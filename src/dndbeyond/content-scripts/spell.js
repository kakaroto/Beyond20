/*
from settings import getStoredSettings;
from dndbeyond import injectDiceToRolls, isRollButtonAdded, CharacterBase, Spell;
from elementmaker import E;
from utils import alertFullSettings;
*/

console.log("Beyond20: D&D Beyond Spell module loaded.");

let character = null;

function addDisplayButton() {
    const icon = chrome.extension.getURL("images/icons/badges/spell32.png");
    const button = E.a({ class: "ct-beyond20-roll button-alt", href: "#" },
        E.span({ class: "label" },
            E.img({ class: "ct-beyond20-spell-icon", src: icon, style: "margin-right: 10px;" }),
            "Display Spell Card on VTT"
        )
    );
    const spell = new Spell($("body"), character);
    $(".page-heading__content").after(button);
    $(".ct-beyond20-roll").css({
        "float": "right",
        "display": "inline-block"
    });
    $(".ct-beyond20-roll").on('click', (event) => spell.display());
}

function documentLoaded(settings) {
    character = new SpellCharacter(settings);
    if (isRollButtonAdded()) {
        chrome.runtime.sendMessage({ "action": "reload-me" });
    } else {
        addDisplayButton();
        const spell_name = $(".page-title").text().trim();
        if (settings['subst-dndbeyond']) {
            injectDiceToRolls(".spell-details .more-info-content", character, spell_name);
        }
    }
}

function updateSettings(new_settings = null) {
    if (new_settings) {
        if (character)
            character.setGlobalSettings(new_settings);
        if (settings['hotkeys-bindings'])
            key_bindings = settings['hotkeys-bindings'];
    } else {
        getStoredSettings((saved_settings) => {
            documentLoaded(saved_settings);
            updateSettings(saved_settings);
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

chrome.runtime.onMessage.addListener(handleMessage);
chrome.runtime.sendMessage({ "action": "activate-icon" });
updateSettings();
