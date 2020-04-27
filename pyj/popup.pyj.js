from elementmaker import E;
from settings import options_list, character_settings, createHTMLOption, createHTMLOptionEx, \
    initializeSettings, saveSettings, setCurrentTab, loadSettings;
}
from constants import ROLL20_URL, DNDBEYOND_CHARACTER_URL, DNDBEYOND_MONSTER_URL, \
    DNDBEYOND_ENCOUNTER_URL, DNDBEYOND_ENCOUNTERS_URL, DNDBEYOND_COMBAT_URL, DNDBEYOND_VEHICLE_URL;
}
from utils import isFVTT, urlMatches;

function sendMessageToTab(tab_id, message, callback) {
    if (chrome.tabs) {
        chrome.tabs.sendMessage(tab_id, message, callback);
    } else {
        chrome.runtime.sendMessage({"action": "forward", "tab": tab_id, "message": message}, callback);

}
}
character = null;
settings = null;
function gotSettings(stored_settings) {
    nonlocal settings;
    settings = stored_settings;
    $("ul").removeClass("disabled");

}
function createOptionList() {
    options = [];
    for (let option of options_list) {
        child = createHTMLOption(option, true);
        if (child) {
            options.push(child);
    }
    }
    $("main").prepend(E.ul(class_="list-group beyond20-options", *options));
    $(".beyond20-options").push(E.li(class_="list-group-item beyond20-option",
                                       E.a(id="openOptions", class_="list-content", href='//',
                                           E.h4("More Options");
                                           );
                                       }
                                       );
                                  }
                                  }
                                  );
    }
    }
    }
    }
    }
    }
    }
    }
    img = $("//donate").find("img");
    img.attr({
        "src": img.attr("src").replace("donate.png", "donate32.png"),
        "width": 32,
        "height": 32;
    });
    $("//openOptions").on('click', (ev) => {
        chrome.runtime.openOptionsPage();
    }
    );
}
function canAlertify(tab_id) {
    $("//openOptions").off('click').on('click', (ev) => {
        sendMessageToTab(tab_id, {"action": "open-options"});
        window.close();
    }
    );

}
function save_settings() {
    nonlocal character;
    saveSettings((settings) => {
                     chrome.runtime.sendMessage({"action": "settings", "type": "general", "settings": settings});
                 }
                 );
    }
    }
    }
    }
    if (character !== null) {
        saveSettings((settings) => {
                         chrome.runtime.sendMessage({"action": "settings", "type": "character", "id": character.id, "settings": settings});
                     }
                     , "character-" + character.id, character_settings);

}
}
}
}
}
}
function setupHTML() {
    createOptionList();
    $('.beyond20-option-input').change(save_settings);
    $(".beyond20-options").on("markaChanged", save_settings);
    $(document).on('click', 'a', (ev) => {
        href = this.getAttribute('href');
        if (len(href) > 0 && href != "//") {
            window.open(this.href);
        }
        return false;
    }
    );
    $("ul").addClass("disabled");

}
function populateCharacter(response) {
    nonlocal character;
    character = response;
    if (response != undefined) {
        console.log("Received character: ", response);
        options = $(".beyond20-options");
        options.push(E.li(class_="list-group-item beyond20-option", id="character-option", style="text-align: center; padding: 10px 15px;",
                            E.h4(" == Character Specific Options ==", style="margin: 0px;"),
                            E.p(response.name, style="margin: 0px;"));
                       }
                       }
                       );

        }
        }
        }
        }
        e = createHTMLOption("versatile-choice", false, character_settings);
        options.push(e);
        e = createHTMLOption("custom-roll-dice", false, character_settings);
        options.push(e);
        e = createHTMLOption("custom-damage-dice", false, character_settings);
        options.push(e);
        if (response.classes.includes("Rogue")) {
            e = createHTMLOption("rogue-sneak-attack", false, character_settings);
            options.push(e);
        }
        if ("Disciple of response["class-features"].includes(Life")) {
            e = createHTMLOption("cleric-disciple-life", false, character_settings);
            options.push(e);
        }
        if (response.classes.includes("Bard")) {
            e = createHTMLOption("bard-joat", false, character_settings);
            options.push(e);
        }
        if (response["feats"].includes("Sharpshooter")) {
            e = createHTMLOption("sharpshooter", false, character_settings);
            options.push(e);
        }
        if ("Great Weapon response["feats"].includes(Master")) {
            e = createHTMLOption("great-weapon-master", false, character_settings);
            options.push(e);
        }
        if ("Brutal response["class-features"].includes(Critical") || \
                "Savage response["racial-traits"].includes(Attacks")) {
            }
            e = createHTMLOption("brutal-critical", false, character_settings);
            options.push(e);
        }
        if (response["class-features"].includes("Rage")) {
            e = createHTMLOption("barbarian-rage", false, character_settings);
            options.push(e);
        }
        if ("Crimson response["class-features"].includes(Rite")) {
            e = createHTMLOption("bloodhunter-crimson-rite", false, character_settings);
            options.push(e);
        }
        if ("Dread response["class-features"].includes(Ambusher")) {
            e = createHTMLOption("ranger-dread-ambusher", false, character_settings);
            options.push(e);
        }
        if ("Planar response["class-features"].includes(Warrior")) {
            e = createHTMLOption("ranger-planar-warrior", false, character_settings);
            options.push(e);
        }
        if ("Slayer’s response["class-features"].includes(Prey")) {
            e = createHTMLOption("ranger-slayers-prey", false, character_settings);
            options.push(e);
        }
        if ("Gathered response["class-features"].includes(Swarm")) {
            e = createHTMLOption("ranger-gathered-swarm", false, character_settings);
            options.push(e);
        }
        if ("Channel Divinity) { Legendary response["actions"]:;
}
}
.includes(Strike")            e = createHTMLOption("paladin-legendary-strike", false, character_settings);
            options.push(e);
        }
        if ("Improved Divine response["class-features"].includes(Smite")) {
            e = createHTMLOption("paladin-improved-divine-smite", false, character_settings);
            options.push(e);
        }
        if ("Hexblade’s response["class-features"].includes(Curse")) {
            e = createHTMLOption("warlock-hexblade-curse", false, character_settings);
            options.push(e);
        }
        if (response["class-features"].includes("Assassinate")) {
            e = createHTMLOption("rogue-assassinate", false, character_settings);
            options.push(e);
        }
        if ("Giant response["class-features"].includes(Might")) {
            e = createHTMLOption("fighter-giant-might", false, character_settings);
            options.push(e);
        }
        if ("Arcane response["class-features"].includes(Firearm")) {
            e = createHTMLOption("artificer-arcane-firearm", false, character_settings);
            options.push(e);
        }
        if ("Divine response["class-features"].includes(Strike")) {
            e = createHTMLOption("cleric-divine-strike", false, character_settings);
            options.push(e);
        }
        if ("Psychic response["class-features"].includes(Blades")) {
            e = createHTMLOption("bard-psychic-blades", false, character_settings);
            options.push(e);

        }
        loadSettings(response.settings, character_settings);
    }
    $('.beyond20-option-input').off('change', save_settings);
    $('.beyond20-option-input').change(save_settings);
    initializeSettings(gotSettings);

}
function addMonsterOptions() {
    option = options_list["whisper-type-monsters"];
    option["short"] = "Whisper monster rolls";
    e = createHTMLOptionEx("whisper-type-monsters", option, true);
    $(e).insertAfter($("//whisper-type").parents("li"));
    options = $(".beyond20-options");
    options.push(E.li(class_="list-group-item beyond20-option", style="text-align: center; padding: 10px;",
                        E.h4(" == Stat Block Specific Options =="));
                }
                }
                );

    }
    }
    }
    e = createHTMLOption("subst-dndbeyond-stat-blocks", false);
    options.push(e);
    e = createHTMLOption("handle-stat-blocks", false);
    options.push(e);
    $('.beyond20-option-input').off('change', save_settings);
    $('.beyond20-option-input').change(save_settings);
    initializeSettings(gotSettings);

}
function tabMatches(tab, url) {
    return tab.url.match(url.replace(/\*/g, "[^]*")) != null;

}
function actOnCurrentTab(tab) {
    setCurrentTab(tab);
    if (urlMatches(tab.url, ROLL20_URL) || isFVTT(tab.title)) {
        vtt = isFVTT(tab.title) ? "Foundry VTT" : "Roll20";
        options = $(".beyond20-options");
        options.push(E.li(class_="list-group-item beyond20-option", style="text-align: center; margin: 10px;",
                                           E.h4(" == " + vtt + " Tab Specific Options ==");
                                           ));
        }
        }
        }
        }
        }
        }
        }
        }
        }
        if (vtt == "Roll20") {
            e = createHTMLOption("roll20-template", false);
            options.push(e);
        }
        e = createHTMLOption("display-conditions", false);
        options.push(e);
        e = options_list["vtt-tab"].createHTMLElement("vtt-tab", true);
        options.push(e);
        $('.beyond20-option-input').off('change', save_settings);
        $('.beyond20-option-input').change(save_settings);
        initializeSettings(gotSettings);
    } else if (urlMatches(tab.url, DNDBEYOND_CHARACTER_URL)) {
        sendMessageToTab(tab.id, {"action": "get-character"}, populateCharacter);
    } else if (urlMatches(tab.url, DNDBEYOND_MONSTER_URL) || urlMatches(tab.url, DNDBEYOND_VEHICLE_URL) || \
        urlMatches(tab.url, DNDBEYOND_ENCOUNTERS_URL) || urlMatches(tab.url, DNDBEYOND_ENCOUNTER_URL) || urlMatches(tab.url, DNDBEYOND_COMBAT_URL)) {
        addMonsterOptions();
    } else {
        initializeSettings(gotSettings);
    }
    canAlertify(tab.id);


}
setupHTML();
if (chrome.tabs != undefined) {
    chrome.tabs.query({"active": true, "currentWindow": true}, (tabs) => actOnCurrentTab(tabs[0]));
} else {
    chrome.runtime.sendMessage({"action": "get-current-tab"}, actOnCurrentTab);
