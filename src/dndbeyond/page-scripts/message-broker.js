const messageBroker = new DDBMessageBroker();
messageBroker.register();

function sendRollToGameLog(request) {
	const message = {
        persist: false,
    };
    if (request.action === "roll") {
        message.eventType = "custom/beyond20/request";
        message.data = {
            'request': request
        }
    } else if (request.action === "rendered-roll") {
        message.eventType = "custom/beyond20/roll";
        message.data = {
            'request': request.request,
            'render': request.html
        }
	} else {
        // Unknown action type
        return;
    }
	messageBroker.postMessage(message);
}

function rollToDDBRoll(roll) {
    let constant = 0;
    let lastOperation = '+';
    const sets = [];
    const results = [];
    for (const part of roll.parts) {
        if (['-', '+'].includes(part)) {
            lastOperation = part;
        } else if (typeof(part) === "number") {
            constant = constant + part * (lastOperation === "+" ? 1 : -1);
        } else if (part.formula) {
            let operation = 0; // sum
            if (part.modifiers.includes("kl") || part.modifiers.includes("dh"))
                operation = 1; // min
            else if (part.modifiers.includes("kh") || part.modifiers.includes("dl"))
                operation = 2; // max
            sets.push({
                count: part.amount,
                dieType: `d${part.faces}`,
                operation,
                dice: part.rolls.filter(r => !r.discarded).map(r => ({dieType: `d${part.faces}`, dieValue: r.roll || 0}))
            });
            if (part.total !== undefined) {
                results.push(part.total);
            }
        }
    }

    const data = {
        diceNotation: {
            constant,
            set: sets
        },
        diceNotationStr: roll.formula,
        rollKind: "",
        rollType: "roll"
    }
    // diceOperation options: 0 = sum, 1 = min, 2 = max
    // rollKind options : "" = none, advantage, disadvantage, critical hit
    // rollType options : roll, to hit, damage, heal, spell, save, check
    if (results.length > 0) {
        data.result = {
            constant,
            text: roll.parts.map(p => p.total === undefined ? String(p) : String(p.total)).join(""),
            total: roll.total,
            values: results
        };
    }
    return data;
}
function pendingRoll(rollData) {
    //console.log("rolling ", rollData);
    messageBroker.postMessage({
        persist: false,
        eventType: "dice/roll/pending",
        data: {
            action: rollData.name,
            rolls: rollData.rolls.map(r => rollToDDBRoll(r)),
            setId: "8201337" // Not setting it makes it use "Basic Black" by default. Using an invalid value is better
        }
    });
    messageBroker.blockMessages({type: "dice/roll/pending", once: true});
    messageBroker.blockMessages({type: "dice/roll/fulfilled", once: true});
}
function fulfilledRoll(rollData) {
    //console.log("fulfilled roll ", rollData);
    messageBroker.postMessage({
        persist: true,
        eventType: "dice/roll/fulfilled",
        data: {
            action: rollData.name,
            rolls: rollData.rolls.map(r => rollToDDBRoll(r)),
            setId: "8201337" // Not setting it makes it use "Basic Black" by default.  Using an invalid value is better
        }
    });
}

function disconnectAllEvents() {
    for (let event of registered_events)
        document.removeEventListener(...event);
}

var registered_events = [];
registered_events.push(addCustomEventListener("rendered-roll", sendRollToGameLog));
registered_events.push(addCustomEventListener("roll", sendRollToGameLog));
registered_events.push(addCustomEventListener("MBPendingRoll", pendingRoll));
registered_events.push(addCustomEventListener("MBFulfilledRoll", fulfilledRoll));
registered_events.push(addCustomEventListener("disconnect", disconnectAllEvents));