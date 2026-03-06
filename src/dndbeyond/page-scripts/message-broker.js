// Read-only MB bridge flag for window.postMessage consumers (content script / isolated world)
const B20_DDB_DICE_MB_BRIDGE = "__b20_ddb_dice_mb_bridge__";

// Publishing is enabled; we only do special behavior when MBPendingRoll/MBFulfilledRoll is used
const B20_DISABLE_DDB_MB_PUBLISH = false;

// Marker to avoid re-processing our own override dispatch
const B20_OVERRIDE_MARKER = "__b20Override__";

// Forward dice roll messages out of the page context so content scripts can listen
// without needing direct access to window[Symbol.for("@dndbeyond/message-broker-lib")].
function postBridge(message) {
    const payload = { [B20_DDB_DICE_MB_BRIDGE]: true, message: null };
    try {
        payload.message = JSON.parse(JSON.stringify(message));
    } catch (e) {
        payload.message = {
            id: message?.id,
            eventType: message?.eventType,
            dateTime: message?.dateTime,
            userId: message?.userId,
            source: message?.source,
            data: message?.data
        };
    }
    try {
        window.postMessage(payload, "*");
    } catch (e2) {
        // ignore
    }
}

function normalizeActionName(name) {
    const s = String(name || "").trim();
    // For initiative to work in the Encounter builder, it needs to have the action name "Initiative"
    // and not "Initiative(+x)" that B20 sends
    return /^Initiative\b/i.test(s) ? "Initiative" : s;
}

const messageBroker = new DDBMessageBroker();
messageBroker.register();
console.log("Registered Beyond20 message broker");

// Forward ALL incoming dice roll messages for digital dice parsing
messageBroker.on(null, (message) => {
    const t = message?.eventType;
    if (typeof t !== "string" || !t.startsWith("dice/roll/")) return;
    postBridge(message);
}, { once: false, send: false, recv: true });

let lastCharacter = null;

// === This function is not what makes "real dice" entries.
// Leaving it intact, but it will still show as "custom" in the log if enabled elsewhere.
function sendRollToGameLog(request) {
    if (B20_DISABLE_DDB_MB_PUBLISH) return;

    const typeMap = {
        "roll": (req) => ({
            eventType: "custom/beyond20/request",
            data: { request: req }
        }),
        "rendered-roll": (req) => ({
            eventType: "custom/beyond20/roll",
            data: { request: req.request, render: req.html }
        })
    };

    const builder = typeMap[request?.action];
    if (!builder) return;

    // Save the character to be used when creating the default roll data context
    lastCharacter = request.character;

    const built = builder(request);
    messageBroker.postMessage({
        persist: false,
        ...built
    });
}

function rollToDDBRoll(roll, forceResults=false) {
    let constant = 0;
    let lastOp = "+";
    const sets = [];
    const results = [];

    const parts = roll?.parts || [];

    // constant, total, count, dieValue and result.values must be ints so it doesn't crash the mobile app
    for (const part of parts) {
        const sign = (lastOp === "+" ? 1 : -1);

        if (part === "+" || part === "-") {
            lastOp = part;
            continue;
        }

        if (typeof part === "number") {
            constant += parseInt(part, 10) * sign;
            continue;
        }

        if (!part?.formula) continue;

        let operation = 0; // sum
        if (part.modifiers?.includes("kl") || part.modifiers?.includes("dh")) operation = 1; // min
        else if (part.modifiers?.includes("kh") || part.modifiers?.includes("dl")) operation = 2; // max

        // the game log will crash if a message is posted with a dieType that isn't supported
        const faces = Number(part.faces);
        const dieType = [4, 6, 8, 10, 12, 20, 100].includes(faces) ? `d${faces}` : "d100";

        sets.push({
            count: parseInt(part.amount, 10) * sign,
            dieType,
            operation,
            // Include ALL rolled dice so DDB can display kh/kl properly when present
            dice: (part.rolls || []).map(r => ({ dieType, dieValue: r.roll || 0 }))
        });

        if (part.total !== undefined) {
            results.push(...(part.rolls || [])
                .filter(r => !r.discarded)
                .map(r => (parseInt(r.roll, 10) || 0) * sign)
            );
        }
    }

    const rollKindMap = {
        "critical-damage": "critical hit"
    };

    const rollTypeMap = {
        "to-hit": "to hit",
        "damage": "damage",
        "critical-damage": "damage",
        "skill-check": "check",
        "ability-check": "check",
        "initiative": "check",
        "saving-throw": "save",
        "death-save": "save"
    };

    const data = {
        diceNotation: { constant, set: sets },
        diceNotationStr: roll.formula,
        rollKind: rollKindMap[roll.type] || "",
        rollType: rollTypeMap[roll.type] || "roll"
    };

    if (forceResults || results.length > 0) {
        data.result = {
            constant,
            text: parts.map(p => {
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

// ============================
// PURE advantage/disadvantage collapsing (NO bless/bane/guidance/etc)
// (Keeping your current logic as-is; only minor cleanup / grouping)
// ============================

function b20MapRollType(b20Type) {
    const t = String(b20Type || "").toLowerCase();
    if (t === "to-hit" || t === "to hit") return "to hit";
    if (t === "damage") return "damage";
    if (t === "critical-damage") return "damage";
    if (t === "saving-throw" || t === "death-save") return "save";
    if (t === "skill-check" || t === "ability-check" || t === "initiative") return "check";
    return "roll";
}

function b20ExtractConstant(roll) {
    let constant = 0;
    let lastOp = "+";
    for (const part of (roll?.parts || [])) {
        const sign = (lastOp === "+" ? 1 : -1);
        if (part === "+" || part === "-") lastOp = part;
        else if (typeof part === "number") constant += parseInt(part, 10) * sign;
    }
    return Number.isFinite(constant) ? constant : 0;
}

function b20GetDiceParts(roll) {
    return (roll?.parts || []).filter(p => p && typeof p === "object" && p.formula && Number.isFinite(p.faces));
}

function b20FindSingleD20Part(roll) {
    return b20GetDiceParts(roll).find(p => Number(p.faces) === 20 && Number(p.amount) === 1) || null;
}

function b20HasExtraDiceBesidesD20(roll) {
    for (const p of b20GetDiceParts(roll)) {
        const faces = Number(p.faces);
        const amount = Number(p.amount || 0);
        if (faces === 20 && amount === 1) continue;
        return true; // bless/bane/guidance/etc => do not collapse
    }
    return false;
}

function b20GetSingleD20Value(roll) {
    const p = b20FindSingleD20Part(roll);
    const rr = p && (p.rolls || [])[0] ? p.rolls[0] : null;
    const v = rr ? parseInt(rr.roll, 10) : NaN;
    return Number.isFinite(v) ? v : null;
}

// returns: true (discarded), false (kept), null (unknown)
function b20DiscardState(roll) {
    if (typeof roll?.discarded === "boolean") return roll.discarded;
    const p = b20FindSingleD20Part(roll);
    const rr = p && (p.rolls || [])[0] ? p.rolls[0] : null;
    if (rr && typeof rr.discarded === "boolean") return rr.discarded;
    return null;
}

function b20IsPureGroupableD20Roll(roll) {
    const p = b20FindSingleD20Part(roll);
    if (!p) return false;

    const mods = String(p.modifiers || "");
    if (/kh|kl/i.test(mods)) return false;

    if (b20HasExtraDiceBesidesD20(roll)) return false;

    return true;
}

function b20InferPreferredOperation(rollData, group) {
    for (const r of (group || [])) {
        const rk = String(r?.rollKind || r?.kind || "").toLowerCase();
        if (rk.includes("dis")) return 1;
        if (rk.includes("adv")) return 2;
    }

    const req = rollData?.request || {};
    const candList = [
        req.advantage,
        req.advantageType,
        req.rollAdvantage,
        req.adv,
        req.disadvantage,
        req.rollKind,
        req.kind
    ].filter(v => v !== undefined && v !== null);

    for (const cand of candList) {
        if (typeof cand === "string") {
            const s = cand.toLowerCase();
            if (s.includes("dis")) return 1;
            if (s.includes("adv")) return 2;
        }
        if (typeof cand === "number") {
            // 0 none, 1 advantage, 2 disadvantage, 3 super-adv, 4 super-dis
            if (cand === 2 || cand === 4 || cand === -1) return 1;
            if (cand === 1 || cand === 3) return 2;
        }
    }

    const nm = String(rollData?.name || "").toLowerCase();
    if (nm.includes("super disadvantage") || nm.includes("super-dis") || nm.includes("superdis")) return 1;
    if (nm.includes("disadvantage") || nm.includes("disadv")) return 1;
    if (nm.includes("super advantage") || nm.includes("super-adv") || nm.includes("superadv")) return 2;
    if (nm.includes("advantage") || nm.includes("adv")) return 2;

    return 2; // fallback: advantage
}

function b20MakeNativeLikeAdvDisRoll(group, rollData) {
    const kept = group.find(r => b20DiscardState(r) === false) || null;

    const values = group.map(b20GetSingleD20Value).filter(v => Number.isFinite(v));
    if (values.length !== group.length) return null;

    const constant = b20ExtractConstant(group[0]);
    const rollType = b20MapRollType(group[0].type);

    const maxV = Math.max(...values);
    const minV = Math.min(...values);

    let operation = null;
    if (kept) {
        const keptVal = b20GetSingleD20Value(kept);
        if (keptVal != null) operation = (keptVal === minV && keptVal !== maxV) ? 1 : 2;
    }
    if (operation == null) operation = b20InferPreferredOperation(rollData, group);

    const rollKind = (operation === 1) ? "disadvantage" : "advantage";
    const keptDie = (operation === 1) ? minV : maxV;

    const absC = Math.abs(constant);
    const sign = constant >= 0 ? "+" : "-";
    const text = constant === 0 ? `(${values.join(",")})` : `(${values.join(",")})${sign}${absC}`;

    const khkl = (operation === 1) ? "kl1" : "kh1";
    const diceNotationStr = `${values.length}d20${khkl}${constant ? (constant > 0 ? `+${constant}` : `${constant}`) : ""}`;

    return {
        diceNotation: {
            constant,
            set: [{
                count: values.length,
                dieType: "d20",
                operation,
                dice: values.map(v => ({ dieType: "d20", dieValue: v }))
            }]
        },
        diceNotationStr,
        result: {
            constant,
            text,
            total: keptDie + constant,
            values: values.slice()
        },
        rollKind,
        rollType
    };
}

function b20BuildDdbRollsForGameLog(b20Rolls, actionName, rollData) {
    const out = [];
    const rolls = Array.isArray(b20Rolls) ? b20Rolls : [];

    for (let i = 0; i < rolls.length; ) {
        const r = rolls[i];

        if (b20IsPureGroupableD20Roll(r)) {
            const type0 = b20MapRollType(r.type);
            const c0 = b20ExtractConstant(r);

            const group = [r];
            let j = i + 1;

            while (j < rolls.length) {
                const r2 = rolls[j];
                if (!b20IsPureGroupableD20Roll(r2)) break;
                if (b20MapRollType(r2.type) !== type0) break;
                if (b20ExtractConstant(r2) !== c0) break;
                group.push(r2);
                j++;
            }

            if (group.length > 1) {
                const merged = b20MakeNativeLikeAdvDisRoll(group, rollData);
                if (merged) {
                    out.push(merged);
                    i = j;
                    continue;
                }
            }
        }

        out.push(rollToDDBRoll(r, true));
        i++;
    }

    return out;
}

// ============================
// Game Log override pipeline (unchanged; keeping your working behavior)
// ============================
const b20OverrideQueue = [];
let b20HooksInstalled = false;

function _installB20OverrideHooksOnce() {
    if (b20HooksInstalled) return;
    b20HooksInstalled = true;

    const bindRollIdIfNeeded = (message) => {
        const head = b20OverrideQueue[0];
        const rid = message?.data?.rollId;
        if (!head || head.rollId || !rid) return;
        head.rollId = rid;
    };

    messageBroker.on("dice/roll/deferred", bindRollIdIfNeeded, { once: false, send: true, recv: false });
    messageBroker.on("dice/roll/pending", bindRollIdIfNeeded, { once: false, send: true, recv: false });

    messageBroker.on("dice/roll/fulfilled", (message) => {
        if (!b20OverrideQueue.length) return;
        if (message?.data && message.data[B20_OVERRIDE_MARKER]) return;

        const rid = message?.data?.rollId;
        let idx = (rid ? b20OverrideQueue.findIndex(e => e.rollId === rid) : -1);
        if (idx === -1) idx = 0;

        const entry = b20OverrideQueue[idx];
        if (!entry) return;

        // Always forward original fulfilled to the bridge so digital dice parsing never deadlocks
        postBridge(message);

        entry.ddbFulfilled = message;
        if (!entry.rollId && rid) entry.rollId = rid;

        if (entry.rollData) {
            _dispatchOverrideFulfilled(entry, idx);
            return false;
        }

        if (!entry.fallbackTimer) {
            entry.fallbackTimer = setTimeout(() => {
                entry.fallbackTimer = null;
                try {
                    if (entry.ddbFulfilled) {
                        if (messageBroker._mbDispatch) messageBroker._mbDispatch(entry.ddbFulfilled);
                        else messageBroker._mb.dispatch(entry.ddbFulfilled);
                    }
                } catch (e) {}
                b20OverrideQueue.splice(idx, 1);
            }, 500);
        }

        return false;
    }, { once: false, send: true, recv: false });
}

function _dispatchOverrideFulfilled(entry, idx) {
    try {
        if (entry.fallbackTimer) {
            clearTimeout(entry.fallbackTimer);
            entry.fallbackTimer = null;
        }

        const base = entry.ddbFulfilled;
        if (!base) return;

        let patched;
        try {
            patched = JSON.parse(JSON.stringify(base));
        } catch (e) {
            patched = Object.assign({}, base);
            patched.data = Object.assign({}, base.data);
        }

        patched.data = patched.data || {};
        patched.data.action = normalizeActionName(entry.action || patched.data.action);

        patched.data.rolls = b20BuildDdbRollsForGameLog(entry.rollData.rolls || [], patched.data.action, entry.rollData);
        patched.data[B20_OVERRIDE_MARKER] = true;

        if (messageBroker._mbDispatch) messageBroker._mbDispatch(patched);
        else messageBroker._mb.dispatch(patched);

    } catch (e) {
        console.warn("Beyond20: failed to dispatch override fulfilled", e);
        try {
            if (entry.ddbFulfilled) {
                if (messageBroker._mbDispatch) messageBroker._mbDispatch(entry.ddbFulfilled);
                else messageBroker._mb.dispatch(entry.ddbFulfilled);
            }
        } catch (e2) {}
    } finally {
        b20OverrideQueue.splice(idx, 1);
    }
}

function pendingRoll(rollData) {
    if (B20_DISABLE_DDB_MB_PUBLISH) return;
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
    if (B20_DISABLE_DDB_MB_PUBLISH) return;
    if (!rollData) return;
    if (!b20OverrideQueue.length) return;

    const entry = b20OverrideQueue[0];
    entry.rollData = rollData;

    if (entry.ddbFulfilled) {
        _dispatchOverrideFulfilled(entry, 0);
    }
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