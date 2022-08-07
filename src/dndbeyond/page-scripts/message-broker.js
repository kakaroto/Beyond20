const messageBroker = new DDBMessageBroker();
messageBroker.register();
console.log("Registered Beyond20 message broker");

let lastCharacter = null;
function sendRollToGameLog(request) {
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
        if (['-', '+'].includes(part)) {
            lastOperation = part;
        } else if (typeof(part) === "number") {
            constant = constant + parseInt(part) * (lastOperation === "+" ? 1 : -1);
        } else if (part.formula) {
            let operation = 0; // sum
            if (part.modifiers.includes("kl") || part.modifiers.includes("dh"))
                operation = 1; // min
            else if (part.modifiers.includes("kh") || part.modifiers.includes("dl"))
                operation = 2; // max
            // the game log will crash if a message is posted with a dieType that isn't supported
            const dieType = [4, 6, 8, 10, 12, 20, 100].includes(part.faces) ? `d${part.faces}` : 'd100';
            sets.push({
                count: parseInt(part.amount),
                dieType,
                operation,
                dice: part.rolls.filter(r => !r.discarded).map(r => ({dieType, dieValue: r.roll || 0}))
            });
            if (part.total !== undefined) {
                results.push(...part.rolls.filter(r => !r.discarded).map(r => parseInt(r.roll) || 0));
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
    // diceOperation options: 0 = sum, 1 = min, 2 = max
    // rollKind options : "" = none, advantage, disadvantage, critical hit
    // rollType options : roll, to hit, damage, heal, spell, save, check
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

let lastMessage = null;
function pendingRoll(rollData) {
    //console.log("rolling ", rollData);
    messageBroker.on("dice/roll/pending", (message) => {
        lastMessage = message;
        // If no roll data, then simply stop propagation but don't replace it
        if (!rollData) return false;
        messageBroker.postMessage({
            persist: false,
            eventType: "dice/roll/pending",
            entityType: message.entityType,
            entityId: message.entityId,
            gameId: message.gameId,
            messageScope: message.messageScope,
            messageTarget: message.messageTarget,
            userId: message.userId,
            data: {
                action: rollData.name,
                context: message.data.context,
                rollId: message.data.rollId,
                rolls: rollData.rolls.map(r => rollToDDBRoll(r)),
                setId: message.data.setId
            }
        });
        // Stop propagation
        return false;
    }, {once: true, send: true, recv: false});
    messageBroker.blockMessages({type: "dice/roll/fulfilled", once: true});
}
function fulfilledRoll(rollData) {
    //console.log("fulfilled roll ", rollData);
    // In case digital dice are disabled, and we have no previous pending roll message
    // we need to construct a valid one for DDB to parse
    lastMessage = lastMessage || {
        data: {
            context: messageBroker.getContext(lastCharacter),
            rollId: messageBroker.uuid()
        }
    };
    // For initiative to work in the Encounter builder, it needs to have the action name "Initiative" and not "Initiative(+x)" that B20 sends
    const action = /^Initiative/.test(rollData.name) ? "Initiative" : rollData.name;
    messageBroker.postMessage({
        persist: true,
        eventType: "dice/roll/fulfilled",
        entityType: lastMessage.entityType,
        entityId: lastMessage.entityId,
        gameId: lastMessage.gameId,
        messageScope: lastMessage.messageScope,
        messageTarget: lastMessage.messageTarget,
        userId: lastMessage.userId,
        data: {
            action,
            rolls: rollData.rolls.map(r => rollToDDBRoll(r, true)),
            context: lastMessage.data.context,
            rollId: lastMessage.data.rollId,
            setId: lastMessage.data.setId || "8201337" // Not setting it makes it use "Basic Black" by default. Using an invalid value is better
        }
    });
    // Avoid overwriting the old roll in case a roll generates multiple fulfilled rolls (critical hit)
    lastMessage.data.rollId = messageBroker.uuid();
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