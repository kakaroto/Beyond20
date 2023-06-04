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
            sendCustomEvent("Loaded", []);
            updateSettings(saved_settings);
        });
    }
}
chrome.runtime.onMessage.addListener(handleMessage);

function sendMessageToBeyond20(message) {
    console.log(message)
    chrome.runtime.sendMessage(message)
}

function disconnectAllEvents() {
    registered_events.forEach((event) => {
        event.disconnect();
    })
}

function handleIncomingSettings({ character, action, type} = {}) {
    characterInternal = character;
    chrome.runtime.sendMessage({
        action: "hp-update",
        character
    })
    chrome.runtime.sendMessage({
        action: "settings",
        type: "character",
        settings: character.settings,
        id: character.id
    })
}

var registered_events = [];
registered_events.push(addCustomEventListener("send-message", sendMessageToBeyond20));
registered_events.push(addCustomEventListener("disconnect", disconnectAllEvents));
registered_events.push(addCustomEventListener("settings", handleIncomingSettings));

updateSettings();
chrome.runtime.sendMessage({ "action": "register-generic-tab" });

sendCustomEvent("Beyond20_Loaded", {details: [settings]});