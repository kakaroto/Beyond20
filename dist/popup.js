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
    },
    "paladin-sacred-weapon": {
        "title": "Oath of Devotion: Sacred Weapon",
        "description": "Your charisma and deity guide your attacks",
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

function sendMessageToTab(tab_id, message, callback) {
    if (chrome.tabs) {
        chrome.tabs.sendMessage(tab_id, message, callback);
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
        if (Object.keys(response.classes).includes("Rogue")) {
            e = createHTMLOption("rogue-sneak-attack", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Disciple of Life")) {
            e = createHTMLOption("cleric-disciple-life", false, character_settings);
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
        if (response["feats"].includes("Sharpshooter")) {
            e = createHTMLOption("sharpshooter", false, character_settings);
            options.append(e);
        }
        if (response["feats"].includes("Great Weapon Master")) {
            e = createHTMLOption("great-weapon-master", false, character_settings);
            options.append(e);
        }
        if (response["class-features"].includes("Brutal Critical") ||
            response["racial-traits"].includes("Savage Attacks")) {
            e = createHTMLOption("brutal-critical", false, character_settings);
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
        if (response["class-features"].includes("Giant Might")) {
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
        if (response["class-features"].includes("Psychic Blades")) {
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