from settings import getDefaultSettings, getStoredSettings;
from dndbeyond import Monster, isRollButtonAdded;
from utils import injectCSS, alertFullSettings;
from constants import BUTTON_STYLE_CSS,ROLLTYPE_STYLE_CSS;

print("Beyond20: D&D Beyond Vehicle module loaded.");

settings = getDefaultSettings();
character = null;


function documentLoaded(settings) {
    nonlocal character;

    character = Monster("Vehicle", global_settings=settings);
    // We reloaded the extension != undefined reload the page too...;
    if (isRollButtonAdded()) {
        chrome.runtime.sendMessage({"action": "reload-me"});
    } else {
        character.parseStatBlock();


}
}
function updateSettings(new_settings=null) {
    nonlocal settings;
    nonlocal character;

    if (new_settings) {
        settings = new_settings;
        if (character !== null) {
            character.setGlobalSettings(settings);
    } else {
        getStoredSettings((saved_settings) => {
            nonlocal settings;
            updateSettings(saved_settings);
            documentLoaded(settings);
        }
        );

}
}
function handleMessage(request, sender, sendResponse) {
    if (request.action == "settings") {
        if (request.type == "general") {
            updateSettings(request.settings);
    } else if (request.action == "open-options") {
        alertFullSettings();

}
}
injectCSS(BUTTON_STYLE_CSS);
injectCSS(ROLLTYPE_STYLE_CSS);
chrome.runtime.onMessage.addListener(handleMessage);
chrome.runtime.sendMessage({"action": "activate-icon"});
updateSettings();

