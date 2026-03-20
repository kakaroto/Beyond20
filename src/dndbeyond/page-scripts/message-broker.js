if (!window.__beyond20_mb2_initialized__) {
    window.__beyond20_mb2_initialized__ = true;

    const BROKER_KEY = "__beyond20_message_broker__";
    const EVENTS_KEY = "__beyond20_mb2_registered_events__";
    const OVERRIDE_QUEUE_KEY = "__beyond20_mb2_override_queue__";
    const HOOKS_INSTALLED_KEY = "__beyond20_mb2_override_hooks_installed__";
    const B20_OVERRIDE_MARKER = "__b20Override__";

    const messageBroker =
        window[BROKER_KEY] || (window[BROKER_KEY] = new DDBMessageBroker());

    messageBroker.register();
    console.log("Registered Beyond20 message broker");

    const b20OverrideQueue =
        window[OVERRIDE_QUEUE_KEY] || (window[OVERRIDE_QUEUE_KEY] = []);

    let lastCharacter = null;

    function normalizeActionName(name) {
        const s = String(name || "").trim();
        return /^Initiative\b/i.test(s) ? "Initiative" : s;
    }

    function cloneMessage(message) {
        try {
            return JSON.parse(JSON.stringify(message));
        } catch (e) {
            const cloned = Object.assign({}, message);
            cloned.data = Object.assign({}, message?.data);
            return cloned;
        }
    }

    function sendRollToGameLog(request) {
        const message = { persist: false };

        if (request.action === "roll") {
            message.eventType = "custom/beyond20/request";
            message.data = { request };
            lastCharacter = request.character;
        } else if (request.action === "rendered-roll") {
            message.eventType = "custom/beyond20/roll";
            message.data = {
                request: request.request,
                render: request.html
            };
            lastCharacter = request.character;
        } else {
            return;
        }

        messageBroker.postMessage(message);
    }

    function rollToDDBRoll(roll, forceResults = false) {
        let constant = 0;
        let lastOperation = "+";
        const sets = [];
        const results = [];

        for (const part of (roll?.parts || [])) {
            const signMultiplier = (lastOperation === "+" ? 1 : -1);

            if (part === "-" || part === "+") {
                lastOperation = part;
                continue;
            }

            if (typeof part === "number") {
                constant += parseInt(part, 10) * signMultiplier;
                continue;
            }

            if (!part?.formula) continue;

            let operation = 0; // sum
            if ((part.modifiers || "").includes("kl") || (part.modifiers || "").includes("dh")) {
                operation = 1; // min
            } else if ((part.modifiers || "").includes("kh") || (part.modifiers || "").includes("dl")) {
                operation = 2; // max
            }

            const faces = Number(part.faces);
            const dieType = [4, 6, 8, 10, 12, 20, 100].includes(faces) ? `d${faces}` : "d100";

            sets.push({
                count: parseInt(part.amount, 10) * signMultiplier,
                dieType,
                operation,
                // Keep all dice so kh/kl style rolls still carry the full raw data
                dice: (part.rolls || []).map(r => ({
                    dieType,
                    dieValue: r.roll || 0
                }))
            });

            if (part.total !== undefined) {
                results.push(
                    ...(part.rolls || [])
                        .filter(r => !r.discarded)
                        .map(r => (parseInt(r.roll, 10) || 0) * signMultiplier)
                );
            }
        }

        const rollToKind = {
            "critical-damage": "critical hit"
        };

        const rollToType = {
            "to-hit": "to hit",
            "damage": "damage",
            "critical-damage": "damage",
            "skill-check": "check",
            "ability-check": "check",
            "initiative": "check",
            "saving-throw": "save",
            "death-save": "save",
        };

        const data = {
            diceNotation: {
                constant,
                set: sets
            },
            diceNotationStr: roll.formula,
            rollKind: rollToKind[roll.type] || "",
            rollType: rollToType[roll.type] || "roll"
        };

        if (forceResults || results.length > 0) {
            data.result = {
                constant,
                text: (roll.parts || []).map(p => {
                    if (p?.total === undefined) return String(p);

                    const rolls = (p.rolls || [])
                        .filter(r => !r.discarded && !Number.isNaN(parseInt(r.roll, 10)))
                        .map(r => parseInt(r.roll, 10));

                    return rolls.length ? rolls.join("+") : String(p.total);
                }).join(""),
                total: parseInt(roll.total, 10),
                values: results
            };
        }

        return data;
    }

    function b20BuildDdbRollsForGameLog(b20Rolls) {
        return (Array.isArray(b20Rolls) ? b20Rolls : []).map(r => rollToDDBRoll(r, true));
    }

    function _dispatchOriginalFulfilled(entry, idx) {
        try {
            if (!entry?.ddbFulfilled) return;
            if (messageBroker._mbDispatch) messageBroker._mbDispatch(entry.ddbFulfilled);
            else if (messageBroker._mb) messageBroker._mb.dispatch(entry.ddbFulfilled);
        } catch (e) {
            console.warn("Beyond20: failed to dispatch original fulfilled", e);
        } finally {
            b20OverrideQueue.splice(idx, 1);
        }
    }

    function _dispatchOverrideFulfilled(entry, idx) {
        try {
            if (entry.fallbackTimer) {
                clearTimeout(entry.fallbackTimer);
                entry.fallbackTimer = null;
            }

            const base = entry.ddbFulfilled;
            if (!base) return _dispatchOriginalFulfilled(entry, idx);
            if (!entry.rollData) return _dispatchOriginalFulfilled(entry, idx);

            const patched = cloneMessage(base);
            patched.data = patched.data || {};
            patched.data.action = normalizeActionName(entry.action || patched.data.action);
            patched.data.rolls = b20BuildDdbRollsForGameLog(entry.rollData.rolls || []);
            patched.data[B20_OVERRIDE_MARKER] = true;

            if (messageBroker._mbDispatch) messageBroker._mbDispatch(patched);
            else if (messageBroker._mb) messageBroker._mb.dispatch(patched);
        } catch (e) {
            console.warn("Beyond20: failed to dispatch override fulfilled", e);
            _dispatchOriginalFulfilled(entry, idx);
            return;
        } finally {
            const stillThere = b20OverrideQueue[idx] === entry;
            if (stillThere) b20OverrideQueue.splice(idx, 1);
        }
    }

    function _installB20OverrideHooksOnce() {
        if (window[HOOKS_INSTALLED_KEY]) return;
        window[HOOKS_INSTALLED_KEY] = true;

        const bindRollIdIfNeeded = (message) => {
            const head = b20OverrideQueue[0];
            const rid = message?.data?.rollId;
            if (!head || head.rollId || !rid) return;
            head.rollId = rid;
        };

        // Let deferred/pending flow normally so DDB can mint the native rollId/context
        messageBroker.on("dice/roll/deferred", bindRollIdIfNeeded, { once: false, send: true, recv: false });
        messageBroker.on("dice/roll/pending", bindRollIdIfNeeded, { once: false, send: true, recv: false });

        // Intercept fulfilled BEFORE it reaches the DDB game log.
        // We manually forward it to the digital-dice bridge first so dice parsing still works.
        messageBroker.on("dice/roll/fulfilled", (message) => {
            if (!b20OverrideQueue.length) return;
            if (message?.data && message.data[B20_OVERRIDE_MARKER]) return;

            const rid = message?.data?.rollId;
            let idx = (rid ? b20OverrideQueue.findIndex(e => e.rollId === rid) : -1);
            if (idx === -1) idx = 0;

            const entry = b20OverrideQueue[idx];
            if (!entry) return;

            entry.ddbFulfilled = message;
            if (!entry.rollId && rid) entry.rollId = rid;

            // Preserve digital dice result parsing even though we suppress the native fulfilled
            try {
                if (typeof messageBroker._forwardDiceRollEvent === "function") {
                    messageBroker._forwardDiceRollEvent(message);
                }
            } catch (e) {
                console.warn("Beyond20: failed to forward fulfilled message to dice bridge", e);
            }

            if (entry.rollData) {
                _dispatchOverrideFulfilled(entry, idx);
                return false;
            }

            if (!entry.fallbackTimer) {
                entry.fallbackTimer = setTimeout(() => {
                    entry.fallbackTimer = null;
                    _dispatchOriginalFulfilled(entry, idx);
                }, 2000);
            }

            // Always suppress the native fulfilled from reaching the DDB game log directly
            return false;
        }, { once: false, send: true, recv: false });
    }

    function pendingRoll(rollData) {
        if (!rollData) return;

        _installB20OverrideHooksOnce();

        b20OverrideQueue.push({
            action: normalizeActionName(rollData.name || "Beyond20"),
            rollId: null,
            rollData: null,
            ddbFulfilled: null,
            fallbackTimer: null,
            createdAt: Date.now()
        });
    }

    function fulfilledRoll(rollData) {
        if (!rollData) return;
        if (!b20OverrideQueue.length) return;

        const entry = b20OverrideQueue[0];
        entry.rollData = rollData;

        if (entry.ddbFulfilled) {
            _dispatchOverrideFulfilled(entry, 0);
        }
    }

    function disconnectAllEvents() {
        const registeredEvents = window[EVENTS_KEY] || [];

        for (const event of registeredEvents) {
            document.removeEventListener(...event);
        }

        for (const entry of b20OverrideQueue) {
            if (entry?.fallbackTimer) {
                clearTimeout(entry.fallbackTimer);
                entry.fallbackTimer = null;
            }
        }

        b20OverrideQueue.length = 0;
        window[EVENTS_KEY] = [];
        window.__beyond20_mb2_initialized__ = false;

        messageBroker.unregister();
    }

    const registered_events = [];
    registered_events.push(addCustomEventListener("rendered-roll", sendRollToGameLog));
    registered_events.push(addCustomEventListener("roll", sendRollToGameLog));
    registered_events.push(addCustomEventListener("MBPendingRoll", pendingRoll));
    registered_events.push(addCustomEventListener("MBFulfilledRoll", fulfilledRoll));
    registered_events.push(addCustomEventListener("disconnect", disconnectAllEvents));

    window[EVENTS_KEY] = registered_events;
}