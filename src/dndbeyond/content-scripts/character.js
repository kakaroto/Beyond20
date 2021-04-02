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
            modifier = mod >= 0 ? `+${mod}` : `${mod}`;
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

    if (character.hasRacialTrait("Deductive Intuition") && (skill_name == "Investigation" || skill_name == "Insight")){
        roll_properties.modifier += "+1d4";
    }

    if (character.hasRacialTrait("Windwright’s Intuition") && skill_name == "Acrobatics"){
        roll_properties.modifier += "+1d4";
    }
    return sendRollWithCharacter("skill", "1d20" + modifier, roll_properties);
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
            modifier = modifier >= 0 ? `+${modifier}` : `${modifier}`;
        } else if (character.hasClassFeature("Jack of All Trades") && character.getSetting("bard-joat", false)) {
            const JoaT = Math.floor(character._proficiency / 2);
            modifier = parseInt(modifier) + JoaT;
            modifier = modifier >= 0 ? `+${modifier}` : `${modifier}`;
        }
    }

    const roll_properties = {
        "name": ability_name,
        "ability": ability,
        "modifier": modifier
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
    // Wizard Bladesong Concentration Check Bonus
    if (character.hasClassFeature("Bladesong") && character.getSetting("wizard-bladesong", false) &&
        rollType == "saving-throw" && ability == "CON") {
        // Using confirm because the parent function is not async
        if (confirm('Your Bladesong whispers: "Is this a Concentration Check?"')) {
            const intelligence = character.getAbility("INT") || {mod: 0};
            const mod = Math.max((parseInt(intelligence.mod) || 0), 1);
            modifier = parseInt(modifier) + mod;
            modifier = modifier >= 0 ? `+${modifier}` : `${modifier}`;
            roll_properties["modifier"] = modifier;
        }
    }
    // Fey Wanderer Ranger - Otherworldly Glamour
    if (character.hasClassFeature("Otherworldly Glamour") && ability == "CHA") {
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
        if (properties["Attack Type"] == "Melee" &&
            character.hasClassFeature("Improved Divine Smite") &&
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
        action_name.includes("Polearm Master - Bonus Attack")) &&
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

    // Class Specific
    if (character.hasClass("Cleric")) {
        // Cleric: Blessed Strikes
        if ((item_name || action_name || (spell_name && spell_level.includes("Cantrip"))) &&
            character.hasClassFeature("Blessed Strikes") &&
            character.getSetting("cleric-blessed-strikes", false)) {
            damages.push("1d8");
            damage_types.push("Blessed Strikes");
        }
    }

    if (character.hasClass("Ranger")) {
        // Ranger: Favored Foe
        if (character.hasClassFeature("Favored Foe") &&
            character.getSetting("ranger-favored-foe", false)) {
            const ranger_level = character.getClassLevel("Ranger");
            damages.push(ranger_level < 6 ? "1d4" : ( ranger_level < 14 ? "1d6" : "1d8"));
            damage_types.push("Favored Foe");
        }
        
        // Ranger: Gathered Swarm
        if (character.hasClassFeature("Gathered Swarm") &&
            character.getSetting("ranger-gathered-swarm", false)) {
            const ranger_level = character.getClassLevel("Ranger");
            damages.push(ranger_level < 11 ? "1d6" : "1d8");
            damage_types.push("Gathered Swarm");
        }
    }

    if (character.hasClass("Warlock")) {
        // Warlock: The Hexblade: Hexblade's Curse
        if (damages.length > 0 &&
            character.getSetting("warlock-hexblade-curse", false) &&
            character.hasClassFeature("Hexblade’s Curse") &&
            character._proficiency !== null) {
            damages.push(character._proficiency);
            damage_types.push("Hexblade's Curse");
        }
        
        // Warlock: Genie Patron: Genie's Wrath
        if (character.hasClassFeature("Genie’s Vessel") &&
            character.getSetting("genies-vessel", false)) {
            damages.push(character._proficiency);
            damage_types.push("Genie's Wrath");
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
            item_type.indexOf(", Common") === -1) {
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
            (properties["Properties"] && properties["Properties"].includes("Finesse"))) ||
            (action_name && action_name.includes("Psychic Blade"))) {
            const sneak_attack = Math.ceil(character._classes["Rogue"] / 2) + "d6";
            damages.push(sneak_attack);
            damage_types.push("Sneak Attack");
        }
    }

    if (character.hasClass("Warlock")) {
        // Warlock: Eldritch Invocation: Lifedrinker
        if (to_hit !== null && 
            character.getSetting("eldritch-invocation-lifedrinker", false) &&
            item_customizations.includes("Pact Weapon")) {
            const charisma_damage_mod =  Math.max(character.getAbility("CHA").mod, 1);
            damages.push(`${charisma_damage_mod}`);
            damage_types.push("Lifedrinker");
        }
    }

    return to_hit;
}

function addCustomDamages(damages, damage_types) {
    const custom_damages = character.getSetting("custom-damage-dice", "");
    if (custom_damages.length > 0) {
        for (let custom_damage of split_custom_damages(custom_damages)) {
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
    for (const dice of [4, 6, 8, 10, 12]) {
        if (key_modifiers[`custom_add_damage_d${dice}`]) {
            damages.push(`1d${dice}`);
            damage_types.push("Custom");
        }
    }
}

function rollItem(force_display = false, force_to_hit_only = false, force_damages_only = false, spell_group = null) {
    const prop_list = $(".ct-item-pane .ct-property-list .ct-property-list__property,.ct-item-pane .ddbc-property-list .ddbc-property-list__property");
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
        const damage_types = [];
        for (let i = 0; i < prop_list.length; i++) {
            if (prop_list.eq(i).find(".ct-property-list__property-label,.ddbc-property-list__property-label").text() == "Damage:") {
                const value = prop_list.eq(i).find(".ct-property-list__property-content,.ddbc-property-list__property-content");
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

                if (versatile_damage != "") {
                    let versatile_choice = character.getSetting("versatile-choice", "both");
                    if (key_modifiers.versatile_one_handed)
                        versatile_choice = "one"
                    if (key_modifiers.versatile_two_handed)
                        versatile_choice = "two";
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

        addCustomDamages(damages, damage_types);

        to_hit = handleSpecialGeneralAttacks(damages, damage_types, properties, settings_to_change, {to_hit, item_name});

        to_hit = handleSpecialWeaponAttacks(damages, damage_types, properties, settings_to_change, {item_customizations, item_type, to_hit});

        if (properties["Attack Type"] == "Melee") {
            to_hit = handleSpecialMeleeAttacks(damages, damage_types, properties, settings_to_change, {to_hit});
        }

        if (properties["Attack Type"] == "Ranged") {
            to_hit = handleSpecialRangedAttacks(damages, damage_types, properties, settings_to_change, {to_hit});
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
        roll_properties["item-customizations"] = item_customizations;
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
                if (character.hasRacialTrait("Windwright’s Intuition") && is_tool && item_name == "Navigator's Tools")
                    roll_properties.modifier += "+1d4";
                return sendRollWithCharacter("skill", "1d20" + modifier, roll_properties);
            }
        });
    } else {
        return sendRollWithCharacter("item", 0, {
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
    let to_hit = properties["To Hit"] !== undefined && properties["To Hit"] !== "--" ? properties["To Hit"] : null;

    if (action_name == "Superiority Dice" || action_parent == "Maneuvers") {
        const fighter_level = character.getClassLevel("Fighter");
        let superiority_die = fighter_level < 10 ? "1d8" : (fighter_level < 18 ? "1d10" : "1d12");
        if (action_name === "Parry")
            superiority_die += " + " + character.getAbility("DEX").mod;
        else if (action_name === "Rally")
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
    } else if (Object.keys(properties).includes("Damage") || to_hit !== null || properties["Attack/Save"] !== undefined) {
        const damages = [];
        const damage_types = [];
        if (Object.keys(properties).includes("Damage")) {
            damages.push(properties["Damage"]);
            damage_types.push(properties["Damage Type"] || "");
        }

        addCustomDamages(damages, damage_types);

        const settings_to_change = {}
        let brutal = 0;
        let critical_limit = 20;
        if (character.hasClassFeature("Hexblade’s Curse") &&
            character.getSetting("warlock-hexblade-curse", false))
            critical_limit = 19;
        // Polearm master bonus attack using the other end of the polearm is considered a melee attack.
        if (action_name.includes("Polearm Master - Bonus Attack") && (character.hasClassFeature("Great Weapon Fighting", true) || character.hasFeat("Great Weapon Fighting", true))) {
            damages[0] = damages[0].replace(/[0-9]*d[0-9]+/g, "$&ro<=2");
        }

        const isMeleeAttack = action_name.includes("Polearm Master - Bonus Attack") || action_name.includes("Unarmed Strike") || action_name.includes("Tavern Brawler Strike")
        || action_name.includes("Psychic Blade") || action_name.includes("Bite") || action_name.includes("Claws") || action_name.includes("Tail")
        || action_name.includes("Ram") || action_name.includes("Horns") || action_name.includes("Hooves") || action_name.includes("Talons") 
        || action_name.includes("Thunder Gauntlets") || action_name.includes("Unarmed Fighting") || action_name.includes("Arms of the Astral Self");
        
        const isRangedAttack = action_name.includes("Lightning Launcher");

        to_hit = handleSpecialGeneralAttacks(damages, damage_types, properties, settings_to_change, {to_hit, action_name});

        if (isMeleeAttack || isRangedAttack) {
            to_hit = handleSpecialWeaponAttacks(damages, damage_types, properties, settings_to_change, {to_hit, action_name});
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
        return sendRollWithCharacter("action", 0, {
            "name": action_name,
            "description": description
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

    // Handle Spirit Guardians
    if (spell_name == "Spirit Guardians" && damages.length == 2 &&
        damage_types[0] == "Radiant" && damage_types[1] == "Necrotic") {
        const dmg = damages[0];
        damages.length = 0;
        damage_types.length = 0;
        damages.push(dmg);
        damage_types.push("Radiant or Necrotic");
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

        // Artificer: Alchemical Savant
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

}
    
function handleSpecialHealingSpells(spell_name, damages=[], damage_types=[], {spell_source="", spell_level="Cantrip", castas}={}) {
    if (character.hasClassFeature("Supreme Healing")) {
        for (let i = 0; i < damages.length; i++) {
            if (damage_types[i] !== "Healing") continue;
            damages[i] = damages[i].replace(/([0-9]*)d([0-9]+)?/, (match, dice, faces) => {
                return String(parseInt(dice || 1) * parseInt(faces));
            });
        }
    }
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
    
    // Find the icon with the AoE effect (<i class="i-aoe-sphere">) and convert it to a word
    const range_shape = $(".ct-spell-pane .ddbc-property-list__property .ct-spell-detail__range-shape i");
    const aoe_class = (range_shape.attr("class") || "").split(" ").find(c => c.startsWith("i-aoe-"));
    // Remove class prefix and capitalize first letter
    const aoe_shape = aoe_class ? aoe_class.replace(/^i-aoe-(.)/, (_, g) => g.toUpperCase()) : undefined;

    let to_hit = properties["To Hit"] !== undefined && properties["To Hit"] !== "--" ? properties["To Hit"] : null;

    if (to_hit === null)
        to_hit = findToHit(spell_full_name, ".ct-combat-attack--spell,.ddbc-combat-attack--spell", ".ct-spell-name,.ddbc-spell-name", ".ct-combat-attack__tohit,.ddbc-combat-attack__tohit");
    if (to_hit === null)
        to_hit = findToHit(spell_full_name, ".ct-spells-spell,.ddbc-spells-spell", ".ct-spell-name,.ddbc-spell-name", ".ct-spells-spell__tohit,.ddbc-spells-spell__tohit");

    if (!force_display && (damage_modifiers.length > 0 || healing_modifiers.length > 0 || temp_hp_modifiers.length > 0 || to_hit !== null || properties["Attack/Save"] !== undefined)) {
        const damages = [];
        const damage_types = [];
        const settings_to_change = {}
        
        for (let modifier of damage_modifiers.toArray()) {
            const dmg = $(modifier).find(".ct-spell-caster__modifier-amount,.ddbc-spell-caster__modifier-amount").text();
            const dmgtype = $(modifier).find(".ct-damage-type-icon .ct-tooltip,.ddbc-damage-type-icon .ddbc-tooltip").attr("data-original-title") || "";
            damages.push(dmg);
            damage_types.push(dmgtype);
        }

        handleSpecialSpells(spell_name, damages, damage_types, {spell_level: level, spell_source, castas});

        // If statement should contain specific spells that shouldn't have extras applied to them
        // Hunter's Mark in example is already an "additional damage on an attack" spell, so other additional damages would be to that attack
        if (spell_name != "Hunter's Mark") {
            to_hit = handleSpecialGeneralAttacks(damages, damage_types, properties, settings_to_change, {to_hit, spell_name, spell_level: level});
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
            handleSpecialHealingSpells(spell_name, damages, damage_types, {spell_level: level, spell_source, castas});
        }

        addCustomDamages(damages, damage_types);

        let critical_limit = 20;
        if (character.hasClassFeature("Hexblade’s Curse") &&
            character.getSetting("warlock-hexblade-curse", false))
            critical_limit = 19;
        if (spell_full_name === "Blade of Disaster")
            critical_limit = 18;
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
    let description = descriptionToString(`.${paneClass} .ct-snippet__content,.${paneClass} .ddbc-snippet__content`);
    const choices = $(`.${paneClass} .ct-feature-snippet__choices .ct-feature-snippet__choice`);
    if (choices.length > 0) {
        description += "\n";
        for (const choice of choices.toArray()) {
            const choiceText = descriptionToString(choice);
            description = `${description}\n> ${choiceText}`;
        }
    }
    return sendRollWithCharacter("feature", 0, {
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
        source: "Bakground",
        description: description
    });
}

function displayAction(paneClass) {
    const action_name = $(".ct-sidebar__heading").text();
    const description = descriptionToString(".ct-action-detail__description");
    return sendRollWithCharacter("action", 0, {
        "name": action_name,
        "description": description
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

async function execute(paneClass, {force_to_hit_only = false, force_damages_only = false, spell_group=null}={}) {
    console.log("Beyond20: Executing panel : " + paneClass, force_to_hit_only, force_damages_only);
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
        if (["ct-skill-pane", "ct-custom-skill-pane"].includes(paneClass))
            await rollSkillCheck(paneClass);
        else if (paneClass == "ct-ability-pane")
            await rollAbilityCheck();
        else if (paneClass == "ct-ability-saving-throws-pane")
            await rollSavingThrow();
        else if (paneClass == "ct-initiative-pane")
            await rollInitiative();
        else if (paneClass == "ct-item-pane")
            await rollItem(false, force_to_hit_only, force_damages_only, spell_group);
        else if (["ct-action-pane", "ct-custom-action-pane"].includes(paneClass))
            await rollAction(paneClass, force_to_hit_only, force_damages_only);
        else if (paneClass == "ct-spell-pane")
            await rollSpell(false, force_to_hit_only, force_damages_only);
        else
            await displayPanel(paneClass);
    }
    await rollCustomText(customTextRolls.after);
}

function displayPanel(paneClass) {
    console.log("Beyond20: Displaying panel : " + paneClass);
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
    const skills = $(".ct-skills .ct-skills__list .ct-skills__col--modifier,.ddbc-skills .ddbc-skills__list .ddbc-skills__col--modifier");
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
                execute(paneClass, {force_to_hit_only, force_damages_only});
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
                    execute("ct-spell-pane", {force_to_hit_only, force_damages_only});
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
    execute(paneClass, {force_to_hit_only: quick_roll_force_attack, force_damages_only: quick_roll_force_damage});
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
        alertify.alert("This is a new or recently leveled-up character sheet and Beyond20 needs to parse its information. <br/>Please select the <strong>'Features &amp; Traits'</strong> panel on your DnDBeyond Character Sheet for Beyond20 to parse this character's features and populate the character-specific options.");
    }


    const customRoll = DigitalDiceManager.updateNotifications();
    if (customRoll && settings['use-digital-dice']) {
        dndbeyondDiceRoller.sendCustomDigitalDice(character, customRoll);
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
        if (settings['hotkeys-bindings']) {
            key_bindings = settings['hotkeys-bindings'];
            updateHotkeysList();
        }
    } else {
        getStoredSettings((saved_settings) => {
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
            if (character._settings && request.settings["last-features-classes"] &&
                character._settings["last-features-classes"] !== request.settings["last-features-classes"]) {
                alertify.success("Beyond20: Character's class features parsed successfully.");
            }
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
