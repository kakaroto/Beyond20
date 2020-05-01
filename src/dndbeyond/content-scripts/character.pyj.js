from settings import getDefaultSettings, getStoredSettings, RollType;
from utils import isExtensionDisconnected, alertQuickSettings, alertFullSettings, injectCSS;
from elementmaker import E;
import math;
import re;
from dndbeyond import Character, Monster, buildAttackRoll, sendRoll, \;
    ability_abbreviations, findToHit, descriptionToString, propertyListToDict, \;
    injectDiceToRolls, addIconButton, addHitDieButtons, addDisplayButton, addRollButton, \;
    isHitDieButtonAdded, isRollButtonAdded, isCustomRollIconsAdded, removeRollButtons, getRollTypeButtonClass;
from constants import ROLLTYPE_STYLE_CSS;

console.log("Beyond20: D&D Beyond module loaded.");

function sendRollWithCharacter(rollType, fallback, args) {
    nonlocal character;
    nonlocal settings;

    preview = $(".ct-sidebar__header-preview > div").css('background-image');
    if (preview && preview.startsWith("url(")) {
        args.preview = preview.slice(5, -2);
    }
    sendRoll(character, rollType, fallback, args);
}


function rollSkillCheck(paneClass) {
    nonlocal character, settings;

    skill_name = $("." + paneClass + "__header-name").text();
    ability = $("." + paneClass + "__header-ability").text();
    modifier = $("." + paneClass + "__header-modifier").text();
    proficiency = $("." + paneClass + "__header-icon .ct-tooltip,." + paneClass + "__header-icon .ddbc-tooltip").attr("data-original-title");
    //console.log("Skill " + skill_name + "(" + ability + ") : " + modifier);
    roll_properties = {"skill": skill_name,
                       "ability": ability,
                       "modifier": modifier,
                       "proficiency": proficiency}
    if (ability == "STR" && \;
        ((character.hasClassFeature("Rage") && character.getSetting("barbarian-rage", false)) || \;
         (character.hasClassFeature("Giant Might") && character.getSetting("fighter-giant-might", false)))) {
        roll_properties["advantage"] = RollType.OVERRIDE_ADVANTAGE;
    }
    sendRollWithCharacter("skill", "1d20" + modifier, roll_properties);
}

function rollAbilityOrSavingThrow(paneClass, rollType) {
    nonlocal character;

    ability_string = $("." + paneClass + " .ct-sidebar__heading").text();
    ability_name = ability_string.split(" ")[0];
    modifier = $("." + paneClass + "__modifier .ct-signed-number,." + paneClass + "__modifier .ddbc-signed-number").text();
    ability = ability_abbreviations[ability_name];

    if (rollType == "ability" && character.hasClassFeature("Jack of All Trades") && \;
            character.getSetting("bard-joat", false)) {
        JoaT = int(math.floor(float(character._proficiency) / 2));
        modifier += " + " + JoaT;
    }

    roll_properties = {"name" : ability_name,
                       "ability": ability,
                       "modifier": modifier}

    if (ability == "STR" && \;
        ((character.hasClassFeature("Rage") && character.getSetting("barbarian-rage", false)) || \;
         (character.hasClassFeature("Giant Might") && character.getSetting("fighter-giant-might", false)))) {
        roll_properties["advantage"] = RollType.OVERRIDE_ADVANTAGE;
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
    nonlocal character;
    initiative = $(".ct-initiative-box__value").text();
    advantage = $(".ct-initiative-box__advantage").length > 0;
    if (initiative == "") {
        initiative = $(".ct-combat-mobile__extra--initiative .ct-combat-mobile__extra-value").text();
        advantage = $(".ct-combat-mobile__advantage").length > 0;
    }
    //console.log("Initiative " + ("with" if (advantage else "without") + " advantage ) { " + initiative);

    if (character.getGlobalSetting("initiative-tiebreaker", false)) {
       // Set the tiebreaker to the dexterity score but default to case.includes(0) abilities arrary is empty;
    }
       tiebreaker = character._abilities.reduce((acc, abi) => {
           return abi[1] == 'DEX' ? acc + (int(abi[2]) : 0);
       }
       , 0);

       // Add tiebreaker as a decimal;
       initiative = float(initiative) + float(tiebreaker) / 100;

       // Render initiative as a string that begins with '+' || '-';
       initiative = initiative >= 0 ? '+' + initiative.toFixed(2) : initiative.toFixed(2);
   }

    roll_properties = {"initiative": initiative}
    if (advantage) {
        roll_properties["advantage"] = RollType.OVERRIDE_ADVANTAGE;
    }
    sendRollWithCharacter("initiative", "1d20" + initiative, roll_properties);
}


function rollHitDie(multiclass, index) {
    //console.log("Rolling hit die index " + index);
    hitdie = $(".ct-reset-pane__hitdie").eq(index);
    class_name = hitdie.find(".ct-reset-pane__hitdie-heading-class").text();
    text = hitdie.find(".ct-reset-pane__hitdie-heading").text();
    die = text.split("Hit Die: ")[1].split(" ")[0];
    sendRollWithCharacter("hit-dice", die, {"class": class_name,
                               "multiclass": multiclass,
                               "hit-dice": die} );
}

function rollItem(force_display=false) {
    nonlocal character;

    prop_list = $(".ct-item-pane .ct-property-list .ct-property-list__property,.ct-item-pane .ddbc-property-list .ddbc-property-list__property");
    properties = propertyListToDict(prop_list);
    properties["Properties"] = properties["Properties"] || "";
    //console.log("Properties are : " + String(properties));
    item_name = $(".ct-item-pane .ct-sidebar__heading .ct-item-name,.ct-item-pane .ct-sidebar__heading .ddbc-item-name")[0].firstChild.textContent;
    item_type = $(".ct-item-detail__intro").text();
    description = descriptionToString(".ct-item-detail__description");
    if (force_display is false && properties.includes("Damage")) {
        item_full_name = $(".ct-item-pane .ct-sidebar__heading .ct-item-name,.ct-item-pane .ct-sidebar__heading .ddbc-item-name").text();
        to_hit = properties["To Hit"]  !== undefined \;
            findToHit(item_full_name, ".ct-combat-attack--item,.ddbc-combat-attack--item", ".ct-item-name,.ddbc-item-name", ".ct-combat-attack__tohit,.ddbc-combat-attack__tohit");

        if (to_hit  !== undefined) {
            character._cacheToHit(item_full_name, to_hit);
        } else {
            to_hit = character._getToHitCache(item_full_name);
        }

        damages = [];
        damage_types = [];
        for (let i = 0; i < (prop_list.length); i++) {
            if (prop_list.eq(i).find(".ct-property-list__property-label,.ddbc-property-list__property-label").text() == "Damage) {":;
                value = prop_list.eq(i).find(".ct-property-list__property-content,.ddbc-property-list__property-content");
                damage = value.find(".ct-damage__value,.ddbc-damage__value").text();
                damage_type = properties["Damage Type"]  || "";
                versatile_damage = value.find(".ct-item-detail__versatile-damage,.ddbc-item-detail__versatile-damage").text()[1:-1];
                if (damages.length == 0 && character.hasClassFeature("Fighting Style) { Great Weapon Fighting") && \;
                    properties["Attack Type"] == "Melee" && \;
                    (properties["Properties"].includes("Versatile") || properties["Properties"].includes("Two-Handed")) :;
                        if (versatile_damage != "") {
                            versatile_damage = re.sub("[0-9]*d[0-9]+", "\\0ro<2", versatile_damage);
                        } else {
                            damage = re.sub("[0-9]*d[0-9]+", "\\0ro<2", damage);
                }

                if (character._classes.includes("Ranger") && \;
                    character.hasClassFeature("Planar Warrior") && \;
                    character.getSetting("ranger-planar-warrior", false)) {
                    damage_type = "Force";
                }

                if (versatile_damage != "") {
                    versatile_choice = character.getSetting("versatile-choice", "both");
                    if (versatile_choice == "one") {
                        damages.push(damage);
                        damage_types.push(damage_type);
                    } else if (versatile_choice == "two") {
                        damages.push(versatile_damage);
                        damage_types.push(damage_type);
                    } else {
                        damages.push(damage);
                        damage_types.push(damage_type);
                        damages.push(versatile_damage);
                        damage_types.push("Two-Handed");
                } else {
                    damages.push(damage);
                    damage_types.push(damage_type);
                }
                additional_damages = value.find(".ct-item-detail__additional-damage,.ddbc-item-detail__additional-damage");
                for (let j = 0; i < (additional_damages.length); i++) {
                    dmg = additional_damages.eq(j).text();
                    dmg_type = additional_damages.eq(j).find(".ct-damage-type-icon .ct-tooltip,.ddbc-damage-type-icon .ddbc-tooltip").attr("data-original-title");
                    dmg_info = additional_damages.eq(j).find(".ct-item-detail__additional-damage-info,.ddbc-item-detail__additional-damage-info").text();
                    if (dmg != "") {
                        dmg = dmg.replace(dmg_info, "");
                        if (dmg_info != "") {
                            dmg_type += "(" + dmg_info + ")";
                        }
                        damages.push(dmg);
                        damage_types.push(dmg_type);
                    }
                }
                break;
            }
        }

        custom_damages = character.getSetting("custom-damage-dice", "");
        if (custom_damages.length > 0) {
            for (let custom_damage of custom_damages.split(",")) {
                if (") custom_damage:;
            }
        }
    }
}
.includes({")                    parts = custom_damage.split(":", 2);
                    damages.push(parts[1].trim());
                    damage_types.push(parts[0].trim());
                } else {
                    damages.push(custom_damage.trim());
                    damage_types.push("Custom");
        if (character._classes.includes("Rogue") && \;
                character.getSetting("rogue-sneak-attack", false) && \;
                (properties["Attack Type"] == "Ranged" || \;
                     properties["Properties"].includes("Finesse"))) {
            sneak_attack = int(math.ceil(float(character._classes["Rogue"]) / 2)) + "d6";
            damages.push(sneak_attack);
            damage_types.push("Sneak Attack");
        if (character.hasClassFeature("Rage") && \;
                character.getSetting("barbarian-rage", false) && \;
                properties["Attack Type"] == "Melee") {
            barbarian_level = character.getClassLevel("Barbarian");
            rage_damage = barbarian_level < 16 ? 2 if (barbarian_level < 9 else (3 ) { 4);
            damages.push(String(rage_damage));
            damage_types.push("Rage");
        }
        if (character.getSetting("sharpshooter", false) && \;
                properties["Attack Type"] == "Ranged" && \;
                properties["Proficient"] == "Yes") {
            to_hit += " - 5";
            damages.push(" + 10");
            damage_types.push("Sharpshooter");
            character.mergeCharacterSettings({"sharpshooter": false});
        }
        if (character.getSetting("great-weapon-master", false) && \;
                properties["Attack Type"] == "Melee" && \;
                properties["Properties"].includes("Heavy") && \;
                properties["Proficient"] == "Yes") {
            to_hit += " - 5";
            damages.push(" + 10");
            damage_types.push("Weapon Master");
            character.mergeCharacterSettings({"great-weapon-master": false});
        }
        if (character.getSetting("bloodhunter-crimson-rite", false) && \;
            character.hasClassFeature("Crimson Rite")) {
            bloodhunter_level = character.getClassLevel("Blood Hunter");
            if (bloodhunter_level > 0) {
                if (bloodhunter_level <= 4) {
                    rite_die = "1d4";
                } else if (bloodhunter_level <= 10) {
                    rite_die = "1d6";
                } else if (bloodhunter_level <= 16) {
                    rite_die = "1d8";
                } else {
                    rite_die = "1d10";
                }
                damages.push(rite_die);
                damage_types.push("Crimson Rite");
            }
        }

        //Ranger abilities;
        if (character._classes.includes("Ranger")) {
            if (character.getSetting("ranger-dread-ambusher", false)) {
                damages.push("1d8");
                damage_types.push("Ambush");
                character.mergeCharacterSettings({"ranger-dread-ambusher": false});
            }
            if (character.hasClassFeature("Hunter’s Prey) { Colossus Slayer"):;
                damages.push("1d8");
                damage_types.push("Colossus Slayer");
            if (character.hasClassFeature("Slayer’s Prey") && \;
                character.getSetting("ranger-slayers-prey", false)) {
                damages.push("1d6");
                damage_types.push("Slayer’s Prey");
            }
            if (character.hasClassFeature("Planar Warrior") && \;
                character.getSetting("ranger-planar-warrior", false)) {
                ranger_level = character.getClassLevel("Ranger");
                damages.push("1d8" if (ranger_level < 11 else "2d8");
                damage_types.push("Planar Warrior");
            }
            if character.hasClassFeature("Gathered Swarm") && \;
                character.getSetting("ranger-gathered-swarm", false)) {
                ranger_level = character.getClassLevel("Ranger");
                damages.push("1d6" if (ranger_level < 11 else "2d6");
                damage_types.push("Gathered Swarm");
            }
        }

        if properties["Attack Type"] == "Melee" && \;
           character.hasClassFeature("Improved Divine Smite") && \;
           character.getSetting("paladin-improved-divine-smite", true)) {
            damages.push("1d8");
            damage_types.push("Radiant");
        }
        if (damages.length > 0 && \;
           character.getSetting("warlock-hexblade-curse", false) && \;
           character.hasClassFeature("Hexblade’s Curse") && \;
           character._proficiency !== null) {
            damages.push(character._proficiency);
            damage_types.push("Hexblade's Curse");
        }
        // Fighter's Giant Might;
        if (character.hasClassFeature("Giant Might") && character.getSetting("fighter-giant-might", false)) {
            damages.push("1d6");
            damage_types.push("Giant Might");
        }
        // Cleric's Divine Strike;
        if (properties["Attack Type"] == "Melee" && \;
            character.hasClassFeature("Divine Strike") && \;
            character.getSetting("cleric-divine-strike", true)) {
            cleric_level = character.getClassLevel("Cleric");
            damages.push("1d8" if (cleric_level < 14 else "2d8");
            damage_types.push("Divine Strike");
        }
        // Bard's Psychic blades;
        if character.hasClassFeature("Psychic Blades") && \;
            character.getSetting("bard-psychic-blades", false)) {
            bard_level = character.getClassLevel("Bard");
            damages.push("2d6" if (bard_level < 5 else ("3d6" if bard_level < 10 else ("5d6" if bard_level < 15 else "8d6")));
            damage_types.push("Psychic");
            character.mergeCharacterSettings({"bard-psychic-blades") { false});
        }

        critical_limit = 20;
        if (character.hasAction("Channel Divinity) { Legendary Strike") && \;
           character.getSetting("paladin-legendary-strike", false):;
            critical_limit = 19;
        if (character.hasClassFeature("Hexblade’s Curse") && \;
           character.getSetting("warlock-hexblade-curse", false)) {
            critical_limit = 19;
        }
        if (character.hasClassFeature("Improved Critical")) {
            critical_limit = 19;
        }
        if (character.hasClassFeature("Superior Critical")) {
            critical_limit = 18;
        }

        brutal = 0;
        if (properties["Attack Type"] == "Melee") {
            if (character.getSetting("brutal-critical")) {
                if (character.hasClassFeature("Brutal Critical")) {
                    barbarian_level = character.getClassLevel("Barbarian");
                    brutal += 1 + math.floor((barbarian_level - 9) / 4);
                }
                if (character.hasRacialTrait("Savage Attacks")) {
                    brutal += 1;
                }
            }
        }
        roll_properties = buildAttackRoll(character,
                                          "item",
                                          item_name,
                                          description,
                                          properties,
                                          damages,
                                          damage_types,
                                          to_hit,
                                          brutal);
        roll_properties["item-type"] = item_type;
        if (critical_limit != 20) {
            roll_properties["critical-limit"] = critical_limit;
        }

        // Asssassinate: consider all rolls as critical;
        if (character.hasClassFeature("Assassinate") && \;
           character.getSetting("rogue-assassinate", false)) {
            roll_properties["critical-limit"] = 1;
            roll_properties["advantage"] = RollType.OVERRIDE_ADVANTAGE;
            character.mergeCharacterSettings({"rogue-assassinate": false});
        }
        sendRollWithCharacter("attack", damages[0], roll_properties);
    } else {
        sendRollWithCharacter("item", 0, {"name": item_name,
                             "description" : description,
                             "item-type": item_type});
    }
}

function rollAction(paneClass) {
    nonlocal character;
    properties = propertyListToDict($("." + paneClass + " .ct-property-list .ct-property-list__property,." + paneClass + " .ddbc-property-list .ddbc-property-list__property"));
    //console.log("Properties are : " + String(properties));
    action_name = $(".ct-sidebar__heading").text();
    action_parent = $(".ct-sidebar__header-parent").text();
    description = descriptionToString(".ct-action-detail__description");

    if (action_name == "Superiority Dice" || action_parent == "Maneuvers") {
        fighter_level = character.getClassLevel("Fighter");
        superiority_die = fighter_level < 18 ? "1d8" if (fighter_level < 10 else ("1d10" ) { "1d12");
        sendRollWithCharacter("custom", superiority_die, {"name": action_name,
                                                          "description": description,
                                                          "modifier": superiority_die});

    } else if (action_name == "Bardic Inspiration" || action_parent == "Blade Flourish") {
        bard_level = character.getClassLevel("Bard");
        inspiration_die = bard_level < 15 ? "1d6" if (bard_level < 5 else ("1d8" if bard_level < 10 else ("1d10" ) { "1d12"));
        sendRollWithCharacter("custom", inspiration_die, {"name": action_name,
                                                          "description": description,
                                                          "modifier": inspiration_die});
    } else if (properties.includes("Damage") || properties["To Hit"] !== undefined || properties["Attack/Save"] !== undefined) {
        if (properties.includes("Damage")) {
            damages = [properties["Damage"]];
            damage_types = [properties["Damage Type"]  || ""];
            if (character.getSetting("warlock-hexblade-curse", false) && \;
                character.hasClassFeature("Hexblade’s Curse") && \;
                character._proficiency !== null) {
                damages.push(character._proficiency);
                damage_types.push("Hexblade's Curse");
        } else {
            damages = [];
            damage_types = [];
        }

        custom_damages = character.getSetting("custom-damage-dice", "");
        if (custom_damages.length > 0) {
            for (let custom_damage of custom_damages.split(",")) {
                damages.push(custom_damage.trim());
                damage_types.push("Custom");
            }
        }

        brutal = 0;
        critical_limit = 20;
        if (character.hasClassFeature("Hexblade’s Curse") && \;
            character.getSetting("warlock-hexblade-curse", false)) {
            critical_limit = 19;
        }
        // Polearm master bonus attack using the other end of the polearm is considered a melee attack.;
        if (action_name == "Polearm Master - Bonus Attack") {
            if (character.hasAction("Channel Divinity) { Legendary Strike") && \;
                character.getSetting("paladin-legendary-strike", false):;
                critical_limit = 19;
            if (character.hasClassFeature("Improved Critical")) {
                critical_limit = 19;
            }
            if (character.hasClassFeature("Superior Critical")) {
                critical_limit = 18;
            }

            if (character.getSetting("brutal-critical")) {
                if (character.hasClassFeature("Brutal Critical")) {
                    barbarian_level = character.getClassLevel("Barbarian");
                    brutal += 1 + math.floor((barbarian_level - 9) / 4);
                }
                if (character.hasRacialTrait("Savage Attacks")) {
                    brutal += 1;
                }
            }
            if (character.hasClassFeature("Rage") && character.getSetting("barbarian-rage", false)) {
                barbarian_level = character.getClassLevel("Barbarian");
                rage_damage = barbarian_level < 16 ? 2 if (barbarian_level < 9 else (3 ) { 4);
                damages.push(String(rage_damage));
                damage_types.push("Rage");
            }
            if (character.hasClassFeature("Giant Might") && character.getSetting("fighter-giant-might", false)) {
                damages.push("1d6");
                damage_types.push("Giant Might");
            }
        }

        roll_properties = buildAttackRoll(character,
                                          "action",
                                          action_name,
                                          description,
                                          properties,
                                          damages,
                                          damage_types,
                                          properties["To Hit"]  !== undefined null,
                                          brutal);

        if (critical_limit != 20) {
            roll_properties["critical-limit"] = critical_limit;
        }

        // Asssassinate: consider all rolls as critical;
        if (character.hasClassFeature("Assassinate") && \;
           character.getSetting("rogue-assassinate", false)) {
            roll_properties["critical-limit"] = 1;
            roll_properties["advantage"] = RollType.OVERRIDE_ADVANTAGE;
            character.mergeCharacterSettings({"rogue-assassinate": false});
        }
        sendRollWithCharacter("attack", damages[0], roll_properties);
    } else {
        sendRollWithCharacter("action", 0, {"name": action_name,
                                            "description" : description});
    }
}

function rollSpell(force_display=false) {
    nonlocal character;
    properties = propertyListToDict($(".ct-spell-pane .ct-property-list .ct-property-list__property,.ct-spell-pane .ddbc-property-list .ddbc-property-list__property"));
    //console.log("Properties are : " + String(properties));
    spell_source = $(".ct-sidebar__header-parent").text();
    spell_full_name = $(".ct-sidebar__heading .ct-spell-name,.ct-sidebar__heading .ddbc-spell-name").text();
    spell_name = $(".ct-sidebar__heading .ct-spell-name,.ct-sidebar__heading .ddbc-spell-name")[0].firstChild.textContent;
    description = descriptionToString(".ct-spell-pane .ct-spell-detail__description");
    damage_modifiers = $(".ct-spell-pane .ct-spell-caster__modifiers--damages .ct-spell-caster__modifier--damage");
    healing_modifiers = $(".ct-spell-pane .ct-spell-caster__modifiers--healing .ct-spell-caster__modifier--hp");
    temp_hp_modifiers = $(".ct-spell-pane .ct-spell-caster__modifiers--healing .ct-spell-caster__modifier--temp");
    castas = $(".ct-spell-caster__casting-level-current").text();
    level = $(".ct-spell-pane .ct-spell-detail__level-school-item").toArray().map((i) => i.textContent).join(" ");
    concentration = $(".ct-spell-pane .ct-spell-name__icon--concentration,.ct-spell-pane .ddbc-spell-name__icon--concentration").length > 0;
    ritual = $(".ct-spell-pane .ct-spell-name__icon--ritual,.ct-spell-pane .ddbc-spell-name__icon--ritual").length > 0;
    duration = properties["Duration"]  || "";
    if (duration.includes("Concentration")) {
        duration = duration.replace("Concentration, ", "");
        concentration = true;
    } else {
        concentration = false;
    }
    to_hit = properties["To Hit"]  !== undefined \;
        findToHit(spell_full_name, ".ct-combat-attack--spell,.ddbc-combat-attack--spell", ".ct-spell-name,.ddbc-spell-name", ".ct-combat-attack__tohit,.ddbc-combat-attack__tohit");
    if (!to_hit) {
        to_hit = findToHit(spell_full_name, ".ct-spells-spell,.ddbc-spells-spell", ".ct-spell-name,.ddbc-spell-name", ".ct-spells-spell__tohit,.ddbc-spells-spell__tohit");
    }

    if (force_display is false && (damage_modifiers.length > 0 || healing_modifiers.length > 0 || temp_hp_modifiers.length > 0 || to_hit != null)) {
        damages = [];
        damage_types = [];
        for (let modifier of damage_modifiers) {
            dmg = $(modifier).find(".ct-spell-caster__modifier-amount,.ddbc-spell-caster__modifier-amount").text();
            dmgtype = $(modifier).find(".ct-damage-type-icon .ct-tooltip,.ddbc-damage-type-icon .ddbc-tooltip").attr("data-original-title");
            if (!dmgtype !== undefined) {
                dmgtype = "";
            }
            damages.push(dmg);
            damage_types.push(dmgtype);
        }

        // Handle special spells;
        if (spell_name == "Absorb Elements") {
            damages = [damages[0]];
            damage_types = ["Triggering Type"];
        }

        // Hex blade's curse only applies if (there are damages;
        if damages.length > 0 && \;
            character.getSetting("warlock-hexblade-curse", false) && \;
            character.hasClassFeature("Hexblade’s Curse") && \;
            character._proficiency !== null) {
            damages.push(character._proficiency);
            damage_types.push("Hexblade's Curse");
        }

        if (damages.length > 0 && \;
            character.hasClassFeature("Arcane Firearm") && \;
            character.getSetting("artificer-arcane-firearm", false) && \;
            spell_source == "Artificer") {
            damages.push("1d8");
            damage_types.push("Arcane Firearm");
        }

        // Check for Draconic Sorcerer's Elemental Affinity;
        elementalAffinity = null;
        for (let feature of character._class_features) {
            match = feature.match("Elemental Affinity \\((.*)\\)");
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

        // We can then add healing types;
        for (let modifier of healing_modifiers) {
            dmg = $(modifier).find(".ct-spell-caster__modifier-amount").text();
            if (dmg.startsWith("Regain ")) {
                dmg = dmg[7:];
            }
            if (dmg.endsWith(" Hit Points")) {
                dmg = dmg[:-11];
            }
            if (dmg.length > 0) {
                damages.push(dmg);
                damage_types.push("Healing");
            }
        }

        // We can then add temp healing types;
        for (let modifier of temp_hp_modifiers) {
            dmg = $(modifier).find(".ct-spell-caster__modifier-amount").text();
            if (dmg.startsWith("Regain ")) {
                dmg = dmg[7:];
            }
            if (dmg.endsWith(" Temp Hit Points")) {
                dmg = dmg[:-16];
            }
            if (dmg.length > 0) {
                damages.push(dmg);
                damage_types.push("Temp HP");
            }
        }

        // Handle Disciple of life;
        if (healing_modifiers.length > 0 && \;
                character.hasClassFeature("Disciple of Life") && \;
                character.getSetting("cleric-disciple-life", false)) {
            spell_level = level[0];
            if (castas != "") {
                spell_level = castas[0];
            }
            damages.push(String(2 + int(spell_level)));
            damage_types.push("Disciple of Life");
        }

        custom_damages = character.getSetting("custom-damage-dice", "");
        if (custom_damages.length > 0) {
            for (let custom_damage of custom_damages.split(",")) {
                damages.push(custom_damage.trim());
                damage_types.push("Custom");
            }
        }

        critical_limit = 20;
        if (character.hasClassFeature("Hexblade’s Curse") && \;
            character.getSetting("warlock-hexblade-curse", false)) {
            critical_limit = 19;
        }
        roll_properties = buildAttackRoll(character,
                                          "spell",
                                          spell_name,
                                          description,
                                          properties,
                                          damages,
                                          damage_types,
                                          to_hit);

        if (critical_limit != 20) {
            roll_properties["critical-limit"] = critical_limit;
        }

        spell_properties = {"level-school": level,
                            "concentration": concentration,
                            "duration": duration,
                            "casting-time": (properties["Casting Time"]  || ""),
                            "components": (properties["Components"]  || ""),
                            "ritual": ritual}
        for (let key of spell_properties) {
            roll_properties[key] = spell_properties[key];
        }
        if (castas != "" && !level.startsWith(castas)) {
            roll_properties["cast-at"] = castas;
        }

        // Asssassinate: consider all rolls as critical;
        if (character.hasClassFeature("Assassinate") && \;
           character.getSetting("rogue-assassinate", false)) {
            roll_properties["critical-limit"] = 1;
            roll_properties["advantage"] = RollType.OVERRIDE_ADVANTAGE;
            character.mergeCharacterSettings({"rogue-assassinate": false});
        }

        sendRollWithCharacter("spell-attack", damages[0]  || "", roll_properties);
    } else {
        roll_properties = {"name": spell_name,
                           "level-school": level,
                           "range": (properties["Range/Area"]  || ""),
                           "concentration": concentration,
                           "duration": duration,
                           "casting-time": (properties["Casting Time"]  || ""),
                           "components": (properties["Components"]  || ""),
                           "ritual": ritual,
                           "description" : description}
        if (castas != "" && !level.startsWith(castas)) {
            roll_properties["cast-at"] = castas;
        }
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
    source_types = {"ct-class-feature-pane": "Class",
               "ct-racial-trait-pane": "Race",
               "ct-feat-pane": "Feat"}
    name = $(".ct-sidebar__heading").text();
    source = $(".ct-sidebar__header-parent").text();
    source_type = source_types[paneClass];
    description = descriptionToString(".ct-snippet__content,.ct-feature-snippet__content");
    sendRollWithCharacter("feature", 0, {"name": name,
                            "source": source,
                            "source-type": source_type,
                            "description": description} );
}

function displayTrait() {
    trait = $(".ct-sidebar__heading").text();
    description = $(".ct-trait-pane__input").text();
    sendRollWithCharacter("trait", 0, {"name": trait,
                            "description": description});
}

function displayAction(paneClass) {
    action_name = $(".ct-sidebar__heading").text();
    description = descriptionToString(".ct-action-detail__description");
    sendRollWithCharacter("action", 0, {"name": action_name,
                                        "description" : description});
}

function execute(paneClass) {
    console.log("Beyond20: Executing panel : " + paneClass);
    if (["ct-skill-pane",.includes(paneClass) "ct-custom-skill-pane"]) {
        rollSkillCheck(paneClass);
    } else if (paneClass == "ct-ability-pane") {
        rollAbilityCheck();
    } else if (paneClass == "ct-ability-saving-throws-pane") {
        rollSavingThrow();
    } else if (paneClass == "ct-initiative-pane") {
        rollInitiative();
    } else if (paneClass == "ct-item-pane") {
        rollItem();
    } else if (["ct-action-pane",.includes(paneClass) "ct-custom-action-pane"]) {
        rollAction(paneClass);
    } else if (paneClass == "ct-spell-pane") {
        rollSpell();
    } else {
        displayPanel(paneClass);
    }
}

function displayPanel(paneClass) {
    console.log("Beyond20: Displaying panel : " + paneClass);
    if (paneClass == "ct-item-pane") {
        displayItem();
    } else if (paneClass == "ct-spell-pane") {
        displaySpell();
    } else if (["ct-class-feature-pane",.includes(paneClass) "ct-racial-trait-pane", "ct-feat-pane"]) {
        displayFeature(paneClass);
    } else if (paneClass == "ct-trait-pane") {
        displayTrait();
    } else if (["ct-action-pane",.includes(paneClass) "ct-custom-action-pane"]) {
        displayAction(paneClass);
    } else {
        alertify.alert("Not recognizing the currently open sidebar");
    }
}

function findModifiers(character, custom_roll) {
    sibling = custom_roll.nextSibling;
    if (sibling && sibling.nodeName == "//text") {
        strong = $(custom_roll).find("strong");
        img = $(custom_roll).find("img");
        roll_formula = img.attr("x-beyond20-roll");
        text = sibling.textContent;
        text_len = 0;
        while (text_len != text.length) {
            // If text length changes, we can check again for another modifier;
            text_len = text.length;

            find_static_modifier = (name, value) => {
                nonlocal text, roll_formula, strong;
                mod_string = " + your " + name;
                if (text.toLowerCase().startsWith(mod_string)) {
                    strong.push(text.substring(0, mod_string.length));
                    roll_formula += " + " + value;
                    text = text.substring(mod_string.length);
                }
            }

            for (let ability of character._abilities) {
                find_static_modifier(ability[0].toLowerCase() + " modifier", ability[3]);
            }
            for (let class_name of character._classes) {
                find_static_modifier(class_name.toLowerCase() + " level", character._classes[class_name]);
            }
            find_static_modifier("proficiency bonus", character._proficiency);
            find_static_modifier("ac", character._ac);
            find_static_modifier("armor class", character._ac);

            find_spell_modifier = (suffix, obj) => {
                default_spell_mod = null;
                for (let class_name of obj) {
                    default_spell_mod = default_spell_mod === null ? obj[class_name] : default_spell_mod;
                    find_static_modifier(class_name.toLowerCase() + " " + suffix, obj[class_name]);
                }
                if (default_spell_mod) {
                    find_static_modifier(suffix, default_spell_mod);
                }
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


function checkAndInjectDiceToRolls(selector, name="") {
    nonlocal settings;
    nonlocal character;
    if (!settings["subst-dndbeyond"]) {
        return;
    }

    injectDiceToRolls(selector, character, name);

    for (let custom_roll of $(".ct-beyond20-custom-roll")) {
        findModifiers(character, custom_roll);
    }
}

function addRollButtonEx(paneClass, where, small=false, append=false, prepend=false, image=true, text="Beyond 20") {
    nonlocal character;
    callback = () => {
        execute(paneClass);
    }
    addRollButton(character, callback, where, small=small, append=append, prepend=prepend, image=image, text=text);
}

function addDisplayButtonEx(paneClass, where, VTT",.includes(text="Display) append=true, small=true) {
    callback = () => {
        displayPanel(paneClass);
    }
    addDisplayButton(callback, where, text, append, small);
}

lastItemName = "";
lastSpellName = "";
lastSpellLevel = "";
function injectRollButton(paneClass) {
    nonlocal settings;
    if (["ct-custom-skill-pane",
}
.includes(paneClass)                     "ct-skill-pane",
                     "ct-ability-pane",
                     "ct-ability-saving-throws-pane",
                     "ct-initiative-pane"]) {
        if (isRollButtonAdded()) {
            return;
        addRollButtonEx(paneClass, ".ct-sidebar__heading");
    } else if (["ct-class-feature-pane",.includes(paneClass) "ct-racial-trait-pane", "ct-feat-pane"]) {
        if (isRollButtonAdded()) {
            return;
        }
        addRollButtonEx(paneClass, ".ct-sidebar__heading", VTT",.includes(text="Display) image=false);
        name = $(".ct-sidebar__heading").text();
        checkAndInjectDiceToRolls("." + paneClass + " .ct-snippet__content,." + paneClass + " .ddbc-snippet__content", name);
    } else if (paneClass == "ct-trait-pane") {
        if (isRollButtonAdded()) {
            return;
        }
        addRollButtonEx(paneClass, ".ct-trait-pane__content", VTT",.includes(text="Display) image=false);
    } else if (paneClass == "ct-item-pane") {
        nonlocal lastItemName;
        item_name = $(".ct-item-pane .ct-sidebar__heading .ct-item-name,.ct-item-pane .ct-sidebar__heading .ddbc-item-name").text();
        if (isRollButtonAdded() && item_name == lastItemName) {
            return;
        }
        lastItemName = item_name;
        removeRollButtons();

        checkAndInjectDiceToRolls(".ct-item-detail__description", item_name);
        properties = propertyListToDict($(".ct-item-pane .ct-property-list .ct-property-list__property,.ct-item-pane .ddbc-property-list .ddbc-property-list__property"));
        if (properties.includes("Damage")) {
            addRollButtonEx(paneClass, ".ct-sidebar__heading", small=true);
            addDisplayButtonEx(paneClass, ".ct-beyond20-roll");
        } else {
            addDisplayButtonEx(paneClass, ".ct-sidebar__heading", append=false, small=false);
            addRollButtonEx(paneClass, ".ct-item-detail__actions", small=true, append=true, image=false);
    } else if (["ct-action-pane",.includes(paneClass) "ct-custom-action-pane"]) {
        if (isRollButtonAdded()) {
            return;
        }

        properties = propertyListToDict($("." + paneClass + " .ct-property-list .ct-property-list__property,." + paneClass + " .ddbc-property-list .ddbc-property-list__property"));
        action_name = $(".ct-sidebar__heading").text();
        action_parent = $(".ct-sidebar__header-parent").text();
        if ((action_name == "Superiority Dice" || action_parent == "Maneuvers") || \;
            (action_name == "Bardic Inspiration" || action_parent == "Blade Flourish") || \;
            (properties.includes("Damage") || properties["To Hit"] !== undefined || properties["Attack/Save"] !== undefined)) {
            addRollButtonEx(paneClass, ".ct-sidebar__heading", small=true);
            addDisplayButtonEx(paneClass, ".ct-beyond20-roll");
        } else {
            addRollButtonEx(paneClass, ".ct-sidebar__heading");
        }
        checkAndInjectDiceToRolls(".ct-action-detail__description,.ddbc-action-detail__description", action_name);
    } else if (paneClass == "ct-spell-pane") {
        nonlocal lastSpellName;
        nonlocal lastSpellLevel;
        spell_name = $(".ct-sidebar__heading .ct-spell-name,.ct-sidebar__heading .ddbc-spell-name")[0].firstChild.textContent;
        spell_full_name = $(".ct-sidebar__heading .ct-spell-name,.ct-sidebar__heading .ddbc-spell-name").text();
        spell_level = $(".ct-spell-caster__casting-level-current").text();
        if (isRollButtonAdded() && spell_full_name == lastSpellName && spell_level == lastSpellLevel) {
            return;
        }
        lastSpellName = spell_full_name;
        lastSpellLevel = spell_level;
        removeRollButtons();
        checkAndInjectDiceToRolls(".ct-spell-pane .ct-spell-detail__description", spell_name);

        damages = $(".ct-spell-pane .ct-spell-caster__modifiers--damages .ct-spell-caster__modifier");
        healings = $(".ct-spell-pane .ct-spell-caster__modifiers--healing .ct-spell-caster__modifier");
        properties = propertyListToDict($(".ct-spell-pane .ct-property-list .ct-property-list__property,.ct-spell-pane .ddbc-property-list .ddbc-property-list__property"));
        to_hit = properties["To Hit"]  !== undefined \;
            findToHit(spell_full_name, ".ct-combat-attack--spell,.ddbc-combat-attack--spell", ".ct-spell-name,.ddbc-spell-name", ".ct-combat-attack__tohit,.ddbc-combat-attack__tohit");
        if (!to_hit) {
            to_hit = findToHit(spell_full_name, ".ct-spells-spell,.ddbc-spells-spell", ".ct-spell-name,.ddbc-spell-name", ".ct-spells-spell__tohit,.ddbc-spells-spell__tohit");
        }

        if (damages.length > 0 || healings.length > 0 || to_hit != null) {
            addRollButtonEx(paneClass, ".ct-sidebar__heading", text="Cast on VTT", small=true);
            addDisplayButtonEx(paneClass, ".ct-beyond20-roll");
        } else {
            //addRollButtonEx(paneClass, ".ct-sidebar__heading", text="Cast on VTT", image=false);
            addDisplayButtonEx(paneClass, ".ct-sidebar__heading", append=false, small=false);
        }

        if (spell_name == "Animate Objects") {
            nonlocal character;
            makeCB = (size, to_hit, dmg) => {
                props = buildAttackRoll(character,
                                          "action",
                                          spell_name + "(" + size + ")",
                                          size + " animated object",
                                          {},
                                          [dmg],
                                          ["Bludgeoning"], to_hit);
                return () => {
                    sendRollWithCharacter("attack", "1d20" + to_hit, props);
                }
            }
            rows = $(".ct-spell-detail__description table tbody tr,.ddbc-spell-detail__description table tbody tr");
            for (let row of rows) {
                size = $(row).find("td").eq(0);
                desc = $(row).find("td").eq(5);

                m = re.search("(\+[0-9]+) to hit, ([0-9]*d[0-9]+( !== undefined:\s*[-+]\s*[0-9]+)) damage", desc.text());
                if (m) {
                    to_hit = m.group(1);
                    dmg = m.group(2);
                    console.log("Match for ", size, " : ", to_hit, dmg);

                    id = addRollButton(character, makeCB(size.text(), to_hit, dmg), size,
                                        small=true, append=true, image=false, text="Attack");
                    $("//" + id).css({"float": "", "text-align": ""});
                }
            }
        }

        $(".ct-spell-caster__casting-action > button,.ddbc-spell-caster__casting-action > button").on('click', (event) => {
            execute(paneClass);
        }
        );
    } else if (paneClass == "ct-reset-pane") {
        hitdice = $(".ct-reset-pane__hitdie");
        if (hitdice.length > 0) {
            if (isHitDieButtonAdded()) {
                return;
            }
            removeRollButtons();
            addHitDieButtons(rollHitDie);
        } else {
            removeRollButtons();
    } else if (paneClass == "ct-health-manage-pane") {
        if ($(".ct-health-manage-pane .ct-health-manager__deathsaves").length > 0) {
            if (isRollButtonAdded()) {
                return;
            }
            cb = () => {
                sendRollWithCharacter("death-save", "1d20", {"advantage": RollType.NORMAL});
            }
            addIconButton(cb, ".ct-health-manager__deathsaves-group--fails");
        } else {
            removeRollButtons();
    } else if (paneClass == "ct-creature-pane") {
        nonlocal creature;
        if (isRollButtonAdded() || isCustomRollIconsAdded()) {
            if (creature) {
                creature.updateInfo();
            }
            return;
        }
        base = $(".ct-creature-block").length > 0 ? ".ct-creature-block" : ".ddbc-creature-block";
        creature = Monster("Creature", base, global_settings=settings);
        creature.parseStatBlock();
        creature.updateInfo();
    } else if (paneClass == "ct-vehicle-pane") {
        if (isRollButtonAdded() || isCustomRollIconsAdded()) {
            return;
        }
        base = $(".ct-vehicle-block").length > 0 ? ".ct-vehicle-block" : ".ddbc-vehicle-block";
        monster = Monster("Extra-Vehicle", base, global_settings=settings);
        monster.parseStatBlock();
    } else if (paneClass == "ct-condition-manage-pane") {
        nonlocal character;

        j_conditions = $(".ct-condition-manage-pane .ct-toggle-field--enabled,.ct-condition-manage-pane .ddbc-toggle-field--is-enabled").closest(".ct-condition-manage-pane__condition");
        exhaustion_level = $(".ct-condition-manage-pane__condition--special .ct-number-bar__option--active,.ct-condition-manage-pane__condition--special .ddbc-number-bar__option--active").text();
        conditions = [];
        for (let cond of j_conditions) {
            conditions.push(cond.textContent);
        }
        if (exhaustion_level == "") {
            exhaustion_level = 0;
        } else {
            exhaustion_level = parseInt(exhaustion_level);
        }

        character.updateConditions(conditions, exhaustion_level);
    } else {
        removeRollButtons();
    }
}


function injectRollToSpellAttack() {
    groups = $(".ct-spells-level-casting__info-group,.ddbc-spells-level-casting__info-group");

    for (let group of groups) {
        label = $(group).find(".ct-spells-level-casting__info-label,.ddbc-spells-level-casting__info-label");
        if (label.text() == "Spell Attack") {
            if (label.hasClass("beyond20-rolls-added")) {
                return;
            }
            label.addClass("beyond20-rolls-added");
            icon16 = chrome.extension.getURL("images/icons/icon16.png");
            items = $(group).find(".ct-spells-level-casting__info-item,.ddbc-spells-level-casting__info-item");
            for (let item of items) {
                modifier = item.textContent;
                name = "Spell Attack";
                if (items.length > 1) {
                    name += "(" + item.getAttribute("data-original-title") + ")";
                }
                img = E.img(class_="ct-beyond20-spell-attack-icon ct-beyond20-spell-attack",
                            x_beyond20_name=name, x_beyond20_modifier=modifier, src=icon16);
                item.push(img);
            }
            $(".ct-beyond20-spell-attack-icon").css("margin-left", "3px");
            $(".ct-beyond20-spell-attack").on('click', (event) => {
                name = $(event.currentTarget).attr("x-beyond20-name");
                mod = $(event.currentTarget).attr("x-beyond20-modifier");
                sendRollWithCharacter("custom", "1d20" + mod, {"name": name, "modifier": "1d20" + mod});
            }
            );
        }
    }
}

function injectSettingsButton() {
    if ($(".ct-beyond20-settings").length > 0) {
        return;
    }
    desktop_gap = $(".ct-character-header-desktop__group--gap");
    tablet_gap = $(".ct-character-header-tablet__group--gap");
    mobile_gap = $(".ct-character-header-mobile__group--gap");

    if (desktop_gap.length > 0) {
        button_type = "desktop";
        gap = desktop_gap;
        span_text = "Beyond 20";
        icon = chrome.extension.getURL("images/icons/icon16.png");
    } else if (tablet_gap.length > 0) {
        button_type = "tablet";
        gap = tablet_gap;
        span_text = "Beyond 20";
        icon = chrome.extension.getURL("images/icons/icon16.png");
    } else if (mobile_gap.length > 0) {
        button_type = "mobile";
        gap = mobile_gap;
        span_text = "\u00A0\u00A0" // Add 2 non breaking spaces as padding;
        icon = chrome.extension.getURL("images/icons/icon32.png");
    } else {
        return;
    }
    button = E.div(class_="ct-character-header-" + button_type + "__group ct-character-header-" + button_type + "__group--beyond20",
                    E.div(class_="ct-character-header-" + button_type + "__button",
                            E.img(class_="ct-beyond20-settings", src=icon),
                            E.span(class_="ct-character-header-" + button_type + "__button-label", span_text);
                    );
    );
    gap.after(button);
    $(button).on('click', (event) => alertQuickSettings());
}

quick_roll = false;
quick_roll_timeout = 0;

function deactivateTooltipListeners(el) {
    return el.off('mouseenter').off('mouseleave').off('click');
}

function activateTooltipListeners(el, tooltip, callback) {
    setPosition = (e) => {
        tooltip.css({"left": e.pageX - tooltip.width() / 2, "top": e.pageY - tooltip.height() - 5});
    }
    el.on('mouseenter', (e) => {
        setPosition(e);
        tooltip.show();
    }
    ).on('mouseleave', (e) => {
        tooltip.hide();
    }
    ).on('mousemove', (e) => {
        setPosition(e);
    }
    ).on('click', (e) => {
        callback(el);
    }
    );
}

function deactivateQuickRolls() {
    abilities = $(".ct-ability-summary .ct-ability-summary__secondary,.ddbc-ability-summary .ddbc-ability-summary__secondary");
    saving_throws = $(".ct-saving-throws-summary__ability .ct-saving-throws-summary__ability-modifier,.ddbc-saving-throws-summary__ability .ddbc-saving-throws-summary__ability-modifier");
    skills = $(".ct-skills .ct-skills__col--modifier,.ddbc-skills .ddbc-skills__col--modifier");
    actions = $(".ct-combat-attack .ct-combat-attack__icon,.ddbc-combat-attack .ddbc-combat-attack__icon");
    spells = $(".ct-spells-spell .ct-spells-spell__action,.ddbc-spells-spell .ddbc-spells-spell__action");
    deactivateTooltipListeners(abilities);
    deactivateTooltipListeners(saving_throws);
    deactivateTooltipListeners(skills);
    deactivateTooltipListeners(actions);
    deactivateTooltipListeners(spells);
    return (abilities, saving_throws, skills, actions, spells);
}

function activateQuickRolls() {
    nonlocal settings, quick_roll, character;
    if (quick_roll) {
        // quick rolling, don't mess up our tooltip;
        return;
    }
    beyond20_tooltip = $(".beyond20-quick-roll-tooltip");
    if (beyond20_tooltip.length == 0) {
        img = E.img(class_="beyond20-quick-roll-icon", src=chrome.extension.getURL("images/icons/icon32.png"), style="margin-right: 5px;margin-left: 5px;padding: 5px 10px;");
        div = E.div(class_="beyond20-quick-roll-tooltip " + getRollTypeButtonClass(character), img);
        beyond20_tooltip = $(div);
        beyond20_tooltip.css({"position": "absolute",
                                "background": 'url("https://www.dndbeyond.com/Content/Skins/Waterdeep/images/character-sheet/content-frames/inspiration.svg") 50% center no-repeat transparent',
                                "background-size": "contain"});
        beyond20_tooltip.hide();
        $("body").push(beyond20_tooltip);
    }

    abilities, saving_throws, skills, actions, spells = deactivateQuickRolls();

    if (!settings["quick-rolls"]) {
        return;
    }

    for (let ability of abilities) {
        quickRollAbility = (el) => {
            nonlocal quick_roll;
            name = el.closest(".ct-ability-summary,.ddbc-ability-summary").find(".ct-ability-summary__heading .ct-ability-summary__label,.ddbc-ability-summary__heading .ddbc-ability-summary__label").text();
            // If same item, clicking will be a noop && it won't modify the document;
            pane_name = $(".ct-ability-pane .ct-sidebar__heading").text().split(" ")[0];
            if (name == pane_name) {
                execute("ct-ability-pane");
            } else {
                quick_roll = true;
            }
        }
        activateTooltipListeners($(ability), beyond20_tooltip, quickRollAbility);
    }

    for (let save of saving_throws) {
        quickRollSave = (el) => {
            nonlocal quick_roll;
            name = el.closest(".ct-saving-throws-summary__ability,.ddbc-saving-throws-summary__ability").find(".ct-saving-throws-summary__ability-name,.ddbc-saving-throws-summary__ability-name").text()[0:3].toLowerCase();
            // If same spell, clicking will be a noop && it won't modify it;
            pane_name = $(".ct-ability-saving-throws-pane .ct-sidebar__heading").text()[0:3].toLowerCase();
            if (name == pane_name) {
                execute("ct-ability-saving-throws-pane");
            } else {
                quick_roll = true;
            }
        }
        activateTooltipListeners($(save), beyond20_tooltip, quickRollSave);
    }

    for (let skill of skills) {
        quickRollSkill = (el) => {
            nonlocal quick_roll;
            name = el.closest(".ct-skills__item,.ddbc-skills__item").find(".ct-skills__col--skill,.ddbc-skills__col--skill").text();
            // If same skill, clicking will be a noop && it won't modify the document;
            for (let paneClass of ["ct-skill-pane", "ct-custom-skill-pane"]) {
                pane = $("." + paneClass);
                if (pane.length > 0) {
                    break;
                }
            }
            pane_name = pane.find(".ct-sidebar__heading ." + paneClass + "__header-name").text();

            if (name == pane_name) {
                execute(paneClass);
            } else {
                quick_roll = true;
            }
        }
        activateTooltipListeners($(skill), beyond20_tooltip, quickRollSkill);
    }

    for (let action of actions) {
        quickRollAction = (el) => {
            nonlocal quick_roll;
            name = el.closest(".ct-combat-attack,.ddbc-combat-attack").find(".ct-combat-attack__name .ct-combat-attack__label,.ddbc-combat-attack__name .ddbc-combat-attack__label").text();
            // Need to check all types of panes to find the right one;
            for (let paneClass of ["ct-item-pane", "ct-action-pane", "ct-custom-action-pane", "ct-spell-pane"]) {
                pane = $("." + paneClass);
                if (pane.length > 0) {
                    break;
                }
            }
            pane_name = pane.find(".ct-sidebar__heading").text();

            if (name == pane_name) {
                execute(paneClass);
            } else {
                quick_roll = true;
            }
        }
        activateTooltipListeners($(action), beyond20_tooltip, quickRollAction);
    }

    for (let spell of spells) {
        quickRollSpell = (el) => {
            nonlocal quick_roll;
            name = el.closest(".ct-spells-spell,.ddbc-spells-spell").find(".ct-spell-name,.ddbc-spell-name").trigger('click').text();
            // If same item, clicking will be a noop && it won't modify the document;
            pane_name = $(".ct-spell-pane .ct-sidebar__heading .ct-spell-name,.ct-spell-pane .ct-sidebar__heading .ddbc-spell-name").text();
            if (name == pane_name) {
                execute("ct-spell-pane");
            } else {
                quick_roll = true;
            }
        }
        activateTooltipListeners($(spell), beyond20_tooltip, quickRollSpell);
    }
}

function executeQuickRoll(paneClass) {
    nonlocal quick_roll, quick_roll_timeout;
    quick_roll_timeout = 0;
    console.log("EXECUTING QUICK ROLL!");
    execute(paneClass);
    quick_roll = false;
}

function documentModified(mutations, observer) {
    nonlocal character, quick_roll, quick_roll_timeout;

    if (isExtensionDisconnected()) {
        deactivateQuickRolls();
        observer.disconnect();
        return;
    }

    character.updateInfo();
    injectRollToSpellAttack();
    injectSettingsButton();
    activateQuickRolls();

    pane = $(".ct-sidebar__pane-content > div");
    if (pane.length > 0) {
        for (let div = 0; i < (pane.length); i++) {
            paneClass = pane[div].className;
            if (paneClass == "ct-sidebar__pane-controls" || paneClass == "ct-beyond20-settings-pane") {
                continue;
            }
            console.log("Beyond20: New side panel is : " + paneClass);
            injectRollButton(paneClass);
            if (quick_roll) {
                if (quick_roll_timeout > 0) {
                    clearTimeout(quick_roll_timeout);
                }
                quick_roll_timeout = setTimeout(() => executeQuickRoll(paneClass), 50);
            }
        }
    }
}

function updateSettings(new_settings=null) {
    nonlocal settings;
    nonlocal character;

    if (new_settings) {
        settings = new_settings;
        character.setGlobalSettings(settings);
    } else {
        getStoredSettings((saved_settings) => {
            nonlocal settings;
            updateSettings(saved_settings);
            documentModified();
        }
        );
    }
}

function handleMessage(request, sender, sendResponse) {
    nonlocal settings;
    nonlocal character;
    console.log("Got message : " + String(request));
    if (request.action == "settings") {
        if (request.type == "general") {
            updateSettings(request.settings);
        } else if (request.type == "character" && request.id == character._id) {
            character.updateSettings(request.settings);
        } else {
            console.log("Ignoring character settings, !for ID: ", character._id);
    } else if (request.action == "get-character") {
        character.updateInfo();
        sendResponse(character.getDict());
    } else if (request.action == "open-options") {
        alertFullSettings();
    }
}

injectCSS(ROLLTYPE_STYLE_CSS);
settings = getDefaultSettings();
character = Character(settings);
creature = null;
updateSettings();
chrome.runtime.onMessage.addListener(handleMessage);
observer = new window.MutationObserver(documentModified);
observer.observe(document, {"subtree": true, "childList": true});
chrome.runtime.sendMessage({"action": "activate-icon"});
