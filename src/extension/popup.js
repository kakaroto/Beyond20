function sendMessageToTab(tab_id, message, callback) {
    if (chrome.tabs) {
        chrome.tabs.sendMessage(tab_id, message, {frameId: 0}, callback);
    } else {
        chrome.runtime.sendMessage({ "action": "forward", "tab": tab_id, "message": message }, callback);
    }
}

var character = null;
var settings = null;

function gotSettings(stored_settings) {
    settings = stored_settings;
    $("ul").removeClass("disabled");
}

function createOptionList() {
    const options = [];
    for (let option in options_list) {
        const child = createHTMLOption(option, true);
        if (child) {
            options.push(child);
        }
    }
    $("main").prepend(E.ul({ class: "list-group beyond20-options" }, ...options));
    $(".beyond20-options").append(
        E.li({ class: "list-group-item beyond20-option" },
            E.a({ id: "openOptions", class: "list-content", href: '#' },
                E.h4({}, "More Options")
            )
        )
    );
    const img = $("#donate").find("img");
    img.attr({
        "src": img.attr("src").replace("donate.png", "donate32.png"),
        "width": 32,
        "height": 32
    });
    $("#openOptions").on('click', (ev) => {
        chrome.runtime.openOptionsPage();
    });
}

function canAlertify(tab_id) {
    $("#openOptions").off('click').on('click', (ev) => {
        sendMessageToTab(tab_id, { "action": "open-options" });
        window.close();
    });
}

function save_settings() {
    saveSettings((settings) => {
        chrome.runtime.sendMessage({ "action": "settings", "type": "general", "settings": settings });
    });
    if (character !== null) {
        saveSettings((settings) => {
            chrome.runtime.sendMessage({ "action": "settings", "type": "character", "id": character.id, "settings": settings })
        }, "character-" + character.id, character_settings);
    }
}

function setupHTML() {
    createOptionList();
    $('.beyond20-option-input').change(save_settings);
    $(".beyond20-options").on("markaChanged", save_settings);
    $(document).on('click', 'a', function (ev) {
        const href = this.getAttribute('href');
        if (href.length > 0 && href != "#") {
            window.open(this.href);
        }
        return false;
    });
    $("ul").addClass("disabled");
}

function populateCharacter(response) {
    character = response;
    if (response) {
        console.log("Received character: ", response);
        const options = $(".beyond20-options");
        options.append(
            E.li({
                class: "list-group-item beyond20-option",
                id: "character-option",
                style: "text-align: center; padding: 10px 15px;"
            },
                E.h4({ style: "margin: 0px;" }, " == Character Specific Options =="),
                E.p({ style: "margin: 0px;" }, response.name))
        );

        let e = createHTMLOption("versatile-choice", false, character_settings);
        options.append(e);
        e = createHTMLOption("custom-roll-dice", false, character_settings);
        options.append(e);
        e = createHTMLOption("custom-damage-dice", false, character_settings);
        options.append(e);
        e = createHTMLOption("custom-critical-limit", false, character_settings);
        options.append(e);
        if (response["racial-traits"].includes("Lucky")) {
            e = createHTMLOption("halfling-lucky", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Brutal Critical") ||
            response["racial-traits"].includes("Savage Attacks")) {
            e = createHTMLOption("brutal-critical", false, character_settings);
            options.append(e);
        }
        if (Object.keys(response.classes).includes("Rogue")) {
            e = createHTMLOption("rogue-sneak-attack", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Jack of All Trade")) {
            e = createHTMLOption("bard-joat", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Remarkable Athlete")) {
            e = createHTMLOption("champion-remarkable-athlete", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Favored Foe")) {
            e = createHTMLOption("ranger-favored-foe", false, character_settings);
            options.append(e);
        }
        if (response["feats"].includes("Sharpshooter")) {
            e = createHTMLOption("sharpshooter", false, character_settings);
            options.append(e);
        }
        if (response["feats"].includes("Great Weapon Master")) {
            e = createHTMLOption("great-weapon-master", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Rage")) {
            e = createHTMLOption("barbarian-rage", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Divine Fury")) {
            e = createHTMLOption("barbarian-divine-fury", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Crimson Rite")) {
            e = createHTMLOption("bloodhunter-crimson-rite", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Dread Ambusher")) {
            e = createHTMLOption("ranger-dread-ambusher", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Planar Warrior")) {
            e = createHTMLOption("ranger-planar-warrior", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Hunter’s Prey: Colossus Slayer")) {
            e = createHTMLOption("ranger-colossus-slayer", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Slayer’s Prey")) {
            e = createHTMLOption("ranger-slayers-prey", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Gathered Swarm")) {
            e = createHTMLOption("ranger-gathered-swarm", false, character_settings);
            options.append(e);
        }
        if (response["actions"].includes("Channel Divinity: Legendary Strike")) {
            e = createHTMLOption("paladin-legendary-strike", false, character_settings)
            options.append(e);
        }
        if (response["class-features"].includes("Improved Divine Smite")) {
            e = createHTMLOption("paladin-improved-divine-smite", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Hexblade’s Curse")) {
            e = createHTMLOption("warlock-hexblade-curse", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Assassinate")) {
            e = createHTMLOption("rogue-assassinate", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Giant’s Might")) {
            e = createHTMLOption("fighter-giant-might", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Arcane Firearm")) {
            e = createHTMLOption("artificer-arcane-firearm", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Divine Strike")) {
            e = createHTMLOption("cleric-divine-strike", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Psychic Blades") &&
            Object.keys(response.classes).includes("Bard")) {
            e = createHTMLOption("bard-psychic-blades", false, character_settings);
            options.append(e);
        }
        if (response["racial-traits"].includes("Radiant Soul")) {
            e = createHTMLOption("protector-aasimar-radiant-soul", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Bladesong")) {
            e = createHTMLOption("wizard-bladesong", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Dreadful Strikes")) {
            e = createHTMLOption("fey-wanderer-dreadful-strikes", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Alchemical Savant")) {
            e = createHTMLOption("artificer-alchemical-savant", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Invincible Conqueror")) {
            e = createHTMLOption("paladin-invincible-conqueror", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Enhanced Bond")) {
            e = createHTMLOption("wildfire-spirit-enhanced-bond", false, character_settings);
            options.append(e);
        }
        if (response["actions"].includes("Channel Divinity: Sacred Weapon")) {
            e = createHTMLOption("paladin-sacred-weapon", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Blessed Strikes")) {
            e = createHTMLOption("cleric-blessed-strikes", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Trance of Order")) {
            e = createHTMLOption("sorcerer-trance-of-order", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Symbiotic Entity")) {
            e = createHTMLOption("druid-symbiotic-entity", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Eldritch Invocations: Lifedrinker")) {
            e = createHTMLOption("eldritch-invocation-lifedrinker", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Arcane Jolt")) {
            e = createHTMLOption("artificer-arcane-jolt", false, character_settings);
            options.append(e);
        }
        if (response["feats"].includes("Charger")) {
            e = createHTMLOption("charger-feat", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Genie’s Vessel")) {
            e = createHTMLOption("genies-vessel", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Empowered Evocation")) {
            e = createHTMLOption("empowered-evocation", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Natural Explorer")) {
            e = createHTMLOption("ranger-natural-explorer", false, character_settings);
            options.append(e);
        }

        loadSettings(response.settings, character_settings);
    }
    $('.beyond20-option-input').off('change', save_settings);
    $('.beyond20-option-input').change(save_settings);
    initializeSettings(gotSettings);
}

function addMonsterOptions() {
    const option = options_list["whisper-type-monsters"];
    option["short"] = "Whisper monster rolls";
    let e = createHTMLOptionEx("whisper-type-monsters", option, true);
    $(e).insertAfter($("#whisper-type").parents("li"));
    const options = $(".beyond20-options");
    options.append(
        E.li({ class: "list-group-item beyond20-option", style: "text-align: center; padding: 10px;" },
            E.h4({}, " == Stat Block Specific Options ==")
        )
    );

    e = createHTMLOption("subst-dndbeyond-stat-blocks", false);
    options.append(e);
    e = createHTMLOption("handle-stat-blocks", false);
    options.append(e);
    $('.beyond20-option-input').off('change', save_settings);
    $('.beyond20-option-input').change(save_settings);
    initializeSettings(gotSettings);
}

function addEncounterOptions() {
    const options = $(".beyond20-options");
    options.append(createHTMLOption("sync-combat-tracker", false));
}

function tabMatches(tab, url) {
    return tab.url.match(url.replace(/\*/g, "[^]*")) != null;
}

function actOnCurrentTab(tab) {
    setCurrentTab(tab);
    if (urlMatches(tab.url, ROLL20_URL) || isFVTT(tab.title)) {
        const vtt = isFVTT(tab.title) ? "Foundry VTT" : "Roll20";
        const options = $(".beyond20-options");
        options.append(
            E.li({ class: "list-group-item beyond20-option", style: "text-align: center; margin: 10px;" },
                E.h4({}, ` == ${vtt} Tab Specific Options ==`)
            )
        );
        let e = null;
        if (vtt == "Roll20") {
            e = createHTMLOption("roll20-template", false);
            options.append(e);
        }
        e = createHTMLOption("display-conditions", false);
        options.append(e);
        e = options_list["vtt-tab"].createHTMLElement("vtt-tab", true);
        options.append(e);
        $('.beyond20-option-input').off('change', save_settings);
        $('.beyond20-option-input').change(save_settings);
        initializeSettings(gotSettings);
    } else if (urlMatches(tab.url, DNDBEYOND_CHARACTER_URL)) {
        sendMessageToTab(tab.id, { "action": "get-character" }, populateCharacter);
    } else if (urlMatches(tab.url, DNDBEYOND_MONSTER_URL) || urlMatches(tab.url, DNDBEYOND_VEHICLE_URL)) {
        addMonsterOptions();
    } else if (urlMatches(tab.url, DNDBEYOND_COMBAT_URL) || urlMatches(tab.url, DNDBEYOND_ENCOUNTERS_URL) || urlMatches(tab.url, DNDBEYOND_ENCOUNTER_URL)) {
        addEncounterOptions();
        addMonsterOptions();
    } else {
        initializeSettings(gotSettings);
    }
    canAlertify(tab.id);
}


setupHTML();
if (chrome.tabs != undefined) {
    chrome.tabs.query({ "active": true, "currentWindow": true }, (tabs) => actOnCurrentTab(tabs[0]));
} else {
    chrome.runtime.sendMessage({ "action": "get-current-tab" }, actOnCurrentTab);
}