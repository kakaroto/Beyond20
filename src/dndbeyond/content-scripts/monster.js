console.log("Beyond20: D&D Beyond Monster module loaded.");

var settings = getDefaultSettings();
var character = null;

function documentLoaded(settings) {
    character = new Monster("Monster", null, settings);
    // We reloaded the extension ? reload the page too...;
    if (isRollButtonAdded()) {
        chrome.runtime.sendMessage({ "action": "reload-me" });
    } else {
        character.parseStatBlock();
    }
}

function updateSettings(new_settings = null) {
    if (new_settings) {
        settings = new_settings;
        if (character !== null)
            character.setGlobalSettings(settings);
        if (settings['hotkeys-bindings'])
            key_bindings = settings['hotkeys-bindings'];
    } else {
        getStoredSettings((saved_settings) => {
            updateSettings(saved_settings);
            documentLoaded(settings);
        });
    }
}

function handleMessage(request, sender, sendResponse) {
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

