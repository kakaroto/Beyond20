from settings import getStoredSettings;
from dndbeyond import injectDiceToRolls, isRollButtonAdded, CharacterBase, Spell;
from elementmaker import E;
from utils import alertFullSettings;

print("Beyond20: D&D Beyond Spell module loaded.");

class FakeCharacter(CharacterBase) {
    pass;
}

character = null;

function addDisplayButton() {
    nonlocal character;
    icon32 = chrome.extension.getURL("images/icons/icon32.png");
    button = E.a(class_="ct-beyond20-roll button-alt", href="//",
                 E.span(class_="label",
                        E.img(class_="ct-beyond20-icon", src=icon32, style="margin-right: 10px;"),
                        "Display Spell Card on VTT");
                 );
    spell = Spell($("body"), character);
    $(".page-heading__content").after(button);
    $(".ct-beyond20-roll").css({"float": "right",
                                "display": "inline-block"});
    $(".ct-beyond20-roll").on('click', (event) => {
        spell.display();
    }
    );
}

function documentLoaded(settings) {
    nonlocal character;

    character = FakeCharacter("spell", global_settings=settings);
    if (isRollButtonAdded()) {
        chrome.runtime.sendMessage({"action": "reload-me"});
    } else {
        addDisplayButton();
        spell_name = $(".page-title").text().trim();
        if (settings['subst-dndbeyond']) {
            injectDiceToRolls(".spell-details .more-info-content", character, spell_name);
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


