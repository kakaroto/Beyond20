/*from utils import sendCustomEvent, injectPageScript, alertQuickSettings, alertFullSettings;
from settings import getDefaultSettings, getStoredSettings;
from elementmaker import E;
*/

console.log("Beyond20: Foundry VTT module loaded.");

var settings = getDefaultSettings();

function updateSettings(new_settings = null) {
    if (new_settings) {
        settings = new_settings;
        sendCustomEvent("NewSettings", [settings, chrome.runtime.getURL("")]);
    } else {
        getStoredSettings(updateSettings)
    }
}

function handleMessage(request, sender, sendResponse) {
    console.log("Got message : ", request);
    if (request.action == "settings") {
        if (request.type == "general")
            updateSettings(request.settings);
    } else if (request.action == "open-options") {
        alertFullSettings();
    } else if (request.action == "hp-update") {
        if (settings["update-hp"])
            sendCustomEvent("UpdateHP", [request.character.name, request.character.hp, request.character["max-hp"], request.character["temp-hp"]]);
    } else if (request.action == "conditions-update") {
        if (settings["display-conditions"])
            sendCustomEvent("UpdateConditions", [request, request.character.name, request.character.conditions, request.character.exhaustion]);
    } else if (request.action == "roll") {
        sendCustomEvent("Roll", [request]);
    }
}

function titleSet(mutations, observer) {
    updateSettings();
    chrome.runtime.onMessage.addListener(handleMessage);
    chrome.runtime.sendMessage({ "action": "register-fvtt-tab" });
    injectSettingsButton();
    observer.disconnect();
}

function injectSettingsButton() {
    $(".beyond20-settings").remove();

    icon = chrome.extension.getURL("images/icons/icon24.png");
    button = E.div({ class: "beyond20-settings", style: "flex-grow: 0;" },
        E.img({ class: "beyond20-settings-logo", src: icon, style: "margin: 0px 5px; border: 0px;" })
    );
    $("#chat-controls").append(button);
    $(button).on('click', (event) => alertQuickSettings());
}

const observer = new window.MutationObserver(titleSet);
observer.observe(document.getElementsByTagName("title")[0], { "childList": true });
sendCustomEvent("disconnect");
injectPageScript(chrome.runtime.getURL('dist/fvtt_script.js'));
