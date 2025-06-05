console.log("Beyond20: D&D Beyond Vehicle module loaded.");

var settings = getDefaultSettings();
var character = null;


function documentLoaded(settings) {
    cleanupAlertifyComments();
    character = new Monster("Vehicle", null, settings);
    // We reloaded the extension !== undefined reload the page too...;
    if (isRollButtonAdded())
        chrome.runtime.sendMessage({ "action": "reload-me" });
    else
        character.parseStatBlock();
}


function updateSettings(new_settings = null) {
    if (new_settings) {
        settings = new_settings;
        if (character)
            character.setGlobalSettings(settings);
        key_bindings = getKeyBindings(settings);
        sendCustomEvent("NewSettings", [settings, chrome.runtime.getURL("")]);
    } else {
        getStoredSettings((saved_settings) => {
            sendCustomEvent("Loaded", [saved_settings]);
            updateSettings(saved_settings);
            documentLoaded(settings);
        });
    }
}

function handleMessage(request, sender, sendResponse) {
    console.log("Received message:", request);
    if (request.action == "settings") {
        if (request.type == "general")
            updateSettings(request.settings);
    } else if (request.action == "open-options") {
        alertFullSettings();
    }
}

injectCSS(BUTTON_STYLE_CSS);
chrome.runtime.onMessage.addListener(handleMessage);
chrome.runtime.sendMessage({ "action": "activate-icon" });
updateSettings();
addCustomEventListener("SendMessage", _sendCustomMessageToBeyond20);

