from settings import getStoredSettings;
from dndbeyond import injectDiceToRolls, isRollButtonAdded, CharacterBase, sendRoll, descriptionToString;
from elementmaker import E;
from utils import alertFullSettings;

print("Beyond20: D&D Beyond Equipment & Magic Items module loaded.");

class FakeCharacter extends CharacterBase {
    pass;
}

character = null;

function addDisplayButton() {
    nonlocal character;
    icon32 = chrome.extension.getURL("images/icons/icon32.png");
    button = E.a(class_="ct-beyond20-roll button-alt", href="//",
                 E.span(class_="label",
                        E.img(class_="ct-beyond20-icon", src=icon32, style="margin-right: 10px;"),
                        "Display Item on VTT");
                 );
    item_name = $(".page-title").text().trim();
    item_type = descriptionToString(".item-details .item-info .details, .details-container-equipment .details-container-content-description > div > .details-container-content-description-text");
    description = descriptionToString(".item-details .more-info-content, .details-container-equipment .marginBottom20 + .details-container-content-description-text");
    $(".page-heading__content").after(button);
    $(".ct-beyond20-roll").css({"float": "right",
                                "display": "inline-block"});
    $(".ct-beyond20-roll").on('click', (event) => {
        sendRoll(character, "item", 0, {"name": item_name,
                             "description" : description,
                             "item-type": item_type});
    }
    );
}

function documentLoaded(settings) {
    nonlocal character;

    character = FakeCharacter("item", global_settings=settings);
    if (isRollButtonAdded()) {
        chrome.runtime.sendMessage({"action": "reload-me"});
    } else {
        addDisplayButton();
        item_name = $(".page-title").text().trim();
        if (settings['subst-dndbeyond']) {
            injectDiceToRolls(".item-details .more-info-content, .details-container-equipment .details-container-content-description-text", character, item_name);
        }
    }
}

function updateSettings(new_settings=null) {
    nonlocal character;

    if (new_settings) {
        if (character !== null) {
            character.setGlobalSettings(new_settings);
    } else {
        getStoredSettings((saved_settings) => {
            documentLoaded(saved_settings);
            updateSettings(saved_settings);
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

chrome.runtime.onMessage.addListener(handleMessage);
chrome.runtime.sendMessage({"action": "activate-icon"});
updateSettings();


