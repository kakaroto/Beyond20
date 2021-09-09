const messageBroker = new DDBMessageBroker();
messageBroker.register();

function uuid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

function sendRollToGameLog(request) {
	const message = {
        id: uuid(),
        persist: false,
        messageScope: "gameId"
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

function preventNextRoll(roll) {
    //console.log("Preventing next roll ", roll);
    messageBroker.blockMessages({type: "dice/roll/pending", once: true});
    messageBroker.blockMessages({type: "dice/roll/fulfilled", once: true});
}

function disconnectAllEvents() {
    for (let event of registered_events)
        document.removeEventListener(...event);
}

var registered_events = [];
registered_events.push(addCustomEventListener("rendered-roll", sendRollToGameLog));
registered_events.push(addCustomEventListener("roll", sendRollToGameLog));
registered_events.push(addCustomEventListener("MBPendingRoll", preventNextRoll));
registered_events.push(addCustomEventListener("disconnect", disconnectAllEvents));