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

    "custom-domains": {
        "title": "List of custom domains to load Beyond20",
        "description": "Enter a list of custom domain URLs to load Beyond20 into.\nOne domain per line, you must include the http:// or https:// protocol and you can use wildcards for subdomains and path.\nThis can be used to send Beyond20 requests to sites that may independently support Beyond20.\nFor example: https://my-new-custom-vtt.com/*/game",
        "type": "special",
        "default": [],
        "advanced": true
        // callbacks will be added after the functions are defined
    },
    "roll20-discord-activity": {
        "title": "Support Roll20 Discord Activity",
        "description": "Integrate with Roll20's Discord Activity.\nThis requires opening Discord in the browser so Beyond20 can be loaded and communicate with the activity.",
        "type": "special",
        "default": null,
        "advanced": true
        // callbacks will be added after the functions are defined
    },

    "hide-results-on-whisper-to-discord": {
        "title": "Hide roll results on D&D Beyond when whispering to Discord",
        "description": "Don't show the roll results on D&D Beyond when using whisper and sending results to \"D&D Beyond Dice Roller & Discord\"",
        "type": "bool",
        "default": false,
        "advanced": true
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
        "default": true,
        "advanced": true
    },

    "use-digital-dice": {
        "short": "Use D&D Beyond's Digital Dice",
        "title": "Use D&D Beyond's Digital Dice",
        "description": "Integrate with D&D Beyond's Digital Dice, rolling the dice on the screen and sending the pre-calculated results to the VTT.",
        "type": "bool",
        "default": true
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
        "default": false,
        "advanced": true
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
        "title": "Force all attacks/damage rolls as Critical Hits",
        "description": "Forces all attacks to be considered as critical hits. Useful for melee attacks against paralyzed enemies or using adamantine weapons against objects",
        "short": "Force Critical Hits",
        "short_description": "Useful for crit damage rolls or melee attacks against paralyzed enemies or using adamantine weapons against objects",
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

    "hotkeys-bindings": {
        "title": "Define custom hotkeys",
        "description": "Set custom hotkeys for controlling Beyond20's behavior.",
        "type": "special",
        "default": null
        // callbacks will be added after the functions are defined
    },

    "sticky-hotkeys": {
        "title": "Sticky Hotkeys: no need to hold the button",
        "description": "Allows you to press a hotkey instead of holding it to toggle the assigned ability for the next roll.",
        "type": "bool",
        "default": false
    },

    "roll20-template": {
        "title": "Roll20 Character Sheet Setting",
        "description": "Select the Character Sheet Template that you use in Roll20\n" +
            "If the template does not match the campaign setting, it will default to the Beyond20 Roll Renderer.",
        "type": "combobox",
        "default": "roll20",
        "choices": { "roll20": "D&D 5E By Roll20", "default": "Default Roll20 template", "beyond20": "Beyond20 Roll Renderer" },
        "advanced": true
    },

    "notes-to-vtt": {
        "title": "Send custom text to the VTT",
        "description": "In the \"Notes\" or \"Description\" section of any item, action, or spell on the D&D Beyond Character Sheet, "
            + "you may add your own custom text to be sent to the VTT as a message when you use that element's roll action."
            + "\nTo do this, format the text you wish to send as follows:"
            + "\n[[msg-type]] Put text you wish to send HERE[[/msg-type]]"
            + "\nReplace \"msg-type\" with one of the following: \"before\", \"after\", or \"replace\" depending on how you want to affect the message or action that would normally be sent to the VTT.",
        "type": "info",
        "advanced": true
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
        "default": true,
        "advanced": true
    },

    "subst-dndbeyond-stat-blocks": {
        "title": "Replace Dices formulas in D&D Beyond (Stat blocks)",
        "description": "In D&D Beyond, if a dice formula is found in the stat block of a creature, monster, vehicle,\n" +
            "enabling this will add a dice icon next to the formula to allow you to roll it.",
        "type": "bool",
        "default": true,
        "advanced": true
    },

    "handle-stat-blocks": {
        "title": "Add roll buttons to stat blocks",
        "description": "In D&D Beyond, adds roll buttons for abilities/saving throws/skills/actions to the stat block of a creature, monster or vehicle.",
        "type": "bool",
        "default": true,
        "advanced": true
    },

    "crit-prefix": {
        "title": "Critical Hit Prefix",
        "description": "Prefix to add to the Critical Hit dice result.\nIt might be less confusing to explicitely show the crit damage",
        "type": "string",
        "default": "Crit: ",
        "advanced": true
    },

    "components-display": {
        "title": "Components to display in spell attacks",
        "description": "When doing a spell attack, what components to show alongside the spell roll.",
        "type": "combobox",
        "default": "all",
        "choices": { "all": "All components", "material": "Only material components", "none": "Do not display anything" },
        "advanced": true
    },

    "component-prefix": {
        "title": "Component Prefix",
        "description": "Prefix to the components display of a spell attack.\nIf displaying material components only, you may want to set it to 'Materials used :' for example",
        "type": "string",
        "default": "Components: ",
        "advanced": true
    },

    "hidden-monster-replacement": {
        "title": "Hidden monster name",
        "description": "Text to use to replace the monster name and attack name for hidden monsters (whisper type)",
        "type": "string",
        "default": "???",
        "advanced": true
    },

    "combat-unknown-monster-name": {
        "title": "Unknown monster name replacement in encounters",
        "description": "Replace monster names in the combat tracker when they can't be mapped to tokens. Leave empty to not replace it.",
        "type": "string",
        "default": "Unknown Creature",
        "advanced": true
    },
    
    "roll20-spell-details-display": {
        "title": "Display Spell Details in spell attacks",
        "description": "When doing a spell attack, display the spell's details (Roll20 only toggle)",
        "type": "bool",
        "default": false
    },

    "roll20-spell-description-display": {
        "title": "Display Spell Descriptions in spell attacks",
        "description": "When doing a spell attack, display the spell's full description (Roll20 only toggle)",
        "type": "bool",
        "default": false
    },
    "weapon-handedness": {
        "title": "Always Show Weapon Handedness",
        "description": "On Versatile weapons, always show weapon-handedness, even if 1-handed or 2-handed is selected",
        "type": "bool",
        "default": false,
        "advanced": true
    },
    "roll-to-game-log": {
        "title": "Send Beyond20 roll results to game log",
        "description": "Send the roll results made by Beyond20 (not in the VTT) to the D&D Beyond Game Log",
        "type": "bool",
        "default": true,
        "advanced": true
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
        "icon": "/images/discord-logo.png",
        "icon-height": "100%",
        "icon-width": "auto"
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
        "default": true,
        "advanced": true
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
    "discord-display-description": {
        "title": "Display description in Discord",
        "description": "Display the roll's description in the Discord message",
        "type": "bool",
        "default": false,
        "advanced": true
    },

    "backup-settings": {
        "title": "Backup Beyond20 settings",
        "description": "Export your Beyond20 settings to a file for backup",
        "type": "special",
        "advanced": true,
        "default": null
    },
    "restore-settings": {
        "title": "Restore Beyond20 settings",
        "description": "Import your Beyond20 settings from a previously exported backup file",
        "type": "special",
        "advanced": true,
        "default": null
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
    },
    "donate-advanced": {
        "short": "Buy rations (1 day) to feed my familiar",
        "title": "Become a patron of the art of software development!",
        "description": "If you wish to support my work on Beyond 20 or my other D&D related project, subscribe to my patreon " +
            "or donate via paypal!\nI am grateful for your generosity!",
        "type": "link",
        "default": "https://beyond20.here-for-more.info/rations",
        "icon": "/images/donate.png",
        "icon-width": "64",
        "icon-height": "64",
        "advanced": true
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
    "custom-ability-modifier": {
        "title": "Custom magical modifier to raw ability checks",
        "description": "Add a custom modifier from magical items (Stone of Good Luck for example) to raw ability checks.",
        "type": "string",
        "default": ""
    },
    "custom-critical-limit": {
        "title": "Custom Critical limit",
        "description": "Set a custom threshold for the critical hit limit (if using homebrew magical items)",
        "type": "string",
        "default": ""
    },
    "artificer-alchemical-savant": {
        "title": "Artificer: Alchemist: Alchemical Savant",
        "description": "Use your Alchemist's supplies as spellcasting focus, dealing extra damage or healing equal to your Intelligence Modifier",
        "type": "bool",
        "default": true
    },
    "artificer-arcane-firearm": {
        "title": "Artificer: Artillerist: Use Arcane Firearm",
        "description": "Use an Arcane Firearm for your Artificer spells. Deals extra 1d8 damage",
        "type": "bool",
        "default": false
    },
    "artificer-arcane-jolt": {
        "title": "Artificer: Battle Smith: Arcane Jolt",
        "description": "Apply an Arcane Jolt to you or your Steel Defender's Weapon Attacks. Deals extra 2d6 damage, or 4d6 at Artificer Level 15+",
        "type": "bool",
        "default": false
    },
    "bard-joat": {
        "title": "Bard: Jack of All Trades",
        "description": "Add JoaT bonus to raw ability checks",
        "type": "bool",
        "default": true
    },
    "bard-psychic-blades": {
        "title": "Bard: College of Whispers: Psychic Blades",
        "description": "Use your Bardic Inspiration to deal extra psychic damage (Apply to next roll only)",
        "type": "bool",
        "default": false
    },
    "bard-spiritual-focus": {
        "title": "Bard: College of Spirits: Spiritual Focus",
        "description": "Use your Spiritual Focus to deal extra psychic damage, or apply extra healing",
        "type": "bool",
        "default": true
    },
    "barbarian-rage": {
        "title": "Barbarian: Rage! You are raging, ARRGGHHHHHH",
        "description": "Add Rage damage to melee attacks and add advantage to Strength checks and saving throws",
        "type": "bool",
        "default": false
    },
    "barbarian-divine-fury": {
        "title": "Barbarian: Path of the Zealot: Divine Fury",
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
    "cleric-blessed-strikes": {
        "title": "Cleric: Blessed Strikes",
        "description": "Deal an extra 1d8 damage on damaging cantrips and weapon attacks",
        "type": "bool",
        "default": true
    },
    "cleric-circle-of-mortality": {
        "title": "Cleric: Grave Domain: Circle of Mortality",
        "description": "Manipulating the line between life and death, your healing on a creature with 0 hp is maximized",
        "type": "bool",
        "default": false
    },
    "cleric-divine-strike": {
        "title": "Cleric: Divine Strike",
        "description": "Deal an extra 1d8 (2d8 at level 14) damage to weapon attacks",
        "type": "bool",
        "default": true
    },
    "druid-symbiotic-entity": {
        "title": "Druid: Circle of Spores: Symbiotic Entity",
        "description": "Your symbiotic entity lends its power to your melee weapon strikes.",
        "type": "bool",
        "default": false
    },
    "wildfire-spirit-enhanced-bond": {
        "title": "Druid: Circle of Wildfire: Enhanced Bond",
        "description": "The bond with your wildfire spirit enhances your destructive and restorative spells.",
        "type": "bool",
        "default": false
    },
    "champion-remarkable-athlete": {
        "title": "Fighter: Champion: Remarkable Athlete",
        "description": "Add Remarkable Athlete bonus to Strength/Dexterity/Constitution ability checks",
        "type": "bool",
        "default": true
    },
    "fighter-giant-might": {
        "title": "Fighter: Rune Knight: Giant’s Might",
        "description": "Activate Giant’s Might to get advantage on Strength checks and saving throws and deal 1d6 extra damage",
        "type": "bool",
        "default": false
    },
    "monk-diamond-soul": {
        "title": "Monk: Diamond Soul",
        "description": "Your proficiency with ki aids you even against the grasp of death",
        "type": "bool",
        "default": true
    },
    "paladin-improved-divine-smite": {
        "title": "Paladin: Improved Divine Smite",
        "description": "Roll an extra 1d8 radiant damage whenever you hit with a melee weapon",
        "type": "bool",
        "default": true
    },
    "paladin-invincible-conqueror": {
        "title": "Paladin: Oath of Conquest: Invincible Conqueror",
        "description": "You can harness extraordinary martial prowess for 1 minute.",
        "type": "bool",
        "default": false
    },
    "paladin-sacred-weapon": {
        "title": "Paladin: Oath of Devotion: Sacred Weapon",
        "description": "Your charisma and deity guide your attacks",
        "type": "bool",
        "default": false
    },
    "ranger-favored-foe": {
        "title": "Ranger: Favored Foe",
        "description": "You mark an enemy and your attacks hurt them to an increased degree",
        "type": "bool",
        "default": false
    },
    "fey-wanderer-dreadful-strikes": {
        "title": "Ranger: Fey Wanderer: Dreadful Strikes",
        "description": "Imbue your weapons and deal psychic damage to your the minds of your enemies.",
        "type": "bool",
        "default": false
    },
    "ranger-dread-ambusher": {
        "title": "Ranger: Gloom Stalker: Dread Ambusher (Apply to next roll only)",
        "description": "You skills in ambushing your enemies lend more damage to your initial strike",
        "type": "bool",
        "default": false
    },
    "ranger-planar-warrior": {
        "title": "Ranger: Horizon Walker: Planar Warrior",
        "description": "Use your Planar Warrior ability to deal extra Force damage",
        "type": "bool",
        "default": false
    },
    "ranger-colossus-slayer": {
        "title": "Ranger: Hunter's Prey: Colossus Slayer",
        "description": "Use your Colossus Slayer ability and add 1d8 damage to your target",
        "type": "bool",
        "default": true
    },
    "ranger-slayers-prey": {
        "title": "Ranger: Monster Slayer: Slayer's Prey",
        "description": "Use your Slayer's Prey ability and add 1d6 damage to your target",
        "type": "bool",
        "default": false
    },
    "ranger-natural-explorer": {
        "title": "Ranger: Natural Explorer",
        "description": "Your familiarity with the current region aids in your exploration",
        "type": "bool",
        "default": false
    },
    "ranger-gathered-swarm": {
        "title": "Ranger: Swarmkeeper: Gathered Swarm",
        "description": "Use your Gathered Swarm ability to add extra Force damage to your attacks",
        "type": "bool",
        "default": false
    },
    "rogue-sneak-attack": {
        "title": "Rogue: Sneak Attack",
        "description": "Send Sneak Attack damage with each attack roll",
        "type": "bool",
        "default": true
    },
    "rogue-assassinate": {
        "title": "Rogue: Assassin: Assassinate Surprise Attack (Apply to next roll only)",
        "description": "Roll with advantage and roll critical damage dice",
        "type": "bool",
        "default": false
    },
    "sorcerer-trance-of-order": {
        "title": "Sorcerer: Clockwork Soul: Trance of Order",
        "description": "Align your conciousness to the calculations of Mechanus. You enter a heightened state.",
        "type": "bool",
        "default": false
    },
    "eldritch-invocation-lifedrinker": {
        "title": "Warlock: Eldritch Invocation: Lifedrinker",
        "description": "Your pact weapon drips with necrotic energy, lending extra damage to your strikes",
        "type": "bool",
        "default": false
    },
    "warlock-the-celestial-radiant-soul": {
        "title": "Warlock: The Celestial: Radiant Soul",
        "description": "The pact with your Celestial enhances your radiant and fire spells.",
        "type": "bool",
        "default": true
    },
    "genies-vessel": {
        "title": "Warlock: The Genie: Genie's Wrath",
        "description": "You genie patron lends their wrath to your attacks.",
        "type": "bool",
        "default": true
    },
    "warlock-hexblade-curse": {
        "title": "Warlock: The Hexblade: Hexblade's Curse",
        "description": "Apply the Hexblade's Curse extra damage on attack rolls and score critical hits on rolls of 19 and 20",
        "type": "bool",
        "default": false
    },
    "warlock-grave-touched": {
        "title": "Warlock: The Undead: Grave Touched",
        "description": "Your attacks become necrotic, and apply extra damage",
        "type": "bool",
        "default": false
    },
    "wizard-bladesong": {
        "title": "Wizard: Bladesinger: Bladesong",
        "description": "Activate your Bladesong and make your weapon sing with magic",
        "type": "bool",
        "default": false
    },
    "empowered-evocation": {
        "title": "Wizard: Evocation Wizard: Empowered Evocation",
        "description": "Your prowess in Evocation lends power to your Evocation spells",
        "type": "bool",
        "default": true
    },
    "wizard-durable-magic": {
        "title": "Wizard: War Magic: Durable Magic",
        "description": "While concenctrating on a spell, your savings throws are fortified",
        "type": "bool",
        "default": false
    },
    "charger-feat": {
        "title": "Feat: Charger Extra Damage (Apply to next roll only)",
        "description": "You charge into battle, lending weight to your blow!",
        "type": "bool",
        "default": false
    },
    "great-weapon-master": {
        "title": "Feat: Great Weapon Master (Apply to next roll only)",
        "description": "Apply Great Weapon Master -5 penalty to roll and +10 to damage",
        "type": "bool",
        "default": false
    },
    "great-weapon-master-2024": {
        "title": "Feat: Great Weapon Master 2024",
        "description": "Heavy Weapon Mastery. Apply extra damage equals your Proficiency Bonus.",
        "type": "bool",
        "default": true
    },
    "sharpshooter": {
        "title": "Feat: Sharpshooter (Apply to next roll only)",
        "description": "Apply Sharpshooter -5 penalty to roll and +10 to damage",
        "type": "bool",
        "default": false
    },
    "brutal-critical": {
        "title": "Brutal Critical/Savage Attacks: Roll extra die",
        "description": "Roll extra damage die on crit for Brutal Critical and Savage Attacks features",
        "type": "bool",
        "default": true
    },
    "brutal-strike": {
        "title": "Brutal Strike: Roll extra die",
        "description": "If you use Reckless Attack, you can forgo any Advantage on one Strength-based attack roll of your choice on your turn.",
        "type": "bool",
        "default": false
    },
    "protector-aasimar-radiant-soul": {
        "title": "Aasimar: Protector: Radiant Soul",
        "description": "Unleash your divine soul to deal extra radiant damage equal to your level.",
        "type": "bool",
        "default": false
    },
    "motm-aasimar-radiant-soul": {
        "title": "Aasimar: Celestial Revelation: Radiant Soul",
        "description": "Unleash your divine soul to deal extra radiant damage equal to your proficiency.",
        "type": "bool",
        "default": false
    },
    "halfling-lucky": {
        "title": "Halfling: Lucky",
        "description": "The luck of your people guides your steps",
        "type": "bool",
        "default": true
    },
    "discord-target": {
        "title": "Discord Destination",
        "description": "Send rolls to a character specific Discord channel",
        "type": "special",
        "default": null
    },
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
function storageGetEverything(cb) {
    getStorage().get(null, cb);
}
function storageSetEverything(value, cb) {
    getStorage().set(value, cb);
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

function createHTMLOptionEx(name, option, short = false, {advanced=false}={}) {
    if (option.hidden || (short && !option.short) || !option.title)
        return null;
    if (!advanced && option.advanced) return null; // Hide advanced if not in advanced mode
    if (advanced && !option.advanced) return null; // Hide non-advanced if in advanced mode

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
                            src: option.icon.startsWith("/") ? chrome.runtime.getURL(option.icon) : option.icon
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

function createHTMLOption(name, short = false, _list = options_list, {advanced}={}) {
    return createHTMLOptionEx(name, _list[name], short, {advanced});
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
                    new_options.push("Another tab || " + campaign.toLowerCase() + " (No change)");
                } else {
                    new_options.push("A " + vtt_name + " " + campaign.toLowerCase() + " (No change)");
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
        attributes.style = "overflow: hidden; text-overflow: ellipsis;";
        options.push(E.li(attributes, E.a({ href: "#" }, name)));
    }
    for (let p of description_p)
        p.classList.add("select");

    return E.li({
        id: `beyond20-option-${name}`,
        class: "list-group-item beyond20-option beyond20-option-combobox"
    },
        E.label({ class: "list-content", for: name },
            E.h4({ class: "select" }, title),
            ...description_p,
            E.div({ class: "button-group" },
                E.a({ id: name, class: "input select beyond20-option-input", href: "", style: "overflow: hidden; text-overflow: ellipsis;" }, dropdown_options[0].name),
                E.ul({ class: "dropdown-menu", style: "max-width: 300px;" },
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
function fillDisordChannelsDropdown(name, dropdowns, triggerChange=false, _list = options_list) {
    const settings_line = $(`#beyond20-option-${name}`);
    if (settings_line.length == 0) return;
    const opt = _list[name];
    settings_line.replaceWith(createDiscordChannelsCombobox(name, opt.description, opt.title, dropdowns));
    const markaGroup = $(`#beyond20-option-${name}`)
    const dropdown_menu = $(markaGroup).find(".dropdown-menu");
    const button_group = $(markaGroup).find(".button-group");
    const input = $(markaGroup).find('.input');
    const m = initializeMarkaGroup(markaGroup);

    const active = dropdowns.find(d => d.active);
    input.text(active.name);
    input.attr("data-secret", active.secret.slice(0, 12));

    $(`#beyond20-option-${name} li`).off('click').click(ev => {
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
        fillDisordChannelsDropdown(name, dropdowns, true, _list);
    });
    $(`#beyond20-option-${name} li[data-action=add]`).off('click').click(ev => {
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
                    fillDisordChannelsDropdown(name, dropdowns, true, _list);
                });
            }, 100);
        });
    });
    $(`#beyond20-option-${name} li[data-action=delete]`).off('click').click(ev => {
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
            fillDisordChannelsDropdown(name, dropdowns, true, _list);
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

function createDiscordTargetSetting(name, short) {
    const opt = character_settings[name];
    const dropdowns = [{ name: "Send to default target", active: true, secret: "" }]
    return createDiscordChannelsCombobox(name, opt.description, opt.title, dropdowns);
}

function setDiscordTargetSetting(name, charSettings) {
    let val = charSettings[name];
    const dropdowns = [{ name: "Send to default target", active: false, secret: "" }]
    const channels = settings['discord-channels'] || []; // get settings from the global variable
    dropdowns.push(...channels)
    const selected = dropdowns.find(c => c.secret.slice(0, 12) === val);
    if (selected) selected.active = true;
    else dropdowns[0].active = true;

    fillDisordChannelsDropdown(name, dropdowns, false, character_settings);
}

function getDiscordTargetSetting(name) {
    return $(`#${name}`).attr("data-secret");
}

function getDiscordChannel(settings, character) {
    const channels = (settings["discord-channels"] || [])
    if (typeof (channels) === "string")
        return channels;
    const target = (character && character["discord-target"]) || null;
    return channels.find(c => target ? c.secret.slice(0, 12) === target : c.active);
}

let key_bindings = {
    ShiftLeft: "advantage",
    ControlLeft: "disadvantage",
    ShiftRight: "super_advantage",
    ControlRight: "super_disadvantage",
    AltLeft: "normal_roll"
};
try {
    // Mac OS X uses Command instead of Control, since Control+click = right click because mac mice have 1 button...
    if (getPlatform() === "Mac") {
        key_bindings.MetaLeft = "disadvantage";
        key_bindings.MetaRight = "super_disadvantage";
    }
} catch (err) {
    // Just in case...
}

const BINDING_NAMES = {
    "": "Click to configure hotkey",
    normal_roll: "Normal Roll",
    advantage: "Roll with Advantage",
    super_advantage: "Roll with Super Advantage",
    disadvantage: "Roll with Disadvantage",
    super_disadvantage: "Roll with Super Disadvantage",
    whisper: "Whisper Rolls",
    dont_whisper: "Don't Whisper Rolls",
    whisper_hide_names: "Hide Monster Name & Attack",
    force_critical: "Force Critical Hit Attack/Damage",
    versatile_one_handed: "Use Versatile Weapon One-handed",
    versatile_two_handed: "Use Versatile Weapon Two-handed",
    custom_modifier: "Custom Modifier",
    custom_damage: "Custom Damage",
    display_attack: "Display instead of rolling an Attack"
}

function configureHotKey(bindings, bindings_div, html, key) {
    const alert = $(`
        <div>
            Press a key to register the new hotkey.
        </div>
    `);
    if (key) {
        const keyName = key.replace(/^Key|^Digit/, "");
        alert.append($(`<div>Current key is : <strong>${keyName}</strong></div>`));
    }
    let newKey = null;
    const $window = $(window);
    const onKeydown = (event) => {
        $window.off('keydown', null, onKeydown);
        console.log(key, event)
        if ((key !== event.code && key !== event.key) &&
            (bindings[event.code] !== undefined || bindings[event.key] !== undefined)) {
            alertify.warning("Hotkey already in use");
            dialog.close();
            return;
        }
        newKey = event.code;
        let binding = bindings[key];
        let custom_formula = "";
        let permanent_toggle = false;
        if (binding.startsWith("custom_damage")) {
            custom_formula = binding.slice("custom_damage:".length).trim();
            binding = "custom_damage";
        } else if (binding.startsWith("custom_modifier")) {
            custom_formula = binding.slice("custom_modifier:".length).trim();
            binding = "custom_modifier";
        } else if (binding.startsWith("toggle-")) {
            permanent_toggle = true;
            binding = `option-${binding.slice("toggle-".length)}`;
        }
        const newKeyName = newKey.replace(/^Key|^Digit/, "");
        const actions = $(`
            <div>
                <div>
                    Select the action to perform when <strong>${newKeyName}</strong> is pressed :
                </div>
                <select style="margin: 5px;">
                    <option value="">None</option>
                </select>
                <div class="custom_formula" style="display: none">
                    <label style="margin: 5px;"> Custom Formula : 
                        <input type="text" value="${custom_formula}">
                    </label>
                </div>
                <div class="toggle_options" style="display: none">
                    <label style="margin: 5px;">
                        <b>Permanently toggle the setting when the hotkey is pressed</b>
                        <input type="checkbox" ${permanent_toggle ? "checked" : ""}>
                    </label>
                    <div>
                      <small>A temporary toggle will only apply while the hotkey is pressed</small>
                    </div>
                    <div>
                      <small>A permanent toggle will change the option until pressed again or changed from the settings</small>
                    </div>
                </div>
            </div>
        `)
        const select = actions.find("select");
        const custom_div = actions.find(".custom_formula");
        const toggles_div = actions.find(".toggle_options");
        let group = $(`<optgroup label="Override Global Settings"></optgroup>`);
        select.append(group);
        for (const action in BINDING_NAMES) {
            if (!action) continue;
            group.append($(`
                <option value="${action}" ${binding === action ? "selected": ""}>${BINDING_NAMES[action]}</option>
            `));
        }
        group = $(`<optgroup label="Toggle Character-Specific setting"></optgroup>`)
        select.append(group);
        for (const name in character_settings) {
            const option = character_settings[name];
            const action = `option-${name}`;
            if (option.hidden || option.type !== "bool") continue;
            group.append($(`
                <option value="${action}" ${binding === action ? "selected": ""}>${option.title}</option>
            `));
        }
        select.on('input', ev => {
            const value = select.val();
            if (value.startsWith("custom_modifier") || value.startsWith("custom_damage")) {
                custom_div.show();
            } else {
                custom_div.hide();
            }
            if (value.startsWith("option-")) {
                toggles_div.show();
            } else {
                toggles_div.hide();
            }
        });
        select.trigger('input');
        alert.empty().append(actions)
    };
    const onOK = () => {
        $window.off('keydown', null, onKeydown);
        if (!newKey) return;
        let action = alert.find("select").val() || "";
        const custom_formula = alert.find(".custom_formula input").val() || "";
        if (action === "custom_modifier" || action === "custom_damage") {
            action = `${action}: ${custom_formula}`;
        }
        if (action.startsWith("option-")) {
            const toggle = alert.find(".toggle_options input")[0].checked;
            if (toggle) {
                action = action.replace(/^option-/, "toggle-")
            }
        }
        html.remove();
        delete bindings[key];
        bindings[newKey] = action;
        addHotKeyToUI(bindings, bindings_div, newKey);
    }
    const onCancel = () => {
        $window.off('keydown', null, onKeydown);
    };
    $window.on('keydown', onKeydown);
    if (alertify.Beyond20HotkeyConfirm === undefined)
        alertify.dialog('Beyond20HotkeyConfirm', function () { return {}; }, false, "confirm");
    const dialog = alertify.Beyond20HotkeyConfirm('Configure Hotkey', alert[0], () => onOK(), () => onCancel());
}

function getHotKeyBindingName(key) {
    let name = BINDING_NAMES[key] || key;
    if (name.startsWith("option-") && character_settings[name.slice("option-".length)]) {
        name = character_settings[name.slice("option-".length)].title;
    }
    if (name.startsWith("toggle-") && character_settings[name.slice("toggle-".length)]) {
        name = character_settings[name.slice("toggle-".length)].title + "✅";
    }
    if (name.startsWith("custom_modifier:")) {
        name = BINDING_NAMES["custom_modifier"] + ": " + name.slice("custom_modifier:".length);
    }
    if (name.startsWith("custom_damage:")) {
        name = BINDING_NAMES["custom_damage"] + ": " + name.slice("custom_damage:".length);
    }
    return name;
}

function addHotKeyToUI(bindings, bindings_div, key) {
    const binding_name = getHotKeyBindingName(bindings[key]);
    const keyName = (key || "").replace(/^Key|^Digit/, "");
    const html = $(`
        <div style="border-bottom: 1px grey solid; display: flex; justify-content: space-between;">
            <div class="hotkey-event" style="cursor: pointer; flex-shrink: 1; padding: 5px; font-weight: bold;">${keyName}</div>
            <div class="hotkey-action" style="cursor: pointer; overflow: hidden; text-overflow: ellipsis; text-align: center; padding: 5px; flex-grow: 1;">${binding_name}</div>
            <span class="delete-hotkey" style="width:15px; height:15px; padding: 3px; flex-shrink: 1;font-weight: 900; font-size: medium;">X</span>
        </div>
    `);
    html.find(".delete-hotkey").click(ev => {
        html.remove();
        delete bindings[key];
        if (Object.keys(bindings).length == 0) {
            bindings_div.find(".no-bindings").show();
            bindings_div.find(".bindings-header").css({display: "none"});
        }
    });
    html.find(".hotkey-event, .hotkey-action").click(ev => {
        configureHotKey(bindings, bindings_div, html, key);
    });
    bindings_div.append(html);
    return html;
}

async function promptHotkeyManager(bindings) {
    // Use defaults if value is invalid or never set
    if (!bindings)
        bindings = {...key_bindings};
    console.log("Hotkeys manager");
    const manager = $(`
    <div class="hotkeys-manager">
        <div class="key-bindings">
            <div class="bindings-header" style="border: 1px grey solid; border-radius: 5px; display: none; justify-content: space-between">
                <div style="flex-shrink: 1; padding: 5px; font-weight: bold;">Hotkey</div>
                <div style="flex-grow: 1; padding: 5px; text-align: center; font-weight: bold;">Action</div>
                <div style="flex-shrink: 1; padding: 5px; font-weight: bold;">Delete</div>
            </div>
            <span class="no-bindings">No key bindings configured.</span>
        </div>
        <div class="save">
            <button class="btn add-hotkey">Add new Hotkey</button>
        </div>
    </div>
    `)
    const bindings_div = manager.find(".key-bindings");
    const add_button = manager.find("button.add-hotkey");
    for (const key in bindings) {
        addHotKeyToUI(bindings, bindings_div, key);
    }
    if (Object.keys(bindings).length > 0) {
        bindings_div.find(".no-bindings").hide();
        bindings_div.find(".bindings-header").css({display: "flex"});
    }
    add_button.click(ev => {
        if (bindings[null] !== undefined) return;
        bindings[null] = "";
        const html = addHotKeyToUI(bindings, bindings_div, null);
        bindings_div.find(".no-bindings").hide();
        bindings_div.find(".bindings-header").css({display: "flex"});
        configureHotKey(bindings, bindings_div, html, null)
    });

    return new Promise(resolve => {
        alertify.confirm('Beyond20 Hotkey Manager', manager[0], () => {
            delete bindings[null];
            resolve(bindings);
        }, () => {});
    });
}

function openHotkeyManager(button) {
    let bindings = null;
    try {
        bindings = JSON.parse(button.attr("data-bindings"));
    } catch (err) {}

    promptHotkeyManager(bindings).then(new_bindings => {
        button.attr("data-bindings", JSON.stringify(new_bindings));
        button.trigger("change");
    });
}
function createHotkeysSetting(name, short) {
    const opt = options_list[name];
    const description_p = opt.description.split("\n").map(desc => E.p({}, desc));
    for (let p of description_p)
        p.classList.add("select");

    const setting = E.li({
        id: "beyond20-option-hotkeys-bindings",
        class: "list-group-item beyond20-option beyond20-option-bool" 
    },
        E.label({ class: "list-content", for: name },
            E.h4({}, opt.title),
            ...description_p,
            E.div({ class: "save button-group" },
                E.button({ id: name, name, class: "beyond20-option-input btn", type: "button", "data-bindings": "" }, "Set Hotkeys"),
            )
        )
    );
    const button = $(setting).find("button");
    button.click(ev => {
        ev.stopPropagation();
        ev.preventDefault();
        openHotkeyManager(button);
    });

    return setting;
}
function setHotkeysSetting(name, settings) {
    const val = getKeyBindings(settings);
    const button = $(`#${name}`);
    button.attr("data-bindings", JSON.stringify(val));
}
function getHotkeysSetting(name) {
    const button = $(`#${name}`);
    try {
        return JSON.parse(button.attr("data-bindings"));
    } catch (err) {
        // Fallback on current settings or on default
        return {...key_bindings};
    }
}
function getKeyBindings(settings) {
    if (!settings['hotkeys-bindings']) return key_bindings;
    const bindings = settings['hotkeys-bindings'];
    
    // Migrate < 2.5 to 2.5+ custom modifier/damage key bindings
    for (const key in bindings) {
        const binding = bindings[key];
        for (const dice of [4, 6, 8, 10, 12]) {
            if (binding === `custom_add_damage_d${dice}`) {
                bindings[key] = `custom_damage: + 1d${dice}`;
            } else if (binding === `custom_add_d${dice}`) {
                bindings[key] = `custom_modifier: + 1d${dice}`;
            } else if (binding === `custom_sub_d${dice}`) {
                bindings[key] = `custom_modifier: - 1d${dice}`;
            }
        }
    }
    return bindings;
}


function createCustomDomainsSetting(name, short) {
    const opt = options_list[name];
    const description_p = opt.description.split("\n").map(desc => E.p({}, desc));
    for (let p of description_p)
        p.classList.add("select");
    const apply_button = E.div({class: "save button-group"},
        E.span({}, "You", E.b({}, " must "), " press Apply to request missing permissions"),
        E.button({ class: "beyond20-option-input btn", type: "button"}, "Apply")
    );
    const setting = E.li({
        id: "beyond20-option-custom-domains",
        class: "list-group-item beyond20-option beyond20-option-text" 
    },
        E.label({ class: "list-content", for: name },
            E.h4({}, opt.title),
            ...description_p,
            E.div({},
                E.textarea({ id: name, name, class: "beyond20-option-input"}),
            ),
            apply_button
            
        )
    );
    const button = $(setting).find("button");
    button.click(ev => {
        ev.stopPropagation();
        ev.preventDefault();
        const domains = getCustomDomainsSetting(name);
        for (const url of domains) {
            const chromeOrBrowser = getBrowser() === "Firefox" ? browser : chrome;
            if (!chromeOrBrowser.permissions) {
                alertify.error("Cannot request permissions. Please open the extension's options page and try again");
                return;
            }
            chromeOrBrowser.permissions.request({origins: [url]}).then((response) => {
                if (response) {
                    console.log("Permission was granted");
                    alertify.success(`Beyond20 will now load automatically on ${url}`);
                } else {
                    console.log("Permission was refused");
                    alertify.error(`Error requesting permission for ${url}`);
                }
            }).catch(err => {
                console.error("Error requesting permission for ", url, err);
            });
        }
    });

    return setting;
}
function setCustomDomainsSetting(name, settings) {
    const textarea = $(`#${name}`);
    textarea.val(settings["custom-domains"].join("\n"));
}
function getCustomDomainsSetting(name) {
    const textarea = $(`#${name}`);
    const domains = textarea.val().split("\n");
    const cleaned = domains.filter(url => {
        // Check for a URL with maybe a wildcard subdomain but valid domain and ignore the path portion
        return /^https?:\/\/(?:\*.)?(localhost|[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6})/.test(url);
    })
    textarea.val(cleaned.join("\n"));
    return cleaned;
}


function createRoll20DiscordActivitySetting(name, short) {
    const opt = options_list[name];
    const description_p = opt.description.split("\n").map(desc => E.p({}, desc));
    for (let p of description_p)
        p.classList.add("select");
    const apply_button = E.div({class: "save button-group"},
        E.span({id: name, name}, "🚫 Permissions missing"),
        E.button({ class: "beyond20-option-input btn", type: "button"}, "Request")
    );
    const label = E.div({ class: "save button-group" },
        E.span({id: name, name}, "✅ Permissions granted"),
        E.button({ class: "beyond20-option-input btn", type: "button"}, "Revoke")
    );
    const setting = E.li({
        id: "beyond20-option-roll20-discord-activity",
        class: "list-group-item beyond20-option beyond20-option-text" 
    },
        E.label({ class: "list-content", for: name },
            E.h4({}, opt.title),
            ...description_p,
            apply_button,
            label,
        )
    );
    const button = $(apply_button).find("button");
    button.click(ev => {
        ev.stopPropagation();
        ev.preventDefault();
        const chromeOrBrowser = getBrowser() === "Firefox" ? browser : chrome;
        if (!chromeOrBrowser.permissions) {
            alertify.error("Cannot request permissions. Please open the extension's options page and try again");
            return;
        }
        chromeOrBrowser.permissions.request(DISCORD_ACTIVITY_PERMISSION_DETAILS).then((response) => {
            if (response) {
                console.log("Permission was granted");
                alertify.success(`Beyond20 will now load automatically on Roll20 Discord activity`);
                $(label).show();
                $(apply_button).hide();
                chrome.runtime.sendMessage({ "action": "discord-permissions-updated", permissions: true });
            } else {
                console.log("Permission was refused");
                alertify.error(`Error requesting permission for Roll20 Discord activity`);
            }
        });
    });
    // Hide both the apply button and checkbox until we know if we have the permissions
    $(label).hide();
    $(apply_button).hide();
    const revokeButton = $(label).find("button");
    const chromeOrBrowser = getBrowser() === "Firefox" ? browser : chrome;
    if (chromeOrBrowser.permissions) {
        chromeOrBrowser.permissions.contains(DISCORD_ACTIVITY_PERMISSION_DETAILS).then((hasPermission) => {
            if (hasPermission) {
                $(label).show();
            } else {
                $(apply_button).show();
            }
        });
    } else {
        // No permissions API? Probably an alertify options dialog on Firefox, assume no permissions found
        $(apply_button).show();
    }
    revokeButton.click(ev => {
        ev.stopPropagation();
        ev.preventDefault();
        if (!chromeOrBrowser.permissions) {
            alertify.error("Cannot revoke permissions. Please open the extension's options page and try again");
            return;
        }
        chromeOrBrowser.permissions.remove(DISCORD_ACTIVITY_PERMISSION_DETAILS).then((removed) => {
            if (removed) {
                $(label).hide();
                $(apply_button).show();
                chrome.runtime.sendMessage({ "action": "discord-permissions-updated", permissions: false });
            }
        });
    });

    return setting;
}
function setRoll20DiscordActivitySetting(name, settings) {
}
function getRoll20DiscordActivitySetting(name) {
}

function createBackupRestoreSetting(name, short) {
    const backup = (name === "backup-settings");
    const opt = options_list[name];
    const description_p = opt.description.split("\n").map(desc => E.p({}, desc));
    const label = backup ? "Export" : "Import";
    // If import, add a hidden file input
    if (!backup) {
        description_p.push(E.input({
            style: "display: none;",
            type: "file",
            accept: ".json",
        }))
    }
    const setting = E.li({
        id: `beyond20-option-${name}`,
        class: "list-group-item beyond20-option beyond20-option-text" 
    },
        E.label({ class: "list-content", for: name },
            E.h4({}, opt.title),
            ...description_p,
            E.div({class: "save button-group"},
                E.button({ class: "beyond20-option-input btn", type: "button"}, label),
            )
        )
    );
    const button = $(setting).find("button");
    const input = $(setting).find("input");
    button.click(ev => {
        ev.stopPropagation();
        ev.preventDefault();
        if (backup) {
            // Export
            storageGetEverything(allSettings => {
                allSettings.beyond20 = {format: 1};
                const blob = new Blob([JSON.stringify(allSettings)], {type: "application/json"});
                saveAs(blob, "Beyond20.json");
            });
        } else {
            // Import
            input.click();
        }
    });
    if (!backup) {
        input.on('change', (ev) => {
            if (input[0].files.length === 0) return;
            const file = input[0].files[0];
            const fr = new FileReader();
            fr.addEventListener("load", () => {
                try {
                    const allSettings = JSON.parse(fr.result);
                    if (!allSettings.beyond20 || allSettings.beyond20.format !== 1) {
                        throw new Error("File doesn't contain Beyond20 settings");
                    }
                    delete allSettings.beyond20;
                    storageSetEverything(allSettings, () => {
                        for (const key in allSettings) {
                            if (key === "settings") {
                                chrome.runtime.sendMessage({ "action": "settings", "type": "general", "settings": allSettings[key] });
                            } else if (key.startsWith("character-")) {
                                const id = key.slice("character-".length);
                                chrome.runtime.sendMessage({ "action": "settings", "type": "character", "id": id, "settings": allSettings[key] })
                            }
                        }
                        alertify.success("Beyond20 settings loaded successfully");
                    });
                } catch (err) {
                    alertify.error(`Unable to load selected file : ${err.message}`);
                }
            }, false);
            fr.addEventListener("error", (ev) => {
                alertify.error("Unable to load selected file");
            }, false);
            fr.readAsText(file);
        })
    }

    return setting;
}
function setBackupRestoreSetting(name, settings) {
}
function getBackupRestoreSetting(name) {
}

options_list["vtt-tab"]["createHTMLElement"] = createVTTTabSetting;
options_list["vtt-tab"]["set"] = setVTTTabSetting;
options_list["vtt-tab"]["get"] = getVTTTabSetting;
options_list["discord-channels"]["createHTMLElement"] = createDiscordChannelsSetting;
options_list["discord-channels"]["set"] = setDiscordChannelsSetting;
options_list["discord-channels"]["get"] = getDiscordChannelsSetting;
options_list["hotkeys-bindings"]["createHTMLElement"] = createHotkeysSetting;
options_list["hotkeys-bindings"]["set"] = setHotkeysSetting;
options_list["hotkeys-bindings"]["get"] = getHotkeysSetting;
options_list["custom-domains"]["createHTMLElement"] = createCustomDomainsSetting;
options_list["custom-domains"]["set"] = setCustomDomainsSetting;
options_list["custom-domains"]["get"] = getCustomDomainsSetting;
options_list["roll20-discord-activity"]["createHTMLElement"] = createRoll20DiscordActivitySetting;
options_list["roll20-discord-activity"]["set"] = setRoll20DiscordActivitySetting;
options_list["roll20-discord-activity"]["get"] = getRoll20DiscordActivitySetting;
character_settings["discord-target"]["createHTMLElement"] = createDiscordTargetSetting;
character_settings["discord-target"]["set"] = setDiscordTargetSetting;
character_settings["discord-target"]["get"] = getDiscordTargetSetting;

options_list["backup-settings"]["createHTMLElement"] = createBackupRestoreSetting;
options_list["backup-settings"]["set"] = setBackupRestoreSetting;
options_list["backup-settings"]["get"] = getBackupRestoreSetting;

options_list["restore-settings"]["createHTMLElement"] = createBackupRestoreSetting;
options_list["restore-settings"]["set"] = setBackupRestoreSetting;
options_list["restore-settings"]["get"] = getBackupRestoreSetting;
