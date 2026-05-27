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

    function rollToDDBRoll(roll, forceResults = false, damageType = null) {
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

            const mods = part.modifiers || "";
            let operation = 0;
            if (mods.includes("kl") || mods.includes("dh")) operation = 1;
            else if (mods.includes("kh") || mods.includes("dl")) operation = 2;

            const faces = Number(part.faces);
            const dieType = [4, 6, 8, 10, 12, 20, 100].includes(faces) ? `d${faces}` : "d100";

            sets.push({
                count: parseInt(part.amount, 10) * signMultiplier,
                dieType,
                operation,
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

        let rollType = rollToType[roll.type] || "roll";
        if (damageType && (roll.type === "damage" || roll.type === "critical-damage")) {
            rollType = damageType;
        }

        const data = {
            diceNotation: {
                constant,
                set: sets
            },
            diceNotationStr: roll.formula,
            rollKind: rollToKind[roll.type] || "",
            rollType: rollType
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

    function b20BuildDdbRollsForGameLog(b20Rolls, request = {}) {
        const rolls = Array.isArray(b20Rolls) ? b20Rolls : [];
        if (!rolls.length) return [];

        const advantage = request.advantage;
        const isAdvantage = advantage === 3;
        const isDisadvantage = advantage === 4;
        const isSuperAdvantage = advantage === 6;
        const isSuperDisadvantage = advantage === 7;
        
        const damageTypes = request["damage-types"] || [];

        if (!isAdvantage && !isDisadvantage && !isSuperAdvantage && !isSuperDisadvantage) {
            let damageTypeIndex = 0;
            return rolls.map((r) => {
                const isDamageRoll = r.type === "damage" || r.type === "critical-damage";
                const dt = isDamageRoll ? damageTypes[damageTypeIndex++] : null;
                return rollToDDBRoll(r, true, dt);
            });
        }

        const [d20Rolls, otherRolls] = [[], []];
        for (const roll of rolls) {
            ((roll.parts || []).some(p => p?.faces === 20) ? d20Rolls : otherRolls).push(roll);
        }

        const isAdv = isAdvantage || isSuperAdvantage;
        let damageTypeIndex = 0;
        return [
            ...(d20Rolls.length ? [combineD20Rolls(d20Rolls, isAdv, isSuperAdvantage || isSuperDisadvantage)] : []),
            ...otherRolls.map((r) => {
                const isDamageRoll = r.type === "damage" || r.type === "critical-damage";
                const dt = isDamageRoll ? damageTypes[damageTypeIndex++] : null;
                return rollToDDBRoll(r, true, dt);
            })
        ];
    }

    function combineD20Rolls(d20Rolls, isAdvantage, isSuper = false, options = {}) {
        const {
            rollType = "to hit",   // "to hit" | "save" | "check"
            includeDebug = false
        } = options;

        const keepHighest = !!isAdvantage;
        const operation = keepHighest ? 2 : 1;

        function formatSigned(value) {
            if (!value) return "";
            return value > 0 ? `+${value}` : `${value}`;
        }

        function parseRoll(roll) {
            let sign = 1;

            let numericConstant = 0;   // only literal numbers like -1, +3
            let d20Total = 0;          // sum of d20s in this branch
            let extraDiceTotal = 0;    // sum of non-d20 dice in this branch

            const d20Values = [];

            for (const part of roll?.parts || []) {
                if (typeof part === "string") {
                    const op = part.trim();
                    if (op === "+") sign = 1;
                    else if (op === "-") sign = -1;
                    continue;
                }

                if (typeof part === "number") {
                    numericConstant += sign * part;
                    sign = 1;
                    continue;
                }

                if (part && typeof part === "object" && Array.isArray(part.rolls)) {
                    const values = (part.rolls || []).map(r => Number(r?.roll) || 0);
                    const subtotal = values.reduce((sum, v) => sum + v, 0);

                    if (part.faces === 20) {
                        d20Values.push(...values);
                        d20Total += sign * subtotal;
                    } else {
                        extraDiceTotal += sign * subtotal;
                    }

                    sign = 1;
                }
            }

            const reconstructedTotal = d20Total + extraDiceTotal + numericConstant;
            const total = typeof roll?.total === "number" ? roll.total : reconstructedTotal;

            // This is the branch value WITHOUT the flat numeric modifier.
            // It still includes bless/bane/etc, because those are rolled per branch for the extension.
            const displayValue = total - numericConstant;

            return {
                raw: roll,
                total,
                numericConstant,
                d20Total,
                extraDiceTotal,
                d20Values,
                displayValue
            };
        }

        function buildDiceNotationStr(d20Count, flatConstant, keepHighest) {
            const base = `${d20Count}d20${keepHighest ? "kh1" : "kl1"}`;
            return `${base}${formatSigned(flatConstant)}`;
        }

        if (!Array.isArray(d20Rolls) || d20Rolls.length === 0) {
            return {
                diceNotation: {
                    constant: 0,
                    set: []
                },
                diceNotationStr: "",
                rollKind: keepHighest ? "advantage" : "disadvantage",
                rollType,
                result: {
                    constant: 0,
                    text: "",
                    total: 0,
                    values: []
                }
            };
        }

        const parsedRolls = d20Rolls.map(parseRoll);
        const allD20Values = parsedRolls.flatMap(r => r.d20Values);

        // Pick the winning FULL branch total.
        const selectedRoll = parsedRolls.reduce((best, current) => {
            if (!best) return current;
            return keepHighest
                ? current.total > best.total ? current : best
                : current.total < best.total ? current : best;
        }, null);

        // In normal use these should all match, since the formula is the same for each branch.
        // We keep the selected branch's numeric constant to stay safe.
        const flatConstant = selectedRoll?.numericConstant ?? 0;

        // Show values WITHOUT the flat numeric constant, but WITH per-branch rolled dice like bless.
        const displayValues = parsedRolls.map(r => r.total - flatConstant);

        const resultText = `(${displayValues.join(",")})${formatSigned(flatConstant)}`;
        const resultSummary = `${resultText} = ${selectedRoll?.total ?? 0}`;

        const payload = {
            diceNotation: {
                constant: flatConstant,
                set: [
                    {
                        count: allD20Values.length,
                        dieType: "d20",
                        operation,
                        dice: allD20Values.map(v => ({
                            dieType: "d20",
                            dieValue: v
                        }))
                    }
                ]
            },

            // Helpful for debugging/other consumers.
            // DDB itself seems to rebuild from diceNotation, not this string.
            diceNotationStr: buildDiceNotationStr(
                allD20Values.length,
                flatConstant,
                keepHighest
            ),

            // Keep native wording even for super advantage/disadvantage.
            // The 3d20 visual comes from count, not a different rollKind.
            rollKind: keepHighest ? "advantage" : "disadvantage",
            rollType,

            result: {
                constant: flatConstant,
                text: resultText,
                summary: resultSummary,
                total: selectedRoll?.total ?? 0,
                values: displayValues
            }
        };

        if (includeDebug) {
            payload.__nativeDowngrade__ = true;
            payload.__isSuper__ = !!isSuper;
            payload.__rawD20Values__ = allD20Values;
            payload.__branchTotals__ = parsedRolls.map(r => r.total);
            payload.__branchDisplayValues__ = displayValues;
            payload.__selectedBranchTotal__ = selectedRoll?.total ?? 0;
            payload.__selectedFlatConstant__ = flatConstant;
        }

        return payload;
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
            patched.data.rolls = b20BuildDdbRollsForGameLog(
                entry.rollData.rolls || [],
                entry.request || {}
            );
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
        // Block rolls we initiated (we have queue entry), allow dice toolbox rolls through.
        messageBroker.on("dice/roll/fulfilled", (message) => {
            // Allow Beyond20 override messages through
            if (message?.data && message.data[B20_OVERRIDE_MARKER]) {
                return;
            }

            const rid = message?.data?.rollId;
            
            // Check if this rollId matches any of our queue entries
            let queueIdx = -1;
            if (rid && b20OverrideQueue.length) {
                queueIdx = b20OverrideQueue.findIndex(e => e.rollId === rid);
            }
            
            // If no matching queue entry, this is a dice toolbox roll - allow through
            if (queueIdx === -1) {
                return;
            }
            
            const entry = b20OverrideQueue[queueIdx];
            
            // Preserve digital dice result parsing
            try {
                if (typeof messageBroker._forwardDiceRollEvent === "function") {
                    messageBroker._forwardDiceRollEvent(message);
                }
            } catch (e) {
                console.warn("Beyond20: failed to forward fulfilled message to dice bridge", e);
            }

            if (!entry.rollId && rid) entry.rollId = rid;
            entry.ddbFulfilled = message;

            if (entry.rollData) {
                _dispatchOverrideFulfilled(entry, queueIdx);
                return false;
            }

            // No rollData yet, start fallback timer
            if (!entry.fallbackTimer) {
                entry.fallbackTimer = setTimeout(() => {
                    entry.fallbackTimer = null;
                    _dispatchOriginalFulfilled(entry, queueIdx);
                }, 2000);
            }
            
            // Block while we wait for rollData
            return false;
        }, { once: false, send: true, recv: true });
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
            createdAt: Date.now(),
            request: rollData.request || {}
        });
    }

    function fulfilledRoll(rollData) {
        if (!rollData) return;
        if (!b20OverrideQueue.length) return;

        const entry = b20OverrideQueue[0];
        entry.rollData = rollData;

        if (rollData.request) {
            entry.request = { ...entry.request, ...rollData.request };
        }

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
    
    // Install hooks immediately so we can intercept messages from other players
    _installB20OverrideHooksOnce();
}