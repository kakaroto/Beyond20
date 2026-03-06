// Read-only MB bridge flag for window.postMessage consumers (content script / isolated world)
const B20_DDB_DICE_MB_BRIDGE = "__b20_ddb_dice_mb_bridge__";

// Keep publishing enabled (we only publish when the extension triggers MBPendingRoll/MBFulfilledRoll)
const B20_DISABLE_DDB_MB_PUBLISH = false;

function forwardDdbDiceMbMessage(message) {
    // Forward dice roll messages out of the page context so content scripts can listen
    // without needing direct access to window[Symbol.for("@dndbeyond/message-broker-lib")].
    //
    // NOTE: This is read-only. We are NOT dispatching to the DDB message broker here.
    try {
        // postMessage requires structured-cloneable data. JSON cloning is safest.
        const safe = JSON.parse(JSON.stringify(message));
        window.postMessage({ [B20_DDB_DICE_MB_BRIDGE]: true, message: safe }, "*");
    } catch (e) {
        // Fallback: forward a minimal subset in case cloning fails
        try {
            window.postMessage({
                [B20_DDB_DICE_MB_BRIDGE]: true,
                message: {
                    id: message?.id,
                    eventType: message?.eventType,
                    dateTime: message?.dateTime,
                    userId: message?.userId,
                    source: message?.source,
                    data: message?.data
                }
            }, "*");
        } catch (e2) {
            // ignore
        }
    }
}

const messageBroker = new DDBMessageBroker();
messageBroker.register();
console.log("Registered Beyond20 message broker");

// Read-only subscription: forward ALL incoming dice roll messages for digital dice parsing
// This does not modify or block DDB behavior.
messageBroker.on(null, (message) => {
    if (!message || typeof message.eventType !== "string") return;
    if (!message.eventType.startsWith("dice/roll/")) return;
    forwardDdbDiceMbMessage(message);
}, { once: false, send: false, recv: true });

let lastCharacter = null;

function sendRollToGameLog(request) {
    // Keep the old custom/beyond20/* messages if you want them,
    // but they show as "custom" entries and aren't the proper dice log rendering.
    // Leaving this function intact, but it doesn't solve the dice log issue by itself.
    if (B20_DISABLE_DDB_MB_PUBLISH) return;

    const message = {
        persist: false,
    };
    if (request.action === "roll") {
        message.eventType = "custom/beyond20/request";
        message.data = {
            'request': request
        }
        // Save the character to be used when creating the default roll data context
        lastCharacter = request.character;
    } else if (request.action === "rendered-roll") {
        message.eventType = "custom/beyond20/roll";
        message.data = {
            'request': request.request,
            'render': request.html
        }
        // Save the character to be used when creating the default roll data context
        lastCharacter = request.character;
    } else {
        // Unknown action type
        return;
    }
    messageBroker.postMessage(message);
}

function rollToDDBRoll(roll, forceResults=false) {
    let constant = 0;
    let lastOperation = '+';
    const sets = [];
    const results = [];
    // constant, total, count, dieValue and result.values must be ints so it doesn't crash the mobile app
    for (const part of roll.parts) {
        const signMultiplier = (lastOperation === "+" ? 1 : -1);
        if (['-', '+'].includes(part)) {
            lastOperation = part;
        } else if (typeof(part) === "number") {
            constant = constant + parseInt(part) * signMultiplier;
        } else if (part.formula) {
            let operation = 0; // sum
            if (part.modifiers.includes("kl") || part.modifiers.includes("dh"))
                operation = 1; // min
            else if (part.modifiers.includes("kh") || part.modifiers.includes("dl"))
                operation = 2; // max
            // the game log will crash if a message is posted with a dieType that isn't supported
            const dieType = [4, 6, 8, 10, 12, 20, 100].includes(part.faces) ? `d${part.faces}` : 'd100';
            sets.push({
                count: parseInt(part.amount) * signMultiplier,
                dieType,
                operation,
                dice: part.rolls.filter(r => !r.discarded).map(r => ({dieType, dieValue: r.roll || 0}))
            });
            if (part.total !== undefined) {
                results.push(...part.rolls.filter(r => !r.discarded).map(r => (parseInt(r.roll) || 0) * signMultiplier));
            }
        }
    }
    const rollToKind = {
        "critical-damage": "critical hit"
    }
    const rollToType = {
        "to-hit": "to hit",
        "damage": "damage",
        "critical-damage": "damage",
        "skill-check": "check",
        "ability-check": "check",
        "initiative": "check",
        "saving-throw": "save",
        "death-save": "save",
    }

    const data = {
        diceNotation: {
            constant,
            set: sets
        },
        diceNotationStr: roll.formula,
        rollKind: rollToKind[roll.type] || "",
        rollType: rollToType[roll.type] || "roll"
    }

    if (forceResults || results.length > 0) {
        data.result = {
            constant,
            text: roll.parts.map(p => {
                if (p.total === undefined) return String(p);
                const rolls = p.rolls.filter(r => !r.discarded && !Number.isNaN(parseInt(r.roll))).map(r => parseInt(r.roll));
                if (rolls.length === 0) return String(p.total);
                return rolls.join("+");
            }).join(""),
            total: parseInt(roll.total),
            values: results
        };
    }
    return data;
}

function isWhispered(rollData) {
    if (!rollData.request) return false;
    // Fallback messages to the roll renderer will set whisper to 0 but
    // will store the original whisper setting under 'original-whisper' field
    const whisper = rollData.request["original-whisper"] === undefined
        ? rollData.request.whisper
        : rollData.request["original-whisper"];

    // IMPORTANT: undefined/null should be treated as NO whisper
    return Number(whisper || 0) !== 0;
}

/**
 * === Minimal re-application of master behavior, adapted for new roller ===
 *
 * We do NOT try to "post a brand new gamelog roll".
 * Instead, when roll-to-game-log is enabled, DigitalDiceManager triggers MBPendingRoll.
 * We then:
 *  - wait for DDB to dispatch its own dice/roll/(deferred|pending) -> capture rollId
 *  - intercept the next dice/roll/fulfilled DISPATCH
 *  - re-dispatch a patched copy (same rollId/results) but with Beyond20 action/name
 * This makes the gamelog update, because it *was already expecting that roll chain*.
 */
const B20_PATCH_MARKER = "__b20PatchedFulfilled__";
const b20RenameQueue = [];
let renameHooksInstalled = false;

function installRenameHooksOnce() {
    if (renameHooksInstalled) return;
    renameHooksInstalled = true;

    const bindRollIdIfNeeded = (message) => {
        if (!b20RenameQueue.length) return;
        const head = b20RenameQueue[0];
        if (head.rollId) return;
        const rid = message?.data?.rollId;
        if (!rid) return;
        head.rollId = rid;
    };

    // Bind on either new or old "pending" flavor
    messageBroker.on("dice/roll/deferred", (message) => {
        bindRollIdIfNeeded(message);
    }, { once: false, send: true, recv: false });

    messageBroker.on("dice/roll/pending", (message) => {
        bindRollIdIfNeeded(message);
    }, { once: false, send: true, recv: false });

    // Patch fulfilled BEFORE it hits the gamelog pipeline
    messageBroker.on("dice/roll/fulfilled", (message) => {
        if (!b20RenameQueue.length) return;

        // Avoid infinite loop if we re-dispatch
        if (message?.data && message.data[B20_PATCH_MARKER]) return;

        // Find matching entry (prefer rollId match if we bound one)
        const rid = message?.data?.rollId;
        let idx = -1;
        if (rid) {
            idx = b20RenameQueue.findIndex(e => e.rollId === rid);
        }
        if (idx === -1) {
            // Fallback: if we haven't bound rollId yet, assume the head
            idx = 0;
        }

        const entry = b20RenameQueue[idx];
        if (!entry) return;

        // If we have a bound rollId and this doesn't match, ignore
        if (entry.rollId && rid && entry.rollId !== rid) return;

        // Clone + patch action/name, keep everything else identical
        let patched;
        try {
            patched = JSON.parse(JSON.stringify(message));
        } catch (e) {
            // If cloning fails, mutate a shallow copy
            patched = Object.assign({}, message);
            patched.data = Object.assign({}, message.data);
        }

        patched.data = patched.data || {};
        patched.data.action = entry.action || patched.data.action;
        patched.data[B20_PATCH_MARKER] = true;

        // Stop original dispatch and dispatch our patched one instead
        // IMPORTANT: dispatch via the original underlying broker dispatch to avoid recursion
        try {
            if (messageBroker._mbDispatch) {
                messageBroker._mbDispatch(patched);
            } else if (messageBroker._mb && typeof messageBroker._mb.dispatch === "function") {
                messageBroker._mb.dispatch(patched);
            }
        } catch (e) {
            console.warn("Beyond20: failed to dispatch patched fulfilled", e);
        } finally {
            // Remove this entry (one-shot)
            b20RenameQueue.splice(idx, 1);
        }

        // Returning false stops propagation of the original fulfilled
        return false;
    }, { once: false, send: true, recv: false });
}

let lastMessage = null;

/**
 * MBPendingRoll is triggered by DigitalDiceManager (only when roll-to-game-log is enabled).
 * We DO NOT post anything here — we only queue a rename so the next DDB fulfilled is patched.
 */
function pendingRoll(rollData) {
    if (B20_DISABLE_DDB_MB_PUBLISH) return;

    if (!rollData || !rollData.name) return;

    installRenameHooksOnce();

    // Queue action rename for the next DDB digital dice roll chain
    b20RenameQueue.push({
        action: rollData.name,
        rollId: null,
        createdAt: Date.now()
    });
}

/**
 * MBFulfilledRoll is triggered after the Beyond20 roll is resolved.
 * For DIGITAL DICE we prefer the patching above (it updates the real DDB entry).
 * For NON-digital rolls, we still attempt to post a deferred+fulfilled chain.
 */
function fulfilledRoll(rollData) {
    if (B20_DISABLE_DDB_MB_PUBLISH) return;

    // If we still have a rename queued, we expect DDB to emit fulfilled and be patched;
    // do not spam additional gamelog posts.
    if (b20RenameQueue.length > 0) return;

    // In case digital dice are disabled, and we have no previous pending roll message
    // we need to construct a valid one for DDB to parse
    lastMessage = lastMessage || {
        data: {
            context: messageBroker.getContext(lastCharacter),
            rollId: (typeof uuidv4 === "function" ? uuidv4() : messageBroker.uuid())
        }
    };

    const toSelf = isWhispered(rollData);

    // For initiative to work in the Encounter builder, it needs to have the action name "Initiative" and not "Initiative(+x)" that B20 sends
    const action = /^Initiative/.test(rollData.name) ? "Initiative" : rollData.name;

    // Post a deferred first (newer DDB expects a chain)
    messageBroker.postMessage({
        source: "Web",
        persist: false,
        eventType: "dice/roll/deferred",
        messageScope: toSelf ? "userId" : "gameId",
        messageTarget: toSelf ? lastMessage.userId : lastMessage.gameId,
        userId: lastMessage.userId,
        data: {
            action,
            rolls: rollData.rolls.map(r => rollToDDBRoll(r, false)),
            context: lastMessage.data.context,
            rollId: lastMessage.data.rollId,
            setId: lastMessage.data.setId || "02401"
        }
    });

    messageBroker.postMessage({
        source: "Web",
        persist: true,
        eventType: "dice/roll/fulfilled",
        messageScope: toSelf ? "userId" : "gameId",
        messageTarget: toSelf ? lastMessage.userId : lastMessage.gameId,
        userId: lastMessage.userId,
        data: {
            action,
            rolls: rollData.rolls.map(r => rollToDDBRoll(r, true)),
            context: lastMessage.data.context,
            rollId: lastMessage.data.rollId,
            setId: lastMessage.data.setId || "02401"
        }
    });

    // Avoid overwriting the old roll in case a roll generates multiple fulfilled rolls (critical hit)
    lastMessage.data.rollId = (typeof uuidv4 === "function" ? uuidv4() : messageBroker.uuid());
}

function disconnectAllEvents() {
    for (let event of registered_events)
        document.removeEventListener(...event);
    messageBroker.unregister();
}

var registered_events = [];
registered_events.push(addCustomEventListener("rendered-roll", sendRollToGameLog));
registered_events.push(addCustomEventListener("roll", sendRollToGameLog));
registered_events.push(addCustomEventListener("MBPendingRoll", pendingRoll));
registered_events.push(addCustomEventListener("MBFulfilledRoll", fulfilledRoll));
registered_events.push(addCustomEventListener("disconnect", disconnectAllEvents));