const site = window.location.hostname;
console.log("Beyond20: Custom Domain module loaded:", site);

var settings = getDefaultSettings();
var characterInternal = null;
function handleMessage(request, sender, sendResponse) {
    console.log("Received Beyond20 message : ", request);
    if (request.action == "settings") {
        if (request.type == "general") {
            updateSettings(request.settings);
        }
    } if (request.action == "hp-update") {
        sendCustomEvent("UpdateHP", [request, request.character.name, request.character.hp, request.character["max-hp"], request.character["temp-hp"]]);
    } else if (request.action === "update-combat") {
        sendCustomEvent("UpdateCombat", [request, request.combat, settings]);
    } else if (request.action == "conditions-update") {
        sendCustomEvent("UpdateConditions", [request, request.character.name, request.character.conditions, request.character.exhaustion]);
    } else if (request.action == "roll") {
        // Let's run it through the roll renderer and let the site decide to use
        // the original request or the rendered version
        roll_renderer.handleRollRequest(request);
    } else if (request.action == "rendered-roll") {
        sendCustomEvent("RenderedRoll", [request]);
    }
}

function updateSettings(new_settings = null) {
    if (new_settings) {
        settings = new_settings;
        roll_renderer.setSettings(settings);
        sendCustomEvent("UpdateSettings", [settings]);
    } else {
        getStoredSettings((saved_settings) => {
            sendCustomEvent("Loaded", [saved_settings]);
            updateSettings(saved_settings);
        });
    }
}
chrome.runtime.onMessage.addListener(handleMessage);

function sendMessageToBeyond20(message) {
    if (!message || !message.action) {
        console.error("Beyond20: Invalid message received: ", message);
        return;
    }
    // Check for allowed actions only
    if (!["roll", "rendered-roll", "hp-update", "conditions-update", "update-combat"].includes(message.action)) {
        console.error("Beyond20: Invalid action received: ", message.action);
        return;
    }
    chrome.runtime.sendMessage(message)
}

function disconnectAllEvents() {
    registered_events.forEach((event) => {
        event.disconnect();
    })
}

var registered_events = [];
registered_events.push(addCustomEventListener("SendMessage", sendMessageToBeyond20));
registered_events.push(addCustomEventListener("disconnect", disconnectAllEvents));

updateSettings();
chrome.runtime.sendMessage({ "action": "register-generic-tab" });