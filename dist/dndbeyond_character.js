function replaceRollsCallback(match, replaceCB) {
    let dice = match[2];
    let modifiers = match[3];
    if (dice === undefined) {
        dice = "";
        modifiers = match[4];
    }

    let result = match[1];
    result += replaceCB(dice, modifiers);
    result += match[5];
    return result;
}

function replaceRolls(text, replaceCB) {
    // TODO: Cache the value so we don't recompile the regexp every time
    const dice_regexp = new RegExp(/(^|[^\w])(?:(?:(?:(\d*d\d+(?:ro(?:=|<|<=|>|>=)[0-9]+)?(?:min[0-9]+)?)((?:\s*[-+]\s*\d+)*))|((?:[-+]\s*\d+)+)))($|[^\w])/, "gm");
    return text.replace(dice_regexp, (...match) => replaceRollsCallback(match, replaceCB));
}

// Used to clean various dice.includes(imperfections) roll strings;
function cleanRoll(rollText) {
    //clean adjacent '+'s (Roll20 treats it as a d20);
    //eg: (1d10 + + 2 + 3) -> (1d10 + 2 + 3);
    rollText = (rollText || "").toString();
    rollText = rollText.replace(/\+ \+/g, '+').replace(/\+ \-/g, '-');
    return rollText;
}

// Taken from https://stackoverflow.com/questions/45985198/the-best-practice-to-detect-whether-a-browser-extension-is-running-on-chrome-or;
function getBrowser() {
    if (typeof (chrome) !== "undefined") {
        if (typeof (browser) !== "undefined") {
            return "Firefox";
        } else {
            return "Chrome";
        }
    } else {
        return "Edge";

    }
}

function isExtensionDisconnected() {
    try {
        chrome.extension.getURL("");
        return false;
    } catch (err) {
        return true;
    }
}

// Taken from https://stackoverflow.com/questions/9515704/insert-code-into-the-page-context-using-a-content-script;
function injectPageScript(url) {
    const s = document.createElement('script');
    s.src = url;
    s.charset = "UTF-8";
    s.onload = () => s.remove();
    (document.head || document.documentElement).appendChild(s);
}

function injectCSS(css) {
    const s = document.createElement('style');
    s.textContent = css;
    (document.head || document.documentElement).appendChild(s);
}

function sendCustomEvent(name, data=[]) {
    if (getBrowser() === "Firefox")
        data = cloneInto(data, window);
    const event = new CustomEvent("Beyond20_" + name, { "detail": data });
    document.dispatchEvent(event);
}

function addCustomEventListener(name, callback) {
    const event = ["Beyond20_" + name, (evt) => {
        const detail = evt.detail || [];
        callback(...detail)
    }, false];
    document.addEventListener(...event);
    return event;
}

function roll20Title(title) {
    return title.replace(" | Roll20", "");
}

function isFVTT(title) {
    return title.includes("Foundry Virtual Tabletop");
}

function isAstral(title) {
    return title.includes("Astral TableTop");
}

function fvttTitle(title) {
    return title.replace(" • Foundry Virtual Tabletop", "");
}

function astralTitle(title) {
    return title.replace(" | Astral TableTop", "");
}

function urlMatches(url, matching) {
    return url.match(matching.replace(/\*/g, "[^]*")) !== null;
}

function alertSettings(url, title) {
    if (alertify.Beyond20Settings === undefined)
        alertify.dialog('Beyond20Settings', function () { return {}; }, false, "alert");

    const popup = chrome.extension.getURL(url);
    const img = E.img({src: chrome.extension.getURL("images/icons/icon32.png"), style: "margin-right: 3px;"})
    const iframe = E.iframe({src: popup, style: "width: 100%; height: 100%;", frameborder: "0", scrolling: "yes"});
    const dialog = alertify.Beyond20Settings(img.outerHTML + title, iframe);
    dialog.set('padding', false).set('resizable', true).set('overflow', false).resizeTo("80%", "80%");

}
function alertQuickSettings() {
    alertSettings("popup.html", "Beyond 20 Quick Settings");
}
function alertFullSettings() {
    alertSettings("options.html", "Beyond 20 Settings");

}
function isListEqual(list1, list2) {
    const list1_str = list1.join(",");
    const list2_str = list2.join(",");
    return list1_str == list2_str;

}
function isObjectEqual(obj1, obj2) {
    const obj1_str = Object.entries(obj1).join(",");
    const obj2_str = Object.entries(obj2).join(",");
    return obj1_str == obj2_str;
}

// replaces matchAll, requires a non global regexp
function reMatchAll(regexp, string) {
    const matches = string.match(new RegExp(regexp, "gm"));
    if ( matches) {
        let start = 0;
        return matches.map(group0 => {
            const match = group0.match(regexp);
            match.index = string.indexOf(group0, start);
            start = match.index;
            return match;
        });
    }
    return matches;
}

E = new Proxy({}, {
    get: function (obj, name) {
        return new Proxy(function () {}, {
            apply: (target, thisArg, argumentsList) => {
                const attributes = argumentsList[0] || {};
                const children = argumentsList.slice(1);
                const e = document.createElement(name);
                for (const [name, value] of Object.entries(attributes))
                    e.setAttribute(name, value);
                for (const child of children)
                    e.append(child);
                return e;
            }
        });
    }
});
//from elementmaker import E;
//from utils import roll20Title, fvttTitle, isFVTT;

class WhisperType {
    static get NO() { return 0; }
    static get YES() { return 1; }
    static get QUERY() { return 2; }
    static get HIDE_NAMES() { return 3; }
}

class RollType {
    static get NORMAL() { return 0; }
    static get DOUBLE() { return 1; }
    static get QUERY() { return 2; }
    static get ADVANTAGE() { return 3; }
    static get DISADVANTAGE() { return 4; }
    static get THRICE() { return 5; }
    static get SUPER_ADVANTAGE() { return 6; }
    static get SUPER_DISADVANTAGE() { return 7; }
    // If a feat overrides it to have advantage;
    static get OVERRIDE_ADVANTAGE() { return 8; }
    static get OVERRIDE_DISADVANTAGE() { return 9; }
}

class CriticalRules {
    static get PHB() { return 0; }
    static get HOMEBREW_MAX() { return 1; }
    // Impossible to achieve with Roll20 && hard with RollRenderer because of brutal && other mods.;
    static get HOMEBREW_DOUBLE() { return 2 }
    static get HOMEBREW_MOD() { return 3; }
    static get HOMEBREW_REROLL() { return 4; }
}

// keys: [short, title, description, type, default];
// Types: bool, string, combobox, link, special;
// combobox extra options:;
//                        choices: {value: string}
// special extra options:;
//                        createHTMLElement: function;
//                        set: function;
//                        get: function;

const options_list = {
    "whisper-type": {
        "short": "Whisper rolls",
        "title": "Whisper rolls to the DM",
        "description": "Determines if the rolls will be whispered to the DM.\n" +
            "In the case of Foundry VTT, the 'ask every time' option will use the setting in the chat box.",
        "type": "combobox",
        "default": WhisperType.NO,
        "choices": {
            [WhisperType.NO.toString()]: "Never whisper",
            [WhisperType.YES.toString()]: "Always whisper",
            [WhisperType.QUERY.toString()]: "Ask every time"
        }
    },

    "whisper-type-monsters": {
        "title": "Whisper monster rolls to the DM",
        "description": "Overrides the global whisper setting from monster stat blocks",
        "type": "combobox",
        "default": WhisperType.YES,
        "choices": {
            [WhisperType.NO.toString()]: "Use general whisper setting",
            [WhisperType.HIDE_NAMES.toString()]: "Hide monster and attack name",
            [WhisperType.YES.toString()]: "Always whisper monster rolls",
            [WhisperType.QUERY.toString()]: "Ask every time"
        }
    },

    "roll-type": {
        "short": "Type of Roll",
        "title": "Type of Roll (Advantange/Disadvantage)",
        "description": "Determines if rolls should be with advantage, disadvantage, double rolls or user queries",
        "short_description": "Hold Shift/Ctrl/Alt to override for Advantage/Disadvantage/Regular rolls",
        "type": "combobox",
        "default": RollType.NORMAL,
        "choices": {
            [RollType.NORMAL.toString()]: "Normal Roll",
            [RollType.DOUBLE.toString()]: "Always roll twice",
            [RollType.QUERY.toString()]: "Ask every time",
            [RollType.ADVANTAGE.toString()]: "Roll with Advantage",
            [RollType.DISADVANTAGE.toString()]: "Roll with Disadvantage",
            [RollType.THRICE.toString()]: "Always roll thrice (limited support on Roll20)",
            [RollType.SUPER_ADVANTAGE.toString()]: "Roll with Super Advantage",
            [RollType.SUPER_DISADVANTAGE.toString()]: "Roll with Super Disadvantage",
        }
    },

    "quick-rolls": {
        "short": "Add Quick Roll areas",
        "title": "Add Quick Rolls areas to main page",
        "description": "Listen to clicks in specific areas of the abilities, skills, actions and spells to quickly roll them.",
        "type": "bool",
        "default": true
    },

    "use-digital-dice": {
        "short": "Use D&D Beyond's Digital Dice",
        "title": "Use D&D Beyond's Digital Dice",
        "description": "Integrate with D&D Beyond's Digital Dice, rolling the dice on the screen and sending the pre-calculated results to the VTT.",
        "type": "bool",
        "default": false
    },

    "auto-roll-damage": {
        "title": "Auto roll Damage and Crit",
        "description": "Always roll damage and critical hit dice when doing an attack",
        "type": "bool",
        "default": true
    },

    "initiative-tracker": {
        "title": "Add initiative roll to the Turn Tracker",
        "description": "Adds the result of the initiative roll to the turn tracker.\n" +
            "This requires you to have a token selected in the VTT\n" +
            "If using Roll20, it will also change the way the output of 'Advantage on initiative' rolls appear.",
        "type": "bool",
        "default": true
    },

    "initiative-tiebreaker": {
        "title": "Add tiebreaker to initiative rolls",
        "description": "Adds the dexterity score as a decimal to initiative rolls to break any initiative ties.",
        "type": "bool",
        "default": false
    },

    "critical-homebrew": {
        "title": "Critical hit rule",
        "description": "Determines how the additional critical hit damages are determined",
        "type": "combobox",
        "default": CriticalRules.PHB.toString(),
        "choices": {
            [CriticalRules.PHB.toString()]: "Standard PHB Rules (reroll dice)",
            [CriticalRules.HOMEBREW_MAX.toString()]: "Homebrew: Perfect rolls",
            [CriticalRules.HOMEBREW_REROLL.toString()]: "Homebrew: Reroll all damages"
        }
    },

    "weapon-force-critical": {
        "title": "Force all attacks as Critical Hits",
        "description": "Forces all attacks to be considered as critical hits. Useful for melee attacks against paralyzed enemies or using adamantine weapons against objects",
        "short": "Force Critical Hits",
        "short_description": "Useful for melee attacks against paralyzed enemies or using adamantine weapons against objects",
        "type": "bool",
        "default": false
    },

    "update-hp": {
        "title": "Update VTT Token HP",
        "description": "When changing HP in D&D Beyond, update it in the VTT tokens and sheets",
        "type": "bool",
        "default": true
    },

    "display-conditions": {
        "title": "Display Condition updates to VTT",
        "description": "When updating character conditions in D&D Beyond, display a message in the VTT chat.\n" +
            "If using Foundry VTT with the Beyond20 module, it will also update the token's status icons appropriately.",
        "type": "bool",
        "default": true
    },

    "template": {
        "type": "migrate",
        "to": "roll20-template",
        "default": "roll20"
    },

    "roll20-template": {
        "title": "Roll20 Character Sheet Setting",
        "description": "Select the Character Sheet Template that you use in Roll20\n" +
            "If the template does not match the campaign setting, it will default to the Beyond20 Roll Renderer.",
        "type": "combobox",
        "default": "roll20",
        "choices": { "roll20": "D&D 5E By Roll20", "default": "Beyond20 Roll Renderer" }
    },

    "notes-to-vtt": {
        "title": "Send custom text to the VTT (currently Roll20 only)",
        "description": "In the \"Notes\" or \"Description\" section of any item, action, or spell on the D&D Beyond Character Sheet, "
            + "you may add your own custom text to be sent to the VTT as a message when you use that element's roll action."
            + "\nTo do this, format the text you wish to send as follows:"
            + "\n[[msg-type]] Put text you wish to send HERE[[/msg-type]]"
            + "\nReplace \"msg-type\" with one of the following: \"before\", \"after\", or \"replace\" depending on how you want to affect the message or action that would normally be sent to the VTT.",
        "type": "info"
    },

    "subst-roll20": {
        "type": "migrate",
        "to": "subst-vtt",
        "default": true
    },

    "subst-vtt": {
        "title": "Replace Dices formulas in the VTT",
        "description": "In Roll20 or Foundry VTT, if a spell card or an item or a feat has a dice formula in its description,\n" +
            "enabling this will make the formula clickable to generate the roll in chat.",
        "type": "bool",
        "default": true
    },

    "subst-dndbeyond": {
        "title": "Replace Dices formulas in D&D Beyond (Spells & Character Sheet)",
        "description": "In the D&D Beyond Spell page or Character sheet side panel, if a spell, item, feat or action has a dice formula in its description,\n" +
            "enabling this will add a dice icon next to the formula to allow you to roll it.",
        "type": "bool",
        "default": true
    },

    "subst-dndbeyond-stat-blocks": {
        "title": "Replace Dices formulas in D&D Beyond (Stat blocks)",
        "description": "In D&D Beyond, if a dice formula is found in the stat block of a creature, monster, vehicle,\n" +
            "enabling this will add a dice icon next to the formula to allow you to roll it.",
        "type": "bool",
        "default": true
    },

    "handle-stat-blocks": {
        "title": "Add roll buttons to stat blocks",
        "description": "In D&D Beyond, adds roll buttons for abilities/saving throws/skills/actions to the stat block of a creature, monster or vehicle.",
        "type": "bool",
        "default": true
    },

    "crit-prefix": {
        "title": "Critical Hit Prefix",
        "description": "Prefix to add to the Critical Hit dice result.\nIt might be less confusing to explicitely show the crit damage",
        "type": "string",
        "default": "Crit: "
    },

    "components-display": {
        "title": "Components to display in spell attacks",
        "description": "When doing a spell attack, what components to show alongside the spell roll.",
        "type": "combobox",
        "default": "all",
        "choices": { "all": "All components", "material": "Only material components", "none": "Do not display anything" }
    },

    "component-prefix": {
        "title": "Component Prefix",
        "description": "Prefix to the components display of a spell attack.\nIf displaying material components only, you may want to set it to 'Materials used :' for example",
        "type": "string",
        "default": "Components: "
    },


    "roll20-tab": {
        "type": "migrate",
        "to": "vtt-tab",
        "default": null
    },

    "vtt-tab": {
        "title": "Select the VTT tab or Game to send rolls to",
        "description": "Select the tab to send rolls to or the specific Game.\nYou can select the Game or tab from the extension's popup menu in the VTT tab itself.\nAfter a specific tab is selected and that tab is closed, it will revert to sending rolls to the same Game.",
        "type": "special",
        "default": null
        // callbacks will be added after the functions are defined
    },

    "discord-integration": {
        "title": "Discord Integration",
        "description": "You can get rolls sent to Discord by enabling Discord Integration!\n" +
            "Click the link, follow the instructions and enter your secret key below.",
        "type": "link",
        "default": "https://beyond20.here-for-more.info/discord",
        "icon": "https://discordapp.com/assets/fc0b01fe10a0b8c602fb0106d8189d9b.png",
        "icon-height": "100%",
        "icon-width": "100%"
    },

    "discord-secret": {
        "type": "migrate",
        "to": "discord-channels",
        "default": ""
    },

    "discord-channels": {
        "title": "Discord Default Destination Channel",
        "description": "Default Discord destination channel to send rolls to",
        "type": "special",
        "default": null
    },

    "show-changelog": {
        "title": "Show Changelog when installing a new version",
        "description": "When a new version is released and the extension has been updated,\n" +
            "open the changelog in a new window",
        "type": "bool",
        "default": true
    },

    "last-version": {
        "description": "Last version that was installed. Used to check if an update just happened",
        "type": "string",
        "hidden": true,
        "default": ""
    },
    "migrated-sync-settings": {
        "description": "Whether the user settings were migrated from sync storage to local storage",
        "type": "bool",
        "hidden": true,
        "default": false
    },
    "last-whisper-query": {
        "description": "Last user selection for query whispers",
        "type": "int",
        "hidden": true,
        "default": WhisperType.NO
    },
    "last-advantage-query": {
        "description": "Last user selection for query roll type",
        "type": "int",
        "hidden": true,
        "default": RollType.NORMAL
    },

    "sync-combat-tracker": {
        "title": "Synchronize the Combat Tracker with the VTT",
        "description": "Overwrites the VTT's combat tracker with the details from D&D Beyond's Encounter tool (Roll20 only, GM only)",
        "type": "bool",
        "default": true
    },

    "donate": {
        "short": "Buy rations (1 day) to feed my familiar",
        "title": "Become a patron of the art of software development!",
        "description": "If you wish to support my work on Beyond 20 or my other D&D related project, subscribe to my patreon " +
            "or donate via paypal!\nI am grateful for your generosity!",
        "type": "link",
        "default": "https://beyond20.here-for-more.info/rations",
        "icon": "/images/donate.png",
        "icon-width": "64",
        "icon-height": "64"
    }
}

const character_settings = {
    "migrated-sync-settings": {
        "description": "Whether the user settings were migrated from sync storage to local storage",
        "type": "bool",
        "hidden": true,
        "default": false
    },
    "versatile-choice": {
        "title": "Versatile weapon choice",
        "description": "How to roll damage for Versatile weapons",
        "type": "combobox",
        "default": "both",
        "choices": {
            "both": "Roll both damages separately",
            "one": "Use weapon One-handed",
            "two": "Use weapon Two-handed"
        }
    },
    "custom-roll-dice": {
        "title": "Custom Roll dice formula bonus",
        "description": "Add custom formula to d20 rolls (Bless, Guidance, Bane, Magic Weapon, etc..)",
        "type": "string",
        "default": ""
    },
    "custom-damage-dice": {
        "title": "Custom Damage dice formula bonus",
        "description": "Add custom dice to damage rolls (Magic Weapon, Elemental Weapon, Green-flame Blade, etc..). Use a comma to separate multiple independent rolls.",
        "type": "string",
        "default": ""
    },
    "custom-critical-limit": {
        "title": "Custom Critical limit",
        "description": "Set a custom threshold for the critical hit limit (if using homebrew magical items)",
        "type": "string",
        "default": ""
    },
    "rogue-sneak-attack": {
        "title": "Rogue: Sneak Attack",
        "description": "Send Sneak Attack damage with each attack roll",
        "type": "bool",
        "default": true
    },
    "cleric-disciple-life": {
        "title": "Cleric: Disciple of Life",
        "description": "Send Disciple of Life healing bonus",
        "type": "bool",
        "default": true
    },
    "bard-joat": {
        "title": "Bard: Jack of All Trades",
        "description": "Add JoaT bonus to raw ability checks",
        "type": "bool",
        "default": true
    },
    "sharpshooter": {
        "title": "Fighter: Sharpshooter (Apply to next roll only)",
        "description": "Apply Sharpshooter -5 penalty to roll and +10 to damage",
        "type": "bool",
        "default": false
    },
    "great-weapon-master": {
        "title": "Great Weapon Master Feat (Apply to next roll only)",
        "description": "Apply Great Weapon Master -5 penalty to roll and +10 to damage",
        "type": "bool",
        "default": false
    },
    "brutal-critical": {
        "title": "Brutal Critical/Savage Attacks: Roll extra die",
        "description": "Roll extra damage die on crit for Brutal Critical and Savage Attacks features",
        "type": "bool",
        "default": true
    },

    "barbarian-rage": {
        "title": "Rage: You are raging, ARRGGHHHHHH",
        "description": "Add Rage damage to melee attacks and add advantage to Strength checks and saving throws",
        "type": "bool",
        "default": false
    },
    "barbarian-divine-fury": {
        "title": "Barbarian: Divine Fury",
        "description": "Add Divine Fury damage to your attack (when raging)",
        "type": "bool",
        "default": true
    },
    "bloodhunter-crimson-rite": {
        "title": "Bloodhunter: Crimson Rite",
        "description": "Add Crimson Rite damage",
        "type": "bool",
        "default": false
    },
    "ranger-dread-ambusher": {
        "title": "Ranger: Dread Ambusher",
        "description": "Add Dread Ambusher attack 1d8 extra damage",
        "type": "bool",
        "default": false
    },
    "paladin-legendary-strike": {
        "title": "Paladin: Legendary Strike",
        "description": "Channel Divinity and score critical hits on rolls of 19 and 20",
        "type": "bool",
        "default": false
    },
    "paladin-improved-divine-smite": {
        "title": "Paladin: Improved Divine Smite",
        "description": "Roll an extra 1d8 radiant damage whenever you hit with a melee weapon",
        "type": "bool",
        "default": true
    },
    "warlock-hexblade-curse": {
        "title": "Warlock: Hexblade's Curse",
        "description": "Apply the Hexblade's Curse extra damage on attack rolls and score critical hits on rolls of 19 and 20",
        "type": "bool",
        "default": false
    },
    "rogue-assassinate": {
        "title": "Rogue: Assassinate surprise attack (Apply to next roll only)",
        "description": "Roll with advantage and roll critical damage dice",
        "type": "bool",
        "default": false
    },
    "fighter-giant-might": {
        "title": "Fighter: Giant Might",
        "description": "Activate Giant Might to get advantage on Strength checks and saving throws and deal 1d6 extra damage",
        "type": "bool",
        "default": false
    },
    "artificer-arcane-firearm": {
        "title": "Artificer: Use Arcane Firearm",
        "description": "Use an Arcane Firearm for your Artificer spells. Deals extra 1d8 damage",
        "type": "bool",
        "default": false
    },
    "cleric-divine-strike": {
        "title": "Cleric: Divine Strike",
        "description": "Deal an extra 1d8 (2d8 at level 14) damage to weapon attacks",
        "type": "bool",
        "default": true
    },
    "bard-psychic-blades": {
        "title": "Bard: Psychic Blades",
        "description": "Use your Bardic Inspiration to deal extra psychic damage (Apply to next roll only)",
        "type": "bool",
        "default": false
    },
    "ranger-planar-warrior": {
        "title": "Ranger: Planar Warrior",
        "description": "Use your Planar Warrior ability to deal extra Force damage",
        "type": "bool",
        "default": false
    },
    "ranger-slayers-prey": {
        "title": "Ranger: Slayer's Prey",
        "description": "Use your Slayer's Prey ability and add 1d6 damage to your target",
        "type": "bool",
        "default": false
    },
    "ranger-gathered-swarm": {
        "title": "Ranger: Gathered Swarm",
        "description": "Use your Gathered Swarm ability to add extra Force damage to your weapon attacks",
        "type": "bool",
        "default": false
    },
    "protector-aasimar-radiant-soul": {
        "title": "Protector Aasimar: Radiant Soul",
        "description": "Unleash your divine soul to deal extra radiant damage equal to your level.",
        "type": "bool",
        "default": false
    },
    "wizard-bladesong": {
        "title": "Wizard: Bladesong",
        "description": "Activate your Bladesong and make your weapon sing with magic",
        "type": "bool",
        "default": false
    },
    "fey-wanderer-dreadful-strikes": {
        "title": "Fey Wanderer: Dreadful Strikes",
        "description": "Imbue your weapons and deal psychic damage to your the minds of your enemies.",
        "type": "bool",
        "default": false
    },
    "champion-remarkable-athlete": {
        "title": "Champion Fighter: Remarkable Athlete",
        "description": "Add Remarkable Athlete bonus to Strength/Dexterity/Constitution ability checks",
        "type": "bool",
        "default": true
    },
    "artificer-alchemical-savant": {
        "title": "Artificer: Use Alchemical Savant",
        "description": "Use your Alchemist's supplies as spellcasting focus, dealing extra damage or healing equal to your Intelligence Modifier",
        "type": "bool",
        "default": true
    },
    "paladin-invincible-conqueror": {
        "title": "Paladin: Oath of Conquest: Invincible Conqueror",
        "description": "You can harness extraordinary martial prowess for 1 minute.",
        "type": "bool",
        "default": false
    },
    "wildfire-spirit-enhanced-bond": {
        "title": "Wildfire Spirit: Enhanced Bond",
        "description": "The bond with your wildfire spirit enhances your destructive and restorative spells.",
        "type": "bool",
        "default": false
    }
}

function getStorage() {
    return chrome.storage.local;
}

function storageGet(name, default_value, cb) {
    getStorage().get({ [name]: default_value }, (items) => cb(items[name]));
}

function storageSet(name, value, cb = null) {
    getStorage().set({ [name]: value }, () => {
        if (chrome.runtime.lastError) {
            console.log('Chrome Runtime Error', chrome.runtime.lastError.message);
        } else if (cb) {
            cb(value);
        }
    });
}

function storageRemove(names, cb = null) {
    getStorage().remove(names, () => {
        if (cb)
            cb(names);
    });
}

function getDefaultSettings(_list = options_list) {
    const settings = {}
    for (let option in _list)
        settings[option] = _list[option].default;
    //console.log("Default settings :", settings);
    return settings;
}

function getStoredSettings(cb, key = "settings", _list = options_list) {
    const settings = getDefaultSettings(_list);
    storageGet(key, settings, async (stored_settings) => {
        //console.log("Beyond20: Stored settings (" + key + "):", stored_settings);
        const migrated_keys = [];
        for (let opt in settings) {
            if (_list[opt].type == "migrate") {
                if (Object.keys(stored_settings).includes(opt)) {
                    if (stored_settings[opt] != _list[opt].default) {
                        // Migrate opts over when loading them;
                        stored_settings[_list[opt].to] = stored_settings[opt];
                        migrated_keys.push(opt);
                    }
                    delete stored_settings[opt];
                }
            } else if (!Object.keys(stored_settings).includes(opt)) {
                // On Firefox, if setting is not in storage, it won't return the default value
                stored_settings[opt] = settings[opt];
            }
        }
        // Migrate settings from sync storage to local storage
        if (!stored_settings["migrated-sync-settings"]) {
            await new Promise(resolve => {
                chrome.storage.sync.get({ [key]: stored_settings }, (items) => {
                    stored_settings = Object.assign(stored_settings, items[key]);
                    resolve();
                });
            });;
            stored_settings["migrated-sync-settings"] = true;
            migrated_keys.push("migrated-sync-settings");
        }
        if (migrated_keys.length > 0) {
            console.log("Beyond20: Migrated some keys:", stored_settings);
            storageSet(key, stored_settings);
        }
        cb(stored_settings);
    });
}

function setSettings(settings, cb = null, key = "settings") {
    storageSet(key, settings, (settings) => {
        console.log("Beyond20: Saved settings (" + key + "): ", settings);
        if (cb)
            cb(settings);
    });
}

function mergeSettings(settings, cb = null, key = "settings", _list = options_list) {
    console.log("Saving new settings (" + key + "): ", settings);
    getStoredSettings((stored_settings) => {
        for (let k in settings)
            stored_settings[k] = settings[k];
        setSettings(stored_settings, cb, key);
    }, key, _list);
}

function resetSettings(cb = null, _list = options_list) {
    setSettings(getDefaultSettings(_list), cb);
}

function createHTMLOptionEx(name, option, short = false) {
    if (option.hidden || (short && !option.short) || !option.title)
        return null;
    const description = short ? option.short_description : option.description;
    const description_p = description ? description.split("\n").map(desc => E.p({}, desc)) : [];
    const title = short ? option.short : option.title;
    let e = null;
    if (option.type == "bool") {
        e = E.li({ class: "list-group-item beyond20-option beyond20-option-bool" },
            E.label({ class: "list-content", for: name },
                E.h4({}, title),
                ...description_p,
                E.div({ class: 'material-switch pull-right' },
                    E.input({ id: name, class: "beyond20-option-input", name, type: "checkbox" }),
                    E.label({ for: name, class: "label-default" })
                )
            )
        );
    } else if (option.type == "string") {
        e = E.li({ class: "list-group-item beyond20-option beyond20-option-string" },
            E.label({ class: "list-content", for: name },
                E.h4({}, title),
                ...description_p,
                E.div({ class: "right-entry" },
                    E.input({ id: name, class: "beyond20-option-input", name, type: "text" })
                )
            )
        );
    } else if (option.type == "combobox") {
        const dropdown_options = Object.values(option.choices).map(o => E.li({}, E.a({ href: "#" }, o)));
        for (let p of description_p) {
            p.classList.add("select");
        }
        e = E.li({ class: "list-group-item beyond20-option beyond20-option-combobox" },
            E.label({ class: "list-content", for: name },
                E.h4({ class: "select" }, title),
                ...description_p,
                E.div({ class: "button-group" },
                    E.a({ id: name, class: "input select beyond20-option-input", href: "" }, option.choices[option.default]),
                    E.ul({ class: "dropdown-menu" },
                        ...dropdown_options),
                    E.i({ id: `${name}--icon`, class: "icon select" })
                )
            )
        );
    } else if (option.type == "link") {
        e = E.li({ class: "list-group-item beyond20-option beyond20-option-link" },
            E.label({ class: "list-content", id: name },
                E.a({ href: option.default },
                    E.h4({}, title)),
                ...description_p,
                E.a({ href: option.default },
                    E.div({ class: "image-link" },
                        E.img({
                            class: "link-image",
                            width: option['icon-width'],
                            height: option['icon-height'],
                            src: option.icon.startsWith("/") ? chrome.extension.getURL(option.icon) : option.icon
                        })
                    )
                )
            )
        );
    } else if (option.type == "info") {
        e = E.li({ class: "list-group-item beyond20-option beyond20-option-info" },
            E.label({ class: "list-content", for: name, style: "background-color: LightCyan;"},
                E.h4({}, title),
                ...description_p
            )
        );
    } else if (option.type == "special") {
        e = option.createHTMLElement(name, short);
    }
    return e;
}

function createHTMLOption(name, short = false, _list = options_list) {
    return createHTMLOptionEx(name, _list[name], short);
}

function initializeMarkaGroup(group) {
    const triggerOpen = $(group).find('.select');
    const triggerClose = $(group).find('.dropdown-menu li');
    const dropdown_menu = $(group).find(".dropdown-menu");
    const button_group = $(group).find(".button-group");
    const marka = $(group).find('.icon');
    const input = $(group).find('.input');

    // set initial Marka icon;
    const m = new Marka('#' + marka.attr("id"));
    m.set('triangle').size(10);
    m.rotate('down');

    // trigger dropdown;
    $(group).find('.button-group').push(marka);
    makeOpenCB = (dropdown_menu, icon, m) => {
        return (event) => {
            event.preventDefault();
            dropdown_menu.toggleClass('open');
            button_group.toggleClass('open');

            if (icon.hasClass("marka-icon-times")) {
                m.set('triangle').size(10);
            } else {
                m.set('times').size(15);
            }
        }
    }
    makeCloseCB = (dropdown_menu, input, m) => {
        return function (event) {
            event.preventDefault();
            input.text(this.innerText);
            input.trigger("markaChanged");
            dropdown_menu.removeClass('open');
            button_group.removeClass('open');
            m.set('triangle').size(10);
        }
    }

    triggerOpen.click(makeOpenCB(dropdown_menu, marka, m));
    triggerClose.click(makeCloseCB(dropdown_menu, input, m));
    return m;
}

function initializeMarka() {
    const groups = $('.beyond20-option-combobox');

    for (let group of groups.toArray())
        initializeMarkaGroup(group);
}

function extractSettingsData(_list = options_list) {
    const settings = {}
    for (let option in _list) {
        const e = $("#" + option);
        if (e.length > 0) {
            const o_type = _list[option].type;
            if (o_type == "bool") {
                settings[option] = e.prop('checked');
            } else if (o_type == "combobox") {
                const val = e.text();
                const choices = _list[option].choices;
                for (let key in choices) {
                    if (choices[key] == val) {
                        settings[option] = key;
                        break;
                    }
                }
            } else if (o_type == "string") {
                settings[option] = e.val();
            } else if (o_type == "special") {
                settings[option] = _list[option].get(option);
            }
        }
    }
    return settings;
}

function loadSettings(settings, _list = options_list) {
    for (let option in settings) {
        if (!_list[option]) {
            continue;
        }
        const o_type = _list[option].type;
        if (o_type == "bool") {
            $("#" + option).prop('checked', settings[option]);
        } else if (o_type == "combobox") {
            const val = settings[option];
            const choices = _list[option].choices;
            $("#" + option).text(choices[val]);
        } else if (o_type == "string") {
            $("#" + option).val(settings[option]);
        } else if (o_type == "special") {
            _list[option].set(option, settings);
        }
    }
}

function restoreSavedSettings(cb = null, key = "settings", _list = options_list) {
    load = (stored_settings) => {
        loadSettings(stored_settings, _list);
        if (cb)
            cb(stored_settings);
    }
    getStoredSettings(load, key, _list);
}

function saveSettings(cb, key = "settings", _list = options_list) {
    mergeSettings(extractSettingsData(_list), cb, key, _list);
}

function initializeSettings(cb = null) {
    initializeMarka();
    restoreSavedSettings(cb);
}

function createRoll20TabCombobox(name, short, dropdown_options) {
    const opt = options_list[name];
    const description = short ? "Restrict where rolls are sent.\nUseful if you have multiple VTT windows open" : opt.description;
    const title = short ? "Send Beyond 20 rolls to" : opt.title;
    const description_p = description.split("\n").map(desc => E.p({}, desc));
    let options = [];
    for (let option of dropdown_options)
        options.push(E.li({}, E.a({ href: "#" }, option)));
    for (let p of description_p)
        p.classList.add("select");

    return E.li({
        id: "beyond20-option-vtt-tab",
        class: "list-group-item beyond20-option beyond20-option-combobox" + (short ? " vtt-tab-short" : "")
    },
        E.label({ class: "list-content", for: name },
            E.h4({ class: "select" }, title),
            ...description_p,
            E.div({ class: "button-group" },
                E.a({ id: name, class: "input select beyond20-option-input", href: "" }, "All VTT Tabs"),
                E.ul({ class: "dropdown-menu" },
                    ...options),
                E.i({ id: `${name}--icon`, class: "icon select" })
            )
        )
    );
}

function createVTTTabSetting(name, short) {
    const dropdown_options = ["All VTT Tabs",
        "Only Roll20 Tabs",
        "Only Foundry VTT Tabs",
        "D&D Beyond Dice Roller & Discord"];

    if (short) {
        const vtt = isFVTT(current_tab.title) ? "Foundry VTT" : "Roll20";
        const campaign = vtt == "Foundry VTT" ? "World" : "Campaign";
        dropdown_options.push("This " + campaign);
        dropdown_options.push("This Specific Tab");

    }
    return createRoll20TabCombobox(name, short, dropdown_options);

}
function setVTTTabSetting(name, settings) {
    const val = settings[name];
    const combobox = $("#beyond20-option-vtt-tab");
    if (combobox.length == 0) return;
    if (val === null) {
        $("#" + name).text("All VTT Tabs");
    } else if (val.title === null) {
        const vtt = val.vtt || "roll20";
        let choice = "";
        if (vtt == "dndbeyond") {
            choice = "D&D Beyond Dice Roller & Discord";
        } else {
            const vtt_name = vtt == "roll20" ? "Roll20" : "Foundry VTT";
            choice = "Only " + vtt_name + " Tabs";
        }
        $("#" + name).text(choice);
    } else {
        const [id, title, vtt] = [val.id, val.title, val.vtt || "roll20"];
        const vtt_name = vtt == "roll20" ? "Roll20" : "Foundry VTT";
        const campaign = vtt == "roll20" ? "Campaign" : "World";
        const short = combobox.hasClass("vtt-tab-short");
        let new_options = null;
        if (short) {
            console.log("Set roll20 tab, is SHORT ", val);
            const current_vtt = isFVTT(current_tab.title) ? "fvtt" : "roll20";
            const current_campaign = current_vtt == "roll20" ? "Campaign" : "World";
            const current_title = current_vtt == "roll20" ? roll20Title(current_tab.title) : fvttTitle(current_tab.title);
            const current_id = current_tab.id;
            console.log("vtt-tab settings are : ", id, title, vtt, current_id, current_title, current_vtt);
            if (id == 0 && title == current_title && current_vtt == vtt) {
                $("#" + name).text("This " + campaign);
            } else if (id == current_id && title == current_title && current_vtt == vtt) {
                $("#" + name).text("This Specific Tab");
            } else {
                new_options = ["All VTT Tabs",
                    "Only Roll20 Tabs",
                    "Only Foundry VTT Tabs",
                    "D&D Beyond Dice Roller & Discord",
                    "This " + current_campaign,
                    "This Specific Tab"];
                if (current_vtt == vtt) {
                    new_options.push("Another tab || " + campaign.toLowerCase() + "(No change)");
                } else {
                    new_options.push("A " + vtt_name + " " + campaign.toLowerCase() + "(No change)");
                }
            }
        } else {
            console.log("Set vtt tab, is LONG ", val);
            console.log("vtt-tab settings are : ", id, title, vtt);
            new_options = ["All VTT Tabs",
                "Only Roll20 Tabs",
                "Only Foundry VTT Tabs",
                "D&D Beyond Dice Roller & Discord",
                campaign + ": " + title];
            if (id != 0) {
                new_options.push("Tab #" + id + " (" + title + ")");

            }
        }
        if (new_options !== null) {
            const dropdown_options = [];
            for (let option of new_options)
                dropdown_options.push(E.li({}, E.a({ href: "#" }, option)));
            combobox.replaceWith(createRoll20TabCombobox("vtt-tab", short, dropdown_options));
            initializeMarkaGroup($("#beyond20-option-vtt-tab"));
            console.log("Added new options", dropdown_options);
            $("#" + name).text(new_options.slice(-1)[0].replace("(No change)", ""));
            $("#" + name).attr("x-beyond20-id", id);
            $("#" + name).attr("x-beyond20-title", title);
            $("#" + name).attr("x-beyond20-vtt", vtt);

        }
    }
}

function getVTTTabSetting(name) {
    const opt = $("#" + name);
    const value = opt.text();
    const saved_id = opt.attr("x-beyond20-id");
    const saved_title = opt.attr("x-beyond20-title");
    const saved_vtt = opt.attr("x-beyond20-vtt");
    let ret = null;
    if (value == "All VTT Tabs") {
        ret = null;
    } else if (["This Campaign", "This World", "This Specific Tab"].includes(value)) {
        const vtt = isFVTT(current_tab.title) ? "fvtt" : "roll20";
        const title = vtt == "fvtt" ? fvttTitle(current_tab.title) : roll20Title(current_tab.title);
        ret = {
            "id": (["This Campaign", "This World"].includes(value) ? 0 : current_tab.id),
            "title": title,
            "vtt": vtt
        }
    } else if (value == "Only Roll20 Tabs") {
        ret = { "id": 0, "title": null, "vtt": "roll20" }
    } else if (value == "Only Foundry VTT Tabs") {
        ret = { "id": 0, "title": null, "vtt": "fvtt" }
    } else if (value == "D&D Beyond Dice Roller & Discord") {
        ret = { "id": 0, "title": null, "vtt": "dndbeyond" }
    } else if (value.startsWith("Campaign: ") || value.startsWith("World: ")) {
        ret = { "id": 0, "title": saved_title, "vtt": saved_vtt }
    } else {
        // "Another tab || campaign (No change)", "A Roll20 game", "A FVTT game", "Tab #";
        ret = { "id": saved_id, "title": saved_title, "vtt": saved_vtt }
    }
    console.log("Get tab: ", ret);
    return ret;
}

function setCurrentTab(tab) {
    current_tab = tab;
}

var current_tab = null;


function createDiscordChannelsCombobox(name, description, title, dropdown_options) {
    const description_p = description.split("\n").map(desc => E.p({}, desc));
    let options = [];
    for (let option of dropdown_options) {
        const name = option.secret ? E.strong({}, option.name) : option.name;
        const attributes = {};
        if (option.action)
            attributes['data-action'] = option.action;
        if (option.secret !== undefined)
            attributes['data-secret'] = option.secret;
        options.push(E.li(attributes, E.a({ href: "#" }, name)));
    }
    for (let p of description_p)
        p.classList.add("select");

    return E.li({
        id: "beyond20-option-discord-channels",
        class: "list-group-item beyond20-option beyond20-option-combobox"
    },
        E.label({ class: "list-content", for: name },
            E.h4({ class: "select" }, title),
            ...description_p,
            E.div({ class: "button-group" },
                E.a({ id: name, class: "input select beyond20-option-input", href: "" }, dropdown_options[0].name),
                E.ul({ class: "dropdown-menu" },
                    ...options),
                E.i({ id: `${name}--icon`, class: "icon select" })
            )
        )
    );
}
function createDiscordChannelsSetting(name, short) {
    const opt = options_list[name];
    const dropdowns = [{ name: "Do not send to Discord", active: true, secret: "" }]
    return createDiscordChannelsCombobox(name, opt.description, opt.title, dropdowns);

}
function setDiscordChannelsSetting(name, settings) {
    let val = settings[name];
    const dropdowns = [{ name: "Do not send to Discord", active: false, secret: "" }]

    if (typeof (val) === "string")
        val = [{ secret: val, name: "Unnamed Channel", active: true }];
    const channels = val || [];
    dropdowns.push(...channels)
    if (!dropdowns.find(d => d.active)) dropdowns[0].active = true;
    if (dropdowns.find(d => d.secret)) dropdowns.push({ name: "Delete selected channel", action: "delete" })
    dropdowns.push({ name: "Add new channel", action: "add" })

    console.log("Added new options", dropdowns);
    fillDisordChannelsDropdown(name, dropdowns);
}
function fillDisordChannelsDropdown(name, dropdowns, triggerChange=false) {
    const settings_line = $("#beyond20-option-discord-channels");
    if (settings_line.length == 0) return;
    const opt = options_list[name];
    settings_line.replaceWith(createDiscordChannelsCombobox(name, opt.description, opt.title, dropdowns));
    const markaGroup = $("#beyond20-option-discord-channels")
    const dropdown_menu = $(markaGroup).find(".dropdown-menu");
    const button_group = $(markaGroup).find(".button-group");
    const input = $(markaGroup).find('.input');
    const m = initializeMarkaGroup(markaGroup);

    const active = dropdowns.find(d => d.active);
    input.text(active.name);
    input.attr("data-secret", active.secret.slice(0, 12));

    $("#beyond20-option-discord-channels li").off('click').click(ev => {
        ev.stopPropagation();
        ev.preventDefault()
        const li = ev.currentTarget;
        const secret = li.dataset.secret;

        if (secret !== undefined) {
            input.text(li.textContent);
            input.attr("data-secret", secret.slice(0, 12));
        }
        dropdown_menu.removeClass('open');
        button_group.removeClass('open');
        m.set('triangle').size(10);
        dropdowns.forEach(d => d.active = (d.name === li.textContent && d.secret === secret))
        fillDisordChannelsDropdown(name, dropdowns, true);
    });
    $("#beyond20-option-discord-channels li[data-action=add]").off('click').click(ev => {
        ev.stopPropagation();
        ev.preventDefault()

        dropdown_menu.removeClass('open');
        button_group.removeClass('open');
        m.set('triangle').size(10);
        alertify.prompt('Enter a friendly name for the discord channel you wish to add', '', (evt, channelName) => {
            console.log("Got evt ", evt, channelName);
            setTimeout(() => {
                alertify.prompt('Enter the secret value given by the Beyond20 Bot', '', (evt, channelSecret) => {
                    console.log("Adding new channel ", channelName, channelSecret);
                    dropdowns.splice(1, 0, {name: channelName, secret: channelSecret});
                    fillDisordChannelsDropdown(name, dropdowns, true);
                });
            }, 100);
        });
    });
    $("#beyond20-option-discord-channels li[data-action=delete]").off('click').click(ev => {
        ev.stopPropagation();
        ev.preventDefault();
        console.log("DELETE");
        dropdown_menu.removeClass('open');
        button_group.removeClass('open');
        m.set('triangle').size(10);
        const toDelete = dropdowns.findIndex(d => d.active);
        if (toDelete > 0) {
            dropdowns.splice(toDelete, 1);
            dropdowns[0].active = true;
            fillDisordChannelsDropdown(name, dropdowns, true);
        }
    });
    if (triggerChange)
        input.trigger("markaChanged");
}

function getDiscordChannelsSetting(name) {
    const combobox = $("#beyond20-option-discord-channels .dropdown-menu li");
    const opt = $("#" + name);
    const value = opt.attr("data-secret");
    const channels = [];
    for (let option of combobox.toArray()) {
        const secret = option.dataset.secret;
        if (secret)
            channels.push({ name: option.textContent, secret })
    }
    if (value) {
        const active = channels.find(c => c.secret.slice(0, 12) === value);
        if (active)
            active.active = true;
    }
    console.log("Get Discord channels : ", channels);
    return channels;
}

function getDiscordChannel(settings, character) {
    const channels = (settings["discord-channels"] || [])
    if (typeof (channels) === "string")
        return channels;
    return channels.find(c => c.active);
}

options_list["vtt-tab"]["createHTMLElement"] = createVTTTabSetting;
options_list["vtt-tab"]["set"] = setVTTTabSetting;
options_list["vtt-tab"]["get"] = getVTTTabSetting;
options_list["discord-channels"]["createHTMLElement"] = createDiscordChannelsSetting;
options_list["discord-channels"]["set"] = setDiscordChannelsSetting;
options_list["discord-channels"]["get"] = getDiscordChannelsSetting;

ROLL20_URL = "*://app.roll20.net/editor/";
FVTT_URL = "*://*/game";
ASTRAL_URL =  "*://*.astraltabletop.com/play/*";
DNDBEYOND_CHARACTER_URL = "*://*.dndbeyond.com/*characters/*";
DNDBEYOND_MONSTER_URL = "*://*.dndbeyond.com/monsters/*";
DNDBEYOND_ENCOUNTERS_URL = "*://*.dndbeyond.com/my-encounters";
DNDBEYOND_ENCOUNTER_URL = "*://*.dndbeyond.com/encounters/*";
DNDBEYOND_COMBAT_URL = "*://*.dndbeyond.com/combat-tracker/*";
DNDBEYOND_SPELL_URL = "*://*.dndbeyond.com/spells/*";
DNDBEYOND_VEHICLE_URL = "*://*.dndbeyond.com/vehicles/*";
CHANGELOG_URL = "https://beyond20.here-for-more.info/update";
DISCORD_BOT_INVITE_URL = "https://beyond20.kicks-ass.org/invite";
DISCORD_BOT_API_URL = "https://beyond20.kicks-ass.org/roll";

BUTTON_STYLE_CSS = `
.character-button, .character-button-small {
    display: inline-block;
    border-radius: 3px;
    background-color: #96bf6b;
    color: #fff;
    font-family: Roboto Condensed,Roboto,Helvetica,sans-serif;
    font-size: 10px;
    border: 1px solid transparent;
    text-transform: uppercase;
    padding: 9px 15px;
    transition: all 50ms;
}
.character-button-small {
    font-size: 8px;
    padding: 5px;
    border-color: transparent;
    min-height: 22px;
}
.ct-button.ct-theme-button {
    cursor: default;
}
.ct-button.ct-theme-button--interactive {
    cursor: pointer;
}
.ct-button.ct-theme-button--filled {
    background-color: #c53131;
    color: #fff;
}
`;


//from constants import DISCORD_BOT_API_URL;

async function postToDiscord(secret, request, title, source, attributes, description, attack_rolls, roll_info, damage_rolls, total_damages, open) {
    secret = (secret || "").trim();
    if (!secret) return;

    if (request['original-whisper'] !== undefined)
        request.whisper = request['original-whisper'];

    const body = {
        "secret": secret,
        "request": request,
        "title": title,
        "source": source,
        "attributes": attributes,
        "description": description,
        "attack_rolls": attack_rolls,
        "roll_info": roll_info,
        "damage_rolls": damage_rolls,
        "total_damages": total_damages,
        "open": open
    }
    try {
        const response = await fetch(DISCORD_BOT_API_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(body)
        });
        const json = await response.json();
        if (json.error)
            console.error('Error from server : ', json.error);
        return json.error;
    } catch (e) {
        console.error(e);
        return e.message;
    }
    return null;
}


class Beyond20BaseRoll {
    constructor(formula, data = {}) {
        this._formula = formula;
        this._data = data;
        this._fail_limit = null;
        this._critical_limit = null;
        this._critical_faces = null;
        this._discarded = false;
        this._total = 0;
    }

    get formula() {
        return this._formula;
    }

    get total() {
        throw new Error("NotImplemented");
    }

    get dice() {
        throw new Error("NotImplemented");
    }

    get parts() {
        throw new Error("NotImplemented");
    }

    async getTooltip() {
        throw new Error("NotImplemented");
    }

    async roll() {
        throw new Error("NotImplemented");
    }

    async reroll() {
        throw new Error("NotImplemented");
    }

    setDiscarded(discarded) {
        this._discarded = discarded;
    }
    isDiscarded() {
        return this._discarded;
    }

    setCriticalLimit(limit) {
        this._critical_limit = limit;
    }
    setFailLimit(limit) {
        this._fail_limit = limit;
    }
    // Ignore all dice that don't have these faces when checking for a crit
    // Hacky trick for custom dice in d20 rolls
    setCriticalFaces(faces) {
        this._critical_faces = faces;
    }
    checkRollForCrits(cb) {
        for (let die of this.dice) {
            for (let r of die.rolls) {
                if (r.discarded === undefined || !r.discarded) {
                    if (cb(die.faces, r.roll)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    isCriticalHit() {
        return this.checkRollForCrits((faces, value) => {
            if (this._critical_faces !== null && this._critical_faces !== faces) return false;
            const limit = this._critical_limit === null ? faces : this._critical_limit;
            return value >= limit;
        }
        );
    }

    isCriticalFail() {
        return this.checkRollForCrits((faces, value) => {
            if (this._critical_faces !== null && this._critical_faces !== faces) return false;
            const limit = this._fail_limit === null ? 1 : this._fail_limit;
            return value <= limit;
        }
        );
    }
    toJSON() {
        return {
            "formula": this.formula,
            "parts": this.parts.map(p => p.toJSON ? p.toJSON() : p),
            "fail-limit": this._fail_limit,
            "critical-limit": this._critical_limit,
            "critical-failure": this.isCriticalFail(),
            "critical-success": this.isCriticalHit(),
            "discarded": this.isDiscarded(),
            "total": this.total
        }
    }
}


class DNDBDice {
    constructor(amount, faces, modifiers = "") {
        this.amount = parseInt(amount) || 1;
        this.faces = parseInt(faces) || 0;
        this._modifiers = modifiers || "";
        this._reroll = { "active": false, "value": 0, "operator": "=" }
        this._dk = { "drop": false, "keep": false, "high": false, "amount": 0 }
        this._min = 0;
        if (modifiers != "") {
            const match_ro = modifiers.match(/r(=|<|<=|>|>=)([0-9]+)/);
            if (match_ro) {
                this._reroll.active = true;
                this._reroll.operator = match_ro[1];
                this._reroll.value = parseInt(match_ro[2]);
            }
            const match_dk = modifiers.match(/(dl|dh|kl|kh)([0-9]*)/);
            if (match_dk) {
                const dk = match_dk[1];
                this._dk.amount = parseInt(match_dk[2] || 1);
                if (dk == "dl") {
                    this._dk.drop = true;
                    this._dk.high = false;
                } else if (dk == "dh") {
                    this._dk.drop = true;
                    this._dk.high = true;
                } else if (dk == "kl") {
                    this._dk.keep = true;
                    this._dk.high = false;
                } else if (dk == "kh") {
                    this._dk.keep = true;
                    this._dk.high = true;
                }
            }
            const match_min = modifiers.match(/min([0-9]*)/);
            if (match_min)
                this._min = parseInt(match_min[1]);

        }
        this._rolls = [];
    }
    rollSingleDie () {
        // Borrowed from https://pthree.org/2018/06/13/why-the-multiply-and-floor-rng-method-is-biased/
        const max = Math.floor(2 ** 32 / this.faces) * this.faces; // make "max" a multiple of "faces"
        let x;
        do {
            x = Math.floor(Math.random() * 2 ** 32); // pick a number of [0, 2^32).
        } while (x >= max); // try again if x is too big
        return (x % this.faces) + 1; // uniformly picked in [1, faces] (inclusively)
    }
    async rollDice() {
        this._rolls = [];
        for (let i = 0; i < this.amount; i++) {
            this._rolls.push({ "roll": this.rollSingleDie() });
        }
    }
    async rerollDice(amount) {
        for (let i = 0; i < amount; i++) {
            this._rolls.push({ "roll": this.rollSingleDie() });
        }
    }
    async roll() {
        await this.rollDice();
        await this.handleModifiers();
        return this.total;
    }
    async handleModifiers() {
        if (this._reroll.active) {
            let rerolls = 0;
            for (let roll of this._rolls) {
                // Check for reroll modifier && discard old value && reroll it if necessary
                const die = roll.roll;
                if ((this._reroll.operator == "=" && die == this._reroll.value) ||
                    (this._reroll.operator == "<=" && die <= this._reroll.value) ||
                    (this._reroll.operator == "<" && die < this._reroll.value) ||
                    (this._reroll.operator == ">=" && die >= this._reroll.value) ||
                    (this._reroll.operator == ">" && die > this._reroll.value)) {
                    roll.discarded = true;
                    rerolls++;
                }
            }
            if (rerolls)
                await this.rerollDice(rerolls);
        }
        // Look for drops && keeps;
        const dk_amount = this._dk.amount;
        while ((this._dk.drop || this._dk.keep) && this._dk.amount > 0) {
            const non_discarded = this._rolls.filter(r => !r.discarded && !r.keep);
            if (non_discarded.length == 0)
                break;
            let to_dk = 0;
            if (this._dk.high)
                to_dk = Math.max(...non_discarded.map((r) => r.roll));
            else
                to_dk = Math.min(...non_discarded.map((r) => r.roll));
            if (this._dk.drop) {
                this._rolls = this._rolls.map((r) => {
                    if (to_dk > 0 && !r.discarded && !r.keep && r.roll == to_dk) {
                        r.discarded = true;
                        to_dk = 0;

                    }
                    return r;
                });
            } else if (this._dk.keep) {
                this._rolls = this._rolls.map((r) => {
                    if (to_dk > 0 && !r.discarded && !r.keep && r.roll == to_dk) {
                        r.keep = true;
                        to_dk = 0;
                    }
                    return r;
                });
            }
            this._dk.amount -= 1;
        }
        if (this._dk.keep) {
            this._rolls = this._rolls.map((r) => {
                if (!r.keep)
                    r.discarded = true;
                delete r.keep;
                return r;
            });
        }
        // Restore drop/keep case.includes(amount) of rerolls;
        this._dk.amount = dk_amount;

        // Accumulate total based on non discarded rolls;
        this._total = this._rolls.reduce((acc, roll) => {
            return acc + (roll.discarded ? 0 : roll.roll);
        }, 0);
        if (this._min && this._total < this._min)
            this._total = this._min;
        return this._total;
    }

    get total() {
        return this._total;
    }

    get formula() {
        return this.amount + "d" + this.faces + this._modifiers;
    }

    get rolls() {
        return this._rolls || [];
    }

    toJSON() {
        return {
            "total": this.total,
            "formula": this.formula,
            "rolls": this.rolls,
            "faces": this.faces
        }
    }
}

class DNDBRoll extends Beyond20BaseRoll {
    constructor(formula, data = {}) {
        formula = formula.replace(/ro(=|<|<=|>|>=)([0-9]+)/g, "r$1$2");
        super(formula, data);
        this._parts = [];
        let last_sign = null;
        for (let key in data)
            formula = formula.replace('@' + key, data[key]);
        const parts = formula.split(/(?=[+-])/);
        const mergeSigns = (sign) => {
            if (!sign) return last_sign;
            if (!last_sign) return sign;
            if (sign === last_sign) return "+";
            return "-";
        }
        for (let part of parts) {
            part = part.trim();
            if (["+", "-"].includes(part)) {
                last_sign = mergeSigns(part);
                continue;
            }
            // Match dice formulas
            let match = part.match(/([+-])?\s*([0-9]*)d([0-9]+)(.*)/);
            if (match) {
                last_sign = mergeSigns(match[1]);
                if (last_sign)
                    this._parts.push(last_sign);
                const part = new DNDBDice(...match.slice(2, 5));
                this._parts.push(part);
                last_sign = "+";
            } else {
                // Match numeric values
                match = part.match(/([+-])?\s*([0-9\.]+)/);
                if (match) {
                    try {
                        last_sign = mergeSigns(match[1]);
                        if (last_sign)
                            this._parts.push(last_sign);
                        const part = parseFloat(match[2]);
                        this._parts.push(part);
                        last_sign = "+";
                    } catch (err) { }
                }
            }
        }
    }

    get total() {
        return this._total;
    }

    get formula() {
        let formula = "";
        let first = true;
        for (let part of this._parts) {
            if (!first)
                formula += " ";
            first = false;
            if (part instanceof DNDBDice)
                formula += part.formula;
            else
                formula += part;
        }
        return formula;
    }
    get dice() {
        const dice = [];
        for (let part of this._parts) {
            if (part instanceof DNDBDice) {
                dice.push(part);
            }
        }
        return dice;
    }

    get parts() {
        return this._parts;
    }

    async roll() {
        for (let part of this._parts) {
            if (part instanceof DNDBDice)
                await part.roll();
        }
        this.calculateTotal();
    }
    calculateTotal() {
        this._total = 0;
        let add = true;
        for (let part of this._parts) {
            if (part instanceof DNDBDice) {
                if (add)
                    this._total += part.total;
                else
                    this._total -= part.total;
            } else if (["+", "-"].includes(part)) {
                add = (part === "+");
            } else {
                if (add)
                    this._total += part;
                else
                    this._total -= part;
            }
        }
        this._total = Math.round(this._total * 100) / 100;
    }

    async getTooltip() {
        let tooltip = "<div class='beyond20-roll-tooltip'>";
        for (let part of this._parts) {
            if (part instanceof DNDBDice) {
                tooltip += "<div class='beyond20-roll-dice'>";
                tooltip += "<div class='beyond20-roll-dice-formula'>" + part.formula + "</div>";
                tooltip += "<div class='beyond20-roll-dice-rolls'>";
                for (let die of part.rolls) {
                    let result_class = 'beyond20-roll-detail-';
                    result_class += die.roll == part.faces ? 'crit' : (die.roll == 1 ? 'fail' : 'normal');
                    if (die.discarded)
                        result_class += ' beyond20-roll-detail-discarded';
                    tooltip += "<span class='beyond20-roll-die-result " + result_class + "'>" + die.roll + "</span>";
                }
                tooltip += "</div></div>";
            }
        }
        tooltip += "</div>";
        return tooltip;
    }

    async reroll() {
        await this.roll();
        return this;
    }
}
class DAMAGE_FLAGS {
    static get MESSAGE() { return 0; }
    static get REGULAR() { return 1; }
    static get VERSATILE() { return 2; }
    static get ADDITIONAL() { return 4; }
    static get HEALING() { return 8; }
    static get CRITICAL() { return 0x10; }
}

class Beyond20RollRenderer {
    constructor(roller, prompter, displayer) {
        this._roller = roller;
        this._prompter = prompter;
        this._displayer = displayer;
        this._extension_url = "";
        this._settings = {}
    }

    setBaseURL(base_url) {
        this._extension_url = base_url;
    }

    setSettings(settings) {
        this._settings = settings;
    }
    _mergeSettings(data) {
        // Catch the mergeSettings since roll renderer could be called from a page script
        // which wouldn't have access to the chrome.storage APIs
        try {
            mergeSettings(data, (settings) => {
                this.setSettings(settings);
                chrome.runtime.sendMessage({ "action": "settings", "type": "general", "settings": settings });
            });
        } catch (err) {}
    }

    async queryGeneric(title, question, choices, select_id = "generic-query", order, selection) {
        let html = `<form><div class="beyond20-form-row"><label>${question}</label><select id="${select_id}" name="${select_id}">`;

        if (!order)
            order = Object.keys(choices);
        for (let [i, option] of order.entries()) {
            const isSelected = (selection && selection == option) || (!selection && i === 0);
            const value = choices[option] || option;
            html += `<option value="${option}"${isSelected ? " selected" : ""}>${value}</option>`;
        }
        html += `;</select></div></form>`;
        return new Promise((resolve) => {
            this._prompter.prompt(title, html, "Roll").then((html) => {
                if (html)
                    resolve(html.find("#" + select_id).val());
            });
        });
    }

    async queryAdvantage(title) {
        const choices = {
            [RollType.NORMAL]: "Normal Roll",
            [RollType.DOUBLE]: "Roll Twice",
            [RollType.ADVANTAGE]: "Advantage",
            [RollType.DISADVANTAGE]: "Disadvantage",
            [RollType.THRICE]: "Roll Thrice",
            [RollType.SUPER_ADVANTAGE]: "Super Advantage",
            [RollType.SUPER_DISADVANTAGE]: "Super Disadvantage"
        }
        const order = [RollType.NORMAL, RollType.ADVANTAGE, RollType.DISADVANTAGE, RollType.DOUBLE, RollType.THRICE, RollType.SUPER_ADVANTAGE, RollType.SUPER_DISADVANTAGE];
        const lastQuery = this._settings["last-advantage-query"];
        const advantage = parseInt(await this.queryGeneric(title, "Select roll mode : ", choices, "roll-mode", order, lastQuery));
        if (lastQuery != advantage) {
            this._mergeSettings({ "last-advantage-query": advantage })
        }
        return advantage;
    }

    async queryWhisper(title, monster) {
        const choices = {
            [WhisperType.YES]: "Whisper Roll",
            [WhisperType.NO]: "Public Roll"
        }
        if (monster)
            choices[WhisperType.HIDE_NAMES] = "Hide Monster and Attack Name";
        const lastQuery = this._settings["last-whisper-query"];
        const whisper = parseInt(await dndbeyondDiceRoller.queryGeneric(title, "Select whisper mode : ", choices, "whisper-mode", null, lastQuery));
        if (lastQuery != whisper) {
            this._mergeSettings({ "last-whisper-query": whisper })
        }
        return whisper;
    }

    async getToHit(request, title, modifier = "", data = {}) {
        let advantage = request.advantage;
        if (advantage == RollType.QUERY)
            advantage = await this.queryAdvantage(title);

        const d20 = request.d20 || "1d20";
        let rolls = [];
        if ([RollType.DOUBLE, RollType.ADVANTAGE, RollType.DISADVANTAGE].includes(advantage)) {
            const roll_1 = this.createRoll(d20 + modifier, data);
            const roll_2 = this.createRoll(d20 + modifier, data);
            roll_1.setCriticalFaces(20);
            roll_2.setCriticalFaces(20);

            rolls = [roll_1, roll_2];
        } else if ([RollType.THRICE, RollType.SUPER_ADVANTAGE, RollType.SUPER_DISADVANTAGE].includes(advantage)) {
            const roll_1 = this.createRoll(d20 + modifier, data);
            const roll_2 = this.createRoll(d20 + modifier, data);
            const roll_3 = this.createRoll(d20 + modifier, data);

            rolls = [roll_1, roll_2, roll_3];
        } else { // advantage == RollType.NORMAL
            rolls.push(this.createRoll(d20 + modifier, data));
        }
        rolls.forEach(r => r.setCriticalFaces(20));
        return {advantage, rolls};
    }
    processToHitAdvantage(advantage, rolls) {
        if ([RollType.DOUBLE, RollType.ADVANTAGE, RollType.DISADVANTAGE].includes(advantage)) {
            const roll_1 = rolls[0];
            const roll_2 = rolls[1];

            if (advantage == RollType.ADVANTAGE) {
                if (roll_1.total >= roll_2.total) {
                    roll_2.setDiscarded(true);
                } else {
                    roll_1.setDiscarded(true);
                }
            } else if (advantage == RollType.DISADVANTAGE) {
                if (roll_1.total <= roll_2.total) {
                    roll_2.setDiscarded(true);
                } else {
                    roll_1.setDiscarded(true);
                }
            }
            return [roll_1, roll_2];
        } else if ([RollType.THRICE, RollType.SUPER_ADVANTAGE, RollType.SUPER_DISADVANTAGE].includes(advantage)) {
            const roll_1 = rolls[0];
            const roll_2 = rolls[1];
            const roll_3 = rolls[2];

            if (advantage == RollType.SUPER_ADVANTAGE) {
                if (roll_1.total >= roll_2.total && roll_1.total >= roll_3.total) {
                    roll_2.setDiscarded(true);
                    roll_3.setDiscarded(true);
                } else if (roll_2.total >= roll_3.total) {
                    roll_1.setDiscarded(true);
                    roll_3.setDiscarded(true);
                } else {
                    roll_1.setDiscarded(true);
                    roll_2.setDiscarded(true);
                }
            } else if (advantage == RollType.SUPER_DISADVANTAGE) {
                if (roll_1.total <= roll_2.total && roll_1.total <= roll_3.total) {
                    roll_2.setDiscarded(true);
                    roll_3.setDiscarded(true);
                } else if (roll_2.total <= roll_3.total) {
                    roll_1.setDiscarded(true);
                    roll_3.setDiscarded(true);
                } else {
                    roll_1.setDiscarded(true);
                    roll_2.setDiscarded(true);
                }
            }
        }
    }

    isCriticalHitD20(rolls, limit = 20) {
        for (let roll of rolls) {
            roll.setCriticalLimit(limit);
            if (!roll.isDiscarded() && roll.isCriticalHit()) {
                return true;
            }
        }
        return false;
    }

    injectRollsInDescription(description) {
        const icon = "/modules/beyond20/images/icons/icon20.png";
        return replaceRolls(description, (dice, modifier) => {
            const dice_formula = (dice == "" ? "1d20" : dice) + modifier;
            // <u> is filtered 0.3.2, so using <span> instead;
            // Can't use single line, since newlines get replaced with <br/>
            return `<span class="ct-beyond20-custom-roll">` +
                `<strong>${dice}${modifier}</strong>` +
                `<img class="ct-beyond20-custom-icon" src="${icon}" style="margin-right: 3px; margin-left: 3px; border: 0px;"></img>` +
                `<span class="beyond20-roll-formula" style="display: none;">${dice_formula}</span>` +
            `</span>`;
        });
    }

    async rollToDetails(roll, is_total = false) {
        const hit = roll.isCriticalHit();
        const fail = roll.isCriticalFail();
        let roll_type_class = 'beyond20-roll-detail-';
        roll_type_class += hit && fail ? 'crit-fail' : (hit ? 'crit' : (fail ? 'fail' : 'normal'))
        if (roll.isDiscarded())
            roll_type_class += ' beyond20-roll-detail-discarded';
        if (is_total)
            roll_type_class += ' beyond20-roll-total dice-total';

        const total = `<span class='${roll_type_class}'>${roll.total}</span>`;
        const tooltip = await roll.getTooltip();
        return `<span class='beyond20-tooltip'>${total}<span class='dice-roll beyond20-tooltip-content'>` +
            `<div class='dice-formula beyond20-roll-formula'>${roll.formula}</div>${tooltip}</span></span>`;
    }

    rollsToCells(html) {
        let result = "";
        for (let roll of html.split(" | "))
            result += `<div class="beyond20-roll-cell">${roll}</div>`;
        return result;
    }


    async postDescription(request, title, source, attributes, description, attack_rolls = [], roll_info = [], damage_rolls = [], open = false) {
        let play_sound = false;

        if (request.whisper == WhisperType.HIDE_NAMES) {
            description = null;
            title = "???";
        }

        let html = '<div class="beyond20-message">';
        if (description) {
            html += "<details" + (open ? " open" : "") + "><summary><a>" + title + "</a></summary>";
            if (source || Object.keys(attributes).length > 0) {
                html += "<table>";
                if (source)
                    html += "<tr><td colspan'2'><i>" + source + "</i></td></tr>";
                for (let attr in attributes)
                    html += "<tr><td><b>" + attr + "</b></td><td>" + attributes[attr] + "</td></tr>";
                html += "</table>";
            }
            const html_description = this.injectRollsInDescription(description).replace(/\n/g, "</br>");
            html += "<div class='beyond20-description'>" + html_description + "</div></details>";
        } else {
            html = "<div class='beyond20-title'>" + title + "</div>";
        }

        //console.log("Rolls : ", attack_rolls, roll_info, damage_rolls);

        for (let [name, value] of roll_info)
            html += "<div class='beyond20-roll-result'><b>" + name + ": </b><span>" + value + "</span></div>";

        if (attack_rolls.length > 0) {
            const is_total = attack_rolls.length === 1 && damage_rolls.length === 0;
            let roll_html = "";
            for (let [i, roll] of attack_rolls.entries()) {
                if (i > 0)
                    roll_html += " | ";
                roll_html += await this.rollToDetails(roll, is_total);
                play_sound = true;
            }
            html += "<div class='beyond20-roll-result beyond20-roll-cells'>" + this.rollsToCells(roll_html) + "</div>";
        }
        const add_totals = damage_rolls.filter((r) => (r[2] & DAMAGE_FLAGS.CRITICAL) == 0).length > 1 || damage_rolls.filter((r) => (r[2] & DAMAGE_FLAGS.CRITICAL) != 0).length > 1;
        const total_damages = {}
        for (let [roll_name, roll, flags] of damage_rolls) {
            const is_total = !add_totals && (flags & DAMAGE_FLAGS.CRITICAL) == 0;
            let roll_html = "";
            if (typeof (roll) === "string")
                roll_html = "<span>" + roll + "</span>";
            else
                roll_html = await this.rollToDetails(roll, is_total);

            play_sound = true;
            roll_name = roll_name[0].toUpperCase() + roll_name.slice(1) + ": ";
            html += "<div class='beyond20-roll-result'><b>" + roll_name + "</b>" + roll_html + "</div>";
            if (add_totals) {
                let kind_of_damage = "";
                if (flags & DAMAGE_FLAGS.REGULAR) {
                    kind_of_damage = flags & DAMAGE_FLAGS.CRITICAL ? "Critical Damage" : "Damage";
                } else if (flags & DAMAGE_FLAGS.VERSATILE) {
                    kind_of_damage = flags & DAMAGE_FLAGS.CRITICAL ? "Critical Two-Handed Damage" : "Two-Handed Damage";
                } else if (flags & DAMAGE_FLAGS.HEALING) {
                    kind_of_damage = "Healing";
                } else if (flags & DAMAGE_FLAGS.ADDITIONAL) {
                    // HACK Alert: crappy code;
                    const regular = flags & DAMAGE_FLAGS.CRITICAL ? "Critical Damage" : "Damage";
                    const versatile = flags & DAMAGE_FLAGS.CRITICAL ? "Critical Two-Handed Damage" : "Two-Handed Damage";
                    if (total_damages[regular] !== undefined)
                        total_damages[regular] += " + " + String(roll.total);
                    if (total_damages[versatile] !== undefined)
                        total_damages[versatile] += " + " + String(roll.total);
                    continue;
                } else {
                    continue;
                }
                if (total_damages[kind_of_damage] !== undefined)
                    total_damages[kind_of_damage] += " + " + String(roll.total);
                else
                    total_damages[kind_of_damage] = String(roll.total);
            }
        }

        if (Object.keys(total_damages).length > 0) {
            // HACK ALERT: Even crappier code than above
            if (total_damages["Two-Handed Damage"]) {
                total_damages["One-Handed Damage"] = total_damages["Damage"];
                delete total_damages["Damage"];
                // Need to swap them so two-handed goes last
                const two_handed = total_damages["Two-Handed Damage"];
                delete total_damages["Two-Handed Damage"];
                total_damages["Two-Handed Damage"] = two_handed;
            }
            if (total_damages["Critical Two-Handed Damage"]) {
                total_damages["Critical One-Handed Damage"] = total_damages["Critical Damage"];
                delete total_damages["Critical Damage"];
                // Need to swap them so two-handed goes last
                const two_handed = total_damages["Critical Two-Handed Damage"];
                delete total_damages["Critical Two-Handed Damage"];
                total_damages["Critical Two-Handed Damage"] = two_handed;
            }
            html += "<div class='beyond20-roll-result'><b><hr/></b></div>";
        }

        let roll = null;
        for (let key in total_damages) {
            const is_total = (roll === null);
            roll = this._roller.roll(total_damages[key]);
            await roll.roll();
            total_damages[key] = roll;
            const roll_html = await this.rollToDetails(roll, is_total);
            html += "<div class='beyond20-roll-result'><b>Total " + key + ": </b>" + roll_html + "</div>";
        }

        if (request.damages && request.damages.length > 0 && 
            request.rollAttack && !request.rollDamage)
            html += '<button class="beyond20-button-roll-damages">Roll Damages</button>';

        html += "</div>";
        const character = (request.whisper == WhisperType.HIDE_NAMES) ? "???" : request.character.name;
        const discordChannel = getDiscordChannel(this._settings, request.character)
        postToDiscord(discordChannel ? discordChannel.secret : "", request, title, source, attributes, description, attack_rolls, roll_info, damage_rolls, total_damages, open).then(discord_error => {
            if (discord_error != undefined)
                this._displayer.displayError("Beyond20 Discord Integration: " + discord_error);
        });

        if (request.sendMessage && this._displayer.sendMessage)
            this._displayer.sendMessage(request, title, html, character, request.whisper, play_sound, source, attributes, description, attack_rolls, roll_info, damage_rolls, total_damages, open)
        else
            this._displayer.postHTML(request, title, html, character, request.whisper, play_sound, source, attributes, description, attack_rolls, roll_info, damage_rolls, total_damages, open);

        if (attack_rolls.length > 0) {
            return attack_rolls.find((r) => !r.isDiscarded());
        } else if (total_damages.length > 0) {
            return total_damages[0];
        } else if (damage_rolls.length > 0) {
            return damage_rolls[0];
        } else {
            return null;
        }
    }

    postMessage(request, title, message) {
        const character = (request.whisper == WhisperType.HIDE_NAMES) ? "???" : request.character.name;
        if (request.whisper == WhisperType.HIDE_NAMES)
            title = "???";
        if (request.sendMessage && this._displayer.sendMessage)
            this._displayer.sendMessage(request, title, message, character, request.whisper, false, '', {}, '', [], [], [], [], true);
        else
            this._displayer.postHTML(request, title, message, character, request.whisper, false, '', {}, '', [], [], [], [], true);

    }

    createRoll(dice, data) {
        const new_data = {}
        const parts = [dice];
        for (let key in data) {
            if (data[key]) {
                const new_key = key.replace("_", "").toLowerCase();
                new_data[new_key] = data[key];
                parts.push(new_key);
            }
        }
        return this._roller.roll(parts.join(" + @"), new_data);
    }

    async rollDice(request, title, dice, data = {}) {
        const roll = this.createRoll(dice, data);
        await this._roller.resolveRolls(title, [roll]);
        return this.postDescription(request, title, null, {}, null, [roll]);
    }

    async rollD20(request, title, data, modifier="") {
        const {advantage, rolls} = await this.getToHit(request, title, modifier, data)
        await this._roller.resolveRolls(title, rolls);
        this.processToHitAdvantage(advantage, rolls);
        return this.postDescription(request, title, null, {}, null, rolls);
    }

    async rollSkill(request, custom_roll_dice = "") {
        const data = { [request.ability]: request.modifier, "custom_dice": custom_roll_dice }
        return this.rollD20(request, request.skill + "(" + request.modifier + ")", data);
    }

    rollAbility(request, custom_roll_dice = "") {
        const data = { [request.ability]: request.modifier, "custom_dice": custom_roll_dice }
        return this.rollD20(request, request.name + "(" + request.modifier + ")", data);
    }

    rollSavingThrow(request, custom_roll_dice = "") {
        const data = { [request.ability]: request.modifier, "custom_dice": custom_roll_dice }
        return this.rollD20(request, request.name + " Save" + "(" + request.modifier + ")", data);
    }

    rollInitiative(request, custom_roll_dice = "") {
        const data = { "initiative": request.initiative, "custom_dice": custom_roll_dice }
        return this.rollD20(request, "Initiative" + "(" + request.initiative + ")", data);
    }

    rollHitDice(request) {
        const rname = "Hit Dice" + (request.multiclass ? `(${request.class})` : "");
        return this.rollDice(request, rname, request["hit-dice"], {});
    }

    rollDeathSave(request, custom_roll_dice = "") {
        return this.rollD20(request, "Death Saving Throw", { "custom_dice": custom_roll_dice });
    }

    rollItem(request) {
        return this.rollTrait(request);
    }

    rollTrait(request) {
        let source = request.type;
        if (request["source-type"] !== undefined) {
            source = request["source-type"];
            if (request.source && request.source.length > 0)
                source += ": " + request.source;
        } else if (request["item-type"] !== undefined) {
            source = request["item-type"];
        }
        return this.postDescription(request, request.name, source, {}, request.description, [], [], [], true);
    }

    queryDamageType(title, damage_types) {
        const choices = {}
        for (let option in damage_types) {
            const value = damage_types[option];
            if (value)
                choices[option] = option + " (" + value + ")";
            else
                choices[option] = option;
        }
        return this.queryGeneric(title, "Choose Damage Type :", choices, "damage-type");
    }

    async buildAttackRolls(request, custom_roll_dice) {
        let to_hit = [];
        let to_hit_advantage = null;
        const damage_rolls = [];
        const all_rolls = [];
        let is_critical = false;
        if (request.rollAttack && request["to-hit"] !== undefined) {
            const custom = custom_roll_dice == "" ? "" : (" + " + custom_roll_dice);
            const to_hit_mod = " + " + request["to-hit"] + custom;
            const {advantage, rolls} = await this.getToHit(request, request.name, to_hit_mod)
            to_hit_advantage = advantage;
            to_hit.push(...rolls);
            all_rolls.push(...rolls);
        }

        if (request.rollDamage && request.damages !== undefined) {
            const damages = request.damages;
            const damage_types = request["damage-types"];
            const critical_damages = request["critical-damages"];
            const critical_damage_types = request["critical-damage-types"];
            if (request.name === "Chromatic Orb") {
                const damage_choices = {}
                const critical_damage_choices = {}
                for (let dmgtype of ["Acid", "Cold", "Fire", "Lightning", "Poison", "Thunder"]) {
                    let idx = damage_types.findIndex(t => t === dmgtype);
                    damage_choices[damage_types.splice(idx, 1)[0]] = damages.splice(idx, 1)[0];
                    idx = critical_damage_types.findIndex(t => t === dmgtype);
                    if (idx >= 0)
                        critical_damage_choices[critical_damage_types.splice(idx, 1)[0]] = critical_damages.splice(idx, 1)[0];
                }

                const chromatic_type = await this.queryDamageType(request.name, damage_choices);
                damages.splice(0, 0, damage_choices[chromatic_type]);
                damage_types.splice(0, 0, chromatic_type);
                if (critical_damage_choices[chromatic_type] !== undefined) {
                    const crit_damage = critical_damage_choices[chromatic_type];
                    critical_damages.splice(0, 0, crit_damage);
                    critical_damage_types.splice(0, 0, chromatic_type);
                }
            } else if (request.name === "Dragon's Breath") {
                const damage_choices = {}
                for (let dmgtype of ["Acid", "Cold", "Fire", "Lightning", "Poison"]) {
                    let idx = damage_types.findIndex(t => t === dmgtype);
                    damage_choices[damage_types.splice(idx, 1)[0]] = damages.splice(idx, 1)[0];
                }

                const dragons_breath_type = await this.queryDamageType(request.name, damage_choices);
                damages.splice(0, 0, damage_choices[dragons_breath_type]);
                damage_types.splice(0, 0, dragons_breath_type);
            } else if (request.name.includes("Chaos Bolt")) {
                let base_damage = null;
                let crit_damage = null;
                for (let dmgtype of ["Acid", "Cold", "Fire", "Force", "Lightning", "Poison", "Psychic", "Thunder"]) {
                    let idx = damage_types.findIndex(t => t === dmgtype);
                    base_damage = damages.splice(idx, 1)[0];
                    damage_types.splice(idx, 1);
                    idx = critical_damage_types.findIndex(t => t === dmgtype);
                    crit_damage = critical_damages.splice(idx, 1)[0];
                    critical_damage_types.splice(idx, 1);
                }
                damages.splice(0, 0, base_damage);
                damage_types.splice(0, 0, "Chaotic energy");
                critical_damages.splice(0, 0, crit_damage);
                critical_damage_types.splice(0, 0, "Chaotic energy");
            } else if (request.name == "Toll the Dead") {
                const ttd_dice = await this.queryGeneric(request.name, "Is the target missing any of its hit points ?", { "d12": "Yes", "d8": "No" }, "ttd_dice", ["d12", "d8"]);
                damages[0] = damages[0].replace("d8", ttd_dice);
            }

            // Ranger Ability Support;
            for (let [dmgIndex, dmgType] of damage_types.entries()) {
                if (dmgType == "Colossus Slayer") {
                    const dmg = damages[dmgIndex].toString();
                    if (dmg) {
                        const dmg_dice = await this.queryGeneric(request.name, `Add ${dmgType} damage ?`, { "0": "No", [dmg]: "Yes" }, "dmg_dice", ["0", dmg]);
                        if (dmg_dice == "0") {
                            damages.splice(dmgIndex, 1);
                            damage_types.splice(dmgIndex, 1);
                        }
                    }
                }
            }

            const has_versatile = damage_types.length > 1 && damage_types[1].includes("Two-Handed");
            for (let i = 0; i < (damages.length); i++) {
                const roll = this._roller.roll(damages[i]);
                all_rolls.push(roll);
                const dmg_type = damage_types[i];
                let damage_flags = DAMAGE_FLAGS.REGULAR;
                if (["Healing", "Disciple of Life", "Temp HP", "Alchemical Savant Healing", "Enhanced Bond Healing"].includes(dmg_type)) {
                    damage_flags = DAMAGE_FLAGS.HEALING;
                } else if (i == 0) {
                    damage_flags = DAMAGE_FLAGS.REGULAR;
                } else if (i == 1 && has_versatile) {
                    damage_flags = DAMAGE_FLAGS.VERSATILE;
                } else {
                    damage_flags = DAMAGE_FLAGS.ADDITIONAL;
                }
                const suffix = !(damage_flags & DAMAGE_FLAGS.HEALING) ? " Damage" : "";
                damage_rolls.push([dmg_type + suffix, roll, damage_flags]);
                // Handle life transference;
                if (request.name == "Life Transference" && dmg_type == "Necrotic") {
                    damage_rolls.push(["Healing", "Twice the Necrotic damage", DAMAGE_FLAGS.HEALING]);
                }
            }
        

            await this._roller.resolveRolls(request.name, all_rolls)
            
            //Moved after the new resolveRolls so it can access the roll results
            if (request.name.includes("Chaos Bolt")) {
                for (let [i, dmg_roll] of damage_rolls.entries()) {
                    const [dmg_type, roll, flags] = dmg_roll;
                    if (dmg_type == "Chaotic energy Damage" && roll.dice[0].faces == 8) {
                        const chaos_bolt_damages = ["Acid", "Cold", "Fire", "Force", "Lightning", "Poison", "Psychic", "Thunder"];
                        const damage_choices = {}
                        for (let r of roll.dice[0].rolls)
                            damage_choices[chaos_bolt_damages[r.roll - 1]] = null;
                        //console.log("Damage choices : ", damage_choices, damage_choices.length);
                        let chaotic_type = null;
                        if (Object.keys(damage_choices).length == 1) {
                            damage_rolls.push(["Chaotic energy leaps from the target to a different creature of your choice within 30 feet of it", "", DAMAGE_FLAGS.MESSAGE]);
                            chaotic_type = Object.keys(damage_choices)[0];
                        } else {
                            chaotic_type = await this.queryDamageType(request.name, damage_choices);
                        }
                        damage_rolls[i] = [chaotic_type + " Damage", roll, flags];
                        critical_damage_types[0] = chaotic_type;
                        break;
                    }
                }
            }

            // If rolling the attack, check for critical hit, otherwise, use argument.
            if (request.rollAttack) {
                if (to_hit.length > 0)
                    this.processToHitAdvantage(to_hit_advantage, to_hit)
                const critical_limit = request["critical-limit"] || 20;
                is_critical = this.isCriticalHitD20(to_hit, critical_limit);
            } else {
                is_critical = request.rollCritical;
            }
            if (is_critical) {
                const critical_damage_rolls = []
                for (let i = 0; i < (critical_damages.length); i++) {
                    const roll = this._roller.roll(critical_damages[i]);
                    critical_damage_rolls.push(roll);
                    const dmg_type = critical_damage_types[i];
                    let damage_flags = DAMAGE_FLAGS.REGULAR;
                    if (["Healing", "Disciple of Life", "Temp HP", "Alchemical Savant Healing", "Enhanced Bond Healing"].includes(dmg_type)) {
                        damage_flags = DAMAGE_FLAGS.HEALING;
                    } else if (i == 0) {
                        damage_flags = DAMAGE_FLAGS.REGULAR;
                    } else if (i == 1 && has_versatile) {
                        damage_flags = DAMAGE_FLAGS.VERSATILE;
                    } else {
                        damage_flags = DAMAGE_FLAGS.ADDITIONAL;
                    }
                    const suffix = !(damage_flags & DAMAGE_FLAGS.HEALING) ? " Critical Damage" : "";
                    damage_rolls.push([dmg_type + suffix, roll, damage_flags | DAMAGE_FLAGS.CRITICAL]);
                }
                await this._roller.resolveRolls(request.name, critical_damage_rolls);
            }
        } else {
            // If no damages, still need to resolve to hit rolls
            
            await this._roller.resolveRolls(request.name, all_rolls)
            if (to_hit.length > 0)
                this.processToHitAdvantage(to_hit_advantage, to_hit)
            const critical_limit = request["critical-limit"] || 20;
            this.isCriticalHitD20(to_hit, critical_limit);
        }

        return [to_hit, damage_rolls];
    }

    async rerollDamages(rolls) {
        const new_rolls = [];
        for (let [roll_name, roll, flags] of rolls) {
            if (typeof (roll.reroll) === "function") {
                new_rolls.push([roll_name, await roll.reroll(), flags]);
            } else {
                new_rolls.push([roll_name, roll, flags]);
            }
        }
        return new_rolls;
    }

    async rollAttack(request, custom_roll_dice = "") {
        const [to_hit, damage_rolls] = await this.buildAttackRolls(request, custom_roll_dice);

        const data = {}
        if (request.range !== undefined)
            data["Range"] = request.range;

        const roll_info = [];
        if (request["save-dc"] != undefined)
            roll_info.push(["Save", request["save-ability"] + " DC " + request["save-dc"]]);

        return this.postDescription(request, request.name, null, data, request.description || "", to_hit, roll_info, damage_rolls);
    }


    buildSpellCard(request) {
        const data = {
            "Casting Time": request["casting-time"],
            "Range": request.range,
            "Duration": request.duration,
            "Components": request.components
        }

        let source = request["level-school"];
        if (request["cast-at"] !== undefined)
            source = request["level-school"] + "(Cast at " + request["cast-at"] + " Level)";

        if (request.ritual)
            data["Ritual"] = "Can be cast as a ritual";
        if (request.concentration)
            data["Concentration"] = "Requires Concentration";

        const description = request.description.replace("At Higher Levels.", "</br><b>At Higher levels.</b>");
        return [source, data, description];
    }

    rollSpellCard(request) {
        const [source, data, description] = this.buildSpellCard(request);
        return this.postDescription(request, request.name, source, data, description, [], [], [], true);
    }

    async rollSpellAttack(request, custom_roll_dice) {
        const [source, data, description] = this.buildSpellCard(request);

        const roll_info = [];
        if (request.range !== undefined)
            roll_info.push(["Range", request.range]);

        if (request["cast-at"] !== undefined)
            roll_info.push(["Cast at", request["cast-at"] + " Level"]);
        let components = request.components;
        const prefix = this._settings["component-prefix"] != "" ? this._settings["component-prefix"] : null;
        if (this._settings["components-display"] == "all") {
            if (components) {
                roll_info.push([prefix || "Components", components]);
            }
        } else if (this._settings["components-display"] == "material") {
            while (components) {
                if (["V", "S"].includes(components[0])) {
                    components = components.slice(1);
                    if (components.startsWith(", ")) {
                        components = components.slice(2);
                    }
                }
                if (components[0] == "M") {
                    roll_info.push([prefix || "Materials", this._settings["component-prefix"] + components.slice(2, -1)]);
                    components = "";
                }
            }
        }

        if (request["save-dc"] !== undefined)
            roll_info.push(["Save", request["save-ability"] + " DC " + request["save-dc"]]);


        const [attack_rolls, damage_rolls] = await this.buildAttackRolls(request, custom_roll_dice);

        return this.postDescription(request, request.name, source, data, description, attack_rolls, roll_info, damage_rolls);

    }

    displayAvatar(request) {
        const character = (request.whisper !== WhisperType.NO) ? "???" : request.character.name;
        this._displayer.postHTML(request, request.name, `<img src='${request.character.avatar}' width='100%'>`, {}, character, false, false);
        this.displayAvatarToDiscord(request);
    }
    displayAvatarToDiscord(request) {
        const discordChannel = getDiscordChannel(this._settings, request.character);
        postToDiscord(discordChannel ? discordChannel.secret : "", request, request.name, "", {}, "", [], [], [], [], false).then((error) => {
            if (error)
                this._displayer.displayError("Beyond20 Discord Integration: " + error);
        });
    }

    handleRollRequest(request) {
        let custom_roll_dice = "";
        if (request.character.type == "Character")
            custom_roll_dice = request.character.settings["custom-roll-dice"] || "";

        if (request.type == "avatar") {
            return this.displayAvatar(request);
        } else if (request.type == "skill") {
            return this.rollSkill(request, custom_roll_dice);
        } else if (request.type == "ability") {
            return this.rollAbility(request, custom_roll_dice);
        } else if (request.type == "saving-throw") {
            return this.rollSavingThrow(request, custom_roll_dice);
        } else if (request.type == "initiative") {
            return this.rollInitiative(request, custom_roll_dice);
        } else if (request.type == "hit-dice") {
            return this.rollHitDice(request);
        } else if (request.type == "item") {
            return this.rollItem(request);
        } else if (["feature", "trait", "action"].includes(request.type)) {
            return this.rollTrait(request);
        } else if (request.type == "death-save") {
            return this.rollDeathSave(request, custom_roll_dice);
        } else if (request.type == "attack") {
            return this.rollAttack(request, custom_roll_dice);
        } else if (request.type == "spell-card") {
            return this.rollSpellCard(request);
        } else if (request.type == "spell-attack") {
            return this.rollSpellAttack(request, custom_roll_dice);
        } else if (request.type == "chat-message") {
            return this.postMessage(request, request.name, request.message);
        } else {
            // 'custom' || anything unexpected;
            const mod = request.modifier || request.roll;
            const rname = request.name || request.type;

            return this.rollDice(request, rname + "(" + mod + ")", mod, {});
        }
    }
}


alertify.defaults.transition = "zoom";
if (alertify.Beyond20Prompt === undefined) {
    const factory = function () {
        return {
            "settings": {
                "content": undefined,
                "ok_label": undefined,
                "cancel_label": undefined,
                "resolver": undefined,
            },
            "main": function (title, content, ok_label, cancel_label, resolver) {
                this.set('title', title);
                this.set('content', content);
                this.set('resolver', resolver);
                this.set('ok_label', ok_label);
                this.set("cancel_label", cancel_label);
            },
            "setup": () => {
                return {
                    "buttons": [
                        {
                            "text": alertify.defaults.glossary.ok,
                            "key": 13, //keys.ENTER;
                            "className": alertify.defaults.theme.ok,
                        },
                        {
                            "text": alertify.defaults.glossary.cancel,
                            "key": 27, //keys.ESC;
                            "invokeOnClose": true,
                            "className": alertify.defaults.theme.cancel,
                        }
                    ],
                    "focus": {
                        "element": 0,
                        "select": true
                    },
                    "options": {
                        "maximizable": false,
                        "resizable": false
                    }
                }
            },
            "build": () => { },
            "prepare": function () {
                this.elements.content.innerHTML = this.get('content');
                this.__internal.buttons[0].element.innerHTML = this.get('ok_label');
                this.__internal.buttons[1].element.innerHTML = this.get('cancel_label');
            },
            "callback": function (closeEvent) {
                if (closeEvent.index == 0) {
                    this.get('resolver').call(this, $(this.elements.content.firstElementChild));
                } else {
                    this.get('resolver').call(this, null);
                }
            }
        }
    }
    alertify.dialog('Beyond20Prompt', factory, false, "prompt");
}


if (alertify.Beyond20Roll === undefined)
    alertify.dialog('Beyond20Roll', function () { return {}; }, false, "alert");

class DigitalDice {
    constructor(name, rolls) {
        this._name = name;
        this._rolls = rolls;
        this._dice = [];
        for (let roll of rolls) {
            this._dice.push(...roll.dice);
        }
        for (let dice of this._dice) {
            // Need access to the roll Class used to create the fake Roll on reroll
            const rollClass = this._rolls[0].constructor;
            dice.rerollDice = async function (amount) {
                const fakeDice = new this.constructor(amount, this.faces, "");
                const fakeRoll = new rollClass(fakeDice.formula);
                const digital = new DigitalDice(name, [fakeRoll])
                await digital.roll();
                this._rolls.push(...fakeRoll.dice[0]._rolls);
            }
        }
        this._notificationIds = this._getNotificationIds();
    }

    clear() {
        $(".dice-toolbar__dropdown-die").click()
    }
    clearResults() {
        $(".dice_notification_controls__clear").click()
    }
    rollDice(amount, type) {
        const dice = $(`.dice-die-button[data-dice="${type}"]`)
        for (let i = 0; i < amount; i++)
            dice.click()
        return amount || 0;
    }
    _makeRoll() {
        this._notificationIds = this._getNotificationIds();
        $(".dice-toolbar__roll").click();
    }
    static isEnabled() {
        const toolbar = $(".dice-toolbar");
        return toolbar.length > 0;
    }
    async roll() {
        this.clear();
        let diceRolled = 0;
        for (let dice of this._dice)
            diceRolled += this.rollDice(dice.amount, `d${dice.faces}`);
        if (diceRolled > 0) {
            this._makeRoll();
            return this.result();
        }
    }
    _getNotificationIds() {
        const notifications = $(".noty_bar").toArray();
        return notifications.map(n => n.id);
    }
    lookForResult() {
        const notifications = this._getNotificationIds();
        const myId = notifications.find(n => !this._notificationIds.includes(n))
        console.log("Found my results : ", myId)
        if (!myId) return false;

        const result = $(`#${myId} .dice_result`);
        this._myId = myId;
        this._myResult = result;
        
        result.find(".dice_result__info__title .dice_result__info__rolldetail").text("Beyond 20: ")
        result.find(".dice_result__info__title .dice_result__rolltype").text(this._name);
        const breakdown = result.find(".dice_result__info__results .dice_result__info__breakdown").text();
        const dicenotation = result.find(".dice_result__info__dicenotation").text();

        const diceMatches = reMatchAll(/([0-9]*)d([0-9]+)/, dicenotation) || [];
        const results = breakdown.split("+");
        this._dice.forEach(d => d._rolls = []);
        for (let match of diceMatches) {
            const amount = parseInt(match[1]);
            const faces = parseInt(match[2]);
            for (let i = 0; i < amount; i++) {
                const result = parseInt(results.shift());
                for (let dice of this._dice) {
                    if (dice.faces != faces) continue;
                    if (dice._rolls.length == dice.amount) continue;
                    dice._rolls.push({ "roll": result });
                    break;
                }
            }
        }
        this._notificationIds = notifications;
        return true;
    }
    async result() {
        while (!this.lookForResult())
            await new Promise(r => setTimeout(r, 500));
        for (let dice of this._dice)
            await dice.handleModifiers();
        this._rolls.forEach(roll => roll.calculateTotal());
        
        this._myResult.find(".dice_result__total-result").text(this._rolls[0].total);
        this._myResult.find(".dice_result__info__results .dice_result__info__breakdown").text(this._rolls[0].formula)
        this._myResult.find(".dice_result__info__dicenotation").text(`${this._rolls.length} roll${this._rolls.length > 1 ? 's' : ''} sent to VTT`).prepend(E.img({ src: chrome.extension.getURL("images/icons/icon32.png") }))
    }
}
/*
from roll_renderer import Beyond20RollRenderer, Beyond20BaseRoll;
from settings import getDefaultSettings, WhisperType;
import re;
*/

class DNDBDisplayer {
    constructor() {
        this._error = null;
    }

    postHTML(request, title, html, character, whisper, play_sound, source, attributes, description, attack_rolls, roll_info, damage_rolls, total_damages, open) {
        let content = "<div class='beyond20-dice-roller'>";
        if (this._error) {
            content += "<div class='beyond20-roller-error'>" +
                "<span class='beyond20-tooltip'>Virtual Table Top Not Found" +
                "<span class='beyond20-tooltip-content'>" + this._error + "</span>" +
                "</span>" +
                "</div>";
        }
        content += "<div class='beyond20-dice-roller-content'>" + html + "</div>" +
            "</div>";
        const dlg = alertify.Beyond20Roll(title, content);
        dlg.set('onclose', () => {
            dlg.set('onclose', null);
            dlg.destroy();
        });
        const element = $(dlg.elements.content.firstElementChild);
        const icon = chrome.runtime.getURL("images/icons/badges/custom20.png");
        element.find(".ct-beyond20-custom-icon").attr('src', icon);
        element.find(".ct-beyond20-custom-roll").on('click', (event) => {
            const roll = $(event.currentTarget).find(".beyond20-roll-formula").text();
            dndbeyondDiceRoller.rollDice(request, title, roll);
        });
        element.find(".beyond20-button-roll-damages").on('click', (event) => {
            request.rollAttack = false;
            request.rollDamage = true;
            request.rollCritical = attack_rolls.some(r => !r.discarded && r["critical-success"])
            dndbeyondDiceRoller.handleRollRequest(request);
        });
    }

    async sendMessage(request, title, html, character, whisper, play_sound, source, attributes, description, attack_rolls, roll_info, damage_rolls, total_damages, open) {
        const req = {
            action: "rendered-roll",
            request,
            title,
            html,
            character,
            whisper,
            play_sound,
            source,
            attributes,
            description,
            attack_rolls: attack_rolls.map(r => r.toJSON ? r.toJSON() : r),
            roll_info,
            damage_rolls: damage_rolls.map(([l, r, f]) => r.toJSON() ? [l, r.toJSON(), f] : [l, r, f]),
            total_damages: Object.fromEntries(Object.entries(total_damages).map(([k, v]) => [k, v.toJSON ? v.toJSON() : v])),
            open
        }
        console.log("Sending message: ", req);
        chrome.runtime.sendMessage(req, (resp) => beyond20SendMessageFailure(character, resp));
    }
    displayError(message) {
        alertify.error(message);
    }

    setError(error) {
        this._error = error;
    }
}

class DNDBRoller {
    roll(formula, data) {
        return new DNDBRoll(formula, data);
    }
    async resolveRolls(name, rolls) {
        if (dndbeyondDiceRoller._settings['use-digital-dice'] && DigitalDice.isEnabled()) {
            const digital = new DigitalDice(name, rolls);
            return digital.roll();
        } else {
            return Promise.all(rolls.map(roll => roll.roll()))
        }
    }
}

class DNDBPrompter {
    async prompt(title, html, ok_label = "OK", cancel_label = "Cancel") {
        return new Promise((resolve, reject) => {
            alertify.Beyond20Prompt(title, html, ok_label, cancel_label, resolve);
        });
    }
}

const dndbeyondDiceRoller = new Beyond20RollRenderer(new DNDBRoller(), new DNDBPrompter(), new DNDBDisplayer());
dndbeyondDiceRoller.setBaseURL(chrome.runtime.getURL(""));
dndbeyondDiceRoller.setSettings(getDefaultSettings());
dndbeyondDiceRoller.handleRollError = (request, error) => {
    dndbeyondDiceRoller._displayer.setError(error);
    if (request.action === "rendered-roll") {
        return dndbeyondDiceRoller._displayer.postHTML(request.request, request.title,
            request.html, request.character, request.whisper,
            request.play_sound, request.source, request.attributes, 
            request.description, request.attack_rolls, request.roll_info, 
            request.damage_rolls, request.total_damages, request.open);
    }
    request['original-whisper'] = request.whisper;
    request.whisper = WhisperType.NO;
    delete request.sendMessage;
    return dndbeyondDiceRoller.handleRollRequest(request);
}

/*from utils import replaceRolls, cleanRoll, alertQuickSettings, isListEqual, isObjectEqual;
from settings import getStoredSettings, mergeSettings, character_settings, WhisperType, RollType, CriticalRules;
from dndbeyond_dice import dndbeyondDiceRoller;
from elementmaker import E;
import uuid;
import re;
*/

class CharacterBase {
    constructor(_type, global_settings) {
        this._name = null;
        this._type = _type;
        this._settings = null;
        this._url = window.location.href;
        this.setGlobalSettings(global_settings);
    }

    type() {
        return this._type;
    }

    getSetting(key, default_value = "", settings = null) {
        if (settings === null)
            settings = this._settings;
        if (settings && settings[key] !== undefined) {
            return settings[key];
        }
        return default_value;
    }

    getGlobalSetting(key, default_value = "") {
        return this.getSetting(key, default_value, this._global_settings);
    }

    setGlobalSettings(new_settings) {
        this._global_settings = new_settings;
        dndbeyondDiceRoller.setSettings(new_settings);
        updateRollTypeButtonClasses(this);
    }

    getDict() {
        return { "name": this._name, "type": this._type, "url": this._url }
    }
}


alertify.set("alert", "title", "Beyond 20");
alertify.set("notifier", "position", "top-center");


const key_modifiers = {"alt": false, "ctrl": false, "shift": false}
checkKeyModifiers = (event) => {
    if (event.originalEvent.repeat) return;
    needsUpdate = Object.values(key_modifiers).some((v) => v);
    key_modifiers.ctrl = event.ctrlKey || event.metaKey;
    key_modifiers.shift = event.shiftKey;
    key_modifiers.alt = event.altKey;
    needsUpdate = needsUpdate || Object.values(key_modifiers).some((v) => v);
    if (needsUpdate)
        updateRollTypeButtonClasses();
}
resetKeyModifiers = (event) => {
    needsUpdate = Object.values(key_modifiers).some((v) => v);
    key_modifiers.ctrl = false;
    key_modifiers.shift = false;
    key_modifiers.alt = false;
    if (needsUpdate)
        updateRollTypeButtonClasses();
}
$(window).keydown(checkKeyModifiers).keyup(checkKeyModifiers).blur(resetKeyModifiers);

const ability_abbreviations = {
    "Strength": "STR",
    "Dexterity": "DEX",
    "Constitution": "CON",
    "Intelligence": "INT",
    "Wisdom": "WIS",
    "Charisma": "CHA"
}

const skill_abilities = {
    "Acrobatics": "DEX",
    "Animal Handling": "WIS",
    "Arcana": "INT",
    "Athletics": "STR",
    "Deception": "CHA",
    "History": "INT",
    "Insight": "WIS",
    "Intimidation": "CHA",
    "Investigation": "INT",
    "Medicine": "WIS",
    "Nature": "INT",
    "Perception": "WIS",
    "Performance": "CHA",
    "Persuasion": "CHA",
    "Religion": "INT",
    "Sleight of Hand": "DEX",
    "Stealth": "DEX",
    "Survival": "WIS"
}

function skillToAbility(skill) {
    return skill_abilities[skill] || "";
}

function abbreviationToAbility(abbr) {
    for (let ability in ability_abbreviations) {
        if (ability_abbreviations[ability] == abbr)
            return ability;
    }
    return abbr;
}


function propertyListToDict(propList) {
    const properties = {}
    for (let i = 0; i < propList.length; i++) {
        const label = propList.eq(i).find(".ct-property-list__property-label,.ddbc-property-list__property-label").text().slice(0, -1);
        const value = propList.eq(i).find(".ct-property-list__property-content,.ddbc-property-list__property-content").text();
        properties[label] = value;
    }
    return properties;
}

function descriptionToString(selector) {
    // strip tags : https://www.sitepoint.com/jquery-strip-html-tags-div/;
    return ($(selector).html() || "").replace(/<\/?[^>]+>/gi, '')
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, "\"")
        .replace(/&apos;/g, "\'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
}

function findToHit(name_to_match, items_selector, name_selector, tohit_selector) {
    const items = $(items_selector);
    for (let i = 0; i < items.length; i++) {
        if (items.eq(i).find(name_selector).text() == name_to_match) {
            const to_hit = items.eq(i).find(tohit_selector);
            if (to_hit.length > 0) {
                const value = to_hit.text();
                return value === "--" ? null : value;
            }
            break;
        }
    }
    return null;
}

function damagesToCrits(character, damages) {
    const crits = [];
    const rule = parseInt(character.getGlobalSetting("critical-homebrew", CriticalRules.PHB));
    if (rule == CriticalRules.HOMEBREW_REROLL || rule == CriticalRules.HOMEBREW_MOD)
        return damages.slice();
    for (let damage of damages) {
        const damage_matches = reMatchAll(/([0-9]*)d([0-9]+)(?:ro<=[0-9]+)?(?:min[0-9]+)?/, damage) || [];
        const damage_parts = damage_matches.map(match => {
            if (rule == CriticalRules.HOMEBREW_MAX) {
                dice = parseInt(match[1] || 1);
                faces = parseInt(match[2]);
                return String(dice * faces);
            } else {
                return match[0];
            }
        });
        console.log("Damage to crits : ", damage, damage_parts);
        crits.push(damage_parts.join(" + "));
    }
    return crits;
}

function buildAttackRoll(character, attack_source, name, description, properties,
                         damages = [], damage_types = [], to_hit = null,
                         brutal = 0, force_to_hit_only = false, force_damages_only = false) {
    const roll_properties = {
        "name": name,
        "attack-source": attack_source,
        "description": description,
        "rollAttack": force_to_hit_only || !force_damages_only,
        "rollDamage": force_damages_only || (!force_to_hit_only && character.getGlobalSetting("auto-roll-damage", true)),
        "rollCritical": false
    }
    if (to_hit !== null)
        roll_properties["to-hit"] = to_hit;

    if (properties["Reach"] !== undefined) {
        roll_properties["reach"] = properties["Reach"];
        roll_properties["attack-type"] = "Melee";
    } else if (properties["Range"] !== undefined) {
        roll_properties["range"] = properties["Range"];
        roll_properties["attack-type"] = "Ranged";
    } else {
        const range_area = properties["Range/Area"] || "";
        if (range_area.includes("Reach")) {
            roll_properties["attack-type"] = "Melee";
            roll_properties["reach"] = range_area.replace(" Reach", "");
        } else {
            roll_properties["attack-type"] = "Ranged";
            roll_properties["range"] = range_area;
        }
    }
    if (properties["Attack Type"] !== undefined)
        roll_properties["attack-type"] = properties["Attack Type"];

    if (properties["Attack/Save"] !== undefined) {
        const [save_ability, save_dc] = properties["Attack/Save"].split(" ");
        roll_properties["save-ability"] = abbreviationToAbility(save_ability);
        roll_properties["save-dc"] = save_dc;
    }

    if (properties["Properties"] !== undefined)
        roll_properties["properties"] = properties["Properties"].split(", ");

    if (damages.length > 0) {
        roll_properties["damages"] = damages;
        roll_properties["damage-types"] = damage_types;
        if (to_hit) {
            const crits = damagesToCrits(character, damages, damage_types);
            const crit_damages = [];
            const crit_damage_types = [];
            for (let [i, dmg] of crits.entries()) {
                if (dmg != "") {
                    crit_damages.push(dmg);
                    crit_damage_types.push(damage_types[i]);
                }
            }
            if (brutal > 0) {
                const rule = parseInt(character.getGlobalSetting("critical-homebrew", CriticalRules.PHB));
                let highest_dice = 0;
                let homebrew_max_damage = 0;
                if (rule == CriticalRules.HOMEBREW_MAX) {
                    let highest_damage = 0;
                    for (let dmg of crit_damages) {
                        if (dmg > highest_damage){
                            highest_damage = dmg;
                        }
                    }
                    homebrew_max_damage = brutal * highest_damage;
                } else {
                    for (let dmg of crit_damages) {
                        const match = dmg.match(/[0-9]*d([0-9]+)/);
                        if (match) {
                            const sides = parseInt(match[1]);
                            if (sides > highest_dice)
                                highest_dice = sides;
                        }
                    }
                }
                const isBrutal = character.hasClassFeature("Brutal Critical");
                const isSavage = character.hasRacialTrait("Savage Attacks");
                if (highest_dice != 0) {
                    let brutal_dmg = `${brutal}d${highest_dice}`
                    // Apply great weapon fighting to brutal damage dice
                    if (character.hasClassFeature("Fighting Style: Great Weapon Fighting") &&
                        properties["Attack Type"] == "Melee" &&
                        (properties["Properties"].includes("Versatile") || properties["Properties"].includes("Two-Handed"))) {
                        brutal_dmg += "ro<=2"
                    }
                    crit_damages.push(brutal_dmg);
                    crit_damage_types.push(isBrutal && isSavage ? "Savage Attacks & Brutal" : (isBrutal ? "Brutal" : "Savage Attacks"));
                } else if (rule == CriticalRules.HOMEBREW_MAX) {
                    crit_damages.push(`${homebrew_max_damage}`);
                    crit_damage_types.push(isBrutal && isSavage ? "Savage Attacks & Brutal" : (isBrutal ? "Brutal" : "Savage Attacks"));
                }

            }
            roll_properties["critical-damages"] = crit_damages;
            roll_properties["critical-damage-types"] = crit_damage_types;
        }
    }

    return roll_properties;
}

async function sendRoll(character, rollType, fallback, args) {
    let whisper = parseInt(character.getGlobalSetting("whisper-type", WhisperType.NO));
    const whisper_monster = parseInt(character.getGlobalSetting("whisper-type-monsters", WhisperType.YES));
    let is_monster = character.type() == "Monster" || character.type() == "Vehicle";
    if (is_monster && whisper_monster != WhisperType.NO)
        whisper = whisper_monster;
    advantage = parseInt(character.getGlobalSetting("roll-type", RollType.NORMAL));
    if (args["advantage"] == RollType.OVERRIDE_ADVANTAGE)
        args["advantage"] = advantage == RollType.SUPER_ADVANTAGE ? RollType.SUPER_ADVANTAGE : RollType.ADVANTAGE;
    if (args["advantage"] == RollType.OVERRIDE_DISADVANTAGE)
        args["advantage"] = advantage == RollType.SUPER_DISADVANTAGE ? RollType.SUPER_DISADVANTAGE : RollType.DISADVANTAGE;

    if (whisper === WhisperType.QUERY)
        whisper = await dndbeyondDiceRoller.queryWhisper(args.name || rollType, is_monster);
    if (advantage == RollType.QUERY)
        advantage = await dndbeyondDiceRoller.queryAdvantage(args.name || rollType);
    // Default advantage/whisper would get overriden if (they are part of provided args;
    req = {
        action: "roll",
        character: character.getDict(),
        type: rollType,
        roll: cleanRoll(fallback),
        advantage: advantage,
        whisper: whisper
    }
    for (let key in args)
        req[key] = args[key];
    if (key_modifiers.shift)
        req["advantage"] = RollType.ADVANTAGE;
    else if (key_modifiers.ctrl)
        req["advantage"] = RollType.DISADVANTAGE;
    else if (key_modifiers.alt)
        req["advantage"] = RollType.NORMAL;
    if (character.getGlobalSetting("weapon-force-critical", false))
        req["critical-limit"] = 1;

    if (character.getGlobalSetting("use-digital-dice", false) && DigitalDice.isEnabled()) {
        req.sendMessage = true;
        dndbeyondDiceRoller.handleRollRequest(req);
    } else {
        console.log("Sending message: ", req);
        chrome.runtime.sendMessage(req, (resp) => beyond20SendMessageFailure(character, resp));
    }
}

function isRollButtonAdded() {
    return $(".ct-beyond20-roll,.ct-beyond20-roll-display").length > 0;
}

function isCustomRollIconsAdded() {
    return $(".ct-beyond20-custom-roll, .ct-beyond20-custom-roll-button").length > 0;
}

function isHitDieButtonAdded() {
    return $(".ct-beyond20-roll-hitdie").length > 0;
}

function getRollTypeButtonClass(character) {
    let advantage = RollType.NORMAL;
    if (character)
        advantage = parseInt(character.getGlobalSetting("roll-type", RollType.NORMAL));
    if (key_modifiers.shift)
        advantage = RollType.ADVANTAGE;
    else if (key_modifiers.ctrl)
        advantage = RollType.DISADVANTAGE;
    else if (key_modifiers.alt)
        advantage = RollType.NORMAL;

    if (advantage == RollType.DOUBLE)
        return "beyond20-roll-type-double";
    if (advantage == RollType.QUERY)
        return "beyond20-roll-type-query";
    if (advantage == RollType.THRICE)
        return "beyond20-roll-type-thrice";
    if (advantage == RollType.ADVANTAGE)
        return "beyond20-roll-type-advantage";
    if (advantage == RollType.DISADVANTAGE)
        return "beyond20-roll-type-disadvantage";
    if (advantage == RollType.SUPER_ADVANTAGE)
        return "beyond20-roll-type-super-advantage";
    if (advantage == RollType.SUPER_DISADVANTAGE)
        return "beyond20-roll-type-super-disadvantage";
    return "";
}

function getBadgeIconFromClass(rolltype_class, size="20") {
    const type = rolltype_class.replace("beyond20-roll-type-", "") || "normal";
    return chrome.extension.getURL(`images/icons/badges/${type}${size}.png`);
}

var last_character_used = null;
function updateRollTypeButtonClasses(character) {
    const button_roll_type_classes = "beyond20-roll-type-double beyond20-roll-type-query beyond20-roll-type-thrice beyond20-roll-type-advantage beyond20-roll-type-disadvantage beyond20-roll-type-super-advantage beyond20-roll-type-super-disadvantage";
    const rolltype_class = getRollTypeButtonClass(character || last_character_used);
    $(".ct-beyond20-roll .ct-beyond20-roll-button,.beyond20-quick-roll-tooltip").removeClass(button_roll_type_classes).addClass(rolltype_class);
    const icon20 = getBadgeIconFromClass(rolltype_class, "20");
    const icon32 = getBadgeIconFromClass(rolltype_class, "32");
    $(".ct-beyond20-roll .ct-beyond20-icon").attr("src", icon20);
    $(".beyond20-quick-roll-tooltip .beyond20-quick-roll-icon").attr("src", icon32);
}


const button_class = "ct-theme-button ct-theme-button--filled ct-theme-button--interactive ct-button character-button";
const button_class_small = button_class + " character-button-small";
function addRollButton(character, callback, where, { small = false, append = false, prepend = false, before = false, image = true, text = "Beyond 20" } = {}) {
    last_character_used = character;

    const id = "beyond20-roll-" + Math.random().toString().slice(2);

    const rolltype_class = getRollTypeButtonClass(character);
    const icon = getBadgeIconFromClass(rolltype_class);

    const button = E.div({ class: "ct-beyond20-roll", id },
        E.button({ class: "ct-beyond20-roll-button " + (small ? button_class_small : button_class) + " " + rolltype_class },
            E.img({ class: "ct-beyond20-icon", src: image ? icon : "", style: image ? "margin-right: 6px;" : "" }),
            E.span({ class: "ct-button__content" }, text)
        )
    )

    if (append)
        $(where).append(button);
    else if (prepend)
        $(where).prepend(button);
    else if (before)
        $(where).before(button);
    else
        $(where).after(button);

    $(`#${id}`).css({
        "float": "right",
        "display": "block",
        "text-align": "center"
    });
    $(`#${id} button`).on('click', (event) => callback());
    return id;
}

function addDisplayButton(callback, where, { text = "Display in VTT", append = true, small = true } = {}) {
    const button = E.div({ class: "ct-beyond20-roll-display" },
        E.button({ class: "ct-beyond20-display-button " + (small ? button_class_small : button_class).replace("filled", "outline") },
            E.span({ class: "ct-button__content" }, text)
        )
    );
    if (append)
        $(where).append(button);
    else
        $(where).after(button);

    $(".ct-beyond20-roll-button").css({
        "margin-left": "auto",
        "margin-right": "auto"
    });
    $(".ct-beyond20-roll-display").css("margin-top", "2px");
    $(".ct-beyond20-roll-display").on('click', (event) => callback());
}

function addHitDieButtons(rollCallback) {
    const icon = chrome.extension.getURL("images/icons/badges/custom20.png");
    const button = E.div({ class: "ct-beyond20-roll-hitdie", style: "float: right;" },
        E.img({ class: "ct-beyond20-icon", src: icon, style: "margin-right: 6px;" }),
        E.button({ class: "ct-beyond20-roll-button " + button_class_small },
            E.span({ class: "ct-button__content" }, "Roll Hit Die")
        )
    );
    //console.log("Adding Hit Dice buttons");

    $(".ct-reset-pane__hitdie-heading").append(button);
    const hitdice = $(".ct-reset-pane__hitdie");
    const multiclass = hitdice.length > 1;
    for (let i = 0; i < hitdice.length; i++) {
        $(".ct-beyond20-roll-hitdie").eq(i).on('click', (event) => rollCallback(multiclass, i));
    }
}

function addIconButton(character, callback, where, { append = false, prepend = false, custom = false } = {}) {
    const rolltype_class = getRollTypeButtonClass(character);
    const icon = custom ? chrome.extension.getURL("images/icons/badges/custom20.png") :
                        getBadgeIconFromClass(rolltype_class);
    const id = "beyond20-roll-" + (custom ? "custom-" : "") + Math.random().toString().slice(2);
    const button = E.span({ class: "ct-beyond20-" + (custom ? "custom-roll-button" : "roll"), id, style: "margin-right:3px; margin-left: 3px;" },
        E.img({ class: "ct-beyond20-" + (custom ? "custom-icon" : "icon"), src: icon })
    );

    if (append)
        $(where).append(button);
    else if (prepend)
        $(where).prepend(button);
    else
        $(where).after(button);
    $(`#${id}`).on('click', (event) => callback());
    return button;
}

function removeRollButtons() {
    $(".ct-beyond20-roll").remove();
    $(".ct-beyond20-roll-hitdie").remove();
    $(".ct-beyond20-roll-display").remove();
    $(".ct-beyond20-custom-icon").remove();
    const custom_rolls = $("u.ct-beyond20-custom-roll");
    for (let i = 0; i < custom_rolls.length; i++)
        custom_rolls.eq(i).replaceWith(custom_rolls.eq(i).text());
}


function recursiveDiceReplace(node, cb) {
    if (node.hasChildNodes()) {
        // We need to copy the list since its size could change as we modify it;
        const children = [].concat(...node.childNodes);
        for (let child of children) {
            // don't replace anything inside of a roll button itthis;
            if ($(child).hasClass("ct-beyond20-roll"))
                continue;
            recursiveDiceReplace(child, cb);
        }
    } else if (node.nodeName == "#text") {
        const text = replaceRolls(node.textContent, cb);
        // Only replace if (we changed it, otherwise we might break existing html code bindings;
        if (text != node.textContent)
            $(node).replaceWith($.parseHTML(text));
    }
}

function injectDiceToRolls(selector, character, name = "") {
    const icon = chrome.extension.getURL("images/icons/badges/custom20.png");
    const replaceCB = (dice, modifier) => {
        dice_formula = (dice == "" ? "1d20" : dice) + modifier;
        return '<u class="ct-beyond20-custom-roll"><strong>' + dice + modifier + '</strong>' +
            '<img class="ct-beyond20-custom-icon" x-beyond20-name="' + name +
            '" x-beyond20-roll="' + dice_formula + '"></img></u>';
    }

    const items = $(selector);
    for (let item of items.toArray())
        recursiveDiceReplace(item, replaceCB);

    $(".ct-beyond20-custom-icon").css("margin-right", "3px");
    $(".ct-beyond20-custom-icon").css("margin-left", "3px");
    $(".ct-beyond20-custom-icon").attr("src", icon);
    $(".ct-beyond20-custom-roll").off('click');
    $(".ct-beyond20-custom-roll").on('click', (event) => {
        const name = $(event.currentTarget).find("img").attr("x-beyond20-name");
        const roll = $(event.currentTarget).find("img").attr("x-beyond20-roll");
        sendRoll(character, "custom", roll, { "name": name });
    }
    );
}

function beyond20SendMessageFailure(character, response) {
    if (!response || (response.request && response.request.action === "update-combat"))
        return;
    console.log("Received response : ", response);
    if (["roll", "rendered-roll"].includes(response.request.action)  && (response.vtt == "dndbeyond" || response.error)) {
        dndbeyondDiceRoller.handleRollError(response.request, response.error);
    } else if (response.error) {
        alertify.error("<strong>Beyond 20 : </strong>" + response.error);
    }
}



class SpellCharacter extends CharacterBase {
    constructor(global_settings) {
        super("spell", global_settings);
    }
}

class Spell {
    constructor(body, character, type = "page") {
        this._character = character;
        // if (type == "page")
        let title_selector = ".page-title";
        let statblock_selector = ".ddb-statblock";
        let description_selector = ".spell-details .more-info-content";
        let casting_time_label = "casting-time";
        let range_area_label = "range-area";

        if (type == "tooltip") {
            title_selector = ".tooltip-header-text";
            statblock_selector = ".tooltip-body-statblock";
            description_selector = ".tooltip-body-description-text";
            casting_time_label = "castingtime";
            range_area_label = "range";
        }

        const get_statblock = (label) => {
            return body.find(`${statblock_selector}-item-${label} ${statblock_selector}-item-value`).text().trim();
        }

        this.spell_name = body.find(title_selector).text().trim();
        this.casting_time = get_statblock(casting_time_label);
        this.range_area = get_statblock(range_area_label);
        this.components = get_statblock("components");
        this.duration = get_statblock("duration");
        this.description = body.find(description_selector).text().trim();
        const level = get_statblock("level");
        const school = get_statblock("school");
        this.preview = "https://www.dndbeyond.com/content/1-0-851-0/skins/waterdeep/images/spell-schools/35/" + school.toLowerCase() + ".png";
        if (level == "Cantrip") {
            this.level_school = school + " " + level;
        } else {
            this.level_school = level + " Level " + school;
        }
        if (this.duration.startsWith("Concentration")) {
            this.concentration = true;
            this.duration = this.duration.replace("Concentration", "").trim();
        } else {
            this.concentration = false;
        }
        this.ritual = (body.find(statblock_selector + "-item-casting-time .i-ritual").length > 0);
        if (this.components.slice(-1)[0] == "*") {
            const materials = body.find(description_selector + " .components-blurb").text().trim();
            this.description = this.description.slice(0, -1 * materials.length).trim();
            this.components = this.components.slice(0, -2) + materials.slice(4);
        }
        const aoe = body.find(statblock_selector + "-item-range-area .aoe-size").text().trim();
        if (aoe != "") {
            this.range_area = this.range_area.slice(0, -1 * aoe.length).trim() + " " + aoe.trim();
        }
    }

    display() {
        sendRoll(this._character, "spell-card", 0, {
            "name": this.spell_name,
            "preview": this.preview,
            "level-school": this.level_school,
            "range": this.range_area,
            "concentration": this.concentration,
            "duration": this.duration,
            "casting-time": this.casting_time,
            "components": this.components,
            "ritual": this.ritual,
            "description": this.description
        });
    }
}

class Monster extends CharacterBase {
    constructor(_type, base = null, global_settings = null) {
        super(_type, global_settings);
        if (this.type() == "Monster") {
            this._base = ".mon-stat-block";
        } else if (this.type() == "Creature") {
            this._base = ".ct-creature-block";
        } else if (this.type() == "Vehicle" || this.type() == "Extra-Vehicle") {
            this._base = ".vehicle-stat-block";
        } else {
            this._base = ".mon-stat-block";
        }
        if (base)
            this._base = base;
        this._stat_block = $(this._base);
        this._id = null;
        this._name = null;
        this._avatar = null;
        this._meta = null;
        this._attributes = {}
        this._ac = null;
        this._hp = null;
        this._hp_formula = null;
        this._max_hp = 0;
        this._temp_hp = 0;
        this._speed = null;
        this._abilities = [];
        this._tidbits = {}
        this._saves = {}
        this._skills = {}
        this._spells = {}
        this._cr = null;
    }

    parseStatBlock(stat_block) {
        const add_dice = this.getGlobalSetting('handle-stat-blocks', true);
        const inject_descriptions = this.getGlobalSetting('subst-dndbeyond-stat-blocks', true);
        const base = this._base;
        if (!stat_block)
            stat_block = $(base);

        this._stat_block = stat_block;
        if (this.type() != "Creature" && this.type() != "Extra-Vehicle") {
            $(".ct-beyond20-settings-button").remove();
            const quick_settings = E.div({ class: "ct-beyond20-settings-button", style: "background-color: rgba(0, 0, 0, 0.1)" },
                E.img({ class: "ct-beyond20-settings", src: chrome.extension.getURL("images/icons/icon32.png"), style: "vertical-align: top;" }),
                E.span({ class: "ct-beyond20-settings-button-label mon-stat-block__tidbit mon-stat-block__tidbit-label", style: "font-size: 28px; margin: 5px;" }, "Beyond 20")
            );
            stat_block.find(`${base}__header`).prepend(quick_settings);
            $(quick_settings).on('click', (event) => alertQuickSettings());
        }
        this._name = stat_block.find(base + "__name").text().trim();
        const link = stat_block.find(base + "__name-link");
        if (link.length > 0) {
            this._url = link[0].href;
            this._id = this._url.replace("/monsters/", "").replace("/vehicles/", "");
        } else {
            this._url = window.location.href;
            this._id = this._name;
        }
        this._meta = stat_block.find(base + "__meta").text().trim();
        const avatar = $(".details-aside .image a");
        if (avatar.length > 0) {
            this._avatar = avatar[0].href;
            const avatarImg = $(".details-aside .image");
            if (avatarImg)
                addRollButton(this, () => this.displayAvatar(), avatarImg, { small: true, image: true, text: "Display in VTT" });
        }
        const attributes = stat_block.find(`${base}__attributes ${base}__attribute`);
        for (let attr of attributes.toArray()) {
            const label = $(attr).find(base + "__attribute-label").text().trim();
            let value = $(attr).find(base + "__attribute-value").text().trim();
            if (value == "")
                value = $(attr).find(base + "__attribute-data").text().trim();
            if (label == "Armor Class") {
                this._ac = $(attr).find(base + "__attribute-data-value").text().trim();
            } else if (label == "Hit Points") {
                this._hp = $(attr).find(base + "__attribute-data-value").text().trim();
                this._hp_formula = $(attr).find(base + "__attribute-data-extra").text().trim().slice(1, -1);
                if (add_dice)
                    addIconButton(this, () => this.rollHitPoints(), $(attr).find(base + "__attribute-data-extra"), {custom: true});
            } else if (label == "Speed") {
                this._speed = value;
            }
            this._attributes[label] = value;
        }

        let abilities = stat_block.find(base + "__abilities");
        let prefix = `${base}__ability-`
        if (abilities.length > 0) {
            abilities = abilities.find("> div");
        } else {
            abilities = stat_block.find(".ability-block > div");
            prefix = ".ability-block__";
        }
        for (let ability of abilities.toArray()) {
            const abbr = $(ability).find(prefix + "heading").text().toUpperCase();
            const score = $(ability).find(prefix + "score").text();
            const modifier = $(ability).find(prefix + "modifier").text().slice(1, -1);
            this._abilities.push([abbreviationToAbility(abbr), abbr, score, modifier]);
            if (add_dice) {
                addIconButton(this, () => this.rollAbilityCheck(abbr), ability, { prepend: true });
                if (abbr == "DEX") {
                    let roll_initiative = stat_block.find(base + "__beyond20-roll-initiative");
                    const attributes = stat_block.find(base + "__attributes");
                    if (attributes.length > 0) {
                        let initiative = roll_initiative.eq(0);
                        // Make sure the modifier didn't change (encounters)
                        if (roll_initiative.length > 0 && roll_initiative.attr("data-modifier") !== modifier) {
                            initiative = null;
                            roll_initiative.remove();
                            roll_initiative = [];
                        }
                        if (roll_initiative.length == 0) {
                            const attribute_prefix = `${base.slice(1)}__attribute`
                            initiative = $(
                                E.div({ class: `${attribute_prefix} ${base.slice(1)}__beyond20-roll-initiative`,
                                        "data-modifier": modifier },
                                    E.span({ class: `${attribute_prefix}-label` }, "Roll Initiative!"),
                                    E.span({ class: `${attribute_prefix}-data` },
                                        E.span({ class: `${attribute_prefix}-data-value` }, "  " + modifier)
                                    )
                                )
                            );
                        }
                        attributes.eq(0).append(initiative);
                        addIconButton(this, () => this.rollInitiative(), initiative.find(base + "__attribute-data"));
                    }
                }
            }
        }


        const tidbits = stat_block.find(base + "__tidbits " + base + "__tidbit");
        for (let tidbit of tidbits.toArray()) {
            const label = $(tidbit).find(base + "__tidbit-label").text();
            const data = $(tidbit).find(base + "__tidbit-data");
            const value = data.text().trim();
            if (label == "Saving Throws") {
                const saves = value.split(", ");
                if (add_dice)
                    data.html("");
                for (let save of saves) {
                    const parts = save.split(" ");
                    const abbr = parts[0];
                    const mod = parts.slice(1).join(" ");
                    this._saves[abbr] = mod;
                    if (!add_dice)
                        continue;
                    data.append(abbr + " " + mod);
                    addIconButton(this, () => this.rollSavingThrow(abbr), data, { append: true });
                    if (saves.length > Object.keys(this._saves).length)
                        data.append(", ");
                }
            } else if (label == "Skills") {
                const skills = value.split(", ");
                for (let skill of skills) {
                    const parts = skill.split(" ");
                    const name = parts.slice(0, -1).join(" ");
                    const mod = parts.slice(-1)[0];
                    this._skills[name] = mod;
                }
                if (!add_dice)
                    continue;
                if (this.type() == "Monster") {
                    const skill_links = data.find("> a");
                    for (let a of skill_links.toArray()) {
                        const mon_skill = a.textContent;
                        const text = a.nextSibling;
                        let last = true;
                        if (text.textContent.endsWith(", ")) {
                            text.textContent = text.textContent.slice(0, -2);
                            last = false;
                        }
                        addIconButton(this, () => this.rollSkillCheck(mon_skill), a.nextSibling);
                        if (!last)
                            $(a.nextElementSibling).after(", ");
                    }
                } else {
                    data.html("");
                    let first = true;
                    for (let skill in this._skills) {
                        if (!first)
                            data.append(", ");
                        first = false;
                        data.append(skill + " " + this._skills[skill]);
                        if (add_dice)
                            addIconButton(this, () => this.rollSkillCheck(skill), data, { append: true });
                    }
                }
            } else if (label == "Challenge") {
                this._cr = value.split(" ")[0];
            }
            this._tidbits[label] = value;
        }
        this.lookForActions(stat_block, add_dice, inject_descriptions);
        if (add_dice)
            this.lookForSpells(stat_block);
        //console.log("Done parsing stat block:", this);
    }

    displayAvatar() {
        sendRoll(this, "avatar", this.avatar, { "name": "Avatar" });
    }

    rollHitPoints() {
        sendRoll(this, "custom", this._hp_formula, {
            "name": "Hit Points",
            "modifier": this._hp_formula
        });
    }

    rollAbilityCheck(abbr) {
        for (let ability of this._abilities) {
            if (ability[1] == abbr) {
                const [name, abbr, score, modifier] = ability;
                sendRoll(this, "ability", "1d20" + modifier, {
                    "name": name,
                    "ability": abbr,
                    "modifier": modifier,
                    "ability-score": score
                });
                break;
            }
        }
    }

    rollInitiative() {
        for (let ability of this._abilities) {
            if (ability[1] == "DEX") {
                const modifier = ability[3];

                let initiative = modifier;
                if (this.getGlobalSetting("initiative-tiebreaker", false)) {
                    const tiebreaker = ability[2];

                    // Add tiebreaker as a decimal;
                    initiative = parseFloat(initiative) + parseFloat(tiebreaker) / 100;

                    // Render initiative as a string that begins with '+' || '-';
                    initiative = initiative >= 0 ? '+' + initiative.toString() : initiative.toString();
                }

                sendRoll(this, "initiative", "1d20" + initiative, { "initiative": initiative });
                break;
            }
        }
    }

    rollSavingThrow(abbr) {
        const mod = this._saves[abbr];
        const name = abbreviationToAbility(abbr);
        sendRoll(this, "saving-throw", "1d20" + mod, {
            "name": name,
            "ability": abbr,
            "modifier": mod
        });
    }

    rollSkillCheck(skill) {
        const modifier = this._skills[skill];
        const ability = skillToAbility(skill);
        sendRoll(this, "skill", "1d20" + modifier, {
            "skill": skill,
            "ability": ability,
            "modifier": modifier
        });
    }

    parseAttackInfo(description) {
        const m = description.match(/(Melee|Ranged)(?: Weapon| Spell)? Attack:.*?(\+[0-9]+) to hit.*?, (?:reach|ranged?) (.*?)(?:,.*?)?\./)
        if (m)
            return m.slice(1, 4);
        else
            return null;
    }

    parseHitInfo(description) {
        const hit_idx = description.indexOf("Hit:");
        let hit = description;
        if (hit_idx > 0)
            hit = description.slice(hit_idx);
        // Using match with global modifier then map to regular match because RegExp.matchAll isn't available on every browser
        const damage_regexp = new RegExp(/([\w]* )(?:([0-9]+))?(?: *\(?([0-9]*d[0-9]+(?:\s*[-+]\s*[0-9]+)?(?: plus [^\)]+)?)\)?)? ([\w ]+?) damage/)
        const damage_matches = reMatchAll(damage_regexp, hit) || [];
        const damages = [];
        const damage_types = [];
        for (let dmg of damage_matches) {
            // Skip any damage that starts wit "DC" because of "DC 13 saving throw or take damage" which could match.
            // A lookbehind would be a simple solution here but rapydscript doesn't let me.
            // Also skip "target reduced to 0 hit points by this damage" from demon-grinder vehicle.
            if (dmg[1] == "DC " || dmg[4] == "hit points by this") {
                continue;
            }
            const damage = dmg[3] || dmg[2];
            // Make sure we did match a damage ('  some damage' would match the regexp, but there is no value)
            if (damage) {
                damages.push(damage.replace("plus", "+"));
                damage_types.push(dmg[4]);
            }
        }
        let save = null;
        const m = hit.match(/DC ([0-9]+) (.*?) saving throw/)
        let preDCDamages = damages.length;
        if (m) {
            save = [m[2], m[1]];
            preDCDamages = damage_matches.reduce((total, match) => {
                if (match.index < m.index)
                    total++;
                return total
            }, 0);
        } else {
            const m2 = hit.match(/escape DC ([0-9]+)/);
            if (m2)
                save = ["Escape", m2[1]];
        }

        if (damages.length == 0 && save === null)
            return null;
        return [damages, damage_types, save, preDCDamages];
    }

    buildAttackRoll(name, description) {
        const roll_properties = {
            "name": name,
            "preview": this._avatar,
            "attack-source": "monster-action",
            "description": description,
            "rollAttack": true,
            "rollDamage": this.getGlobalSetting("auto-roll-damage", true),
        }

        const attackInfo = this.parseAttackInfo(description);
        //console.log("Attack info for ", name, attackInfo);
        if (attackInfo) {
            const [attack_type, to_hit, reach_range] = attackInfo;
            roll_properties["to-hit"] = to_hit;
            roll_properties["attack-type"] = attack_type;
            roll_properties[attack_type == "Melee" ? "reach" : "range"] = reach_range;
        }


        const hitInfo = this.parseHitInfo(description);
        //console.log("Hit info for ", name, hitInfo);
        if (hitInfo) {
            const [damages, damage_types, save, toCrit] = hitInfo;
            if (damages.length > 0) {
                roll_properties["damages"] = damages;
                roll_properties["damage-types"] = damage_types;
                const crits = damagesToCrits(this, damages.slice(0, toCrit), damage_types.slice(0, toCrit));
                const crit_damages = [];
                const crit_damage_types = [];
                for (let [i, dmg] of crits.entries()) {
                    if (dmg != "") {
                        crit_damages.push(dmg);
                        crit_damage_types.push(damage_types[i]);
                    }
                }
                roll_properties["critical-damages"] = crit_damages;
                roll_properties["critical-damage-types"] = crit_damage_types;
            }
            if (save) {
                roll_properties["save-ability"] = save[0];
                roll_properties["save-dc"] = save[1];
            }
        }

        if (attackInfo || hitInfo)
            return roll_properties;

        return null;
    }

    lookForActions(stat_block, add_dice, inject_descriptions) {
        let blocks = stat_block.find(this._base + "__description-blocks " + this._base + "__description-block");

        const handleAction = (action_name, block, action) => {
            if (action_name.slice(-1)[0] == ".")
                action_name = action_name.slice(0, -1);
            //console.log("Action name: ", action_name);
            if (add_dice) {
                const description = descriptionToString(action);
                const roll_properties = this.buildAttackRoll(action_name, description);
                if (roll_properties) {
                    const id = addRollButton(this, () => {
                        const roll_properties = this.buildAttackRoll(action_name, description);
                        sendRoll(this, "attack", "1d20" + (roll_properties["to-hit"] || ""), roll_properties)
                    }, block, {small: true, before: true, image: true, text: action_name});
                    $("#" + id).css({ "float": "", "text-align": "", "margin-top": "15px" });
                }
            }
            if (inject_descriptions)
                injectDiceToRolls(action, this, action_name);
        }

        for (let block of blocks.toArray()) {
            const actions = $(block).find(this._base + "__description-block-content p");
            for (let action of actions.toArray()) {
                //console.log("Found action: ", action);
                const firstChild = action.firstElementChild;
                if (!firstChild) {
                    if (inject_descriptions)
                        injectDiceToRolls(action, this, this._name);
                    continue;
                }
                // Usually <em><strong> || <strong><em> (Orcus is <span><em><strong>);
                let action_name = $(firstChild).find("> :first-child").text().trim();
                handleAction(action_name, action, action);
            }
        }

        // Parse Vehicle (boats) weapons;
        blocks = stat_block.find(this._base + "__component-block");
        for (let block of blocks.toArray()) {
            const action_name = $(block).find(this._base + "__component-block-heading").text();
            const attributes = $(block).find(this._base + "__component-block-content " + this._base + "__attribute-value");
            for (let action of attributes.toArray()) {
                const description = $(action).text();
                // HACK: Skip ship movement to  avoid having a "-5 ft speed per 25 damage taken" inject dice rolls on '-5';
                if (description.match(/-\d+ ft. speed/))
                    continue;
                handleAction(action_name, block, action);
            }
        }

        // Parse Vehicle (boats) weapons (in character extra);
        blocks = stat_block.find(this._base + "-component");
        for (let block of blocks.toArray()) {
            const action_name = $(block).find(this._base + "__section-header").text();
            const actions = $(block).find(this._base + "-component__actions");
            // We can't parse each action separately because the entire block is interactive.;
            handleAction(action_name, block, actions);
        }

        // Parse Vehicle (infernal machines) features;
        blocks = stat_block.find(this._base + "__feature," + this._base + "__features-feature");
        for (let block of blocks.toArray()) {
            let action_name = $(block).find(this._base + "__feature-label").text();
            let action = $(block).find(this._base + "__feature-value");
            if (action_name == "" && action.length == 0) {
                action_name = $(block).find(this._base + "__features-feature-name").text();
                action = $(block).find(this._base + "__features-feature-description");
            }
            handleAction(action_name, block, action);
        }

        // Parse Vehicle (infernal machines) action stations;
        blocks = stat_block.find(this._base + "__action-station-block," + this._base + "-action-station");
        for (let block of blocks.toArray()) {
            let action_name = $(block).find(this._base + "__action-station-block-heading").text();
            let action = $(block).find(this._base + "__action-station-block-content " + this._base + "__attribute-value");
            if (action_name == "" && action.length == 0) {
                action_name = $(block).find(this._base + "-action-station__heading").text();
                action = $(block).find(this._base + "-action-station__action");
            }
            handleAction(action_name, block, action);
        }
    }


    injectSpellRolls(element, url) {
        const icon = chrome.extension.getURL("images/icons/badges/spell20.png");
        const roll_icon = $('<img class="ct-beyond20-spell-icon" x-beyond20-spell-url="' + url + '"></img>');

        $(element).after(roll_icon);

        $(".ct-beyond20-spell-icon").css("margin-right", "3px");
        $(".ct-beyond20-spell-icon").css("margin-left", "3px");
        $(".ct-beyond20-spell-icon").attr("src", icon);
        $(".ct-beyond20-spell-icon").off('click');
        $(".ct-beyond20-spell-icon").on('click', (event) => {
            const spell_url = $(event.currentTarget).attr("x-beyond20-spell-url");
            if (this._spells[spell_url] !== undefined) {
                this._spells[spell_url].display();
            } else {
                //console.log("Fetching Spell Tooltip from URL : ", spell_url);
                $.get(spell_url, (text) => {
                    const spell_json = JSON.parse(text.slice(1, -1));
                    const spell = new Spell($(spell_json.Tooltip), this, "tooltip");
                    spell.display();
                    this._spells[spell_url] = spell;
                });
            }
        });
    }

    lookForSpells(stat_block) {
        const spells = stat_block.find(this._base + "__description-blocks a.spell-tooltip");
        for (let spell of spells.toArray()) {
            const tooltip_href = $(spell).attr("data-tooltip-href");
            const tooltip_url = tooltip_href.replace(/-tooltip.*$/, "/tooltip");
            this.injectSpellRolls(spell, tooltip_url);
        }
    }

    updateInfo() {
        // Creature name could change/be between.includes(customized) calls;
        this._name = this._stat_block.find(this._base + "__name").text().trim();
        let hp = null;
        let max_hp = null;
        let temp_hp = null;
        const groups = $(".ct-creature-pane .ct-collapsible__content .ct-creature-pane__adjuster-group,.ct-creature-pane .ddbc-collapsible__content .ct-creature-pane__adjuster-group");
        for (let item of groups.toArray()) {
            const label = $(item).find(".ct-creature-pane__adjuster-group-label").text();
            if (label == "Current HP") {
                hp = parseInt($(item).find(".ct-creature-pane__adjuster-group-value").text());
            } else if (label == "Max HP") {
                max_hp = parseInt($(item).find(".ct-creature-pane__adjuster-group-value").text());
            } else if (label == "Temp HP") {
                temp_hp = parseInt($(item).find(".ct-creature-pane__adjuster-group-value input").val());
            }
        }
        if (hp !== null && max_hp !== null && (this._hp != hp || this._max_hp != max_hp || this._temp_hp != temp_hp)) {
            this._hp = hp;
            this._max_hp = max_hp;
            this._temp_hp = temp_hp;
            console.log("Monster HP updated to : (" + hp + "+" + temp_hp + ")/" + max_hp);

            if (this.getGlobalSetting("update-hp", true)) {
                const req = { "action": "hp-update", "character": this.getDict() }
                console.log("Sending message: ", req);
                chrome.runtime.sendMessage(req, (resp) => beyond20SendMessageFailure(this, resp));
            }
        }
    }

    getDict() {
        return {
            "name": this._name,
            "avatar": this._avatar,
            "type": this.type(),
            "id": this._id,
            "ac": this._ac,
            "hp": this._hp,
            "hp-formula": this._hp_formula,
            "max-hp": this._max_hp,
            "temp-hp": this._temp_hp,
            "speed": this._speed,
            "abilities": this._abilities,
            "saves": this._saves,
            "skills": this._skills,
            "cr": this._cr,
            "url": this._url
        }
    }
}

class Character extends CharacterBase {
    constructor(global_settings) {
        super("Character", global_settings);
        this._abilities = [];
        this._name = null;
        this._avatar = null;
        this._id = null;
        this._race = null;
        this._level = null;
        this._classes = null;
        this._ac = null;
        this._speed = null;
        this._proficiency = null;
        this._hp = 0;
        this._max_hp = 0;
        this._temp_hp = 0;
        this._class_features = [];
        this._racial_traits = [];
        this._feats = [];
        this._actions = [];
        this._spell_modifiers = {}
        this._spell_attacks = {}
        this._spell_saves = {}
        this._to_hit_cache = {}
        this._conditions = [];
        this._exhaustion = 0;
    }

    updateInfo() {
        this._id = $("#character-sheet-target,#character-tools-target").attr("data-character-id");
        this._url = window.location.href;

        if (this._settings === null)
            this.updateSettings();

        // Static values that need an edit to change;
        if (this._name === null) {
            this._name = $(".ddbc-character-name").text();
            // This can happen when you reload the page;
            if (this._name == "")
                this._name = null;
        }
        if (this._avatar === null) {
            const avatar = $(".ddbc-character-avatar__portrait").css('background-image');
            if (avatar && avatar.startsWith("url("))
                this._avatar = avatar.slice(5, -2);
        }
        if (this._race === null) {
            this._race = $(".ddbc-character-summary__race").text();
            if (this._race == "")
                this._race = null;
        }
        if (this._classes === null) {
            const jClasses = $(".ddbc-character-summary__classes");
            if (jClasses.length > 0) {
                const classes = jClasses.text().split(" / ");
                this._classes = {}
                for (let class_ of classes) {
                    const parts = class_.split(" ");
                    const name = parts.slice(0, -1).join(" ");
                    const level = parts.slice(-1)[0];
                    this._classes[name] = level;
                }
            }
        }
        if (this._level === null) {
            const level = $(".ddbc-character-progression-summary__level");
            const xp = $(".ddbc-character-progression-summary__xp-bar .ddbc-xp-bar__item--cur .ddbc-xp-bar__label");
            if (level.length > 0) {
                this._level = level.text().replace("Level ", "");
            } else if (xp.length > 0) {
                this._level = xp.text().replace("LVL ", "").trim();
                if (this._level === "19") {
                    // With XP progress, a level 20 will have their XP bar from 19 to 20 with progression full, since it can't show 20->21
                    const xp_data = $(".ddbc-character-progression-summary__xp-bar .ddbc-character-progression-summary__xp-data").text();
                    if (xp_data === "355,000 / 355,000 XP") {
                        this._level = "20";
                    }
                }
            }
        }
        if (this._proficiency === null) {
            this._proficiency = $(".ct-proficiency-bonus-box__value,.ddbc-proficiency-bonus-box__value").text();
            if (this._proficiency == "") {
                this._proficiency = $(".ct-combat-mobile__extra--proficiency .ct-combat-mobile__extra-value,.ddbc-combat-mobile__extra--proficiency .ddbc-combat-mobile__extra-value").text();
                if (this._proficiency == "")
                    this._proficiency = null;
            }
        }
        if (Object.keys(this._to_hit_cache).length == 0) {
            const items = $(".ct-combat-attack--item .ct-item-name,.ddbc-combat-attack--item .ddbc-item-name");
            for (let item of items.toArray()) {
                const item_name = item.textContent;
                const to_hit = findToHit(item_name, ".ct-combat-attack--item,.ddbc-combat-attack--item", ".ct-item-name,.ddbc-item-name", ".ct-combat-attack__tohit,.ddbc-combat-attack__tohit");
                //console.log("Caching to hit for ", item_name, " : ", to_hit);
                this._to_hit_cache[item_name] = to_hit;
            }
        }
        // Values that could change/get overriden dynamically;
        let ac = $(".ct-armor-class-box__value,.ddbc-armor-class-box__value").text();
        if (ac == "")
            ac = $(".ct-combat-mobile__extra--ac .ct-combat-mobile__extra-value,.ddbc-combat-mobile__extra--ac .ddbc-combat-mobile__extra-value").text();
        if (ac != "")
            this._ac = ac;
        let speed = $(".ct-speed-box__box-value .ct-distance-number__number,.ddbc-speed-box__box-value .ddbc-distance-number__number").text();
        if (speed == "")
            speed = $(".ct-combat-mobile__extra--speed .ct-combat-mobile__extra-value .ct-distance-number__number,.ddbc-combat-mobile__extra--speed .ddbc-combat-mobile__extra-value .ddbc-distance-number__number").text();
        if (speed != "")
            this._speed = speed;
        let abilities = $(".ct-quick-info__ability,.ddbc-quick-info__ability");
        if (abilities.length == 0)
            abilities = $(".ct-main-mobile__ability,.ddbc-main-mobile__ability");
        if (abilities.length == 0)
            abilities = $(".ct-main-tablet__ability,.ddbc-main-tablet__ability");

        if (abilities.length > 0)
            this._abilities = [];
        for (let ability of abilities.toArray()) {
            const name = $(ability).find(".ct-ability-summary__heading .ct-ability-summary__label,.ddbc-ability-summary__heading .ddbc-ability-summary__label").text();
            const abbr = $(ability).find(".ct-ability-summary__heading .ct-ability-summary__abbr,.ddbc-ability-summary__heading .ddbc-ability-summary__abbr").text().toUpperCase();
            let modifier = $(ability).find(".ct-ability-summary__primary .ct-signed-number,.ddbc-ability-summary__primary .ddbc-signed-number").text();
            let value = $(ability).find(".ct-ability-summary__secondary,.ddbc-ability-summary__secondary").text();
            if (modifier == "") {
                modifier = $(ability).find(".ct-ability-summary__secondary .ct-signed-number,.ddbc-ability-summary__secondary .ddbc-signed-number").text();
                value = $(ability).find(".ct-ability-summary__primary,.ddbc-ability-summary__primary").text();
            }
            this._abilities.push([name, abbr, value, modifier]);
        }
        if (this._settings) {
            this.updateHP();
            this.updateFeatures();
        }
    }

    updateHP() {
        const health_pane = $(".ct-health-manager");
        let hp = null;
        let max_hp = null;
        let temp_hp = null;
        if (health_pane.length > 0) {
            hp = parseInt(health_pane.find(".ct-health-manager__health-item--cur .ct-health-manager__health-item-value").text());
            max_hp = parseInt(health_pane.find(".ct-health-manager__health-item--max .ct-health-manager__health-item-value .ct-health-manager__health-max-current").text());
            temp_hp = parseInt(health_pane.find(".ct-health-manager__health-item--temp .ct-health-manager__health-item-value input").val());
        } else {
            const hp_items = $(".ct-health-summary__hp-group--primary .ct-health-summary__hp-item");
            for (let item of hp_items.toArray()) {
                const label = $(item).find(".ct-health-summary__hp-item-label").text();
                if (label == "Current") {
                    // Make sure it's !an input being modified;
                    const number = $(item).find(".ct-health-summary__hp-item-content .ct-health-summary__hp-number");
                    if (number.length > 0)
                        hp = parseInt(number.text());
                } else if (label == "Max") {
                    max_hp = parseInt($(item).find(".ct-health-summary__hp-item-content .ct-health-summary__hp-number").text());
                }
            }
            const temp_item = $(".ct-health-summary__hp-group--temp .ct-health-summary__hp-item--temp .ct-health-summary__hp-item-content");
            if (temp_item.length > 0) {
                // Can be hp-empty class instead;
                temp_hp = parseInt(temp_item.find(".ct-health-summary__hp-number").text()) || 0;
            } else {
                temp_hp = this._temp_hp;
            }

            const mobile_hp = $(".ct-status-summary-mobile__hp-current");
            if (mobile_hp.length > 0) {
                hp = parseInt(mobile_hp.text());
                max_hp = parseInt($(".ct-status-summary-mobile__hp-max").text());
                const has_temp = $(".ct-status-summary-mobile__hp.ct-status-summary-mobile__hp--has-temp");
                if (has_temp.length > 0)
                    temp_hp = this._temp_hp;
                else
                    temp_hp = 0;
                hp = hp - temp_hp;
            }
            if ($(".ct-status-summary-mobile__deathsaves-group").length > 0 ||
                $(".ct-health-summary__deathsaves").length > 0) {
                // if (we find death saving section, then it means the HP is 0;
                hp = 0;
                temp_hp = 0;
                max_hp = this._max_hp;
            }
        }
        if (hp !== null && max_hp !== null && (this._hp != hp || this._max_hp != max_hp || this._temp_hp != temp_hp)) {
            this._hp = hp;
            this._max_hp = max_hp;
            this._temp_hp = temp_hp;
            console.log("HP updated to : (" + hp + "+" + temp_hp + ")/" + max_hp);

            if (this.getGlobalSetting("update-hp", true)) {
                const req = { "action": "hp-update", "character": this.getDict() }
                console.log("Sending message: ", req);
                chrome.runtime.sendMessage(req, (resp) => beyond20SendMessageFailure(this, resp));
            }
        }
    }

    updateConditions(conditions = null, exhaustion_level = null) {
        if (conditions === null)
            conditions = this.getSetting("conditions", []);
        if (exhaustion_level === null)
            exhaustion_level = this.getSetting("exhaustion-level", 0);

        this._conditions = conditions;
        this._exhaustion = exhaustion_level;
        //console.log("Updating conditions to : ", conditions, exhaustion_level);
        if (this._settings &&
            (!isListEqual(this._conditions, this.getSetting("conditions", [])) ||
                this._exhaustion != this.getSetting("exhaustion-level", 0))) {
            this.mergeCharacterSettings({
                "conditions": this._conditions,
                "exhaustion-level": this._exhaustion
            }, () => {
                const req = { "action": "conditions-update", "character": this.getDict() }
                console.log("Sending message: ", req);
                chrome.runtime.sendMessage(req, (resp) => beyond20SendMessageFailure(this, resp));
            });
        }
    }

    featureDetailsToList(selector, name) {
        const features = $(selector).find(".ct-feature-snippet > .ct-feature-snippet__heading");
        const feature_list = [];
        for (let feat of features.toArray()) {
            const feat_name = feat.childNodes[0].textContent.trim();
            feature_list.push(feat_name);
            const options = $(feat).parent().find(".ct-feature-snippet__option > .ct-feature-snippet__heading");
            for (let option of options.toArray()) {
                const option_name = option.childNodes[0].textContent.trim();
                feature_list.push(feat_name + ": " + option_name);
            }
        }

        //console.log(name, feature_list);
        return feature_list;
    }

    updateFeatures() {
        let update = false;
        // Use classes instead of level because using XP method, you could reach the higher level before you level up
        const last_classes = this.getSetting("last-features-classes", "");
        const current_classes = $(".ddbc-character-summary__classes").text();
        let updated_features_list = false;
        const class_detail = $(".ct-features .ct-classes-detail");
        if (class_detail.length > 0) {
            updated_features_list = true;
            this._class_features = this.featureDetailsToList(class_detail, "Class Features");
            if (!isListEqual(this._class_features, this.getSetting("class-features", []))) {
                console.log("New class feature");
                update = true;
            }
        } else {
            this._class_features = this.getSetting("class-features", []);
        }

        const race_detail = $(".ct-features .ct-race-detail");
        if (race_detail.length > 0) {
            this._racial_traits = this.featureDetailsToList(race_detail, "Racial Traits");
            if (!isListEqual(this._racial_traits, this.getSetting("racial-traits", []))) {
                console.log("New race feature");
                update = true;
            }
        } else {
            this._racial_traits = this.getSetting("racial-traits", []);
        }

        const feats_detail = $(".ct-features .ct-feats-detail");
        if (feats_detail.length > 0) {
            this._feats = this.featureDetailsToList(feats_detail, "Feats");
            if (!isListEqual(this._feats, this.getSetting("feats", []))) {
                console.log("New Feats");
                update = true;
            }
        } else {
            this._feats = this.getSetting("feats", []);
        }

        const actions_detail = $(".ct-actions-list .ct-actions-list__activatable");
        if (actions_detail.length > 0) {
            this._actions = this.featureDetailsToList(actions_detail, "Actions");
            if (!isListEqual(this._actions, this.getSetting("actions", []))) {
                console.log("New Actions");
                update = true;
            }
        } else if (this.getSetting("actions", null)) {
            this._actions = this.getSetting("actions", []);
        }

        // Spell modifier, Spell attack && spell save DC;
        const spell_info_groups = $(".ct-spells-level-casting__info-group,.ddbc-spells-level-casting__info-group");
        if (spell_info_groups.length > 0) {
            this._spell_modifiers = {}
            this._spell_attacks = {}
            this._spell_saves = {}
            for (let group of spell_info_groups.toArray()) {
                const label = $(group).find(".ct-spells-level-casting__info-label,.ddbc-spells-level-casting__info-label");
                const items = $(group).find(".ct-spells-level-casting__info-item,.ddbc-spells-level-casting__info-item");
                let obj = null;
                if (label.text() == "Modifier") {
                    obj = this._spell_modifiers;
                } else if (label.text() == "Spell Attack") {
                    obj = this._spell_attacks;
                } else if (label.text() == "Save DC") {
                    obj = this._spell_saves;
                }
                if (obj === null)
                    continue;
                for (let item of items.toArray()) {
                    const modifier = item.textContent;
                    const char_classes = item.getAttribute("data-original-title").split(",");
                    for (let char_class of char_classes)
                        obj[char_class.trim()] = modifier;
                }
            }
            if (!isObjectEqual(this._spell_modifiers, this.getSetting("spell_modifiers", {})) ||
                !isObjectEqual(this._spell_attacks, this.getSetting("spell_attacks", {})) ||
                !isObjectEqual(this._spell_saves, this.getSetting("spell_saves", {}))) {
                console.log("New Spell information");
                update = true;
            }
        } else {
            this._spell_modifiers = this.getSetting("spell_modifiers", {});
            this._spell_saves = this.getSetting("spell_saves", {});
            this._spell_attacks = this.getSetting("spell_attacks", {});
        }
        if (updated_features_list && last_classes !== current_classes) {
            update = true;
        }
        this._features_needs_refresh = current_classes && !updated_features_list && last_classes !== current_classes;

        if (this._settings && update) {
            this.mergeCharacterSettings({
                "class-features": this._class_features,
                "racial-traits": this._racial_traits,
                "feats": this._feats,
                "actions": this._actions,
                "spell_modifiers": this._spell_modifiers,
                "spell_saves": this._spell_saves,
                "spell_attacks": this._spell_attacks,
                "last-features-classes": updated_features_list ? current_classes : last_classes
            });
        }
    }

    hasClassFeature(name) {
        return this._class_features.includes(name);
    }
    hasRacialTrait(name) {
        return this._racial_traits.includes(name);
    }
    hasFeat(name) {
        return this._feats.includes(name);
    }
    hasAction(name) {
        return this._actions.includes(name);
    }
    getClassLevel(name) {
        return this._classes[name] || 0;
    }
    hasClass(name) {
        return this._classes[name] !== undefined;
    }
    getAbility(abbr) {
        const ability = this._abilities.find(abi => abi[1] === abbr);
        if (!ability) return {score: 0, mod: 0};
        return {score: parseInt(ability[2]), mod: parseInt(ability[3])}
    }

    _cacheToHit(item_name, to_hit) {
        this._to_hit_cache[item_name] = to_hit;
    }

    _getToHitCache(item_name) {
        return this._to_hit_cache[item_name] || null;
    }

    mergeCharacterSettings(data, callback = null) {
        const cb = (settings) => {
            this.updateSettings(settings);
            chrome.runtime.sendMessage({
                "action": "settings",
                "type": "character",
                "id": this._id,
                "settings": settings
            });
            if (callback)
                callback(settings);
        }
        mergeSettings(data, cb, "character-" + this._id, character_settings);
    }

    updateSettings(new_settings = null) {
        if (new_settings) {
            this._settings = new_settings;
        } else {
            getStoredSettings((saved_settings) => {
                this.updateSettings(saved_settings);
                this.updateHP();
                this.updateFeatures();
                this.updateConditions();
            }, "character-" + this._id, character_settings);
        }
    }

    getDict() {
        const settings = {}
        // Make a copy of the settings but without the features since they are;
        // the.includes(already) dict;
        for (let key in this._settings) {
            if (!["class-features", "racial-traits", "feats", "actions",
                "spell_modifiers", "spell_saves", "spell_attacks",
                "conditions", "exhaustion-level"].includes(key))
                settings[key] = this._settings[key];
        }
        return {
            "name": this._name,
            "avatar": this._avatar,
            "id": this._id,
            "type": this.type(),
            "abilities": this._abilities,
            "classes": this._classes,
            "level": this._level,
            "race": this._race,
            "ac": this._ac,
            "proficiency": this._proficiency,
            "speed": this._speed,
            "hp": this._hp,
            "max-hp": this._max_hp,
            "temp-hp": this._temp_hp,
            "exhaustion": this._exhaustion,
            "conditions": this._conditions,
            "settings": settings,
            "class-features": this._class_features,
            "racial-traits": this._racial_traits,
            "feats": this._feats,
            "actions": this._actions,
            "spell_modifiers": this._spell_modifiers,
            "spell_saves": this._spell_saves,
            "spell_attacks": this._spell_attacks,
            "url": this._url
        }
    }
}

console.log("Beyond20: D&D Beyond module loaded.");

function sendRollWithCharacter(rollType, fallback, args) {
    const preview = $(".ct-sidebar__header-preview > div").css('background-image');
    if (preview && preview.startsWith("url("))
        args.preview = preview.slice(5, -2);
    // Add halfling luck
    if (character.hasRacialTrait("Lucky") && ["skill", "ability", "saving-throw", "death-save",
        "initiative", "attack", "spell-attack"].includes(rollType)) {
        args.d20 = args.d20 || "1d20";
        args.d20 += "ro<=1";
    }
    sendRoll(character, rollType, fallback, args);
}


async function rollSkillCheck(paneClass) {
    const skill_name = $("." + paneClass + "__header-name").text();
    let ability = $("." + paneClass + "__header-ability").text();
    let modifier = $("." + paneClass + "__header-modifier").text();
    const proficiency = $("." + paneClass + "__header-icon .ct-tooltip,." + paneClass + "__header-icon .ddbc-tooltip").attr("data-original-title");

    
    if (ability == "--" && character._abilities.length > 0) {
        let prof = "";
        let prof_val = "";
        if (proficiency == "Proficiency") {
            prof = "proficiency";
            prof_val = parseInt(character._proficiency);
        } else if (proficiency == "Half Proficiency") {
            prof = "half_proficiency";
            prof_val += Math.floor(character._proficiency / 2);
        } else if (proficiency == "Expertise") {
            prof = "expertise";
            prof_val += character._proficiency * 2;
        }
        const formula = "1d20 + @ability " + (prof != "" ? " + @" + prof : "") + " + @custom_dice";
        let html = '<form>';
        html += '<div class="beyond20-form-row"><label>Roll Formula</label><input type="text" value="' + formula + '" disabled></div>';
        html += '<div class="beyond20-form-row"><label>Select Ability</label><select name="ability">';
        const modifiers = {};
        for (let ability of character._abilities) {
            html += '<option value="' + ability[1] + '">' + ability[0] + '</option>';
            modifiers[ability[1]] = ability[3];
        }
        html += "</select></div>";
        html += '</form>';
        html = await dndbeyondDiceRoller._prompter.prompt("Custom Skill", html, skill_name);
        if (html) {
            ability = html.find('[name="ability"]').val();
            let mod = parseInt(modifiers[ability]);
            if (prof_val)
                mod += prof_val;
            // In case of magical bonus
            if (modifier != "--" && modifier != "+0")
                mod += parseInt(modifier);
            modifier = mod >= 0 ? `+${mod}` : `-${mod}`;
        }
    }
    //console.log("Skill " + skill_name + "(" + ability + ") : " + modifier);
    const roll_properties = {
        "skill": skill_name,
        "ability": ability,
        "modifier": modifier,
        "proficiency": proficiency
    }
    if(character.getGlobalSetting("roll-type", RollType.NORMAL) != RollType.QUERY) {
        const skill_badge_adv = $("." + paneClass + "__dice-adjustments .ddbc-advantage-icon").length > 0;
        const skill_badge_disadv = $("." + paneClass + "__dice-adjustments .ddbc-disadvantage-icon").length > 0;

        if (skill_badge_adv && skill_badge_disadv) {
            roll_properties["advantage"] = RollType.QUERY;
        } else if (skill_badge_adv) {
            roll_properties["advantage"] = RollType.OVERRIDE_ADVANTAGE;
        } else if (skill_badge_disadv) {
            roll_properties["advantage"] = RollType.OVERRIDE_DISADVANTAGE;
        }
    }
    if (ability == "STR" &&
        ((character.hasClassFeature("Rage") && character.getSetting("barbarian-rage", false)) ||
            (character.hasClassFeature("Giant Might") && character.getSetting("fighter-giant-might", false)))) {
        roll_properties["advantage"] = RollType.OVERRIDE_ADVANTAGE;
    }
    if (skill_name == "Acrobatics" && character.hasClassFeature("Bladesong") && character.getSetting("wizard-bladesong", false)) {
        roll_properties["advantage"] = RollType.OVERRIDE_ADVANTAGE;
    }
    roll_properties.d20 = "1d20";
    // Set Reliable Talent flag if character has the feature and skill is proficient/expertise
    if (character.hasClassFeature("Reliable Talent") && ["Proficiency", "Expertise"].includes(proficiency))
        roll_properties.d20 = "1d20min10";
    // Set Silver Tongue if Deception or Persuasion
    if (character.hasClassFeature("Silver Tongue") && (skill_name === "Deception" || skill_name === "Persuasion"))
        roll_properties.d20 = "1d20min10";
    
    if (character.hasClassFeature("Indomitable Might") && ability == "STR") {
        const min = character.getAbility("STR").score - parseInt(modifier);
        // Check against reliable talent or silver tongue (should be an impossible state)
        const min10 = roll_properties.d20 === "1d20min10";
        if (min10 && min > 10) {
            roll_properties.d20 = `1d20min${min}`
        } else if (!min10) {
            roll_properties.d20 = `1d20min${min}`
        }
    }
    sendRollWithCharacter("skill", "1d20" + modifier, roll_properties);
}

function rollAbilityOrSavingThrow(paneClass, rollType) {
    const ability_string = $("." + paneClass + " .ct-sidebar__heading").text();
    const ability_name = ability_string.split(" ")[0];
    const ability = ability_abbreviations[ability_name];
    let modifier = $("." + paneClass + "__modifier .ct-signed-number,." + paneClass + "__modifier .ddbc-signed-number").text();

    if (rollType == "ability") {
        // Remarkable Athelete and Jack of All Trades don't stack, we give priority to RA instead of JoaT because
        // it's rounded up instead of rounded down.
        if (character.hasClassFeature("Remarkable Athlete") && character.getSetting("champion-remarkable-athlete", false) &&
            ["STR","DEX", "CON"].includes(ability)) {
            const remarkable_athlete_mod = Math.ceil(character._proficiency / 2);
            modifier = parseInt(modifier) + remarkable_athlete_mod;
            modifier = modifier >= 0 ? `+${modifier}` : `-${modifier}`;
        } else if (character.hasClassFeature("Jack of All Trades") && character.getSetting("bard-joat", false)) {
            const JoaT = Math.floor(character._proficiency / 2);
            modifier = parseInt(modifier) + JoaT;
            modifier = modifier >= 0 ? `+${modifier}` : `-${modifier}`;
        }
    }

    const roll_properties = {
        "name": ability_name,
        "ability": ability,
        "modifier": modifier
    }

    if (ability == "STR" &&
        ((character.hasClassFeature("Rage") && character.getSetting("barbarian-rage", false)) ||
            (character.hasClassFeature("Giant Might") && character.getSetting("fighter-giant-might", false)))) {
        roll_properties["advantage"] = RollType.OVERRIDE_ADVANTAGE;
    }
    if (character.hasClassFeature("Indomitable Might") && ability == "STR") {
        const min = character.getAbility("STR").score - parseInt(modifier);
        roll_properties.d20 = `1d20min${min}`
    }
    sendRollWithCharacter(rollType, "1d20" + modifier, roll_properties);
}

function rollAbilityCheck() {
    rollAbilityOrSavingThrow("ct-ability-pane", "ability");
}

function rollSavingThrow() {
    rollAbilityOrSavingThrow("ct-ability-saving-throws-pane", "saving-throw");
}

function rollInitiative() {
    let initiative = $(".ct-initiative-box__value").text();
    let advantage = $(".ct-initiative-box__advantage").length > 0;
    if (initiative == "") {
        initiative = $(".ct-combat-mobile__extra--initiative .ct-combat-mobile__extra-value").text();
        advantage = $(".ct-combat-mobile__advantage").length > 0;
    }
    //console.log("Initiative " + ("with" if (advantage else "without") + " advantage ) { " + initiative);

    if (character.getGlobalSetting("initiative-tiebreaker", false)) {
        // Set the tiebreaker to the dexterity score but default to case.includes(0) abilities arrary is empty;
        const tiebreaker = character.getAbility("DEX").score;

        // Add tiebreaker as a decimal;
        initiative = parseFloat(initiative) + parseFloat(tiebreaker) / 100;

        // Render initiative as a string that begins with '+' || '-';
        initiative = initiative >= 0 ? '+' + initiative.toFixed(2) : initiative.toFixed(2);
    }

    const roll_properties = { "initiative": initiative }
    if (advantage)
        roll_properties["advantage"] = RollType.OVERRIDE_ADVANTAGE;
    sendRollWithCharacter("initiative", "1d20" + initiative, roll_properties);
}


function rollHitDie(multiclass, index) {
    //console.log("Rolling hit die index " + index);
    const hitdie = $(".ct-reset-pane__hitdie").eq(index);
    const class_name = hitdie.find(".ct-reset-pane__hitdie-heading-class").text();
    const text = hitdie.find(".ct-reset-pane__hitdie-heading").text();
    const die = text.split("Hit Die: ")[1].split(" ")[0];
    sendRollWithCharacter("hit-dice", die, {
        "class": class_name,
        "multiclass": multiclass,
        "hit-dice": die
    });
}

function rollItem(force_display = false, force_to_hit_only = false, force_damages_only = false) {
    const prop_list = $(".ct-item-pane .ct-property-list .ct-property-list__property,.ct-item-pane .ddbc-property-list .ddbc-property-list__property");
    const properties = propertyListToDict(prop_list);
    properties["Properties"] = properties["Properties"] || "";
    //console.log("Properties are : " + String(properties));
    const item_name = $(".ct-item-pane .ct-sidebar__heading .ct-item-name,.ct-item-pane .ct-sidebar__heading .ddbc-item-name")[0].firstChild.textContent;
    const item_type = $(".ct-item-detail__intro").text();
    const item_tags = $(".ct-item-detail__tags-list .ct-item-detail__tag").toArray().map(elem => elem.textContent);
    const source = item_type.trim().toLowerCase();
    const is_tool = source === "tool, common" || (source === "gear, common" && item_name.endsWith("Tools"));
    const is_instrument =  item_tags.includes("Instrument");
    const description = descriptionToString(".ct-item-detail__description");
    if (!force_display && Object.keys(properties).includes("Damage")) {
        const item_full_name = $(".ct-item-pane .ct-sidebar__heading .ct-item-name,.ct-item-pane .ct-sidebar__heading .ddbc-item-name").text();
        let to_hit = properties["To Hit"] !== undefined && properties["To Hit"] !== "--" ? properties["To Hit"] : null;

        if (to_hit === null)
            to_hit = findToHit(item_full_name, ".ct-combat-attack--item,.ddbc-combat-attack--item", ".ct-item-name,.ddbc-item-name", ".ct-combat-attack__tohit,.ddbc-combat-attack__tohit");

        if (to_hit !== null)
            character._cacheToHit(item_full_name, to_hit);
        else
            to_hit = character._getToHitCache(item_full_name);

        const damages = [];
        const damage_types = [];
        for (let i = 0; i < prop_list.length; i++) {
            if (prop_list.eq(i).find(".ct-property-list__property-label,.ddbc-property-list__property-label").text() == "Damage:") {
                const value = prop_list.eq(i).find(".ct-property-list__property-content,.ddbc-property-list__property-content");
                let damage = value.find(".ct-damage__value,.ddbc-damage__value").text();
                let damage_type = properties["Damage Type"] || "";
                let versatile_damage = value.find(".ct-item-detail__versatile-damage,.ddbc-item-detail__versatile-damage").text().slice(1, -1);
                if (damages.length == 0 &&
                    character.hasClassFeature("Fighting Style: Great Weapon Fighting") &&
                    properties["Attack Type"] == "Melee" &&
                    (properties["Properties"].includes("Versatile") || properties["Properties"].includes("Two-Handed"))) {
                    if (versatile_damage != "") {
                        versatile_damage = versatile_damage.replace(/[0-9]*d[0-9]+/g, "$&ro<=2");
                    } else {
                        damage = damage.replace(/[0-9]*d[0-9]+/g, "$&ro<=2");
                    }
                }
                if (character.hasClass("Ranger") &&
                    character.hasClassFeature("Planar Warrior") &&
                    character.getSetting("ranger-planar-warrior", false))
                    damage_type = "Force";

                if (versatile_damage != "") {
                    const versatile_choice = character.getSetting("versatile-choice", "both");
                    if (versatile_choice == "one") {
                        damages.push(damage);
                        damage_types.push(damage_type);
                    } else if (versatile_choice == "two") {
                        damages.push(versatile_damage);
                        damage_types.push(damage_type);
                    } else {
                        damages.push(damage);
                        damage_types.push(damage_type + "(One-Handed)");
                        damages.push(versatile_damage);
                        damage_types.push(damage_type + "(Two-Handed)");
                    }
                } else {
                    damages.push(damage);
                    damage_types.push(damage_type);
                }
                const additional_damages = value.find(".ct-item-detail__additional-damage,.ddbc-item-detail__additional-damage");
                for (let j = 0; j < additional_damages.length; j++) {
                    let dmg = additional_damages.eq(j).text();
                    let dmg_type = additional_damages.eq(j).find(".ct-damage-type-icon .ct-tooltip,.ddbc-damage-type-icon .ddbc-tooltip").attr("data-original-title");
                    const dmg_info = additional_damages.eq(j).find(".ct-item-detail__additional-damage-info,.ddbc-item-detail__additional-damage-info").text();
                    if (dmg != "") {
                        dmg = dmg.replace(dmg_info, "");
                        if (dmg_info != "")
                            dmg_type += "(" + dmg_info + ")";

                        if (character.hasClassFeature("Fighting Style: Great Weapon Fighting") &&
                            properties["Attack Type"] == "Melee" &&
                            (properties["Properties"].includes("Two-Handed") ||
                                (properties["Properties"].includes("Versatile") && character.getSetting("versatile-choice", "both") === "two")))
                            dmg = dmg.replace(/[0-9]*d[0-9]+/g, "$&ro<=2");
                        damages.push(dmg);
                        damage_types.push(dmg_type);
                    }
                }
                break;
            }
        }

        const custom_damages = character.getSetting("custom-damage-dice", "");
        if (custom_damages.length > 0) {
            for (let custom_damage of custom_damages.split(",")) {
                if (custom_damage.includes(":")) {
                    const parts = custom_damage.split(":", 2);
                    damages.push(parts[1].trim());
                    damage_types.push(parts[0].trim());
                } else {
                    damages.push(custom_damage.trim());
                    damage_types.push("Custom");
                }
            }
        }
        if (character.hasClass("Rogue") &&
            character.getSetting("rogue-sneak-attack", false) &&
            (properties["Attack Type"] == "Ranged" ||
                properties["Properties"].includes("Finesse"))) {
            const sneak_attack = Math.ceil(character._classes["Rogue"] / 2) + "d6";
            damages.push(sneak_attack);
            damage_types.push("Sneak Attack");
        }
        if (character.hasClassFeature("Rage") &&
            character.getSetting("barbarian-rage", false) &&
            properties["Attack Type"] == "Melee") {
            const barbarian_level = character.getClassLevel("Barbarian");
            const rage_damage = barbarian_level < 9 ? 2 : (barbarian_level < 16 ? 3 : 4);
            damages.push(String(rage_damage));
            damage_types.push("Rage");
        }
        if (character.hasClassFeature("Rage") && character.getSetting("barbarian-rage", false) &&
            character.getSetting("barbarian-divine-fury", true) && character.hasClassFeature("Divine Fury") &&
            properties["Attack Type"] == "Melee") {
            const barbarian_level = character.getClassLevel("Barbarian");
            damages.push(`1d6+${Math.floor(barbarian_level / 2)}`);
            damage_types.push("Divine Fury");
        }
        if (to_hit !== null && 
            character.getSetting("sharpshooter", false) &&
            properties["Attack Type"] == "Ranged" &&
            properties["Proficient"] == "Yes") {
            to_hit += " - 5";
            damages.push("10");
            damage_types.push("Sharpshooter");
            character.mergeCharacterSettings({ "sharpshooter": false });
        }
        if (to_hit !== null && 
            character.getSetting("great-weapon-master", false) &&
            properties["Attack Type"] == "Melee" &&
            properties["Properties"].includes("Heavy") &&
            properties["Proficient"] == "Yes") {
            to_hit += " - 5";
            damages.push("10");
            damage_types.push("Weapon Master");
            character.mergeCharacterSettings({ "great-weapon-master": false });
        }
        if (character.getSetting("bloodhunter-crimson-rite", false) &&
            character.hasClassFeature("Crimson Rite")) {
            const bloodhunter_level = character.getClassLevel("Blood Hunter");
            if (bloodhunter_level > 0) {
                let rite_die = "1d4";
                if (bloodhunter_level <= 4)
                    rite_die = "1d4";
                else if (bloodhunter_level <= 10)
                    rite_die = "1d6";
                else if (bloodhunter_level <= 16)
                    rite_die = "1d8";
                else
                    rite_die = "1d10";
                damages.push(rite_die);
                damage_types.push("Crimson Rite");
            }
        }

        //Ranger abilities;
        if (character.hasClass("Ranger")) {
            if (character.getSetting("ranger-dread-ambusher", false)) {
                damages.push("1d8");
                damage_types.push("Ambush");
                character.mergeCharacterSettings({ "ranger-dread-ambusher": false });
            }
            if (character.hasClassFeature("Hunter’s Prey: Colossus Slayer")) {
                damages.push("1d8");
                damage_types.push("Colossus Slayer");
            }
            if (character.hasClassFeature("Slayer’s Prey") &&
                character.getSetting("ranger-slayers-prey", false)) {
                damages.push("1d6");
                damage_types.push("Slayer’s Prey");
            }
            if (character.hasClassFeature("Planar Warrior") &&
                character.getSetting("ranger-planar-warrior", false)) {
                const ranger_level = character.getClassLevel("Ranger");
                damages.push(ranger_level < 11 ? "1d8" : "2d8");
                damage_types.push("Planar Warrior");
            }
            if (character.hasClassFeature("Gathered Swarm") &&
                character.getSetting("ranger-gathered-swarm", false)) {
                const ranger_level = character.getClassLevel("Ranger");
                damages.push(ranger_level < 11 ? "1d6" : "2d6");
                damage_types.push("Gathered Swarm");
            }
        }

        // FIXME: UA content, Ranger Fey Wanderer Feature, may need to be removed or corrected later
        if (character.hasClassFeature("Dreadful Strikes") && character.getSetting("fey-wanderer-dreadful-strikes")) {
            damages.push("1d6");
            damage_types.push("Dreadful Strikes");
        }

        if (properties["Attack Type"] == "Melee" &&
            character.hasClassFeature("Improved Divine Smite") &&
            character.getSetting("paladin-improved-divine-smite", true)) {
            damages.push("1d8");
            damage_types.push("Radiant");
        }
        if (damages.length > 0 &&
            character.getSetting("warlock-hexblade-curse", false) &&
            character.hasClassFeature("Hexblade’s Curse") &&
            character._proficiency !== null) {
            damages.push(character._proficiency);
            damage_types.push("Hexblade's Curse");
        }
        // Fighter's Giant Might;
        if (character.hasClassFeature("Giant Might") && character.getSetting("fighter-giant-might", false)) {
            const fighter_level = character.getClassLevel("Fighter");
            damages.push(fighter_level < 10 ? "1d6" : "1d8");
            damage_types.push("Giant Might");
        }
        // Cleric's Divine Strike;
        if (character.hasClassFeature("Divine Strike") &&
            character.getSetting("cleric-divine-strike", true)) {
            const cleric_level = character.getClassLevel("Cleric");
            damages.push(cleric_level < 14 ? "1d8" : "2d8");
            damage_types.push("Divine Strike");
        }
        // Bard's Psychic blades;
        if (character.hasClassFeature("Psychic Blades") &&
            character.getSetting("bard-psychic-blades", false)) {
            const bard_level = character.getClassLevel("Bard");
            let blades_dmg = "2d6";
            if (bard_level < 5)
                blades_dmg = "2d6"
            else if (bard_level < 10)
                blades_dmg = "3d6"
            else if (bard_level < 15)
                blades_dmg = "5d6"
            else
                blades_dmg = "8d6"
            damages.push(blades_dmg);
            damage_types.push("Psychic");
            character.mergeCharacterSettings({ "bard-psychic-blades": false });
        }
        //Protector Aasimar: Radiant Soul Damage
        if (character.hasRacialTrait("Radiant Soul") &&
            character.getSetting("protector-aasimar-radiant-soul", false)) {
            damages.push(character._level);
            damage_types.push("Radiant Soul");
        }

        // Wizard Bladesong
        if (character.hasClassFeature("Song of Victory") && character.getSetting("wizard-bladesong", false)) {
            const intelligence = character.getAbility("INT") || {mod: 0};
            const mod = parseInt(intelligence.mod) || 0;
            damages.push(String(Math.max(mod, 1)));
            damage_types.push("Bladesong");
        }

        let critical_limit = 20;
        if (character.hasAction("Channel Divinity: Legendary Strike") &&
            character.getSetting("paladin-legendary-strike", false))
            critical_limit = 19;
        if (character.hasClassFeature("Hexblade’s Curse") &&
            character.getSetting("warlock-hexblade-curse", false))
            critical_limit = 19;
        if (character.hasClassFeature("Improved Critical"))
            critical_limit = 19;
        if (character.hasClassFeature("Invincible Conqueror") &&
            character.getSetting("paladin-invincible-conqueror", false))
            critical_limit = 19;
        if (character.hasClassFeature("Superior Critical"))
            critical_limit = 18;

        let brutal = 0;
        if (properties["Attack Type"] == "Melee") {
            if (character.getSetting("brutal-critical")) {
                if (character.hasClassFeature("Brutal Critical")) {
                    const barbarian_level = character.getClassLevel("Barbarian");
                    brutal += 1 + Math.floor((barbarian_level - 9) / 4);
                }
                if (character.hasRacialTrait("Savage Attacks"))
                    brutal += 1;
            }
        }
        const roll_properties = buildAttackRoll(character,
            "item",
            item_name,
            description,
            properties,
            damages,
            damage_types,
            to_hit,
            brutal,
            force_to_hit_only,
            force_damages_only);
        roll_properties["item-type"] = item_type;
        if (critical_limit != 20)
            roll_properties["critical-limit"] = critical_limit;
        const custom_critical_limit = parseInt(character.getSetting("custom-critical-limit", ""))
        if (custom_critical_limit) {
            roll_properties["critical-limit"] = custom_critical_limit;
            if (to_hit !== null)
                roll_properties["name"] += ` (CRIT${custom_critical_limit})`;
        }

        // Asssassinate: consider all rolls as critical;
        if (character.hasClassFeature("Assassinate") &&
            character.getSetting("rogue-assassinate", false)) {
            roll_properties["critical-limit"] = 1;
            roll_properties["advantage"] = RollType.OVERRIDE_ADVANTAGE;
            character.mergeCharacterSettings({ "rogue-assassinate": false });
        }
        sendRollWithCharacter("attack", damages[0], roll_properties);
    } else if (!force_display && (is_tool || is_instrument) && character._abilities.length > 0) {
        const proficiencies = {}
        proficiencies["None"] = 0;
        proficiencies["Half Proficient"] = Math.floor(character._proficiency / 2);
        proficiencies["Proficient"] = parseInt(character._proficiency);
        proficiencies["Expert"] = character._proficiency * 2;
        const formula = "1d20 + @ability + @proficiency + @custom_dice";
        let html = '<form>';
        html += '<div class="beyond20-form-row"><label>Roll Formula</label><input type="text" value="' + formula + '" disabled></div>';
        html += '<div class="beyond20-form-row"><label>Select Ability</label><select name="ability">';
        const modifiers = {}
        for (let ability of character._abilities) {
            html += '<option value="' + ability[1] + '">' + ability[0] + '</option>';
            modifiers[ability[1]] = ability[3];
        }
        html += "</select></div>";
        html += '<div class="beyond20-form-row"><label>Select Proficiency</label><select name="proficiency">';
        for (let prof in proficiencies) {
            html += '<option value="' + prof + '">' + prof + '</option>';
        }
        html += "</select></div>";
        html += '</form>';
        dndbeyondDiceRoller._prompter.prompt("Using a tool", html, item_name).then((html) => {
            if (html) {
                const ability = html.find('[name="ability"]').val();
                const proficiency = html.find('[name="proficiency"]').val();
                const prof_val = proficiencies[proficiency];
                const modifier = prof_val ? `${modifiers[ability]}${prof_val > 0 ? ' +' : ' -'}${prof_val}` : modifiers[ability];
                const roll_properties = {
                    "skill": item_name,
                    "ability": ability,
                    "modifier": modifier,
                    "proficiency": proficiency
                }
                if (ability == "STR" &&
                    ((character.hasClassFeature("Rage") && character.getSetting("barbarian-rage", false)) ||
                        (character.hasClassFeature("Giant Might") && character.getSetting("fighter-giant-might", false)))) {
                    roll_properties["advantage"] = RollType.OVERRIDE_ADVANTAGE;
                }
                roll_properties.d20 = "1d20";
                // Set Reliable Talent flag if character has the feature and skill is proficient/expertise
                if (character.hasClassFeature("Reliable Talent") && ["Proficiency", "Expertise"].includes(proficiency))
                    roll_properties.d20 = "1d20min10";
                sendRollWithCharacter("skill", "1d20" + modifier, roll_properties);
            }
        });
    } else {
        sendRollWithCharacter("item", 0, {
            "name": item_name,
            "description": description,
            "item-type": item_type,
            "tags": item_tags
        });
    }
}

function rollAction(paneClass, force_to_hit_only = false, force_damages_only = false) {
    const properties = propertyListToDict($("." + paneClass + " .ct-property-list .ct-property-list__property,." + paneClass + " .ddbc-property-list .ddbc-property-list__property"));
    //console.log("Properties are : " + String(properties));
    const action_name = $(".ct-sidebar__heading").text();
    const action_parent = $(".ct-sidebar__header-parent").text();
    const description = descriptionToString(".ct-action-detail__description");
    const to_hit = properties["To Hit"] !== undefined && properties["To Hit"] !== "--" ? properties["To Hit"] : null;

    if (action_name == "Superiority Dice" || action_parent == "Maneuvers") {
        const fighter_level = character.getClassLevel("Fighter");
        let superiority_die = fighter_level < 10 ? "1d8" : (fighter_level < 18 ? "1d10" : "1d12");
        if (action_name === "Parry")
            superiority_die += " + " + character.getAbility("DEX").mod;
        else if (action_name === "Rally")
            superiority_die += " + " + character.getAbility("CHA").mod;
        sendRollWithCharacter("custom", superiority_die, {
            "name": action_name,
            "description": description,
            "modifier": superiority_die
        });
    } else if (action_name == "Bardic Inspiration" || action_parent == "Blade Flourish") {
        const bard_level = character.getClassLevel("Bard");
        inspiration_die = bard_level < 5 ? "1d6" : (bard_level < 10 ? "1d8" : (bard_level < 15 ? "1d10" : "1d12"));
        sendRollWithCharacter("custom", inspiration_die, {
            "name": action_name,
            "description": description,
            "modifier": inspiration_die
        });
    } else if (Object.keys(properties).includes("Damage") || to_hit !== null || properties["Attack/Save"] !== undefined) {
        const damages = [];
        const damage_types = [];
        if (Object.keys(properties).includes("Damage")) {
            damages.push(properties["Damage"]);
            damage_types.push(properties["Damage Type"] || "");
            if (character.getSetting("warlock-hexblade-curse", false) &&
                character.hasClassFeature("Hexblade’s Curse") &&
                character._proficiency !== null) {
                damages.push(character._proficiency);
                damage_types.push("Hexblade's Curse");
            }
        }

        const custom_damages = character.getSetting("custom-damage-dice", "");
        if (custom_damages.length > 0) {
            for (let custom_damage of custom_damages.split(",")) {
                if (custom_damage.includes(":")) {
                    const parts = custom_damage.split(":", 2);
                    damages.push(parts[1].trim());
                    damage_types.push(parts[0].trim());
                } else {
                    damages.push(custom_damage.trim());
                    damage_types.push("Custom");
                }
            }
        }

        let brutal = 0;
        let critical_limit = 20;
        if (character.hasClassFeature("Hexblade’s Curse") &&
            character.getSetting("warlock-hexblade-curse", false))
            critical_limit = 19;
        // Polearm master bonus attack using the other end of the polearm is considered a melee attack.
        if (action_name.includes("Polearm Master - Bonus Attack") && character.hasClassFeature("Fighting Style: Great Weapon Fighting")) {
            damages[0] = damages[0].replace(/[0-9]*d[0-9]+/g, "$&ro<=2");
        }
        if (action_name.includes("Polearm Master - Bonus Attack") || action_name.includes("Unarmed Strike") || action_name.includes("Tavern Brawler Strike")
            || action_name.includes("Psychic Blade") || action_name.includes("Bite") || action_name.includes("Claws") || action_name.includes("Tail")
            || action_name.includes("Ram") || action_name.includes("Horns") || action_name.includes("Hooves") || action_name.includes("Talons")
            || action_name.includes("Thunder Gauntlets") || action_name.includes("Lightning Launcher")) {
            if (character.hasAction("Channel Divinity: Legendary Strike") &&
                character.getSetting("paladin-legendary-strike", false))
                critical_limit = 19;
            if (character.hasClassFeature("Improved Critical"))
                critical_limit = 19;
            if (character.hasClassFeature("Invincible Conqueror") &&
                character.getSetting("paladin-invincible-conqueror", false))
                critical_limit = 19;
            if (character.hasClassFeature("Superior Critical"))
                critical_limit = 18;

            if (character.getSetting("brutal-critical")) {
                if (character.hasClassFeature("Brutal Critical")) {
                    const barbarian_level = character.getClassLevel("Barbarian");
                    brutal += 1 + Math.floor((barbarian_level - 9) / 4);
                }
                if (character.hasRacialTrait("Savage Attacks"))
                    brutal += 1;
            }
            if (character.hasClassFeature("Rage") && character.getSetting("barbarian-rage", false)) {
                const barbarian_level = character.getClassLevel("Barbarian");
                const rage_damage = barbarian_level < 9 ? 2 : (barbarian_level < 16 ? 3 : 4);
                damages.push(String(rage_damage));
                damage_types.push("Rage");
            }
            if (character.hasClassFeature("Rage") && character.getSetting("barbarian-rage", false) &&
                character.getSetting("barbarian-divine-fury", true) && character.hasClassFeature("Divine Fury")) {
                const barbarian_level = character.getClassLevel("Barbarian");
                damages.push(`1d6+${Math.floor(barbarian_level / 2)}`);
                damage_types.push("Divine Fury");
            }
            if (character.hasClassFeature("Giant Might") && character.getSetting("fighter-giant-might", false)) {
                const fighter_level = character.getClassLevel("Fighter");
                damages.push(fighter_level < 10 ? "1d6" : "1d8");
                damage_types.push("Giant Might");
            }
            if (character.getSetting("bloodhunter-crimson-rite", false) &&
            character.hasClassFeature("Crimson Rite")) {
                const bloodhunter_level = character.getClassLevel("Blood Hunter");
                if (bloodhunter_level > 0) {
                    let rite_die = "1d4";
                    if (bloodhunter_level <= 4)
                        rite_die = "1d4";
                    else if (bloodhunter_level <= 10)
                        rite_die = "1d6";
                    else if (bloodhunter_level <= 16)
                        rite_die = "1d8";
                    else
                        rite_die = "1d10";
                    damages.push(rite_die);
                    damage_types.push("Crimson Rite");
                }
            }
            if (action_name.includes("Psychic Blade")) {
                if (character.hasClass("Rogue") &&
                    character.getSetting("rogue-sneak-attack", false)) {
                    const sneak_attack = Math.ceil(character._classes["Rogue"] / 2) + "d6";
                    damages.push(sneak_attack);
                    damage_types.push("Sneak Attack");
                }
            }
            // Wizard: Bladesong
            if (character.hasClassFeature("Song of Victory") && character.getSetting("wizard-bladesong", false)) {
                const intelligence = character.getAbility("INT") || {mod: 0};
                const mod = parseInt(intelligence.mod) || 0;
                damages.push(String(Math.max(mod, 1)));
                damage_types.push("Bladesong");
            }

            if (character.hasClassFeature("Improved Divine Smite") &&
                character.getSetting("paladin-improved-divine-smite", true)) {
                damages.push("1d8");
                damage_types.push("Radiant");
            }
        }

        //Protector Aasimar: Radiant Soul Damage
        if (character.hasRacialTrait("Radiant Soul") &&
            character.getSetting("protector-aasimar-radiant-soul", false)) {
            damages.push(character._level);
            damage_types.push("Radiant Soul");
        }

        const roll_properties = buildAttackRoll(character,
            "action",
            action_name,
            description,
            properties,
            damages,
            damage_types,
            to_hit,
            brutal,
            force_to_hit_only,
            force_damages_only);

        if (critical_limit != 20)
            roll_properties["critical-limit"] = critical_limit;

        const custom_critical_limit = parseInt(character.getSetting("custom-critical-limit", ""))
        if (custom_critical_limit) {
            roll_properties["critical-limit"] = custom_critical_limit;
            if (to_hit !== null)
                roll_properties["name"] += ` (CRIT${custom_critical_limit})`;
        }

        // Asssassinate: consider all rolls as critical;
        if (character.hasClassFeature("Assassinate") &&
            character.getSetting("rogue-assassinate", false)) {
            roll_properties["critical-limit"] = 1;
            roll_properties["advantage"] = RollType.OVERRIDE_ADVANTAGE;
            character.mergeCharacterSettings({ "rogue-assassinate": false });
        }
        sendRollWithCharacter("attack", damages[0], roll_properties);
    } else {
        sendRollWithCharacter("action", 0, {
            "name": action_name,
            "description": description
        });
    }
}

function rollSpell(force_display = false, force_to_hit_only = false, force_damages_only = false) {
    const properties = propertyListToDict($(".ct-spell-pane .ct-property-list .ct-property-list__property,.ct-spell-pane .ddbc-property-list .ddbc-property-list__property"));
    //console.log("Properties are : " + String(properties));
    const spell_source = $(".ct-sidebar__header-parent").text();
    const spell_full_name = $(".ct-sidebar__heading .ct-spell-name,.ct-sidebar__heading .ddbc-spell-name").text();
    const spell_name = $(".ct-sidebar__heading .ct-spell-name,.ct-sidebar__heading .ddbc-spell-name")[0].firstChild.textContent;
    const description = descriptionToString(".ct-spell-pane .ct-spell-detail__description");
    const damage_modifiers = $(".ct-spell-pane .ct-spell-caster__modifiers--damages .ct-spell-caster__modifier--damage");
    const healing_modifiers = $(".ct-spell-pane .ct-spell-caster__modifiers--healing .ct-spell-caster__modifier--hp");
    const temp_hp_modifiers = $(".ct-spell-pane .ct-spell-caster__modifiers--healing .ct-spell-caster__modifier--temp");
    const castas = $(".ct-spell-caster__casting-level-current").text();
    const level = $(".ct-spell-pane .ct-spell-detail__level-school-item").toArray().map((i) => i.textContent).join(" ");
    const ritual = $(".ct-spell-pane .ct-spell-name__icon--ritual,.ct-spell-pane .ddbc-spell-name__icon--ritual").length > 0;
    let concentration = $(".ct-spell-pane .ct-spell-name__icon--concentration,.ct-spell-pane .ddbc-spell-name__icon--concentration").length > 0;
    let duration = properties["Duration"] || "";
    if (duration.includes("Concentration")) {
        duration = duration.replace("Concentration, ", "");
        concentration = true;
    } else {
        concentration = false;
    }
    let to_hit = properties["To Hit"] !== undefined && properties["To Hit"] !== "--" ? properties["To Hit"] : null;;

    if (to_hit === null)
        to_hit = findToHit(spell_full_name, ".ct-combat-attack--spell,.ddbc-combat-attack--spell", ".ct-spell-name,.ddbc-spell-name", ".ct-combat-attack__tohit,.ddbc-combat-attack__tohit");
    if (to_hit === null)
        to_hit = findToHit(spell_full_name, ".ct-spells-spell,.ddbc-spells-spell", ".ct-spell-name,.ddbc-spell-name", ".ct-spells-spell__tohit,.ddbc-spells-spell__tohit");

    if (!force_display && (damage_modifiers.length > 0 || healing_modifiers.length > 0 || temp_hp_modifiers.length > 0 || to_hit !== null)) {
        const damages = [];
        const damage_types = [];
        for (let modifier of damage_modifiers.toArray()) {
            const dmg = $(modifier).find(".ct-spell-caster__modifier-amount,.ddbc-spell-caster__modifier-amount").text();
            const dmgtype = $(modifier).find(".ct-damage-type-icon .ct-tooltip,.ddbc-damage-type-icon .ddbc-tooltip").attr("data-original-title") || "";
            damages.push(dmg);
            damage_types.push(dmgtype);
        }

        // Handle special spells;
        if (spell_name == "Absorb Elements") {
            const dmg = damages[0];
            damages.length = 0;
            damage_types.length = 0;
            damages.push(dmg);
            damage_types.push("Triggering Type");
        }

        //Protector Aasimar: Radiant Soul Damage
        if (character.hasRacialTrait("Radiant Soul") &&
            character.getSetting("protector-aasimar-radiant-soul", false)) {
            damages.push(character._level);
            damage_types.push("Radiant Soul");
        }

        // Hex blade's curse only applies if (there are damages;
        if (damages.length > 0 &&
            character.getSetting("warlock-hexblade-curse", false) &&
            character.hasClassFeature("Hexblade’s Curse") &&
            character._proficiency !== null) {
            damages.push(character._proficiency);
            damage_types.push("Hexblade's Curse");
        }

        if (damages.length > 0 &&
            character.hasClassFeature("Arcane Firearm") &&
            character.getSetting("artificer-arcane-firearm", false) &&
            spell_source.includes("Artificer")) {
            damages.push("1d8");
            damage_types.push("Arcane Firearm");
        }

        if (character.hasClassFeature("Alchemical Savant") &&
            character.getSetting("artificer-alchemical-savant", false) &&
            damages.length) {
            for (let i = 0; i < damages.length; i++){
                if (damage_types[i] === "Acid" || damage_types[i] === "Fire" ||
                    damage_types[i] === "Necrotic" || damage_types[i] === "Poison") {
                    damages.push(`${character.getAbility("INT").mod < 2 ? 1 : character.getAbility("INT").mod}`);
                    damage_types.push("Alchemical Savant");
                    break;
                }
            }
        }

        if (character.hasClassFeature("Enhanced Bond") &&
            character.getSetting("wildfire-spirit-enhanced-bond", false) &&
            damages.length > 0) {
            for (let i = 0; i < damages.length; i++){
                if (damage_types[i] === "Fire") {
                    damages.push("1d8");
                    damage_types.push("Enhanced Bond");
                    break;
                }
            }
        }

        //Handle Flames of Phlegethos
        if (damages.length > 0 &&
            character.hasFeat("Flames of Phlegethos")) {
            for (i = 0; i < damages.length; i++) {
                if (damage_types[i] === "Fire")
                    damages[i] = damages[i].replace(/[0-9]*d[0-9]+/g, "$&ro<=1");
            }
        }

        // Check for Draconic Sorcerer's Elemental Affinity;
        let elementalAffinity = null;
        for (let feature of character._class_features) {
            const match = feature.match("Elemental Affinity \\((.*)\\)");
            if (match) {
                elementalAffinity = match[1];
                break;
            }
        }
        const elementalAdepts = [];
        for (let feature of character._feats) {
            const match = feature.match("Elemental Adept \\((.*)\\)");
            if (match) {
                elementalAdepts.push(match[1]);
            }
        }
        if (elementalAffinity && damage_types.includes(elementalAffinity)) {
            for (let ability of character._abilities) {
                if (ability[1] == "CHA" && ability[3] != "" && ability[3] != "0") {
                    damages.push(ability[3]);
                    damage_types.push(elementalAffinity + " (Elemental Affinity)");
                }
            }
        }
        for (let elementalAdept of elementalAdepts) {
            for (let i = 0; i < damages.length; i++) {
                if (damage_types[i] === elementalAdept) {
                    damages[i] = damages[i].replace(/([0-9]*)d([0-9]+)([^\s+-]*)(.*)/g, (match, amount, faces, roll_mods, mods) => {
                        return new Array(parseInt(amount) || 1).fill(`1d${faces}${roll_mods}min2`).join(" + ") + mods;
                    });
                }
            }
        }

        // We can then add healing types;
        for (let modifier of healing_modifiers.toArray()) {
            let dmg = $(modifier).find(".ct-spell-caster__modifier-amount").text();
            if (dmg.startsWith("Regain "))
                dmg = dmg.slice(7);
            if (dmg.endsWith(" Hit Points"))
                dmg = dmg.slice(0, -11);
            if (dmg.length > 0) {
                damages.push(dmg);
                damage_types.push("Healing");
            }
        }

        if (character.hasClassFeature("Alchemical Savant") &&
            character.getSetting("artificer-alchemical-savant", false)) {
            for (let i = 0; i < damages.length; i++){
                if (damage_types[i] === "Healing") {
                    damages.push(`${character.getAbility("INT").mod < 2 ? 1 : character.getAbility("INT").mod}`);
                    damage_types.push("Alchemical Savant Healing");
                    break;
                }
            }
        }
        
        if (character.hasClassFeature("Enhanced Bond") &&
            character.getSetting("wildfire-spirit-enhanced-bond", false)) {
            for (let i = 0; i < damages.length; i++){
                if (damage_types[i] === "Healing") {
                    damages.push("1d8");
                    damage_types.push("Enhanced Bond Healing");
                    break;
                }
            }
        }

        // We can then add temp healing types;
        for (let modifier of temp_hp_modifiers.toArray()) {
            let dmg = $(modifier).find(".ct-spell-caster__modifier-amount").text();
            if (dmg.startsWith("Regain "))
                dmg = dmg.slice(7);
            if (dmg.endsWith(" Temp Hit Points"))
                dmg = dmg.slice(0, -16);
            if (dmg.length > 0) {
                damages.push(dmg);
                damage_types.push("Temp HP");
            }
        }

        // Handle Disciple of life;
        if (healing_modifiers.length > 0 &&
            character.hasClassFeature("Disciple of Life") &&
            character.getSetting("cleric-disciple-life", false)) {
            const spell_level = (castas != "") ? castas[0] : level[0];
            const discipleOfLife = 2 + parseInt(spell_level);
            damages.push(discipleOfLife.toString());
            damage_types.push("Disciple of Life");
        }
        if (healing_modifiers.length > 0 &&
            character.hasClassFeature("Supreme Healing")) {
            for (let i = 0; i < damages.length; i++) {
                if (damage_types[i] !== "Healing") continue;
                damages[i] = damages[i].replace(/([0-9]*)d([0-9]+)?/, (match, dice, faces) => {
                    return String(parseInt(dice || 1) * parseInt(faces));
                });
            }
        }

        const custom_damages = character.getSetting("custom-damage-dice", "");
        if (custom_damages.length > 0) {
            for (let custom_damage of custom_damages.split(",")) {
                if (custom_damage.includes(":")) {
                    const parts = custom_damage.split(":", 2);
                    damages.push(parts[1].trim());
                    damage_types.push(parts[0].trim());
                } else {
                    damages.push(custom_damage.trim());
                    damage_types.push("Custom");
                }
            }
        }

        let critical_limit = 20;
        if (character.hasClassFeature("Hexblade’s Curse") &&
            character.getSetting("warlock-hexblade-curse", false))
            critical_limit = 19;
        const roll_properties = buildAttackRoll(character,
            "spell",
            spell_name,
            description,
            properties,
            damages,
            damage_types,
            to_hit,
            0,
            force_to_hit_only,
            force_damages_only);

        if (critical_limit != 20)
            roll_properties["critical-limit"] = critical_limit;
        const custom_critical_limit = parseInt(character.getSetting("custom-critical-limit", ""))
        if (custom_critical_limit) {
            roll_properties["critical-limit"] = custom_critical_limit;
            if (to_hit !== null)
                roll_properties["name"] += ` (CRIT${custom_critical_limit})`;
        }

        const spell_properties = {
            "level-school": level,
            "concentration": concentration,
            "duration": duration,
            "casting-time": properties["Casting Time"] || "",
            "components": properties["Components"] || "",
            "ritual": ritual
        }
        for (let key in spell_properties)
            roll_properties[key] = spell_properties[key];

        if (castas != "" && !level.startsWith(castas))
            roll_properties["cast-at"] = castas;

        // Asssassinate: consider all rolls as critical;
        if (character.hasClassFeature("Assassinate") &&
            character.getSetting("rogue-assassinate", false)) {
            roll_properties["critical-limit"] = 1;
            roll_properties["advantage"] = RollType.OVERRIDE_ADVANTAGE;
            character.mergeCharacterSettings({ "rogue-assassinate": false });
        }

        sendRollWithCharacter("spell-attack", damages[0] || "", roll_properties);
    } else {
        const roll_properties = {
            "name": spell_name,
            "level-school": level,
            "range": (properties["Range/Area"] || ""),
            "concentration": concentration,
            "duration": duration,
            "casting-time": (properties["Casting Time"] || ""),
            "components": (properties["Components"] || ""),
            "ritual": ritual,
            "description": description
        }
        if (castas != "" && !level.startsWith(castas))
            roll_properties["cast-at"] = castas;
        sendRollWithCharacter("spell-card", 0, roll_properties);
    }
}

function displayItem() {
    rollItem(true);
}

function displaySpell() {
    rollSpell(true);
}

function displayFeature(paneClass) {
    const source_types = {
        "ct-class-feature-pane": "Class",
        "ct-racial-trait-pane": "Race",
        "ct-feat-pane": "Feat"
    }
    const name = $(".ct-sidebar__heading").text();
    const source = $(".ct-sidebar__header-parent").text();
    const source_type = source_types[paneClass];
    const description = descriptionToString(".ct-snippet__content,.ddbc-snippet__content");
    sendRollWithCharacter("feature", 0, {
        "name": name,
        "source": source,
        "source-type": source_type,
        "description": description
    });
}

function displayTrait() {
    const trait = $(".ct-sidebar__heading").text();
    const description = descriptionToString(".ct-trait-pane__input");
    sendRollWithCharacter("trait", 0, {
        "name": trait,
        "description": description
    });
}

function displayBackground() {
    const background = $(".ct-sidebar__heading").text();
    const description = descriptionToString(".ct-background-pane__description > p");
    sendRollWithCharacter("trait", 0, {
        name: background,
        source: "Bakground",
        description: description
    });
}

function displayAction(paneClass) {
    const action_name = $(".ct-sidebar__heading").text();
    const description = descriptionToString(".ct-action-detail__description");
    sendRollWithCharacter("action", 0, {
        "name": action_name,
        "description": description
    });
}

function displayInfusion() {
    const infusion = $(".ct-sidebar__heading").text();
    const description = descriptionToString(".ct-infusion-choice-pane__description");
    sendRollWithCharacter("trait", 0, {
        "name": infusion,
        "description": description,
        "item-type": "Infusion",
    });
}

function handleCustomText(paneClass) {
    const customRolls = {
        before: [],
        replace:[],
        after:  []
    };
    // Relative to normal roll msg
    const rollOrderTypes = ["before", "after", "replace"];
    const pane = $(`.${paneClass}`);
    const notes = descriptionToString(pane.find(".ddbc-property-list__property:contains('Notes:')"));
    const description = descriptionToString(pane.find(".ct-action-detail__description, .ct-spell-detail__description, .ct-item-detail__description, .ddbc-action-detail__description, .ddbc-spell-detail__description, .ddbc-item-detail__description"));

    // Look for all the roll orders
    for (const rollOrder of rollOrderTypes) {
        // Use global, multiline and dotall flags
        const regexp = new RegExp(`\\[\\[${rollOrder}\\]\\]\\s*(.+?)\\s*\\[\\[/${rollOrder}\\]\\]`, "gms");
        const matches = [...notes.matchAll(regexp), ...description.matchAll(regexp)];
        customRolls[rollOrder] = matches.map(([match, content]) => content)
    }
    
    return customRolls;
}

function execute(paneClass, force_to_hit_only = false, force_damages_only = false) {
    console.log("Beyond20: Executing panel : " + paneClass, force_to_hit_only, force_damages_only);
    const rollCustomText = (customTextList) => {
        for (const customText of customTextList) {
            sendRollWithCharacter("chat-message", 0, {
                name: "",
                message: customText
            });
        }
     };
     
    const customTextRolls = handleCustomText(paneClass);
    rollCustomText(customTextRolls.before);
    if (customTextRolls.replace.length > 0) {
        rollCustomText(customTextRolls.replace);
    } else {
        if (["ct-skill-pane", "ct-custom-skill-pane"].includes(paneClass))
            rollSkillCheck(paneClass);
        else if (paneClass == "ct-ability-pane")
            rollAbilityCheck();
        else if (paneClass == "ct-ability-saving-throws-pane")
            rollSavingThrow();
        else if (paneClass == "ct-initiative-pane")
            rollInitiative();
        else if (paneClass == "ct-item-pane")
            rollItem(false, force_to_hit_only, force_damages_only);
        else if (["ct-action-pane", "ct-custom-action-pane"].includes(paneClass))
            rollAction(paneClass, force_to_hit_only, force_damages_only);
        else if (paneClass == "ct-spell-pane")
            rollSpell(false, force_to_hit_only, force_damages_only);
        else
            displayPanel(paneClass);
    }
    rollCustomText(customTextRolls.after);
}

function displayPanel(paneClass) {
    console.log("Beyond20: Displaying panel : " + paneClass);
    if (paneClass == "ct-item-pane")
        displayItem();
    else if (paneClass == "ct-infusion-choice-pane")
        displayInfusion();
    else if (paneClass == "ct-spell-pane")
        displaySpell();
    else if (["ct-class-feature-pane", "ct-racial-trait-pane", "ct-feat-pane"].includes(paneClass))
        displayFeature(paneClass);
    else if (paneClass == "ct-trait-pane")
        displayTrait();
    else if (["ct-action-pane", "ct-custom-action-pane"].includes(paneClass))
        displayAction(paneClass);
    else if (paneClass == "ct-background-pane")
        displayBackground();
    else
        alertify.alert("Not recognizing the currently open sidebar");
}

function findModifiers(character, custom_roll) {
    const sibling = custom_roll.nextSibling;
    if (sibling && sibling.nodeName == "#text") {
        const strong = $(custom_roll).find("strong");
        const img = $(custom_roll).find("img");
        let roll_formula = img.attr("x-beyond20-roll");
        let text = sibling.textContent;
        let text_len = 0;
        while (text_len != text.length) {
            // If text length changes, we can check again for another modifier;
            text_len = text.length;

            find_static_modifier = (name, value, {add_your=true}={}) => {
                const mod_string = add_your ? " + your " + name : name;
                if (text.toLowerCase().startsWith(mod_string)) {
                    strong.append(text.substring(0, mod_string.length));
                    roll_formula += " + " + value;
                    text = text.substring(mod_string.length);
                }
            }

            for (let ability of character._abilities)
                find_static_modifier(ability[0].toLowerCase() + " modifier", ability[3]);
            for (let class_name in character._classes) {
                const half_level = Math.min(1, Math.floor(character._classes[class_name] / 2));
                find_static_modifier(class_name.toLowerCase() + " level", character._classes[class_name]);
                find_static_modifier(" + half your " + class_name.toLowerCase() + " level", half_level, {add_your: false});
            }
            find_static_modifier("proficiency bonus", character._proficiency);
            find_static_modifier("ac", character._ac);
            find_static_modifier("armor class", character._ac);

            find_spell_modifier = (suffix, obj) => {
                let default_spell_mod = null;
                for (let class_name in obj) {
                    default_spell_mod = default_spell_mod === null ? obj[class_name] : default_spell_mod;
                    find_static_modifier(class_name.toLowerCase() + " " + suffix, obj[class_name]);
                }
                if (default_spell_mod)
                    find_static_modifier(suffix, default_spell_mod);
            }
            find_spell_modifier("spell modifier", character._spell_modifiers);
            find_spell_modifier("spell attack", character._spell_attacks);
            find_spell_modifier("spell save dc", character._spell_saves);
            find_spell_modifier("save dc", character._spell_saves);
        }

        sibling.textContent = text;
        img.attr("x-beyond20-roll", roll_formula);
    }
}


function checkAndInjectDiceToRolls(selector, name = "") {
    if (!settings["subst-dndbeyond"])
        return;

    injectDiceToRolls(selector, character, name);

    for (let custom_roll of $(".ct-beyond20-custom-roll").toArray())
        findModifiers(character, custom_roll);
}

function addRollButtonEx(paneClass, where, options) {
    addRollButton(character, () => execute(paneClass), where, options);
}

function addDisplayButtonEx(paneClass, where, options) {
    addDisplayButton(() => displayPanel(paneClass), where, options);
}

var lastItemName = "";
var lastSpellName = "";
var lastSpellLevel = "";
function injectRollButton(paneClass) {
    if (["ct-custom-skill-pane",
        "ct-skill-pane",
        "ct-ability-pane",
        "ct-ability-saving-throws-pane",
        "ct-initiative-pane"].includes(paneClass)) {
        if (isRollButtonAdded())
            return;
        addRollButtonEx(paneClass, ".ct-sidebar__heading");
    } else if (["ct-class-feature-pane", "ct-racial-trait-pane", "ct-feat-pane"].includes(paneClass)) {
        if (isRollButtonAdded())
            return;
        addRollButtonEx(paneClass, ".ct-sidebar__heading", { image: false });
        const name = $(".ct-sidebar__heading").text();
        checkAndInjectDiceToRolls("." + paneClass + " .ct-snippet__content,." + paneClass + " .ddbc-snippet__content", name);
    } else if (paneClass === "ct-background-pane") {
        if (isRollButtonAdded())
            return;
        addRollButtonEx(paneClass, ".ct-sidebar__heading", { image: false });
        const name = $(".ct-sidebar__heading").text();
        checkAndInjectDiceToRolls("." + paneClass + " .ct-background-pane__description", name);
    } else if (paneClass == "ct-trait-pane") {
        if (isRollButtonAdded())
            return;
        addRollButtonEx(paneClass, ".ct-trait-pane__content", { image: false });
    } else if (paneClass == "ct-item-pane") {
        const item_name = $(".ct-item-pane .ct-sidebar__heading .ct-item-name,.ct-item-pane .ct-sidebar__heading .ddbc-item-name").text();
        if (isRollButtonAdded() && item_name == lastItemName)
            return;
        lastItemName = item_name;
        removeRollButtons();

        checkAndInjectDiceToRolls(".ct-item-detail__description", item_name);
        const properties = propertyListToDict($(".ct-item-pane .ct-property-list .ct-property-list__property,.ct-item-pane .ddbc-property-list .ddbc-property-list__property"));
        if (Object.keys(properties).includes("Damage")) {
            addRollButtonEx(paneClass, ".ct-sidebar__heading", { small: true });
            addDisplayButtonEx(paneClass, ".ct-beyond20-roll");
        } else {
            const item_type = $(".ct-item-detail__intro").text().trim().toLowerCase();
            const item_tags = $(".ct-item-detail__tags-list .ct-item-detail__tag").toArray().map(elem => elem.textContent);
            const is_tool = item_type === "tool, common" || (item_type === "gear, common" && item_name.endsWith("Tools"));
            const is_instrument =  item_tags.includes("Instrument");
            if (is_tool || is_instrument) {
                addRollButtonEx(paneClass, ".ct-sidebar__heading", { small: true, text: `Use ${is_tool? "Tool" : "Instrument"}` });
                addDisplayButtonEx(paneClass, ".ct-beyond20-roll");
            } else {
                addDisplayButtonEx(paneClass, ".ct-sidebar__heading", { append: false, small: false });
            }
            addRollButtonEx(paneClass, ".ct-item-detail__actions", { small: true, append: true, image: false });
        }
    } else if (paneClass == "ct-infusion-choice-pane") {
        const infusion_name = $(".ct-infusion-choice-pane .ct-sidebar__heading").text();
        if (isRollButtonAdded() && infusion_name == lastItemName)
            return;
        lastItemName = infusion_name;
        removeRollButtons();

        checkAndInjectDiceToRolls(".ct-infusion-choice-pane__description", infusion_name);
        addDisplayButtonEx(paneClass, ".ct-sidebar__heading", { append: false, small: false });
    } else if (["ct-action-pane", "ct-custom-action-pane"].includes(paneClass)) {
        if (isRollButtonAdded())
            return;

        const properties = propertyListToDict($("." + paneClass + " .ct-property-list .ct-property-list__property,." + paneClass + " .ddbc-property-list .ddbc-property-list__property"));
        const action_name = $(".ct-sidebar__heading").text();
        const action_parent = $(".ct-sidebar__header-parent").text();
        const to_hit = properties["To Hit"] !== undefined && properties["To Hit"] !== "--" ? properties["To Hit"] : null;
        if ((action_name == "Superiority Dice" || action_parent == "Maneuvers") ||
            (action_name == "Bardic Inspiration" || action_parent == "Blade Flourish") ||
            (properties["Damage"] !== undefined || to_hit !== null || properties["Attack/Save"] !== undefined)) {
            addRollButtonEx(paneClass, ".ct-sidebar__heading", { small: true });
            addDisplayButtonEx(paneClass, ".ct-beyond20-roll");
        } else {
            addRollButtonEx(paneClass, ".ct-sidebar__heading");
        }
        checkAndInjectDiceToRolls(".ct-action-detail__description,.ddbc-action-detail__description", action_name);
    } else if (paneClass == "ct-spell-pane") {
        const spell_name = $(".ct-sidebar__heading .ct-spell-name,.ct-sidebar__heading .ddbc-spell-name")[0].firstChild.textContent;
        const spell_full_name = $(".ct-sidebar__heading .ct-spell-name,.ct-sidebar__heading .ddbc-spell-name").text();
        const spell_level = $(".ct-spell-caster__casting-level-current").text();
        if (isRollButtonAdded() && spell_full_name == lastSpellName && spell_level == lastSpellLevel)
            return;
        lastSpellName = spell_full_name;
        lastSpellLevel = spell_level;
        removeRollButtons();
        checkAndInjectDiceToRolls(".ct-spell-pane .ct-spell-detail__description", spell_name);

        const damages = $(".ct-spell-pane .ct-spell-caster__modifiers--damages .ct-spell-caster__modifier");
        const healings = $(".ct-spell-pane .ct-spell-caster__modifiers--healing .ct-spell-caster__modifier");
        const properties = propertyListToDict($(".ct-spell-pane .ct-property-list .ct-property-list__property,.ct-spell-pane .ddbc-property-list .ddbc-property-list__property"));
        let to_hit = properties["To Hit"] !== undefined && properties["To Hit"] !== "--" ? properties["To Hit"] : null;
        if (to_hit === null)
            to_hit = findToHit(spell_full_name, ".ct-combat-attack--spell,.ddbc-combat-attack--spell", ".ct-spell-name,.ddbc-spell-name", ".ct-combat-attack__tohit,.ddbc-combat-attack__tohit");
        if (to_hit === null)
            to_hit = findToHit(spell_full_name, ".ct-spells-spell,.ddbc-spells-spell", ".ct-spell-name,.ddbc-spell-name", ".ct-spells-spell__tohit,.ddbc-spells-spell__tohit");

        if (damages.length > 0 || healings.length > 0 || to_hit !== null) {
            addRollButtonEx(paneClass, ".ct-sidebar__heading", { text: "Cast on VTT", small: true });
            addDisplayButtonEx(paneClass, ".ct-beyond20-roll");
        } else {
            //addRollButtonEx(paneClass, ".ct-sidebar__heading", text="Cast on VTT", image=false);
            addDisplayButtonEx(paneClass, ".ct-sidebar__heading", { append: false, small: false });
        }

        if (spell_name == "Animate Objects") {
            const rows = $(".ct-spell-detail__description table tbody tr,.ddbc-spell-detail__description table tbody tr");
            for (let row of rows.toArray()) {
                const size = $(row).find("td").eq(0);
                const desc = $(row).find("td").eq(5);

                const m = desc.text().match(/(\+[0-9]+) to hit, ([0-9]*d[0-9]+(?:\s*[-+]\s*[0-9]+)) damage/)
                if (m) {
                    const to_hit = m[1];
                    const dmg = m[2];
                    //console.log("Match for ", size, " : ", to_hit, dmg);

                    const id = addRollButton(character, () => {
                        const props = buildAttackRoll(character,
                            "action",
                            spell_name + "(" + size + ")",
                            size + " animated object",
                            {},
                            [dmg],
                            ["Bludgeoning"], to_hit);
                        sendRollWithCharacter("attack", "1d20" + to_hit, props);
                    }, size, { small: true, append: true, image: false, text: "Attack" });
                    $(`#${id}`).css({ "float": "", "text-align": "" });
                }
            }
        }

        $(".ct-spell-caster__casting-action > button,.ddbc-spell-caster__casting-action > button").off('click').on('click', (event) => {
            execute(paneClass);
        });
    } else if (paneClass == "ct-reset-pane") {
        const hitdice = $(".ct-reset-pane__hitdie");
        if (hitdice.length > 0) {
            if (isHitDieButtonAdded())
                return;
            removeRollButtons();
            addHitDieButtons(rollHitDie);
        } else {
            removeRollButtons();
        }
    } else if (paneClass == "ct-health-manage-pane") {
        if ($(".ct-health-manage-pane .ct-health-manager__deathsaves").length > 0) {
            if (isRollButtonAdded() || isCustomRollIconsAdded())
                return;
            addIconButton(character, () => {
                sendRollWithCharacter("death-save", "1d20", { "advantage": RollType.NORMAL })
            }, ".ct-health-manager__deathsaves-group--fails", { custom: true });
        } else {
            removeRollButtons();
        }
    } else if (paneClass == "ct-creature-pane") {
        if (isRollButtonAdded() || isCustomRollIconsAdded()) {
            if (creature)
                creature.updateInfo();
            return;
        }
        const base = $(".ct-creature-block").length > 0 ? ".ct-creature-block" : ".ddbc-creature-block";
        creature = new Monster("Creature", base, settings);
        creature.parseStatBlock();
        creature.updateInfo();
    } else if (paneClass == "ct-vehicle-pane") {
        if (isRollButtonAdded() || isCustomRollIconsAdded())
            return;
        const base = $(".ct-vehicle-block").length > 0 ? ".ct-vehicle-block" : ".ddbc-vehicle-block";
        monster = new Monster("Extra-Vehicle", base, settings);
        monster.parseStatBlock();
    } else if (paneClass == "ct-condition-manage-pane") {
        const j_conditions = $(".ct-condition-manage-pane .ct-toggle-field--enabled,.ct-condition-manage-pane .ddbc-toggle-field--is-enabled").closest(".ct-condition-manage-pane__condition");
        let exhaustion_level = $(".ct-condition-manage-pane__condition--special .ct-number-bar__option--active,.ct-condition-manage-pane__condition--special .ddbc-number-bar__option--active").text();
        const conditions = [];
        for (let cond of j_conditions.toArray())
            conditions.push(cond.textContent);
        if (exhaustion_level == "")
            exhaustion_level = 0;
        else
            exhaustion_level = parseInt(exhaustion_level);

        character.updateConditions(conditions, exhaustion_level);
    } else {
        removeRollButtons();
    }
}


function injectRollToSpellAttack() {
    const groups = $(".ct-spells-level-casting__info-group,.ddbc-spells-level-casting__info-group");

    for (let group of groups.toArray()) {
        const label = $(group).find(".ct-spells-level-casting__info-label,.ddbc-spells-level-casting__info-label");
        if (label.text() == "Spell Attack") {
            if (label.hasClass("beyond20-rolls-added"))
                return;
            label.addClass("beyond20-rolls-added");
            const icon = chrome.extension.getURL("images/icons/badges/spell20.png");
            const items = $(group).find(".ct-spells-level-casting__info-item,.ddbc-spells-level-casting__info-item");
            for (let item of items.toArray()) {
                const modifier = item.textContent;
                let name = "Spell Attack";
                if (items.length > 1)
                    name += "(" + item.getAttribute("data-original-title") + ")";
                const img = E.img({
                    class: "ct-beyond20-spell-attack-icon ct-beyond20-spell-attack",
                    'x-beyond20-name': name, 'x-beyond20-modifier': modifier, src: icon
                });
                item.append(img);
            }
            $(".ct-beyond20-spell-attack-icon").css("margin-left", "3px");
            $(".ct-beyond20-spell-attack").on('click', (event) => {
                const name = $(event.currentTarget).attr("x-beyond20-name");
                const mod = $(event.currentTarget).attr("x-beyond20-modifier");
                sendRollWithCharacter("spell-attack", "1d20" + mod, {
                    name: name,
                    "to-hit": mod,
                    rollAttack: true,
                    description: "Spell Attack",
                    components: ""
                });
            });
        }
    }
}

function injectRollToSnippets() {
    const groups = $(`.ct-actions .ct-actions-list .ct-actions-list__activatable .ct-feature-snippet,
                        .ct-features .ct-class-detail .ct-feature-snippet,
                        .ct-features .ct-race-detail .ct-feature-snippet,
                        .ct-features .ct-feats-detail .ct-feature-snippet`);

    for (let group of groups.toArray()) {
        const snippet = $(group);
        if (snippet.hasClass("beyond20-rolls-added"))
                continue;
        snippet.addClass("beyond20-rolls-added");
        const name = snippet.find(".ct-feature-snippet__heading")[0].childNodes[0].textContent.trim();
        checkAndInjectDiceToRolls(snippet.find(".ct-feature-snippet__content"), name);
    }
}

function injectSettingsButton() {
    if ($(".ct-beyond20-settings").length > 0)
        return;
    const desktop_gap = $(".ct-character-header-desktop__group--gap");
    const tablet_gap = $(".ct-character-header-tablet__group--gap");
    const mobile_gap = $(".ct-character-header-mobile__group--gap");

    let button_type = null;
    let gap = null;
    let span_text = "Beyond 20";
    let icon = chrome.extension.getURL("images/icons/badges/normal20.png");
    if (desktop_gap.length > 0) {
        button_type = "desktop";
        gap = desktop_gap;
    } else if (tablet_gap.length > 0) {
        button_type = "tablet";
        gap = tablet_gap;
    } else if (mobile_gap.length > 0) {
        button_type = "mobile";
        gap = mobile_gap;
        span_text = "\u00A0\u00A0"; // Add 2 non breaking spaces as padding;
        icon = chrome.extension.getURL("images/icons/badges/normal32.png");
    } else {
        return;
    }
    const button = E.div({ class: "ct-character-header-" + button_type + "__group ct-character-header-" + button_type + "__group--beyond20" },
        E.div({ class: "ct-character-header-" + button_type + "__button" },
            E.img({ class: "ct-beyond20-settings", src: icon }),
            E.span({ class: "ct-character-header-" + button_type + "__button-label" }, span_text)
        )
    );
    gap.after(button);
    $(button).on('click', (event) => alertQuickSettings());
}

var quick_roll = false;
var quick_roll_force_attack = false;
var quick_roll_force_damage = false;
var quick_roll_timeout = 0;

function deactivateTooltipListeners(el) {
    return el.off('mouseenter').off('mouseleave').off('click');
}

var quickRollHideId = 0;
function activateTooltipListeners(el, direction, tooltip, callback) {
    const site = $("#site");
    el.on('mouseenter', (e) => {
        if (quickRollHideId)
            clearTimeout(quickRollHideId);
        quickRollHideId = 0;

        const target = $(e.currentTarget)
        const position = target.offset()
        const siteOffset = site.offset(); // Banner on top of the site can shift everything down
        position.left -= siteOffset.left;
        position.top -= siteOffset.top;
        if (direction === "up") {
            position.left += target.outerWidth() / 2 - tooltip.outerWidth() / 2;
            position.top -= tooltip.outerHeight() + 5;
        } else if (direction == "down") {
            position.left += target.outerWidth() / 2 - tooltip.outerWidth() / 2;
            position.top += target.outerHeight() + 5;
        } else if (direction == "left") {
            position.left -= tooltip.outerWidth() - 2;
            position.top += target.outerHeight() / 2 - tooltip.outerHeight() / 2;
        } else if (direction == "right") {
            position.left += target.outerWidth() + 2;
            position.top += target.outerHeight() / 2 - tooltip.outerHeight() / 2;
        }
        tooltip.find(".beyond20-quick-roll-indicator").removeClass("left right down up").addClass(direction);
        tooltip.css(position).show().off('click').on('click', (e) => {
            e.stopPropagation();
            callback(el);
        });
        el.off('click').on('click', (e) => {
            if ($(e.currentTarget).hasClass('integrated-dice__container') || $(e.currentTarget).find(".integrated-dice__container").length > 0) {
                e.stopPropagation();
            }
            callback(el);
        })
    }).on('mouseleave', (e) => {
        if (quickRollHideId)
            clearTimeout(quickRollHideId);
        quickRollHideId = setTimeout(() => tooltip.hide(), 250);
    });
    el.addClass("beyond20-quick-roll-area");
}

function deactivateQuickRolls() {
    let abilities = $(".ddbc-ability-summary .ddbc-ability-summary__primary .integrated-dice__container");
    // If digital dice are disabled, look up where the modifier is
    if (abilities.length === 0)
        abilities = $(".ddbc-ability-summary .ddbc-ability-summary__secondary .ddbc-signed-number, .ddbc-ability-summary .ddbc-ability-summary__primary .ddbc-signed-number");
    const saving_throws = $(".ct-saving-throws-summary__ability .ct-saving-throws-summary__ability-modifier,.ddbc-saving-throws-summary__ability .ddbc-saving-throws-summary__ability-modifier");
    const skills = $(".ct-skills .ct-skills__col--modifier,.ddbc-skills .ddbc-skills__col--modifier");
    const actions = $(".ct-combat-attack .ct-combat-attack__icon,.ddbc-combat-attack .ddbc-combat-attack__icon");
    const actions_to_hit = $(".ddbc-combat-attack .ddbc-combat-attack__tohit .integrated-dice__container");
    const actions_damage = $(".ddbc-combat-attack .ddbc-combat-attack__damage .integrated-dice__container:first-of-type");
    const spells = $(".ct-spells-spell .ct-spells-spell__action,.ddbc-spells-spell .ddbc-spells-spell__action");
    const spells_to_hit = $(".ct-spells-spell .ct-spells-spell__tohit .integrated-dice__container, .ddbc-spells-spell .ddbc-spells-spell__tohit .integrated-dice__container");
    const spells_damage = $(".ct-spells-spell .ct-spells-spell__damage .integrated-dice__container, .ddc-spells-spell .ddc-spells-spell__damage .integrated-dice__container");
    let initiative = $(".ct-initiative-box__value .integrated-dice__container, .ct-combat-mobile__extra--initiative .ct-combat-mobile__extra-value .integrated-dice__container");
    if (initiative.length === 0)
        initiative = $(".ct-initiative-box__value .ddbc-signed-number, .ct-combat-mobile__extra--initiative .ct-combat-mobile__extra-value .ddbc-signed-number");
    deactivateTooltipListeners(initiative);
    deactivateTooltipListeners(abilities);
    deactivateTooltipListeners(saving_throws);
    deactivateTooltipListeners(skills);
    deactivateTooltipListeners(actions);
    deactivateTooltipListeners(actions_to_hit);
    deactivateTooltipListeners(actions_damage);
    deactivateTooltipListeners(spells);
    deactivateTooltipListeners(spells_to_hit);
    deactivateTooltipListeners(spells_damage);

    return {
        initiative,
        abilities, saving_throws, skills,
        actions, actions_to_hit, actions_damage,
        spells, spells_to_hit, spells_damage
    };
}

function activateQuickRolls() {
    // quick rolling, don't mess up our tooltip;
    if (quick_roll)
        return;
    let beyond20_tooltip = $(".beyond20-quick-roll-tooltip");
    if (beyond20_tooltip.length == 0) {
        const rolltype_class = getRollTypeButtonClass(character);
        const icon = getBadgeIconFromClass(rolltype_class, "32");
        const img = E.img({ class: "beyond20-quick-roll-icon", src: icon, style: "margin-right: 5px;margin-left: 5px;padding: 5px 5px;" });
        const indicator = E.img({ class: "beyond20-quick-roll-indicator", src: chrome.extension.getURL("images/quick-roll-indicator.png") });
        const div = E.div({ class: "beyond20-quick-roll-tooltip " + getRollTypeButtonClass(character) }, img, indicator);
        beyond20_tooltip = $(div);
        beyond20_tooltip.css({
            "position": "absolute",
            "background": `url("${chrome.extension.getURL("images/quick-roll-background.png")}") 50% center no-repeat transparent`,
            "background-size": "contain",
            "z-index": "20"
        });
        beyond20_tooltip.off('mouseenter').off('mouseleave').on('mouseleave', (e) => {
            if (quickRollHideId)
                clearTimeout(quickRollHideId);
            quickRollHideId = setTimeout(() => beyond20_tooltip.hide(), 100);
        }).on('mouseenter', () => {
            if (quickRollHideId)
                clearTimeout(quickRollHideId);
            quickRollHideId = 0;
        })
        beyond20_tooltip.hide();
        $("body").append(beyond20_tooltip);
    }

    const {
        initiative,
        abilities, saving_throws, skills,
        actions, actions_to_hit, actions_damage,
        spells, spells_to_hit, spells_damage
    } = deactivateQuickRolls();

    if (!settings["quick-rolls"])
        return;

    activateTooltipListeners(initiative, 'up', beyond20_tooltip, (el) => {
        el.closest(".ct-initiative-box__value, .ct-combat-mobile__extra-value").trigger('click');
        if ($(".ct-initiative-pane").length)
            execute("ct-initiative-pane");
        else
            quick_roll = true;
    });
    for (let ability of abilities.toArray()) {
        activateTooltipListeners($(ability), 'down', beyond20_tooltip, (el) => {
            const name = el.closest(".ct-ability-summary,.ddbc-ability-summary")
                .find(".ct-ability-summary__heading .ct-ability-summary__label,.ddbc-ability-summary__heading .ddbc-ability-summary__label")
                .trigger('click').text();
            // If same item, clicking will be a noop && it won't modify the document;
            const pane_name = $(".ct-ability-pane .ct-sidebar__heading").text().split(" ")[0];
            if (name == pane_name)
                execute("ct-ability-pane");
            else
                quick_roll = true;
        });
    }

    for (let [idx, save] of saving_throws.toArray().entries()) {
        activateTooltipListeners($(save), idx < 3 ? 'left' : 'right', beyond20_tooltip, (el) => {
            const name = el.closest(".ct-saving-throws-summary__ability,.ddbc-saving-throws-summary__ability")
                .find(".ct-saving-throws-summary__ability-name,.ddbc-saving-throws-summary__ability-name")
                .trigger('click').text().slice(0, 3).toLowerCase();
            // If same spell, clicking will be a noop && it won't modify it;
            const pane_name = $(".ct-ability-saving-throws-pane .ct-sidebar__heading").text().slice(0, 3).toLowerCase();
            if (name == pane_name)
                execute("ct-ability-saving-throws-pane");
            else
                quick_roll = true;
        });
    }

    for (let skill of skills.toArray()) {
        activateTooltipListeners($(skill), 'left', beyond20_tooltip, (el) => {
            const name = el.closest(".ct-skills__item,.ddbc-skills__item")
                .find(".ct-skills__col--skill,.ddbc-skills__col--skill")
                .trigger('click').text();
            let pane = null;
            let paneClass = null;
            // If same skill, clicking will be a noop && it won't modify the document;
            for (paneClass of ["ct-skill-pane", "ct-custom-skill-pane"]) {
                pane = $("." + paneClass);
                if (pane.length > 0)
                    break;
            }
            const pane_name = pane.find(".ct-sidebar__heading ." + paneClass + "__header-name").text();

            if (name == pane_name)
                execute(paneClass);
            else
                quick_roll = true;
        });
    }

    const activateQRAction = (action, force_to_hit_only, force_damages_only) => {
        action = $(action);
        // To the right for attack and damage, to the left for to hit
        const position = force_to_hit_only ? 'left' : 'right';
        activateTooltipListeners(action, position, beyond20_tooltip, (el) => {
            const name = el.closest(".ct-combat-attack,.ddbc-combat-attack")
                .find(".ct-combat-attack__name .ct-combat-attack__label,.ddbc-combat-attack__name .ddbc-combat-attack__label")
                .trigger('click').text();
            let pane = null;
            let paneClass = null;
            // Need to check all types of panes to find the right one;
            for (paneClass of ["ct-item-pane", "ct-action-pane", "ct-custom-action-pane", "ct-spell-pane"]) {
                pane = $("." + paneClass);
                if (pane.length > 0)
                    break;
            }
            const pane_name = pane.find(".ct-sidebar__heading").text();

            if (name == pane_name) {
                execute(paneClass, force_to_hit_only, force_damages_only);
            } else {
                quick_roll_force_attack = force_to_hit_only;
                quick_roll_force_damge = force_damages_only;
                quick_roll = true;
            }
        });
    }

    for (let action of actions.toArray()) {
        activateQRAction(action, false, false);
    }
    for (let action of actions_to_hit.toArray()) {
        activateQRAction(action, true, false);
    }
    for (let action of actions_damage.toArray()) {
        activateQRAction(action, false, true);
    }

    const activateQRSpell = (spell, force_to_hit_only, force_damages_only) => {
        spell = $(spell);
        // To the right for attack and damage, to the left for to hit
        const position = force_to_hit_only ? 'left' : 'right';
        activateTooltipListeners(spell, position, beyond20_tooltip, (el) => {
            const name_element = el.closest(".ct-spells-spell,.ddbc-spells-spell")
                .find(".ct-spell-name,.ddbc-spell-name");
            const name = name_element.trigger('click').text();
            // If same item, clicking will be a noop && it won't modify the document;
            const pane_name = $(".ct-spell-pane .ct-sidebar__heading .ct-spell-name,.ct-spell-pane .ct-sidebar__heading .ddbc-spell-name").text();
            if (name == pane_name) {
                // For spells, check the spell level. DNDB doesn't switch to the right level when clicking the spell if
                // it's already the right spell (but wrong level)
                const castas = $(".ct-spell-caster__casting-level-current").text()
                const level = el.closest(".ct-content-group").find(".ct-content-group__header-content").text();
                const pane_level = castas === "" ? "Cantrip" : `${castas} Level`;
                if (pane_level.toLowerCase() === level.toLowerCase()) {
                    execute("ct-spell-pane", force_to_hit_only, force_damages_only);
                } else {
                    // Trigger a click elsewhere to cause the sidepanel to change and then force it again to display the right level spell
                    $(".ddbc-character-tidbits__menu-callout").trigger('click');
                    name_element.trigger('click');
                    quick_roll_force_attack = force_to_hit_only;
                    quick_roll_force_damge = force_damages_only;
                    quick_roll = true;
                }
            } else {
                quick_roll_force_attack = force_to_hit_only;
                quick_roll_force_damge = force_damages_only;
                quick_roll = true;
            }
        });
    }
    for (let spell of spells.toArray()) {
        activateQRSpell(spell, false, false);
    }
    for (let spell of spells_to_hit.toArray()) {
        activateQRSpell(spell, true, false);
    }
    for (let spell of spells_damage.toArray()) {
        activateQRSpell(spell, false, true);
    }
}

function executeQuickRoll(paneClass) {
    quick_roll_timeout = 0;
    console.log("EXECUTING QUICK ROLL!");
    execute(paneClass, quick_roll_force_attack, quick_roll_force_damage);
    quick_roll_force_attack = false;
    quick_roll_force_damage = false;
    quick_roll = false;
}

function documentModified(mutations, observer) {
    if (isExtensionDisconnected()) {
        deactivateQuickRolls();
        observer.disconnect();
        return;
    }

    character.updateInfo();
    injectRollToSpellAttack();
    injectRollToSnippets();
    injectSettingsButton();
    activateQuickRolls();
    if (character._features_needs_refresh && !character._features_refresh_warning_displayed) {
        character._features_refresh_warning_displayed = true;
        alertify.alert("This is a new or recently leveled-up character sheet and Beyond20 needs to parse its information. <br/>Please select the <strong>'Features &amp; Traits'</strong> panel for Beyond20 to parse this character's features and populate the character-specific options.");
    }

    const pane = $(".ct-sidebar__pane-content > div");
    if (pane.length > 0) {
        for (let div = 0; div < pane.length; div++) {
            const paneClass = pane[div].className;
            if (paneClass == "ct-sidebar__pane-controls" || paneClass == "ct-beyond20-settings-pane") {
                continue;
            }
            console.log("Beyond20: New side panel is : " + paneClass);
            injectRollButton(paneClass);
            if (quick_roll) {
                if (quick_roll_timeout > 0)
                    clearTimeout(quick_roll_timeout);
                quick_roll_timeout = setTimeout(() => executeQuickRoll(paneClass), 50);
            }
        }
    }
}

function updateSettings(new_settings = null) {

    if (new_settings) {
        settings = new_settings;
        character.setGlobalSettings(settings);
    } else {
        getStoredSettings((saved_settings) => {
            updateSettings(saved_settings);
            documentModified();
        }
        );
    }
}

function handleMessage(request, sender, sendResponse) {
    console.log("Got message : ", request);
    if (request.action == "settings") {
        if (request.type == "general") {
            updateSettings(request.settings);
        } else if (request.type == "character" && request.id == character._id) {
            character.updateSettings(request.settings);
        } else {
            console.log("Ignoring character settings, for ID: ", request.id);
        }
    } else if (request.action == "get-character") {
        character.updateInfo();
        sendResponse(character.getDict());
    } else if (request.action == "open-options") {
        alertFullSettings();
    }
}

var settings = getDefaultSettings();
var character = new Character(settings);
var creature = null;
updateSettings();
chrome.runtime.onMessage.addListener(handleMessage);
observer = new window.MutationObserver(documentModified);
observer.observe(document, { subtree: true, childList: true, characterData: true });
chrome.runtime.sendMessage({ "action": "activate-icon" });
