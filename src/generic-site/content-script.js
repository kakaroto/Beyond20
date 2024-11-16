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
    } else if (request.action == "open-options") {
        alertFullSettings();
    } else {
        forwardMessageToDOM(request);
    }
}

function updateSettings(new_settings = null) {
    if (new_settings) {
        settings = new_settings;
        roll_renderer.setSettings(settings);
        sendCustomEvent("NewSettings", [settings, chrome.runtime.getURL("")]);
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