console.log("Beyond20: D&D Beyond module loaded.");

function sendRollWithCharacter(rollType, fallback, args) {
    const preview = $(".ct-sidebar__header-preview > div").css('background-image');
    if (preview && preview.startsWith("url("))
        args.preview = preview.slice(5, -2);
    // Add halfling luck
    if (character.hasRacialTrait("Lucky") && character.getSetting("halfling-lucky", false) && ["skill", "ability", "saving-throw", "death-save",
        "initiative", "attack", "spell-attack"].includes(rollType)) {
        args.d20 = args.d20 || "1d20";
        args.d20 += "ro<=1";
    }
    return sendRoll(character, rollType, fallback, args);
}


async function rollSkillCheck(paneClass) {
    const skill_name = $("." + paneClass + "__header-name").text();
    let ability = $("." + paneClass + "__header-ability").text();
    let modifier = $("." + paneClass + "__header-modifier").text();
    const proficiency = $("." + paneClass + "__header-icon .ct-tooltip,." + paneClass + "__header-icon .ddbc-tooltip").attr("data-original-title");

    
    if (ability == "--" && character._abilities.length > 0) {
        let prof = "";
        let prof_val = 0;
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
            modifier = mod >= 0 ? `+${mod}` : `${mod}`;
        }
    }
    //console.log("Skill " + skill_name + " (" + ability + ") : " + modifier);
    const roll_properties = {
        "skill": skill_name,
        "ability": ability,
        "modifier": modifier,
        "proficiency": proficiency
    }
    const adjustments = $(`.${paneClass}__dice-adjustments`);
    let query = "";
    let hasRestriction = false;
    for (const adj of adjustments.find(".ct-dice-adjustment-summary").toArray()) {
        const adv =  $(adj).find(".ddbc-advantage-icon").length > 0;
        const restriction = $(adj).find(".ct-dice-adjustment-summary__restriction").text();
        const origin = $(adj).find(".ct-dice-adjustment-summary__data-origin").text();
        query += `${query ? "\n" : ""}${adv ? "Advantage: " : "Disadvantage : "} ${restriction} ${origin}`;
        hasRestriction |= !!restriction;
    }
    roll_properties["advantage-query"] = query;
    if(character.getGlobalSetting("roll-type", RollType.NORMAL) != RollType.QUERY) {
        const skill_badge_adv =  adjustments.find(".ddbc-advantage-icon").length > 0;
        const skill_badge_disadv = adjustments.find(".ddbc-disadvantage-icon").length > 0;

        if (hasRestriction || (skill_badge_adv && skill_badge_disadv)) {
            roll_properties["advantage"] = RollType.QUERY;
        } else if (skill_badge_adv) {
            roll_properties["advantage"] = RollType.OVERRIDE_ADVANTAGE;
        } else if (skill_badge_disadv) {
            roll_properties["advantage"] = RollType.OVERRIDE_DISADVANTAGE;
        }
    }
    if (ability == "STR" &&
        ((character.hasClassFeature("Rage") && character.getSetting("barbarian-rage", false)) ||
            (character.hasClassFeature("Giant’s Might") && character.getSetting("fighter-giant-might", false)))) {
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
    
    // Sorcerer: Clockwork Soul - Trance of Order
    if (character.hasClassFeature("Trance of Order") && character.getSetting("sorcerer-trance-of-order", false))
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

    // Mark of Detection Half-Elf - Deductive Intuition
    if (character.hasRacialTrait("Deductive Intuition") && (skill_name == "Investigation" || skill_name == "Insight")) {
        roll_properties.modifier += "+1d4";
    }

    // Mark of Shadow Elf - Cunning Intuition
    if (character.hasRacialTrait("Cunning Intuition") && (skill_name == "Performance" || skill_name == "Stealth")) {
        roll_properties.modifier += "+1d4";
    }

    // Mark of Storm Half-Elf Windwright's Intuition
    if (character.hasRacialTrait("Windwright’s Intuition") && skill_name == "Acrobatics") {
        roll_properties.modifier += "+1d4";
    }

    // Mark of Warding Dwarf - Warder's Intuition
    if (character.hasRacialTrait("Warder’s Intuition") && skill_name == "Investigation") {
        roll_properties.modifier += "+1d4";
    }

    // Mark of Scribing Gnome - Gifted Scribe
    if (character.hasRacialTrait("Gifted Scribe") && skill_name == "History") {
        roll_properties.modifier += "+1d4";
    }

    // Mark of Healing Halfing - Healing Touch
    if (character.hasRacialTrait("Healing Touch") && skill_name == "Medicine") {
        roll_properties.modifier += "+1d4";
    }

    // Mark of Hospitality Halfing - Ever Hospitable
    if (character.hasRacialTrait("Ever Hospitable") && skill_name == "Persuasion") {
        roll_properties.modifier += "+1d4";
    }

    // Mark of Finding Half-Orc/Human - Hunter's Intuition
    if (character.hasRacialTrait("Hunter’s Intuition") && (skill_name == "Perception" || skill_name == "Survival")) {
        roll_properties.modifier += "+1d4";
    }

    // Mark of Handling Human - Wild Intuition
    if (character.hasRacialTrait("Wild Intuition") && (skill_name == "Animal Handling" || skill_name == "Nature")) {
        roll_properties.modifier += "+1d4";
    }

    // Mark of Making Human - Artisan's Intuition
    if (character.hasRacialTrait("Artisan’s Intuition") && skill_name == "Arcana") {
        roll_properties.modifier += "+1d4";
    }

    // Mark of Passage Human - Intuitive Motion
    if (character.hasRacialTrait("Intuitive Motion") && skill_name == "Acrobatics") {
        roll_properties.modifier += "+1d4";
    }

    // Mark of Sentinel Human - Sentinel's Intuition
    if (character.hasRacialTrait("Sentinel’s Intuition") && (skill_name == "Insight" || skill_name == "Perception")) {
        roll_properties.modifier += "+1d4";
    }

    if (character.hasClassFeature("Natural Explorer") && character.getSetting("ranger-natural-explorer", false) &&
        (ability == "WIS" || ability == "INT") && (proficiency == "Proficiency" || proficiency == "Expertise")) {
        roll_properties.modifier += character._proficiency;
    }

    return sendRollWithCharacter("skill", "1d20" + modifier, roll_properties);
}

function rollAbilityOrSavingThrow(paneClass, rollType) {
    const ability_string = $("." + paneClass + " .ct-sidebar__heading").text();
    const ability_name = ability_string.split(" ")[0];
    const ability = ability_abbreviations[ability_name];
    let modifier = $(`.${paneClass}__modifier .ct-signed-number,.${paneClass}__modifier .ddbc-signed-number, span[class*='styles_modifier'] span[class*='styles_numberDisplay']`).text();

    if (rollType == "ability") {
        // Remarkable Athelete and Jack of All Trades don't stack, we give priority to RA instead of JoaT because
        // it's rounded up instead of rounded down.
        if (character.hasClassFeature("Remarkable Athlete") && character.getSetting("champion-remarkable-athlete", false) &&
            ["STR","DEX", "CON"].includes(ability)) {
            const remarkable_athlete_mod = Math.ceil(character._proficiency / 2);
            modifier = parseInt(modifier) + remarkable_athlete_mod;
            modifier = modifier >= 0 ? `+${modifier}` : `${modifier}`;
        } else if (character.hasClassFeature("Jack of All Trades") && character.getSetting("bard-joat", false)) {
            const JoaT = Math.floor(character._proficiency / 2);
            modifier = parseInt(modifier) + JoaT;
            modifier = modifier >= 0 ? `+${modifier}` : `${modifier}`;
        }
        if (character.getSetting("custom-ability-modifier", "")) {
            const custom = parseInt(character.getSetting("custom-ability-modifier", "0")) || 0;
            if (custom != 0)  {
                modifier = parseInt(modifier) + custom;
                modifier = modifier >= 0 ? `+${modifier}` : `${modifier}`;
            }
        }
    }

    const roll_properties = {
        "name": ability_name,
        "ability": ability,
        "modifier": modifier
    }

    if (rollType === "saving-throw") {
        const proficiency = $(`.ddbc-saving-throws-summary__ability--${ability.toLowerCase()}
                                .ddbc-saving-throws-summary__ability-proficiency .ddbc-tooltip`).attr("data-original-title");
        roll_properties["proficiency"] = proficiency;
    }

    if (ability == "STR" &&
        ((character.hasClassFeature("Rage") && character.getSetting("barbarian-rage", false)) ||
            (character.hasClassFeature("Giant’s Might") && character.getSetting("fighter-giant-might", false)))) {
        roll_properties["advantage"] = RollType.OVERRIDE_ADVANTAGE;
    }
    if (character.hasClassFeature("Indomitable Might") && ability == "STR") {
        const min = character.getAbility("STR").score - parseInt(modifier);
        roll_properties.d20 = `1d20min${min}`
    }

    // Concentration checks
    if (rollType == "saving-throw" && ability == "CON") {
        const has_warcaster = character.hasFeat("War Caster");
        const has_bladesong = character.hasClassFeature("Bladesong") && character.getSetting("wizard-bladesong", false);
        if (has_warcaster || has_bladesong) {
            const confirmation = has_bladesong ? 'Your Bladesong whispers: "Is this a Concentration Check?"' : 'Is this a Concentration Check?';
            // Using confirm because the parent function is not async
            if (confirm(confirmation)) {
                // Wizard Bladesong Concentration Check Bonus
                if (has_bladesong) {
                    const intelligence = character.getAbility("INT") || {mod: 0};
                    const mod = Math.max((parseInt(intelligence.mod) || 0), 1);
                    modifier = parseInt(modifier) + mod;
                    modifier = modifier >= 0 ? `+${modifier}` : `${modifier}`;
                    roll_properties["modifier"] = modifier;
                }
                // Feat - War Caster - Concentration Check Bonus
                if (has_warcaster) {
                    roll_properties["advantage"] = RollType.OVERRIDE_ADVANTAGE;
                }
            }
        }
    }
    
    // Wizard - War Magic - Saving Throw Bonus
    if (character.hasClassFeature("Durable Magic") && character.getSetting("wizard-durable-magic", false) &&
        rollType == "saving-throw") {
        modifier = parseInt(modifier) + 2;
        modifier = modifier >= 0 ? `+${modifier}` : `${modifier}`;
        roll_properties["modifier"] = modifier;
    }
    // Fey Wanderer Ranger - Otherworldly Glamour
    if (rollType == "ability" && character.hasClassFeature("Otherworldly Glamour") && ability == "CHA") {
        modifier = parseInt(modifier) + Math.max(character.getAbility("WIS").mod,1);
        modifier = modifier >= 0 ? `+${modifier}` : `${modifier}`;
        roll_properties["modifier"] = modifier;
    }
    // Sorcerer: Clockwork Soul - Trance of Order
    if (character.hasClassFeature("Trance of Order") && character.getSetting("sorcerer-trance-of-order", false))
            roll_properties.d20 = "1d20min10";

    return sendRollWithCharacter(rollType, "1d20" + modifier, roll_properties);
}

function rollAbilityCheck() {
    rollAbilityOrSavingThrow("b20-ability-pane", "ability");
}

function rollSavingThrow() {
    rollAbilityOrSavingThrow("b20-ability-saving-throws-pane", "saving-throw");
}

function rollInitiative() {
    let initiative = $(".ct-combat__summary-group--initiative .integrated-dice__container, span[class*='styles_value'] span[class*='styles_numberDisplay']").text();
    let advantage = $(".ct-initiative-box__advantage").length > 0;
    if (initiative == "") {
        initiative = $(".ct-combat-mobile__extras section div[class*='styles_value'] .integrated-dice__container span[class*='styles_numberDisplay']").text();
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
    return sendRollWithCharacter("initiative", "1d20" + initiative, roll_properties);
}


function rollHitDie(multiclass, index) {
    //console.log("Rolling hit die index " + index);
    const hitdie = $(".ct-reset-pane__hitdie").eq(index);
    const class_name = hitdie.find(".ct-reset-pane__hitdie-heading-class").text();
    const text = hitdie.find(".ct-reset-pane__hitdie-heading").text();
    const die = text.split("Hit Die: ")[1].split(" ")[0];
    return sendRollWithCharacter("hit-dice", die, {
        "class": class_name,
        "multiclass": multiclass,
        "hit-dice": die
    });
}

/**
 * Split a custom damages line on commas, while ignoring commas inside parenthesis/brackets/curly braces
 * to allow Roll20 macros to work
 * 
 * @param {String} damages   The custom damages line
 */
function split_custom_damages(damages) {
    // Single damage
    if (!damages.includes(",")) return [damages];
    // No parenthesis/brackets/curly braces, so split on the comma
    if (!["(", "[", "{"].some(del => damages.includes(del))) return damages.split(",");

    // Complex situation, actually parse the string
    const result = [];
    const delimiters = [];
    let current_damage = "";
    for (let i = 0; i < damages.length; i++) {
        if (damages[i] === "(") {
            delimiters.push(")");
        } else if (damages[i] === "[") {
            delimiters.push("]");
        } else if (damages[i] === "{") {
            delimiters.push("}");
        }
        if (delimiters.length === 0 && damages[i] === ",") {
            current_damage = current_damage.trim();
            if (current_damage) {
                result.push(current_damage);
                current_damage = "";
            }
            continue;
        }
        current_damage += damages[i];
        if (delimiters.length > 0 && damages[i] === delimiters[delimiters.length - 1]) {
            delimiters.pop();
        }
    }
    current_damage = current_damage.trim();
    if (current_damage) result.push(current_damage);
    return result;
}

function isItemATool(item_name, source) {
    return source === "tool, common" ||
        item_name.includes(" Tools") || item_name.includes(" Tool") ||
        item_name.includes(" Kit") ||
        item_name.includes(" Supplies") || 
        item_name.includes(" Set") || 
        item_name === "Wagon" ||
        item_name.includes(" Utensils");
}
function isItemAnInstruction(item_name, item_tags) {
    // Rhythm-Maker’s Drum, +1, +2, +3 don't have the tag
    return item_tags.includes("Instrument") || item_name.includes(" Drum");
}

function handleSpecialMeleeAttacks(damages=[], damage_types=[], properties, settings_to_change={}, {to_hit, action_name=""}={}) {
    if (character.hasClass("Barbarian")) {
        // Barbarian: Rage
        if (character.hasClassFeature("Rage") &&
            character.getSetting("barbarian-rage", false)) {
            const barbarian_level = character.getClassLevel("Barbarian");
            const rage_damage = barbarian_level < 9 ? 2 : (barbarian_level < 16 ? 3 : 4);
            damages.push(String(rage_damage));
            damage_types.push("Rage");
        }
    }

    if (character.hasClass("Druid")) {
        // Druid: Circle of Spores: Symbiotic Entity
        if (character.hasClassFeature("Symbiotic Entity") &&
            character.getSetting("druid-symbiotic-entity", false)) {
                damages.push("1d6");
                damage_types.push("Symbiotic Entity");
        }
    }

    if (character.hasClass("Paladin")) {
        //Paladin: Improved Divine Smite
        if (character.hasClassFeature("Improved Divine Smite") &&
            character.getSetting("paladin-improved-divine-smite", true)) {
            damages.push("1d8");
            damage_types.push("Radiant");
        }
    }

    if (character.hasClass("Wizard")) {
        // Wizard: Bladesinging: Song of Victory
        if (character.hasClassFeature("Song of Victory") &&
            character.getSetting("wizard-bladesong", false)) {
            const intelligence = character.getAbility("INT") || {mod: 0};
            const mod = parseInt(intelligence.mod) || 0;
            damages.push(String(Math.max(mod, 1)));
            damage_types.push("Bladesong");
        }
    }

    // Feats
    // Great Weapon Master Feat
    if (to_hit !== null && 
        character.getSetting("great-weapon-master", false) &&
        character.hasFeat("Great Weapon Master") &&
        (properties["Properties"] && properties["Properties"].includes("Heavy") ||
        action_name.includes("Polearm Master")) &&
        properties["Proficient"] == "Yes") {
        to_hit += " - 5";
        damages.push("10");
        damage_types.push("Great Weapon Master");
        settings_to_change["great-weapon-master"] = false;
    }

    // Charger Feat
    if (character.hasFeat("Charger") &&
        character.getSetting("charger-feat")) {
        damages.push("+5");
        damage_types.push("Charger Feat");
        settings_to_change["charger-feat"] = false;
    }
    
    return to_hit;
}

function handleSpecialRangedAttacks(damages=[], damage_types=[], properties, settings_to_change={}, {to_hit, action_name=""}={}) {
    // Feats
    // Sharpshooter Feat
    if (to_hit !== null && 
        character.getSetting("sharpshooter", false) &&
        character.hasFeat("Sharpshooter") &&
        properties["Proficient"] == "Yes") {
        to_hit += " - 5";
        damages.push("10");
        damage_types.push("Sharpshooter");
        settings_to_change["sharpshooter"] = false;
    }
    
    return to_hit;
}

function handleSpecialGeneralAttacks(damages=[], damage_types=[], properties, settings_to_change={}, {to_hit, action_name, item_name, spell_name, spell_level}={}) {
    // Racial Traits
    //Protector Aasimar: Radiant Soul Damage
    if (character.hasRacialTrait("Radiant Soul") &&
        character.getSetting("protector-aasimar-radiant-soul", false)) {
        damages.push(character._level);
        damage_types.push("Radiant Soul");
    }

    // MotM Aasimar: Radiant Soul Damage
    if (character.hasRacialTrait("Celestial Revelation: Radiant Soul") &&
        character.getSetting("motm-aasimar-radiant-soul", false)) {
        damages.push(character._proficiency);
        damage_types.push("Radiant Soul");
    }

    // Class Specific
    if (character.hasClass("Cleric")) {
        // Cleric: Blessed Strikes
        if ((((item_name || action_name) && to_hit != null) || (spell_name && spell_level.includes("Cantrip"))) &&
            character.hasClassFeature("Blessed Strikes") &&
            character.getSetting("cleric-blessed-strikes", false)) {
            damages.push("1d8");
            damage_types.push("Blessed Strikes");
        }
    }

    if (character.hasClass("Ranger")) {
        // Ranger: Favored Foe
        if (to_hit != null &&
            character.hasClassFeature("Favored Foe") &&
            character.getSetting("ranger-favored-foe", false)) {
            const ranger_level = character.getClassLevel("Ranger");
            damages.push(ranger_level < 6 ? "1d4" : ( ranger_level < 14 ? "1d6" : "1d8"));
            damage_types.push("Favored Foe");
        }
        
        // Ranger: Gathered Swarm
        if (to_hit != null &&
            character.hasClassFeature("Gathered Swarm") &&
            character.getSetting("ranger-gathered-swarm", false)) {
            const ranger_level = character.getClassLevel("Ranger");
            damages.push(ranger_level < 11 ? "1d6" : "1d8");
            damage_types.push("Gathered Swarm");
        }
    }

    if (character.hasClass("Warlock")) {
        // Warlock: The Hexblade: Hexblade's Curse
        if (to_hit != null &&
            character.getSetting("warlock-hexblade-curse", false) &&
            character.hasClassFeature("Hexblade’s Curse") &&
            character._proficiency !== null) {
            damages.push(character._proficiency);
            damage_types.push("Hexblade's Curse");
        }
        
        // Warlock: Genie Patron: Genie's Wrath
        if (to_hit != null &&
            character.hasClassFeature("Genie’s Vessel") &&
            character.getSetting("genies-vessel", false)) {
            damages.push(character._proficiency);
            if (character.hasClassFeature("Genie’s Vessel: Genie's Wrath (Dao)"))
                damage_types.push("Genie's Wrath (Bludgeoning)");
            else if (character.hasClassFeature("Genie’s Vessel: Genie's Wrath (Djinni)"))
                damage_types.push("Genie's Wrath (Thunder)");
            else if (character.hasClassFeature("Genie’s Vessel: Genie's Wrath (Efreeti)"))
                damage_types.push("Genie's Wrath (Fire)");
            else if (character.hasClassFeature("Genie’s Vessel: Genie's Wrath (Marid)"))
                damage_types.push("Genie's Wrath (Cold)");
            else
                damage_types.push("Genie's Wrath");
        }

        // Warlock: The Undead: Grave Touched
        if (to_hit != null &&
            character.hasClassFeature("Grave Touched") &&
            character.getSetting("warlock-grave-touched", false)) {
                damage_types[0] = "Necrotic";
                let highest_dice = 0;
                for (let dmg of damages) {
                    const match = dmg.match(/[0-9]*d([0-9]+)/);
                    if (match) {
                        const sides = parseInt(match[1]);
                        if (sides > highest_dice)
                            highest_dice = sides;
                    }
                }
                if (highest_dice != 0) {
                    damages.push(`1d${highest_dice}`);
                    damage_types.push("Grave Touched")
                }
            }
    }

    return to_hit;
}

function handleSpecialWeaponAttacks(damages=[], damage_types=[], properties, settings_to_change={}, {action_name="", item_customizations=[], item_type="", to_hit}={}) {
    // Class Specific
    if (character.hasClass("Artificer")) {
        //Artificer: Battlemaster: Arcane Jolt
        // TODO: Implement for Steel Defender at later date
        if (damages.length > 0 &&
            character.hasClassFeature("Arcane Jolt") &&
            character.getSetting("artificer-arcane-jolt", false) &&
            (properties["Infused"] || item_type.indexOf(", Common") === -1)) {
            damages.push(character._level < 15 ? "2d6" : "4d6");
            damage_types.push("Arcane Jolt");
        }
    }

    if (character.hasClass("Barbarian")) {
        // Barbarian: Path of the Zealot: Divine Fury
        if (character.hasClassFeature("Rage") &&
            character.getSetting("barbarian-rage", false) &&
            character.getSetting("barbarian-divine-fury", true) &&
            character.hasClassFeature("Divine Fury")) {
            const barbarian_level = character.getClassLevel("Barbarian");
            damages.push(`1d6+${Math.floor(barbarian_level / 2)}`);
            damage_types.push("Divine Fury");
        }
    }
    
    if (character.hasClass("Bard")) {
        // Bard: College of Whispers: Psychic blades
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
            damage_types.push("Psychic Blades");
            settings_to_change["bard-psychic-blades"] = false;
        }
    }

    if (character.hasClass("Blood Hunter")) {
        // Bloodhunter: Crimson Rite
        if (character.getSetting("bloodhunter-crimson-rite", false) &&
            character.hasClassFeature("Crimson Rite") &&
            ((properties["Attack Type"] == "Ranged" || properties["Attack Type"] == "Melee") ||
            action_name.includes("Predatory Strike") || action_name.includes("Polearm Master"))) {
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
    }
    
    if (character.hasClass("Cleric")) {
        // Cleric: Divine Strike
        if (character.hasClassFeature("Divine Strike") &&
            character.getSetting("cleric-divine-strike", true)) {
            const cleric_level = character.getClassLevel("Cleric");
            damages.push(cleric_level < 14 ? "1d8" : "2d8");
            damage_types.push("Divine Strike");
        }
    }

    if (character.hasClass("Fighter")) {
        // Fighter: Giant’s Might;
        if (character.hasClassFeature("Giant’s Might") &&
            character.getSetting("fighter-giant-might", false)) {
            const fighter_level = character.getClassLevel("Fighter");
            damages.push(fighter_level < 10 ? "1d6" : (fighter_level < 18 ? "1d8" : "1d10"));
            damage_types.push("Giant’s Might");
        }
    }

    if (character.hasClass("Paladin")) {
        // Paladin: Sacred Weapon
        if (to_hit !== null && 
            character.getSetting("paladin-sacred-weapon", false)) {
            const charisma_attack_mod =  Math.max(character.getAbility("CHA").mod, 1);
            to_hit += `+ ${charisma_attack_mod}`;
        }
    }

    if (character.hasClass("Ranger")) {
        // Ranger: Gloom Stalker: Dread Ambusher
        if (character.getSetting("ranger-dread-ambusher", false)) {
            damages.push("1d8");
            damage_types.push("Dread Ambusher");
            settings_to_change["ranger-dread-ambusher"] = false;
        }
        
        // Ranger: Hunter: Colossus Slayer
        if (character.hasClassFeature("Hunter’s Prey: Colossus Slayer") &&
            character.getSetting("ranger-colossus-slayer", false)) {
            damages.push("1d8");
            damage_types.push("Colossus Slayer");
        }
        
        // Ranger: Monster Slayer: Slayer's Prey
        if (character.hasClassFeature("Slayer’s Prey") &&
            character.getSetting("ranger-slayers-prey", false)) {
            damages.push("1d6");
            damage_types.push("Slayer’s Prey");
        }
        
        // Ranger: Horizon Walker: Planar Warrior
        if (character.hasClassFeature("Planar Warrior") &&
            character.getSetting("ranger-planar-warrior", false)) {
            const ranger_level = character.getClassLevel("Ranger");
            damages.push(ranger_level < 11 ? "1d8" : "2d8");
            damage_types.push("Planar Warrior");
        }

        // Ranger: Fey Wanderer: Dreadful Strikes
        if (character.hasClassFeature("Dreadful Strikes") &&
            character.getSetting("fey-wanderer-dreadful-strikes")) {
            const ranger_level = character.getClassLevel("Ranger");
            damages.push(ranger_level < 11 ? "1d4" : "1d6");
            damage_types.push("Dreadful Strikes");
        }
    }
    
    if (character.hasClass("Rogue")) {
        // Rogue: Sneak Attack
        if (character.getSetting("rogue-sneak-attack", false) &&
            (properties["Attack Type"] == "Ranged" ||
            (properties["Properties"] && properties["Properties"].includes("Finesse")) ||
            (action_name && (action_name.includes("Psychic Blade") || action_name.includes("Shadow Blade"))))) {
            const sneak_attack = Math.ceil(character._classes["Rogue"] / 2) + "d6";
            damages.push(sneak_attack);
            damage_types.push("Sneak Attack");
        }
    }

    if (character.hasClass("Warlock")) {
        // Warlock: Eldritch Invocation: Lifedrinker
        if (character.getSetting("eldritch-invocation-lifedrinker", false) &&
            item_customizations.includes("Pact Weapon")) {
            const charisma_damage_mod =  Math.max(character.getAbility("CHA").mod, 1);
            damages.push(`${charisma_damage_mod}`);
            damage_types.push("Lifedrinker");
        }
    }

    return to_hit;
}

function capitalize(str) {
    return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

async function rollItem(force_display = false, force_to_hit_only = false, force_damages_only = false, force_versatile = false, spell_group = null) {
    const prop_list = $(".ct-item-pane .ct-item-detail [role=list] > div");
    const properties = propertyListToDict(prop_list);
    properties["Properties"] = properties["Properties"] || "";
    //console.log("Properties are : " + String(properties));
    const item_name = $(".ct-item-pane .ct-sidebar__heading .ct-item-name,.ct-item-pane .ct-sidebar__heading .ddbc-item-name")[0].firstChild.textContent;
    const item_type = $(".ct-item-detail__intro").text();
    const item_tags = $(".ct-item-detail__tags-list .ct-item-detail__tag").toArray().map(elem => elem.textContent);
    const item_customizations = $(".ct-item-pane .ct-item-detail__class-customize-item .ddbc-checkbox--is-enabled .ddbc-checkbox__label").toArray().map(e => e.textContent);
    const source = item_type.trim().toLowerCase();
    const is_tool = isItemATool(item_name, source);
    const is_instrument = isItemAnInstruction(item_name, item_tags);
    const description = descriptionToString(".ct-item-detail__description");
    const quantity = $(".ct-item-pane .ct-simple-quantity .ct-simple-quantity__value .ct-simple-quantity__input").val();
    const is_infused = $(".ct-item-pane .ct-item-detail__infusion");
    if (is_infused.length > 0)
        properties["Infused"] = true;
    let is_versatile = false;
    if (key_modifiers["display_attack"]) {
        force_display = true;
    }
    if (!force_display && Object.keys(properties).includes("Damage")) {
        const item_full_name = $(".ct-item-pane .ct-sidebar__heading .ct-item-name,.ct-item-pane .ct-sidebar__heading .ddbc-item-name").text();
        let to_hit = properties["To Hit"] !== undefined && properties["To Hit"] !== "--" ? properties["To Hit"] : null;
        const settings_to_change = {}

        if (to_hit === null)
            to_hit = findToHit(item_full_name, ".ct-combat-attack--item,.ddbc-combat-attack--item", ".ct-item-name,.ddbc-item-name", ".ct-combat-attack__tohit,.ddbc-combat-attack__tohit");

        if (to_hit !== null)
            character._cacheToHit(item_full_name, to_hit);
        else
            to_hit = character._getToHitCache(item_full_name);

        const damages = [];
        let damage_types = [];
        for (let i = 0; i < prop_list.length; i++) {
            const prop = propertyListToDict(prop_list.eq(i));
            if (Object.keys(prop)[0] == "Damage") {
                const value = prop_list.eq(i).find("> p").filter((idx, el) => el.textContent === prop["Damage"]);
                let damage = value.find(".ct-damage__value,.ddbc-damage__value").text();
                let damage_type = properties["Damage Type"] || "";
                let versatile_damage = value.find(".ct-item-detail__versatile-damage,.ddbc-item-detail__versatile-damage").text().slice(1, -1);
                if (damages.length == 0 &&
                    (character.hasClassFeature("Great Weapon Fighting", true) || character.hasFeat("Great Weapon Fighting", true)) &&
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

                if (versatile_damage != "" && damage_type != "--") {
                    let versatile_choice = character.getSetting("versatile-choice", "both");
                    if (key_modifiers.versatile_one_handed)
                        versatile_choice = "one"
                    if (key_modifiers.versatile_two_handed)
                        versatile_choice = "two";
                    if (force_versatile) {
                        versatile_choice = "two";
                    }
                    if (versatile_choice == "one") {
                        damages.push(damage);
                        if (character.getGlobalSetting("weapon-handedness", false)){
                            damage_types.push(damage_type + " (1-Hand)");
                        } else {
                            damage_types.push(damage_type);
                        }
                    } else if (versatile_choice == "two") {
                        damages.push(versatile_damage);
                        if (character.getGlobalSetting("weapon-handedness", false)){
                            damage_types.push(damage_type + " (2-Hand)");
                        } else {
                            damage_types.push(damage_type);
                        }
                    } else {
                        damages.push(damage);
                        damage_types.push(damage_type + " (1-Hand)");
                        damages.push(versatile_damage);
                        damage_types.push(damage_type + " (2-Hand)");
                        is_versatile = true;
                    }
                } else if (damage != "" && damage_type != "--") {
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
                            dmg_type += " (" + dmg_info + ")";

                        if ((character.hasClassFeature("Great Weapon Fighting", true) || character.hasFeat("Great Weapon Fighting", true)) &&
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

        // Handle Dragon Wing * Ranged Weapons
        if (item_name.includes("Dragon Wing") || item_name === "Flail of Tiamat") {
            damages.splice(2,damages.length - 2);
            let possible_damages = damage_types.splice(1,damage_types.length - 1);
            const damage_type = properties.Notes && possible_damages.reduce((found, damage) => {
                if (found) return found;
                if (properties.Notes.toLowerCase().includes(damage.toLowerCase())) return damage;
                return null;
            }, null);
            if (damage_type) {
                damage_types.push(damage_type);
            }
            else if (item_name.includes("Dragon Wing")) {
                damage_types.push("Infused");
            }
            else if (item_name === "Flail of Tiamat") {
                damage_types.push("Chosen Type");
            }
            else {
                damage_types.push("Extra");
            }
        }

        const weapon_damage_length = damages.length;
        
        // If clicking on a spell group within a item (Green flame blade, Booming blade), then add the additional damages from that spell
        if (spell_group) {
            const group_name = $(spell_group).find(".ct-item-detail__spell-damage-group-name").text();
            const group_origin = $(spell_group).find(".ddbc-data-origin-name").text();
            const group_damages = $(spell_group).find(".ct-item-detail__spell-damage-group-item");
            const spell_damages = [];
            const spell_damage_types = [];
            for (let j = 0; j < group_damages.length; j++) {
                let dmg = group_damages.eq(j).find(".ddbc-damage__value").text();
                let dmg_type = group_damages.eq(j).find(".ddbc-tooltip").attr("data-original-title");
                if (dmg != "") {
                    spell_damages.push(dmg);
                    spell_damage_types.push(dmg_type);
                }
            }
            handleSpecialSpells(group_name, spell_damages, spell_damage_types, {spell_source: group_origin});
            damages.push(...spell_damages);
            damage_types.push(...spell_damage_types.map(t => `${t} (${group_name})`));
        }

        addCustomDamages(character, damages, damage_types);

        // Capitalize all Damage Types to ensure consistency for later processing
        damage_types = damage_types.map(t => capitalize(t.trim()));

        to_hit = handleSpecialGeneralAttacks(damages, damage_types, properties, settings_to_change, {to_hit, item_name});

        to_hit = handleSpecialWeaponAttacks(damages, damage_types, properties, settings_to_change, {item_customizations, item_type, to_hit});

        if (properties["Attack Type"] == "Melee") {
            to_hit = handleSpecialMeleeAttacks(damages, damage_types, properties, settings_to_change, {to_hit});
        }

        if (properties["Attack Type"] == "Ranged") {
            to_hit = handleSpecialRangedAttacks(damages, damage_types, properties, settings_to_change, {to_hit});
        }
        
        let critical_limit = 20;
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

        const roll_properties = await buildAttackRoll(character,
            "item",
            item_name,
            description,
            properties,
            damages,
            damage_types,
            to_hit,
            brutal,
            force_to_hit_only,
            force_damages_only,
            {weapon_damage_length});
        if (roll_properties === null) {
            // A query was cancelled, so let's cancel the roll
            return;
        }
        roll_properties["item-type"] = item_type;
        roll_properties["item-customizations"] = item_customizations;
        roll_properties["is_versatile"] = is_versatile;
        if (quantity) roll_properties["quantity"] = parseInt(quantity);
        if (critical_limit != 20)
            roll_properties["critical-limit"] = critical_limit;
        const custom_critical_limit = parseInt(character.getSetting("custom-critical-limit", ""))
        if (custom_critical_limit) {
            roll_properties["critical-limit"] = custom_critical_limit;
            if (to_hit !== null)
                roll_properties["name"] += ` (CRIT${custom_critical_limit})`;
        }

        // Assassinate: consider all rolls as critical;
        if (character.hasClassFeature("Assassinate") &&
            character.getSetting("rogue-assassinate", false)) {
            roll_properties["critical-limit"] = 1;
            roll_properties["advantage"] = RollType.OVERRIDE_ADVANTAGE;
            settings_to_change["rogue-assassinate"] = false;
        }
        // Sorcerer: Clockwork Soul - Trance of Order
        if (character.hasClassFeature("Trance of Order") && character.getSetting("sorcerer-trance-of-order", false))
            roll_properties.d20 = "1d20min10";

        // Apply batched updates to settings, if any:
        if (Object.keys(settings_to_change).length > 0)
            character.mergeCharacterSettings(settings_to_change);

        return sendRollWithCharacter("attack", damages[0], roll_properties);
    } else if (!force_display && (is_tool || is_instrument) && character._abilities.length > 0) {
        const proficiencies = {}
        proficiencies["None"] = 0;
        proficiencies["Half Proficiency"] = Math.floor(character._proficiency / 2);
        proficiencies["Proficiency"] = parseInt(character._proficiency);
        proficiencies["Expertise"] = character._proficiency * 2;
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
                        (character.hasClassFeature("Giant’s Might") && character.getSetting("fighter-giant-might", false)))) {
                    roll_properties["advantage"] = RollType.OVERRIDE_ADVANTAGE;
                }
                roll_properties.d20 = "1d20";
                // Set Reliable Talent flag if character has the feature and skill is proficient/expertise
                if (character.hasClassFeature("Reliable Talent") && ["Proficiency", "Expertise"].includes(proficiency))
                    roll_properties.d20 = "1d20min10";
                // Sorcerer: Clockwork Soul - Trance of Order
                if (character.hasClassFeature("Trance of Order") && character.getSetting("sorcerer-trance-of-order", false))
                    roll_properties.d20 = "1d20min10";
                // Mark of Storm Half-Elf Windwright's Intuition
                if (character.hasRacialTrait("Windwright’s Intuition") && is_tool && item_name == "Navigator's Tools")
                    roll_properties.modifier += "+1d4";
                // Mark of Warding Dwarf - Warder's Intuition
                if (character.hasRacialTrait("Warder’s Intuition") && is_tool && item_name == "Thieves' Tools")
                    roll_properties.modifier += "+1d4";
                // Mark of Scribing Gnome - Gifted Scribe
                if (character.hasRacialTrait("Gifted Scribe") && is_tool && item_name == "Calligrapher's Supplies")
                    roll_properties.modifier += "+1d4";
                // Mark of Hospitality Halfing - Healing Touch
                if (character.hasRacialTrait("Healing Touch") && is_tool && item_name == "Herbalism Kit")
                    roll_properties.modifier += "+1d4";
                // Mark of Hospitality Halfing - Ever Hospitable
                if (character.hasRacialTrait("Ever Hospitable") && is_tool && (item_name == "Brewer's Supplies" || item_name == "Cook's Utensils"))
                    roll_properties.modifier += "+1d4";
                // Mark of Making Human - Artisan's Intuition
                if (character.hasRacialTrait("Artisan’s Intuition") && is_tool)
                    roll_properties.modifier += "+1d4";
                return sendRollWithCharacter("skill", "1d20" + modifier, roll_properties);
            }
        });
    } else {
        return sendRollWithCharacter("item", 0, {
            "name": item_name,
            "description": description,
            "item-type": item_type,
            "tags": item_tags,
            "quantity": quantity ? parseInt(quantity) : undefined
        });
    }
}

async function rollAction(paneClass, force_to_hit_only = false, force_damages_only = false) {
    if (key_modifiers["display_attack"]) {
        return displayAction(paneClass);
    }
    // ct-action-pane and ct-custom-action-page both use ct-action-detail for the details
    const properties = propertyListToDict($("." + paneClass + " .ct-action-detail [role=list] > div"));
    //console.log("Properties are : " + String(properties));
    const action_name = $(".ct-sidebar__heading").text();
    const action_parent = $(".ct-sidebar__header-parent").text();
    const description = descriptionToString(".ct-action-detail__description");
    let to_hit = properties["To Hit"] !== undefined && properties["To Hit"] !== "--" ? properties["To Hit"] : null;

    if (action_name == "Superiority Dice" || action_parent == "Maneuvers") {
        const fighter_level = character.getClassLevel("Fighter");
        let superiority_die = fighter_level < 10 ? "1d8" : (fighter_level < 18 ? "1d10" : "1d12");
        if (action_name === "Maneuvers: Parry")
            superiority_die += " + " + character.getAbility("DEX").mod;
        else if (action_name === "Maneuvers: Rally")
            superiority_die += " + " + character.getAbility("CHA").mod;
        return sendRollWithCharacter("custom", superiority_die, {
            "name": action_name,
            "description": description,
            "modifier": superiority_die
        });
    } else if (action_name == "Bardic Inspiration" || action_parent == "Blade Flourish") {
        const bard_level = character.getClassLevel("Bard");
        inspiration_die = bard_level < 5 ? "1d6" : (bard_level < 10 ? "1d8" : (bard_level < 15 ? "1d10" : "1d12"));
        return sendRollWithCharacter("custom", inspiration_die, {
            "name": action_name,
            "description": description,
            "modifier": inspiration_die
        });
    } else if (action_name.includes("Blood Curse of the Eyeless")) {
        const bloodhunter_level = character.getClassLevel("Blood Hunter");
        let hemocraft_die = bloodhunter_level < 5 ? "1d4" : (bloodhunter_level < 11 ? "1d6" : (bloodhunter_level < 17 ? "1d8" : "1d10"));
        return sendRollWithCharacter("custom", hemocraft_die, {
            "name": action_name,
            "description": description,
            "modifier": hemocraft_die
        });
    } else if (Object.keys(properties).includes("Damage") || to_hit !== null || properties["Attack/Save"] !== undefined) {
        const damages = [];
        let damage_types = [];
        if (Object.keys(properties).includes("Damage")) {
            damages.push(properties["Damage"]);
            damage_types.push(properties["Damage Type"] || "");
        }

        const weapon_damage_length = damages.length;

        addCustomDamages(character, damages, damage_types);

        // Capitalize all Damage Types to ensure consistency for later processing
        damage_types = damage_types.map(t => capitalize(t.trim()));

        const settings_to_change = {}
        let brutal = 0;
        let critical_limit = 20;
        if (character.hasClassFeature("Hexblade’s Curse") &&
            character.getSetting("warlock-hexblade-curse", false))
            critical_limit = 19;
        // Polearm master bonus attack using the other end of the polearm is considered a melee attack.
        if (action_name.includes("Polearm Master") && (character.hasClassFeature("Great Weapon Fighting", true) || character.hasFeat("Great Weapon Fighting", true))) {
            damages[0] = damages[0].replace(/[0-9]*d[0-9]+/g, "$&ro<=2");
        }

        const isMeleeAttack = action_name.includes("Polearm Master") || action_name.includes("Unarmed Strike") || action_name.includes("Tavern Brawler Strike")
        || action_name.includes("Psychic Blade") || action_name.includes("Bite") || action_name.includes("Claws") || action_name.includes("Tail")
        || action_name.includes("Ram") || action_name.includes("Horns") || action_name.includes("Hooves") || action_name.includes("Talons") 
        || action_name.includes("Thunder Gauntlets") || action_name.includes("Unarmed Fighting") || action_name.includes("Arms of the Astral Self")
        || action_name.includes("Shadow Blade") || action_name.includes("Predatory Strike");
        
        const isRangedAttack = action_name.includes("Lightning Launcher");

        to_hit = handleSpecialGeneralAttacks(damages, damage_types, properties, settings_to_change, {to_hit, action_name});

        if (isMeleeAttack || isRangedAttack) {
            to_hit = handleSpecialWeaponAttacks(damages, damage_types, properties, settings_to_change, {to_hit, action_name});
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
        }

        if (isMeleeAttack) {
            to_hit = handleSpecialMeleeAttacks(damages, damage_types, properties, settings_to_change, {to_hit, action_name});
        }

        if (isRangedAttack) {
            to_hit = handleSpecialRangedAttacks(damages, damage_types, properties, settings_to_change, {to_hit, action_name});
        }

        // Circle of Spores - Symbiotic Entity
        if (character.hasClassFeature("Symbiotic Entity") &&
        character.getSetting("druid-symbiotic-entity", false) &&
            action_name === "Halo of Spores") {
            damages[0] = damages[0].replace(/1d/g, "2d");
        }

        const roll_properties = await buildAttackRoll(character,
            "action",
            action_name,
            description,
            properties,
            damages,
            damage_types,
            to_hit,
            brutal,
            force_to_hit_only,
            force_damages_only,
            {weapon_damage_length});

        if (roll_properties === null) {
            // A query was cancelled, so let's cancel the roll
            return;
        }
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
            settings_to_change["rogue-assassinate"] = false;
        }
        // Sorcerer: Clockwork Soul - Trance of Order
        if (character.hasClassFeature("Trance of Order") && character.getSetting("sorcerer-trance-of-order", false))
            roll_properties.d20 = "1d20min10";

        // Apply batched updates to settings, if any:
        if (Object.keys(settings_to_change).length > 0)
            character.mergeCharacterSettings(settings_to_change);

        return sendRollWithCharacter("attack", damages[0], roll_properties);
    } else {
        return sendRollWithCharacter("trait", 0, {
            "name": action_name,
            "description": description,
            "source-type": "action"
        });
    }
}

function handleSpecialSpells(spell_name, damages=[], damage_types=[], {spell_source="", spell_level="Cantrip", castas}={}) {
    // Handle special spells;
    // Absorb Elements
    if (spell_name == "Absorb Elements" && damages.length == 5 &&
        damage_types[0] == "Acid" && damage_types[1] == "Cold" && damage_types[2] == "Fire" &&
        damage_types[3] == "Lightning" && damage_types[4] == "Thunder") {
        const dmg = damages[0];
        damages.length = 0;
        damage_types.length = 0;
        damages.push(dmg);
        damage_types.push("Triggering Type");
    }

    // Handle Hunter's Mark
    if (spell_name == "Hunter's Mark" && damages.length == 3 &&
        damage_types[0] == "Bludgeoning" && damage_types[1] == "Piercing" && damage_types[2] == "Slashing") {
        const dmg = damages[0];
        damages.length = 0;
        damage_types.length = 0;
        damages.push(dmg);
        damage_types.push("Weapon Type");
    }

    // Artificer
    if (character.hasClass("Artificer")) {
        // Artificer: Arcane Firearm
        if (damages.length > 0 &&
            character.hasClassFeature("Arcane Firearm") &&
            character.getSetting("artificer-arcane-firearm", false) &&
            spell_source.includes("Artificer")) {
            damages.push("1d8");
            damage_types.push("Arcane Firearm");
        }
    }

    // Bard
    if (character.hasClass("Bard")) {
        // Bard: College of Spirits: Spiritual Focus
        if (damages.length > 0 &&
            character.hasClassFeature("Spiritual Focus") &&
            character.getSetting("bard-spiritual-focus", false) &&
            spell_source.includes("Bard") &&
            parseInt(character.getClassLevel("Bard")) >= 6) {
                damages.push("1d6");
                damage_types.push("Spiritual Focus");
            }
    }

    // Druid
    if (character.hasClass("Druid")) {
        // Druid: Wildfire Druid: Enhanced Bond
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
    }

    // Warlock
    if (character.hasClass("Warlock")) {
        // Warlock: The Celestial: Radiant Soul
        if (character.hasClassFeature("Radiant Soul") &&
            character.getSetting("warlock-the-celestial-radiant-soul", false) &&
            damages.length > 0) {
            for (let i = 0; i < damages.length; i++){
                if (damage_types[i] === "Fire" || damage_types[i] === "Radiant") {
                    damages.push(`${parseInt(character.getAbility("CHA").mod)}`);
                    damage_types.push("Radiant Soul");
                    break;
                }
            }
        }
    }

    // Wizard
    if (character.hasClass("Wizard")) {
        // Wizard: School of Evocation: Empowered Evocation
        if (character.hasClassFeature("Empowered Evocation") &&
            character.getSetting("empowered-evocation", false) &&
            spell_level.includes("Evocation") &&
            spell_source.includes("Wizard")) {
            damages.push(`${parseInt(character.getAbility("INT").mod)}`);
            damage_types.push("Empowered Evocation");
        }
    }
    
    // NOTE: Below this line are things that work on ALL damages, they should stay there
    // Artificer
    if (character.hasClass("Artificer")) {
        if (character.hasClassFeature("Alchemical Savant") &&
            character.getSetting("artificer-alchemical-savant", false) &&
            damages.length > 0) {
            const alchemical_savant_regex = /[0-9]+d[0-9]+/g;
            for (let i = 0; i < damages.length; i++){
                if ((damage_types[i] === "Acid" || damage_types[i] === "Fire" || damage_types[i] === "Necrotic" || damage_types[i] === "Poison") &&
                    alchemical_savant_regex.test(damages[i])) {
                    damages.push(`${character.getAbility("INT").mod < 2 ? 1 : character.getAbility("INT").mod}`);
                    damage_types.push("Alchemical Savant");
                    break;
                }
            }
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
    if (elementalAffinity && damage_types.includes(elementalAffinity)) {
        for (let ability of character._abilities) {
            if (ability[1] == "CHA" && ability[3] != "" && ability[3] != "0") {
                damages.push(ability[3]);
                damage_types.push(elementalAffinity + " (Elemental Affinity)");
            }
        }
    }
    
    // Check for Elemental Adept Feats
    const elementalAdepts = [];
    for (let feature of character._feats) {
        const match = feature.match("Elemental Adept \\((.*)\\)");
        if (match) {
            elementalAdepts.push(match[1]);
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

    //Handle Flames of Phlegethos
    if (damages.length > 0 &&
        character.hasFeat("Flames of Phlegethos")) {
        for (i = 0; i < damages.length; i++) {
            if (damage_types[i] === "Fire")
                damages[i] = damages[i].replace(/[0-9]*d[0-9]+/g, "$&ro<=1");
        }
    }

}
    
function handleSpecialHealingSpells(spell_name, damages=[], damage_types=[], {spell_source="", spell_level="Cantrip", castas, settings_to_change}={}) {
    // Artificer
    if (character.hasClass("Artificer")) {
        if (character.hasClassFeature("Alchemical Savant") &&
            character.getSetting("artificer-alchemical-savant", false)) {
            const alchemical_savant_regex = /[0-9]+d[0-9]+/g;
            for (let i = 0; i < damages.length; i++){
                if (damage_types[i] === "Healing" && alchemical_savant_regex.test(damages[i])) {
                    damages.push(`${character.getAbility("INT").mod < 2 ? 1 : character.getAbility("INT").mod}`);
                    damage_types.push("Alchemical Savant Healing");
                    break;
                }
            }
        }
    }

    // Bard
    if (character.hasClass("Bard")) {
        // Bard: College of Spirits: Spiritual Focus
        if (damages.length > 0 &&
            character.hasClassFeature("Spiritual Focus") &&
            character.getSetting("bard-spiritual-focus", false) &&
            spell_source.includes("Bard") &&
            parseInt(character.getClassLevel("Bard")) >= 6) {
                damages.push("1d6");
                damage_types.push("Spiritual Focus Healing");
            }
    }

    // Druid
    if (character.hasClass("Druid")) {    
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
    }
    
    // Supreme Healing and Circle of Mortality must ALWAYS be at the end, as they max all healing dice
    if (character.hasClass("Cleric")) {
        if (character.hasClassFeature("Supreme Healing") ||
            (character.hasClassFeature("Circle of Mortality") &&
            character.getSetting("cleric-circle-of-mortality", false))) {
            for (let i = 0; i < damages.length; i++) {
                if (!damage_types[i].includes("Healing")) continue;
                damages[i] = damages[i].replace(/([0-9]*)d([0-9]+)?/, (match, dice, faces) => {
                    return String(parseInt(dice || 1) * parseInt(faces));
                });
            }
            if (character.hasClassFeature("Circle of Mortality")) {
                settings_to_change["cleric-circle-of-mortality"] = false;
            }
        }
    }
}

async function rollSpell(force_display = false, force_to_hit_only = false, force_damages_only = false) {
    const properties = propertyListToDict($(".ct-spell-pane .ct-spell-detail [role=list] > div"));
    //console.log("Properties are : " + String(properties));
    const spell_source = $(".ct-sidebar__header-parent").text();
    const spell_full_name = $(".ct-sidebar__heading .ct-spell-name,.ct-sidebar__heading .ddbc-spell-name, .ct-sidebar__heading span[class*='styles_spellName']").text();
    const spell_name = $(".ct-sidebar__heading .ct-spell-name,.ct-sidebar__heading .ddbc-spell-name, .ct-sidebar__heading span[class*='styles_spellName']")[0].firstChild.textContent;
    const description = descriptionToString(".ct-spell-pane .ct-spell-detail__description");
    const damage_modifiers = $(".ct-spell-pane .ct-spell-caster__modifiers--damages .ct-spell-caster__modifier--damage");
    const healing_modifiers = $(".ct-spell-pane .ct-spell-caster__modifiers--healing .ct-spell-caster__modifier--hp");
    const temp_hp_modifiers = $(".ct-spell-pane .ct-spell-caster__modifiers--healing .ct-spell-caster__modifier--temp");
    const castas = $(".ct-spell-caster__casting-level-current").text();
    const level = $(".ct-spell-pane .ct-spell-detail__level-school-item").toArray().map((i) => i.textContent).join(" ");
    const ritual = $(".ct-spell-pane .ct-spell-name__icon--ritual,.ct-spell-pane .ddbc-spell-name__icon--ritual, .ct-spell-pane .ct-sidebar__header-primary ddbc-ritual-icon").length > 0;
    let concentration = $(".ct-spell-pane .ct-spell-name__icon--concentration,.ct-spell-pane .ddbc-spell-name__icon--concentration, .ct-spell-pane .ct-sidebar__header-primary ddbc-concentration-icon").length > 0;
    let duration = properties["Duration"] || "";
    if (duration.includes("Concentration")) {
        duration = duration.replace("Concentration, ", "");
        concentration = true;
    } else {
        concentration = false;
    }
    
    // Find the icon with the AoE effect (<i class="i-aoe-sphere">) and convert it to a word
    const range_shape = $(".ct-spell-pane .ct-spell-detail__properties .ct-spell-detail__range-shape .ddbc-aoe-type-icon");
    const aoe_class = (range_shape.attr("class") || "").split(" ").find(c => c.startsWith("ddbc-aoe-type-icon--"));
    // Remove class prefix and capitalize first letter
    const aoe_shape = aoe_class ? aoe_class.replace(/^ddbc-aoe-type-icon--(.)/, (_, g) => g.toUpperCase()) : undefined;

    let to_hit = properties["To Hit"] !== undefined && properties["To Hit"] !== "--" ? properties["To Hit"] : null;

    if (to_hit === null)
        to_hit = findToHit(spell_full_name, ".ct-combat-attack--spell,.ddbc-combat-attack--spell", ".ct-spell-name,.ddbc-spell-name,span[class*='styles_spellName']", ".ct-combat-attack__tohit,.ddbc-combat-attack__tohit");
    if (to_hit === null)
        to_hit = findToHit(spell_full_name, ".ct-spells-spell,.ddbc-spells-spell", ".ct-spell-name,.ddbc-spell-name,span[class*='styles_spellName']", ".ct-spells-spell__tohit,.ddbc-spells-spell__tohit");

    if (key_modifiers["display_attack"]) {
        force_display = true;
    }
    if (!force_display && (damage_modifiers.length > 0 || healing_modifiers.length > 0 || temp_hp_modifiers.length > 0 || to_hit !== null || properties["Attack/Save"] !== undefined)) {
        const damages = [];
        let damage_types = [];
        const settings_to_change = {}
        
        for (let modifier of damage_modifiers.toArray()) {
            const dmg = $(modifier).find(".ct-spell-caster__modifier-amount,.ddbc-spell-caster__modifier-amount").text();
            const dmgtype = $(modifier).find(".ct-damage-type-icon .ct-tooltip,.ddbc-damage-type-icon .ddbc-tooltip").attr("data-original-title") || "";
            damages.push(dmg);
            damage_types.push(dmgtype);
        }

        addCustomDamages(character, damages, damage_types);

        // Capitalize all Damage Types to ensure consistency for later processing
        damage_types = damage_types.map(t => capitalize(t.trim()));

        if (damages.length > 0) {
            to_hit = handleSpecialGeneralAttacks(damages, damage_types, properties, settings_to_change, {to_hit, spell_name, spell_level: level});
        
            handleSpecialSpells(spell_name, damages, damage_types, {spell_level: level, spell_source, castas});
        }

        // We can then add healing types
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

        // We can then add temp healing types
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
        if (healing_modifiers.length > 0) {
            handleSpecialHealingSpells(spell_name, damages, damage_types, {spell_level: level, spell_source, castas, settings_to_change});
        }

        let critical_limit = 20;
        if (character.hasClassFeature("Hexblade’s Curse") &&
            character.getSetting("warlock-hexblade-curse", false))
            critical_limit = 19;
        if (spell_full_name === "Blade of Disaster")
            critical_limit = 18;
        const roll_properties = await buildAttackRoll(character,
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

        if (roll_properties === null) {
            // A query was cancelled, so let's cancel the roll
            return;
        }
        // If it's an AoE, then split the range property appropriately
        if (aoe_shape) {
            const [range, aoe] = properties["Range/Area"].split("/");
            roll_properties['range'] = range;
            roll_properties['aoe'] = aoe;
            roll_properties['aoe-shape'] = aoe_shape;
        }

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
            settings_to_change["rogue-assassinate"] = false;
        }
        // Sorcerer: Clockwork Soul - Trance of Order
        if (character.hasClassFeature("Trance of Order") && character.getSetting("sorcerer-trance-of-order", false))
            roll_properties.d20 = "1d20min10";
        // Apply batched updates to settings, if any:
        if (Object.keys(settings_to_change).length > 0)
            character.mergeCharacterSettings(settings_to_change);
        return sendRollWithCharacter("spell-attack", damages[0] || "", roll_properties);
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
        // If it's an AoE, then split the range property appropriately
        if (aoe_shape) {
            const [range, aoe] = properties["Range/Area"].split("/");
            roll_properties['range'] = range;
            roll_properties['aoe'] = aoe;
            roll_properties['aoe-shape'] = aoe_shape;
        }
        if (castas != "" && !level.startsWith(castas))
            roll_properties["cast-at"] = castas;
        return sendRollWithCharacter("spell-card", 0, roll_properties);
    }
}

async function displayItem() {
    return rollItem(true);
}

async function displaySpell() {
    return rollSpell(true);
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
    let description = descriptionToString(`.${paneClass} .ct-snippet__content,.${paneClass} .ddbc-snippet__content`);
    const choices = $(`.${paneClass} .ct-feature-snippet__choices .ct-feature-snippet__choice`);
    if (choices.length > 0) {
        description += "\n";
        for (const choice of choices.toArray()) {
            const choiceText = descriptionToString(choice);
            description = `${description}\n> ${choiceText}`;
        }
    }
    return sendRollWithCharacter("trait", 0, {
        "name": name,
        "source": source,
        "source-type": source_type,
        "description": description
    });
}

function displayTrait() {
    const trait = $(".ct-sidebar__heading").text();
    const description = descriptionToString(".ct-trait-pane__input");
    return sendRollWithCharacter("trait", 0, {
        "name": trait,
        "description": description
    });
}

function displayBackground() {
    const background = $(".ct-sidebar__heading").text();
    const description = descriptionToString(".ct-background-pane__description > p");
    return sendRollWithCharacter("trait", 0, {
        name: background,
        source: "Background",
        description: description
    });
}

function displayAction(paneClass) {
    const action_name = $(".ct-sidebar__heading").text();
    const description = descriptionToString(".ct-action-detail__description");
    return sendRollWithCharacter("trait", 0, {
        "name": action_name,
        "description": description,
        "source-type": "action"
    });
}

function displayInfusion() {
    const infusion = $(".ct-sidebar__heading").text();
    const description = descriptionToString(".ct-infusion-choice-pane__description");
    return sendRollWithCharacter("trait", 0, {
        "name": infusion,
        "description": description,
        "item-type": "Infusion",
    });
}
function displayProficiencies(group) {
    const label = $(group).find(".ct-proficiency-groups__group-label").text().trim();
    const proficiencies = $(group).find(".ct-proficiency-groups__group-items").text().trim();
    return sendRollWithCharacter("trait", 0, {
        "name": label,
        "source-type": "Proficiency",
        "description": proficiencies
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
    const notes = descriptionToString(pane.find("[role=list] > div:contains('Note')"));
    const description = descriptionToString(pane.find(".ct-action-detail__description, .ct-spell-detail__description, .ct-item-detail__description, .ddbc-action-detail__description, .ddbc-spell-detail__description, .ddbc-item-detail__description"));

    // Look for all the roll orders
    for (const rollOrder of rollOrderTypes) {
        // Use global, multiline and dotall flags
        try {
            const regexp = new RegExp(`\\[\\[${rollOrder}\\]\\]\\s*(.+?)\\s*\\[\\[/${rollOrder}\\]\\]`, "gms");
            const matches = [...notes.matchAll(regexp), ...description.matchAll(regexp)];
            customRolls[rollOrder] = matches.map(([match, content]) => content)
        } catch (err) {
            // Ignore errors that might be caused by DOTALL regexp flag not being supported by the browser
        }
    }
    
    return customRolls;
}

async function execute(paneClass, {force_to_hit_only = false, force_damages_only = false, force_versatile = false, spell_group=null}={}) {
    console.log("Beyond20: Executing panel : " + paneClass, force_to_hit_only, force_damages_only, force_versatile);
    const rollCustomText = async (customTextList) => {
        for (const customText of customTextList) {
            await sendRollWithCharacter("chat-message", 0, {
                name: "",
                message: customText
            });
        }
     };
     
    const customTextRolls = handleCustomText(paneClass);
    await rollCustomText(customTextRolls.before);
    if (customTextRolls.replace.length > 0) {
        await rollCustomText(customTextRolls.replace);
    } else {
        try {
            pauseHotkeyHandling();
            if (["ct-skill-pane", "ct-custom-skill-pane"].includes(paneClass))
                await rollSkillCheck(paneClass);
            else if (paneClass == "b20-ability-pane")
                await rollAbilityCheck();
            else if (paneClass == "b20-ability-saving-throws-pane")
                await rollSavingThrow();
            else if (paneClass == "b20-initiative-pane")
                await rollInitiative();
            else if (paneClass == "ct-item-pane")
                await rollItem(false, force_to_hit_only, force_damages_only, force_versatile, spell_group);
            else if (["ct-action-pane", "ct-custom-action-pane"].includes(paneClass))
                await rollAction(paneClass, force_to_hit_only, force_damages_only);
            else if (paneClass == "ct-spell-pane")
                await rollSpell(false, force_to_hit_only, force_damages_only);
            else
                await displayPanel(paneClass);
        } finally {
            resumeHotkeyHandling();
        }
    }
    await rollCustomText(customTextRolls.after);
}

function displayPanel(paneClass) {
    console.log("Beyond20: Displaying panel : " + paneClass);
    try {
        pauseHotkeyHandling();
        if (paneClass == "ct-item-pane")
            return displayItem();
        else if (paneClass == "ct-infusion-choice-pane")
            return displayInfusion();
        else if (paneClass == "ct-spell-pane")
            return displaySpell();
        else if (["ct-class-feature-pane", "ct-racial-trait-pane", "ct-feat-pane"].includes(paneClass))
            return displayFeature(paneClass);
        else if (paneClass == "ct-trait-pane")
            return displayTrait();
        else if (["ct-action-pane", "ct-custom-action-pane"].includes(paneClass))
            return displayAction(paneClass);
        else if (paneClass == "ct-background-pane")
            return displayBackground();
        else
            alertify.alert("Not recognizing the currently open sidebar");
    } finally {
        resumeHotkeyHandling();
    }
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

        if (sibling.textContent !== text) {
            sibling.textContent = text;
            img.attr("x-beyond20-roll", roll_formula);
        }
    }
}


function checkAndInjectDiceToRolls(selector, name = "") {
    if (!settings["subst-dndbeyond"])
        return;

    const added = injectDiceToRolls(selector, character, name);

    // Don't parse if nothing new was added
    if (added === 0) return;

    for (const custom_roll of $(selector).find(".ct-beyond20-custom-roll").toArray()) {
        findModifiers(character, custom_roll);
    }
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
    const pane = $(`.${paneClass}`);
    if (["ct-custom-skill-pane",
        "ct-skill-pane",
        "b20-ability-pane",
        "b20-ability-saving-throws-pane",
        "b20-initiative-pane"].includes(paneClass)) {
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
        removeRollButtons(pane);

        checkAndInjectDiceToRolls(".ct-item-detail__description", item_name);
        const properties = propertyListToDict($(".ct-item-pane .ct-item-detail [role=list] > div"));
        if (Object.keys(properties).includes("Damage")) {
            addRollButtonEx(paneClass, ".ct-sidebar__heading", { small: true });
            addDisplayButtonEx(paneClass, ".ct-beyond20-roll");
            const spell_damage_groups = $(".ct-item-pane .ct-item-detail__spell-damage-group");
            for (const group of spell_damage_groups.toArray()) {
                const header = $(group).find(".ct-item-detail__spell-damage-group-header");
                addRollButton(character, () => execute(paneClass, {spell_group: group}), header, {small: true, append: true});
            }
        } else {
            const item_type = $(".ct-item-detail__intro").text().trim().toLowerCase();
            const item_tags = $(".ct-item-detail__tags-list .ct-item-detail__tag").toArray().map(elem => elem.textContent);
            const is_tool = isItemATool(item_name, item_type);
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
        removeRollButtons(pane);

        checkAndInjectDiceToRolls(".ct-infusion-choice-pane__description", infusion_name);
        addDisplayButtonEx(paneClass, ".ct-sidebar__heading", { append: false, small: false });
    } else if (["ct-action-pane", "ct-custom-action-pane"].includes(paneClass)) {
        if (isRollButtonAdded())
            return;

        const properties = propertyListToDict($("." + paneClass + " .ct-action-detail [role=list] > div"));
        const action_name = $(".ct-sidebar__heading").text();
        const action_parent = $(".ct-sidebar__header-parent").text();
        const to_hit = properties["To Hit"] !== undefined && properties["To Hit"] !== "--" ? properties["To Hit"] : null;
        if (action_name == "Superiority Dice" || action_parent == "Maneuvers" ||
            action_name == "Bardic Inspiration" || action_parent == "Blade Flourish" ||
            action_name.includes("Blood Curse of the Eyeless") ||
            (properties["Damage"] !== undefined || to_hit !== null || properties["Attack/Save"] !== undefined)) {
            addRollButtonEx(paneClass, ".ct-sidebar__heading", { small: true });
            addDisplayButtonEx(paneClass, ".ct-beyond20-roll");
        } else {
            addRollButtonEx(paneClass, ".ct-sidebar__heading");
        }
        checkAndInjectDiceToRolls(".ct-action-detail__description,.ddbc-action-detail__description", action_name);
    } else if (paneClass == "ct-spell-pane") {
        const spell_name = $(".ct-sidebar__heading .ct-spell-name,.ct-sidebar__heading .ddbc-spell-name, .ct-sidebar__heading span[class*='styles_spellName']")[0].firstChild.textContent;
        const spell_full_name = $(".ct-sidebar__heading .ct-spell-name,.ct-sidebar__heading .ddbc-spell-name, .ct-sidebar__heading span[class*='styles_spellName']").text();
        const spell_level = $(".ct-spell-caster__casting-level-current").text();
        if (isRollButtonAdded() && spell_full_name == lastSpellName && spell_level == lastSpellLevel)
            return;
        lastSpellName = spell_full_name;
        lastSpellLevel = spell_level;
        removeRollButtons(pane);
        checkAndInjectDiceToRolls(".ct-spell-pane .ct-spell-detail__description", spell_name);

        const damages = $(".ct-spell-pane .ct-spell-caster__modifiers--damages .ct-spell-caster__modifier");
        const healings = $(".ct-spell-pane .ct-spell-caster__modifiers--healing .ct-spell-caster__modifier");
        const properties = propertyListToDict($(".ct-spell-pane .ct-spell-detail [role=list] > div"));
        let to_hit = properties["To Hit"] !== undefined && properties["To Hit"] !== "--" ? properties["To Hit"] : null;
        if (to_hit === null)
            to_hit = findToHit(spell_full_name, ".ct-combat-attack--spell,.ddbc-combat-attack--spell", ".ct-spell-name,.ddbc-spell-name,span[class*='styles_spellName']", ".ct-combat-attack__tohit,.ddbc-combat-attack__tohit");
        if (to_hit === null)
            to_hit = findToHit(spell_full_name, ".ct-spells-spell,.ddbc-spells-spell", ".ct-spell-name,.ddbc-spell-name,span[class*='styles_spellName']", ".ct-spells-spell__tohit,.ddbc-spells-spell__tohit");

        if (damages.length > 0 || healings.length > 0 || to_hit !== null || properties["Attack/Save"] !== undefined) {
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
                    const sizeStr = size.text().trim();

                    const id = addRollButton(character, async () => {
                        const props = await buildAttackRoll(character,
                            "action",
                            spell_name + " (" + sizeStr + ")",
                            sizeStr + " animated object",
                            {},
                            [dmg],
                            ["Bludgeoning"], to_hit);
                        if (props) {
                            sendRollWithCharacter("attack", "1d20" + to_hit, props);
                        }
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
            removeRollButtons(pane);
            addHitDieButtons(rollHitDie);
        } else {
            if (!isHitDieButtonAdded())
                return
            removeRollButtons(pane);
        }
    } else if (paneClass == "ct-health-manage-pane") {
        const deathsaves = $(".ct-health-manage-pane .ct-health-manager__deathsaves");
        if (deathsaves.length > 0) {
            if (isRollButtonAdded(deathsaves) || isCustomRollIconsAdded(deathsaves))
                return;
            
            // Check for Advantage/Disadvantage Badges, as Lineages: Reborn advantage on Death Saves or similar will supply
            const skill_badge_adv = $(".ct-health-manage-pane .ct-health-manager__deathsaves .ddbc-advantage-icon").length > 0;
            const skill_badge_disadv = $(".ct-health-manage-pane .ct-health-manager__deathsaves .ddbc-disadvantage-icon").length > 0;
            let deathSaveRollType = RollType.NORMAL;
            if (skill_badge_adv && skill_badge_disadv) {
                deathSaveRollType = RollType.QUERY;
            } else if (skill_badge_adv) {
                deathSaveRollType = RollType.OVERRIDE_ADVANTAGE;
            } else if (skill_badge_disadv) {
                deathSaveRollType = RollType.OVERRIDE_DISADVANTAGE;
            }
            
            addIconButton(character, () => {
                const adjustments = $(".ct-saving-throws-box__info .ct-dice-adjustment-summary");
                let modifier = "";
                // Aura of protection grants bonus to saves and is listed as an adjustment
                // but it should not apply when the character is unconscious
                let removeAuraOfProtection = character.hasClassFeature("Aura of Protection");
                for (const adjustment of adjustments.toArray()) {
                    const desc = $(adjustment).find(".ct-dice-adjustment-summary__description").text().trim();
                    if (desc !== "on saves") continue;
                    const pos = $(adjustment).find(".ddbc-bonus-positive-svg").length > 0;
                    const amount = parseInt($(adjustment).find(".ct-dice-adjustment-summary__value").text().trim()) || 0;
                    if (!amount) continue;
                    if (removeAuraOfProtection && amount === Math.max(character.getAbility("CHA").mod, 1)) {
                        removeAuraOfProtection = false;
                        continue;
                    }
                    modifier += `${pos ? "+" : "-"} ${amount} `;
                }
                if (character.hasClassFeature("Diamond Soul") && character.getSetting("monk-diamond-soul", false)) {
                    modifier += `+ ${parseInt(character._proficiency)} `;
                }
                sendRollWithCharacter("death-save", "1d20" + modifier, {
                    "modifier": modifier,
                    "advantage": deathSaveRollType
                })
            }, ".ct-health-manager__deathsaves-group--fails", { custom: true });
        }
    } else if (paneClass == "ct-creature-pane") {
        if (isRollButtonAdded() || isCustomRollIconsAdded()) {
            if (creature)
                creature.updateInfo();
            return;
        }
        const base = $(".ct-creature-block").length > 0 ? ".ct-creature-block" : ".ddbc-creature-block";
        const creatureType = $(".ct-sidebar__header-parent").text();
        creature = new Monster("Creature", base, settings, {creatureType, character});
        creature.parseStatBlock();
        creature.updateInfo();
    } else if (paneClass == "ct-vehicle-pane") {
        if (isRollButtonAdded() || isCustomRollIconsAdded())
            return;
        const base = $(".ct-vehicle-block").length > 0 ? ".ct-vehicle-block" : ".ddbc-vehicle-block";
        monster = new Monster("Extra-Vehicle", base, settings, {character});
        monster.parseStatBlock();
    } else if (paneClass == "ct-condition-manage-pane") {
        const j_conditions = $(".ct-condition-manage-pane .ct-toggle-field--enabled,.ct-condition-manage-pane .ddbc-toggle-field--is-enabled").closest(".ct-condition-manage-pane__condition");
        let exhaustion_level = $(".ct-condition-manage-pane__condition--special .ct-number-bar__option--active,.ct-condition-manage-pane__condition--special .ddbc-number-bar__option--active").text();
        const conditions = [];
        for (let cond of j_conditions.toArray()) {
            const condition_name = $(cond).find(".ct-condition-manage-pane__condition-name").text();
            conditions.push(condition_name);
        }
        if (exhaustion_level == "")
            exhaustion_level = 0;
        else
            exhaustion_level = parseInt(exhaustion_level);

        character.updateConditions(conditions, exhaustion_level);
        removeRollButtons(pane);
    } else if (paneClass == "ct-proficiencies-pane") {
        const proficiencies = $(".ct-proficiencies-pane .ct-proficiency-groups .ct-proficiency-groups__group");
        if (isRollButtonAdded())
            return;
        for (const group of proficiencies.toArray()) {
            addRollButton(character, () => displayProficiencies(group), group, { small: true, prepend: true, image: false });
        }
    } else if (paneClass == "ct-character-manage-pane") {
        const avatar = $(".ct-character-manage-pane .ct-character-manage-pane__summary-avatar");
        const char_name = $(".ct-character-manage-pane .ct-character-manage-pane__character-name h1").text().trim();
        let avatar_link = avatar.css('background-image');
        if (avatar_link && avatar_link.startsWith("url("))
            avatar_link = avatar_link.slice(5, -2);
        if (!avatar_link || isRollButtonAdded())
            return;
        const button = addDisplayButton(() => sendRoll(character, "avatar", avatar_link, { "name": char_name }), avatar, { small: true, append: false, image: false });
        $(button).css({"text-align": "center"});
    } else {
        removeRollButtons(pane);
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
            const icon = chrome.runtime.getURL("images/icons/badges/spell20.png");
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
                
        // Not the most optimal, but avoids double-adding dice. Problem is that the dice get cleared out by
        // DDB when a panel is opened, so we can't mark the snippet itself with a custom class, as that doesn't
        // get modified.
        if (snippet.find(".ct-beyond20-custom-roll").length > 0)
            continue;
        const name = snippet.find(".ct-feature-snippet__heading")[0].childNodes[0].textContent.trim();
        const content = snippet.find(".ct-feature-snippet__content")
        checkAndInjectDiceToRolls(content, name);
        // DDB now displays tooltips on the modifiers, so it's not "1d4+3" it's "1d4<span>+3</span>" which causes
        // Beyond20 to see it as two separate formulas, a "1d4" and a "+3" which rolls as "1d20 + 3"
        // We need to find these and fix them manually
        const customRolls = content.find(".ct-beyond20-custom-roll");
        for (const customRoll of customRolls.toArray()) {
            const leftFormula = customRoll.textContent || "";
            let modifier = customRoll.nextSibling;
            let operator = "";
            if (!modifier) {
                // Handle the use case of both left and right formulas having a modifier tooltip
                const closestTooltip = $(customRoll).closest(".ddbc-tooltip");
                // Ensure we got the right setup of "<ddbc-tooltip><custom roll></ddbc-tooltip><ddbc-tooltip><custom roll></ddbc-tooltip>"
                if (leftFormula.trim() === closestTooltip.text().trim()) {
                    modifier = closestTooltip[0].nextSibling;
                }
            }
            if (!modifier) {
                // Handle the use case of <strong>1d6</strong>+6
                const parent = customRoll.parentElement;
                if (parent && parent.nodeName === "STRONG" && parent.textContent.trim() === leftFormula) {
                    modifier = parent.nextSibling;
                }
            }
            if (modifier && modifier.nodeName === "#text" &&
                ["+", "-", ""].includes(modifier.textContent.trim())) {
                operator = modifier.textContent.trim();
                modifier = modifier.nextSibling;
            }
            if (!modifier ||
                modifier.nodeName !== "SPAN" ||
                !modifier.classList.contains("ddbc-tooltip")) continue;
            // We found one! Let's grab the formula from both and replace the calculated one
            let rightFormula = modifier.textContent || "";
            if ($(modifier).find("span > u.ct-beyond20-custom-roll").length === 0) {
                // Handle the use case of <roll> + <tooltip>5</tooltip>
                if (!operator || !rightFormula.match(/[0-9]+/)) continue;
                rightFormula = `${operator}${rightFormula}`;
            } else {
                // Ensure we got the right setup of "<custom roll><ddbc-tooltip><custom roll></ddbc-tooltip>"
                if (rightFormula.trim() !== $(modifier).find("u.ct-beyond20-custom-roll").text()) continue;
                $(customRoll).find("img.ct-beyond20-custom-icon").hide();
            }
            
            const formula = `${leftFormula}${rightFormula}`;
            $(customRoll).find("img.ct-beyond20-custom-icon").attr("x-beyond20-roll", formula)
            $(modifier).find("img.ct-beyond20-custom-icon").attr("x-beyond20-roll", formula);
        }
    }

}
function showHotkeysList(popup) {
    popup.removeClass('beyond20-hotkeys-hidden');
}
function hideHotkeysList(popup) {
    popup.addClass('beyond20-hotkeys-hidden');
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
    let icon = chrome.runtime.getURL("images/icons/badges/normal20.png");
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
        icon = chrome.runtime.getURL("images/icons/badges/normal32.png");
    } else {
        return;
    }

    const button = E.div({ class: "ct-character-header-" + button_type + "__group ct-character-header-" + button_type + "__group--beyond20" },
        E.div({ class: "ct-character-header-" + button_type + "__button ct-beyond20-settings-button" },
            E.img({ class: "ct-beyond20-settings", src: icon }),
            E.span({ class: "ct-character-header-" + button_type + "__button-label" }, span_text)
        )
    );

    gap.after(button);
    $(button).on('click', (event) => alertQuickSettings());

    const hotkeys_button = E.div({ class: "ct-character-header-" + button_type + "__group ct-character-header-" + button_type + "__group--beyond20-hotkeys" },
        E.div({ class: "beyond20-hotkeys-popup beyond20-hotkeys-list beyond20-hotkeys-hidden"})
    );
    const hotkeys_popup = $(hotkeys_button).find(".beyond20-hotkeys-popup");

    gap.after(hotkeys_button);
    $(hotkeys_button).on('mouseenter', (event) => showHotkeysList(hotkeys_popup)).on('mouseleave', (event) => hideHotkeysList(hotkeys_popup));
    $(button).on('mouseenter', (event) => showHotkeysList(hotkeys_popup)).on('mouseleave', (event) => hideHotkeysList(hotkeys_popup));
    updateHotkeysList(hotkeys_popup);
}

var quick_roll = false;
var quick_roll_force_attack = false;
var quick_roll_force_damage = false;
var quick_roll_force_versatile = false;
var quick_roll_timeout = 0;


function deactivateQuickRolls() {
    let abilities = $(".ddbc-ability-summary .ddbc-ability-summary__primary .integrated-dice__container");
    // If digital dice are disabled, look up where the modifier is
    if (abilities.length === 0)
        abilities = $(".ct-quick-info__abilities .ddbc-ability-summary .ddbc-ability-summary__secondary .ddbc-signed-number, .ct-quick-info__abilities .ddbc-ability-summary .ddbc-ability-summary__primary .ddbc-signed-number, .ct-quick-info__abilities .ddbc-ability-summary .ddbc-ability-summary__secondary span[class*='styles_numberDisplay'], .ct-quick-info__abilities .ddbc-ability-summary .ddbc-ability-summary__primary span[class*='styles_numberDisplay']");
    const saving_throws = $(".ct-saving-throws-summary__ability .ct-saving-throws-summary__ability-modifier,.ddbc-saving-throws-summary__ability .ddbc-saving-throws-summary__ability-modifier");
    const skills = $(".ct-skills .ct-skills__list .ct-skills__col--modifier,.ddbc-skills .ddbc-skills__list .ddbc-skills__col--modifier");
    const actions = $(".ct-combat-attack .ct-combat-attack__icon,.ddbc-combat-attack .ddbc-combat-attack__icon");
    const actions_to_hit = $(".ddbc-combat-attack .ddbc-combat-attack__tohit .integrated-dice__container");
    const actions_damage = $(".ddbc-combat-attack .ddbc-combat-attack__damage .integrated-dice__container");
    const spells = $(".ct-spells-spell .ct-spells-spell__action,.ddbc-spells-spell .ddbc-spells-spell__action");
    const spells_to_hit = $(".ct-spells-spell .ct-spells-spell__tohit .integrated-dice__container, .ddbc-spells-spell .ddbc-spells-spell__tohit .integrated-dice__container");
    const spells_damage = $(".ct-spells-spell .ct-spells-spell__damage .integrated-dice__container, .ddc-spells-spell .ddc-spells-spell__damage .integrated-dice__container");
    const initiative = $(".ct-combat__summary-group--initiative div[class*='styles_value'] .integrated-dice__container, .ct-combat-tablet__extra--initiative .integrated-dice__container, .ct-combat-mobile__extras section div[class*='styles_value'] .integrated-dice__container");

    hideTooltipIfDestroyed();
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
    const beyond20_tooltip = getQuickRollTooltip();

    const {
        initiative,
        abilities, saving_throws, skills,
        actions, actions_to_hit, actions_damage,
        spells, spells_to_hit, spells_damage
    } = deactivateQuickRolls();

    if (!settings["quick-rolls"])
        return;

    activateTooltipListeners(initiative, 'up', beyond20_tooltip, (el) => {
        el.closest(".ct-combat__summary-group--initiative section[class*='styles_box'] div, section, div[class*='styles_label']").trigger('click');
        
        if(!$(".ct-sidebar__portal .ct-sidebar__header").parent().hasClass("b20-initiative-pane")) {
            $(".ct-sidebar__portal .ct-sidebar__header").parent().addClass("b20-initiative-pane");
        };

        if ($(".b20-initiative-pane").length)
            execute("b20-initiative-pane");
        else
            quick_roll = true;
    });
    for (let ability of abilities.toArray()) {
        activateTooltipListeners($(ability), 'down', beyond20_tooltip, (el) => {
            const name = el.closest(".ct-ability-summary,.ddbc-ability-summary")
                .find(".ct-ability-summary__heading .ct-ability-summary__label,.ddbc-ability-summary__heading .ddbc-ability-summary__label")
                .trigger('click').text();
            // If same item, clicking will be a noop && it won't modify the document;
            if(!$(".ct-sidebar__portal .ct-sidebar__header").parent().hasClass("b20-ability-pane")) {
                $(".ct-sidebar__portal .ct-sidebar__header").parent().addClass("b20-ability-pane");
            };
            const pane_name = $(".b20-ability-pane .ct-sidebar__heading").text().split(" ")[0];
            if (name == pane_name)
                execute("b20-ability-pane");
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
            if(!$(".ct-sidebar__portal .ct-sidebar__header").parent().hasClass("b20-ability-saving-throws-pane")) {
                $(".ct-sidebar__portal .ct-sidebar__header").parent().addClass("b20-ability-saving-throws-pane");
            };
            const pane_name = $(".b20-ability-saving-throws-pane .ct-sidebar__heading").text().slice(0, 3).toLowerCase();
            if (name == pane_name)
                execute("b20-ability-saving-throws-pane");
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

    const activateQRAction = (action, force_to_hit_only, force_damages_only, force_versatile) => {
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
                execute(paneClass, {force_to_hit_only, force_damages_only, force_versatile});
            } else {
                quick_roll_force_attack = force_to_hit_only;
                quick_roll_force_damage = force_damages_only;
                quick_roll_force_versatile = force_versatile;
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
        activateQRAction(action, false, true, action.previousElementSibling !== null);
    }

    const activateQRSpell = (spell, force_to_hit_only, force_damages_only) => {
        spell = $(spell);
        // To the right for attack and damage, to the left for to hit
        const position = force_to_hit_only ? 'left' : 'right';
        activateTooltipListeners(spell, position, beyond20_tooltip, (el) => {
            const name_element = el.closest(".ct-spells-spell,.ddbc-spells-spell")
                .find(".ct-spell-name,.ddbc-spell-name,span[class*='styles_spellName']");
            const name = name_element.trigger('click').text();
            // If same item, clicking will be a noop && it won't modify the document;
            const pane_name = $(".ct-spell-pane .ct-sidebar__heading .ct-spell-name,.ct-spell-pane .ct-sidebar__heading .ddbc-spell-name, .ct-spell-pane .ct-sidebar__heading span[class*='styles_spellName']").text();
            if (name == pane_name) {
                // For spells, check the spell level. DNDB doesn't switch to the right level when clicking the spell if
                // it's already the right spell (but wrong level)
                const castas = $(".ct-spell-caster__casting-level-current").text()
                const level = el.closest(".ct-content-group").find(".ct-content-group__header-content").text();
                const pane_level = castas === "" ? "Cantrip" : `${castas} Level`;
                if (pane_level.toLowerCase() === level.toLowerCase()) {
                    execute("ct-spell-pane", {force_to_hit_only, force_damages_only});
                } else {
                    // Trigger a click elsewhere to cause the sidepanel to change and then force it again to display the right level spell
                    $(".ddbc-character-tidbits__menu-callout").trigger('click');
                    name_element.trigger('click');
                    quick_roll_force_attack = force_to_hit_only;
                    quick_roll_force_damage = force_damages_only;
                    quick_roll_force_versatile = false;
                    quick_roll = true;
                }
            } else {
                quick_roll_force_attack = force_to_hit_only;
                quick_roll_force_damage = force_damages_only;
                quick_roll_force_versatile = false;
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
    execute(paneClass, {
        force_to_hit_only: quick_roll_force_attack,
        force_damages_only: quick_roll_force_damage,
        force_versatile: quick_roll_force_versatile
    });
    quick_roll_force_attack = false;
    quick_roll_force_damage = false;
    quick_roll_force_versatile = false;
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
        alertify.alert("This is a new or recently leveled-up character sheet and Beyond20 needs to parse its information. <br/>Please select the <strong>'Features &amp; Traits'</strong> panel on your DnDBeyond Character Sheet for Beyond20 to parse this character's features and populate the character-specific options.");
    }


    const customRoll = DigitalDiceManager.updateNotifications();
    if (customRoll && settings['use-digital-dice']) {
        dndbeyondDiceRoller.sendCustomDigitalDice(character, customRoll);
    }

    const SUPPORTED_PANES = [
        "ct-custom-skill-pane",
        "ct-skill-pane",
        "ct-class-feature-pane",
        "ct-racial-trait-pane",
        "ct-feat-pane",
        "ct-background-pane",
        "ct-trait-pane",
        "ct-item-pane",
        "ct-infusion-choice-pane",
        "ct-action-pane",
        "ct-custom-action-pane",
        "ct-spell-pane",
        "ct-reset-pane",
        "ct-health-manage-pane",
        "ct-creature-pane",
        "ct-vehicle-pane",
        "ct-condition-manage-pane",
        "ct-proficiencies-pane",
        "ct-character-manage-pane"
    ]

    const SPECIAL_PANES = {
        ability: "b20-ability-pane",
        savingThrow: "b20-ability-saving-throws-pane",
        initiative: "b20-initiative-pane"
    }

    const ABILITIES = [
        "strength",
        "dexterity",
        "constitution",
        "intelligence",
        "wisdom",
        "charisma",
    ]

    function handlePane(paneClass) {
        console.log("Beyond20: New side panel is : " + paneClass);
        injectRollButton(paneClass);
        if (quick_roll) {
            if (quick_roll_timeout > 0) clearTimeout(quick_roll_timeout);
            quick_roll_timeout = setTimeout(() => executeQuickRoll(paneClass), 50);
        }
    }
    
    const pane = $(SUPPORTED_PANES.map(pane => `.${pane}`).join(","));
    if (pane.length > 0) {
        pane.each((_, div) => handlePane(div.className));
    } else {
        const sidebar = $(".ct-sidebar__portal .ct-sidebar__header");
        const sideBarHeader = sidebar.text().toLowerCase();
    
        if (sideBarHeader.startsWith("saving")) {
            const paneClass = SPECIAL_PANES.savingThrow;
            if (!sidebar.parent().hasClass(paneClass)) {
                sidebar.parent().addClass(paneClass);
            }
            handlePane(paneClass);
        } else if (ABILITIES.some(ability => sideBarHeader.startsWith(ability))) {
            const paneClass = SPECIAL_PANES.ability;
            if (!sidebar.parent().hasClass(paneClass)) {
                sidebar.parent().addClass(paneClass);
            }
            handlePane(paneClass);
        } if (sideBarHeader.startsWith("initiative")) {
            const paneClass = SPECIAL_PANES.initiative;
            if (!sidebar.parent().hasClass(paneClass)) {
                sidebar.parent().addClass(paneClass);
            }
            handlePane(paneClass);
        }
    }
}

function updateSettings(new_settings = null) {

    if (new_settings) {
        settings = new_settings;
        character.setGlobalSettings(settings);
        key_bindings = getKeyBindings(settings)
        if (settings['hotkeys-bindings']) {
            updateHotkeysList();
        }
        sendCustomEvent("NewSettings", [settings, chrome.runtime.getURL("")]);
    } else {
        getStoredSettings((saved_settings) => {
            sendCustomEvent("Loaded", [saved_settings]);
            updateSettings(saved_settings);
            documentModified();
        });
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
sendCustomEvent("disconnect");
injectPageScript(chrome.runtime.getURL('dist/dndbeyond_mb.js'));
addCustomEventListener("SendMessage", _sendCustomMessageToBeyond20);
