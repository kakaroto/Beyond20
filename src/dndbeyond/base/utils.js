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
        const prop = propList.eq(i);
        let labelElement = prop.find(".ct-property-list__property-label,.ddbc-property-list__property-label,[class*='InfoItem_label']");
        let valueElement = prop.find(".ct-property-list__property-content,.ddbc-property-list__property-content,[class*='InfoItem_value']");
        // April 2024 website redesign now uses dynamic class names with styled components
        if (labelElement.length === 0 || valueElement.length === 0) {
            labelElement = prop.children().filter((i, el) => el.className.toLowerCase().includes("label"));
            valueElement = prop.children().filter((i, el) => el.className.toLowerCase().includes("value"));
        }
        if (labelElement.length > 0 && valueElement.length > 0) {
            let label = labelElement.text().trim();
            const value = valueElement.text().trim();
            if (label.endsWith(":")) {
                label = label.slice(0, -1);
            }
            properties[label] = value;
        }
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

async function queryDamageTypeFromArray(name, damages, damage_types, possible_types) {
    const damage_choices = {}
    let first_idx = -1;
    for (let dmgtype of possible_types) {
        const idx = damage_types.findIndex(t => t === dmgtype);
        if (idx === -1) continue;
        damage_choices[damage_types.splice(idx, 1)[0]] = damages.splice(idx, 1)[0];
        if (first_idx === -1) first_idx = idx;
    }
    if (first_idx === -1) return;
    const id = `dmg-${name.replace(/[^a-zA-Z0-9]/g, '-')}`;
    const choice = await dndbeyondDiceRoller.queryDamageType(name, damage_choices, id);
    if (choice === null) return null; // query was cancelled
    damages.splice(first_idx, 0, damage_choices[choice]);
    damage_types.splice(first_idx, 0, choice);
    return choice;
}

async function queryCunningStrike() {
    const selection = [];
    // Sneak Attack free-rules, pg. 129
    // Cunning Strike free-rules, pg. 130
    const actions = [{ action: "None" }];
    const hasImprovedCunningStrike = character.hasClassFeature("Improved Cunning Strike");
    
    actions.push(...character.getSneakAttackActions());
    
    const options = [...actions.map(m => m["die"] ? `${m.action}: ${m.die}D6` : `${m.action}`)];

    const getSelection = choices => {
        return choices.map(m => {
            if (!m || m === "None") return {action: "None"};
            const option = m.split(":")[0];
            return actions.find(f => f.action === option);
        });
    }
        
    if(hasImprovedCunningStrike) {
        const choice = await dndbeyondDiceRoller.queryDoubleGeneric("Sneak Attack: Cunning Strike", "Cunning Strike effect", options, "Improved Cunning Strike effect", options, "sneak-attack", options, options, "None", "None");
        if (choice) {
            selection.push(...getSelection(choice));
        }
    } else {
        const choice = [await dndbeyondDiceRoller.queryGeneric("Sneak Attack: Cunning Strike", "Cunning Strike effect", options, "sneak-attack", options, "None")];
        if(choice) {
            selection.push(...getSelection(choice));
        }
    }
    
    return selection;
}

async function buildAttackRoll(character, attack_source, name, description, properties,
                         damages = [], damage_types = [], to_hit = null,
                         brutal = 0, force_to_hit_only = false, force_damages_only = false, {weapon_damage_length=0}={}, settings_to_change = []) {
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

    if (properties["Properties"] !== undefined) {
        roll_properties["properties"] = properties["Properties"].split(", ");
    }
    if (attack_source === "item") {
        roll_properties["proficient"] = properties["Proficient"] === "Yes";
    }

    if (damages.length > 0) {
        roll_properties["damages"] = damages;
        roll_properties["damage-types"] = damage_types;
        
        if (roll_properties.name === "Chromatic Orb") {
            const choice = await queryDamageTypeFromArray(roll_properties.name, damages, damage_types, ["Acid", "Cold", "Fire", "Lightning", "Poison", "Thunder"]);
            if (choice === null) return null; // Query was cancelled;
        } else if (roll_properties.name === "Sorcerous Burst") {
            const choice = await queryDamageTypeFromArray(roll_properties.name, damages, damage_types, ["Acid", "Cold", "Fire", "Lightning", "Poison", "Psychic", "Thunder"]);
            if (choice === null) return null; // Query was cancelled;
        } else if (roll_properties.name === "Dragon's Breath") {
            const choice = await queryDamageTypeFromArray(roll_properties.name, damages, damage_types, ["Acid", "Cold", "Fire", "Lightning", "Poison"]);
            if (choice === null) return null; // Query was cancelled;
        } else if (roll_properties.name.includes("Chaos Bolt")) {
            let base_damage = null;
            for (let dmgtype of ["Acid", "Cold", "Fire", "Force", "Lightning", "Poison", "Psychic", "Thunder"]) {
                const idx = damage_types.findIndex(t => t === dmgtype);
                if (idx === -1) continue;
                base_damage = damages.splice(idx, 1)[0];
                damage_types.splice(idx, 1);
            }
            if (base_damage) {
                damages.splice(0, 0, base_damage);
                damage_types.splice(0, 0, "Chaotic Energy");
            }
            // Chaos Bolt has a 1d6 damage with no damage type assigned
            const no_type_idx = damage_types.findIndex(t => t === "");
            if (no_type_idx > -1) {
                damage_types[no_type_idx] = "Chaotic Energy";
            }
        } else if (roll_properties.name == "Toll the Dead") {
            const ttd_dice = await dndbeyondDiceRoller.queryGeneric(roll_properties.name, "Is the target missing any of its hit points ?", { "d12": "Yes", "d8": "No" }, "ttd_dice", ["d12", "d8"]);
            if (ttd_dice === null) return null;
            damages[0] = damages[0].replace("d8", ttd_dice);
        }  else if (roll_properties.name === "Spirit Shroud") {
            const choice = await queryDamageTypeFromArray(roll_properties.name, damages, damage_types, ["Cold", "Necrotic", "Radiant"]);
            if (choice === null) return null; // Query was cancelled;
        } else if (roll_properties.name === "Destructive Wave") {
            const choice = await queryDamageTypeFromArray(roll_properties.name, damages, damage_types, ["Radiant", "Necrotic"]);
            if (choice === null) return null; // Query was cancelled;
        } else if (roll_properties.name === "Elemental Weapon") {
            const choice = await queryDamageTypeFromArray(roll_properties.name, damages, damage_types, ["Acid", "Cold", "Fire", "Lightning", "Thunder"]);
            if (choice === null) return null; // Query was cancelled;
        } else if (roll_properties.name === "Elemental Bane") {
            const choice = await queryDamageTypeFromArray(roll_properties.name, damages, damage_types, ["Acid", "Cold", "Fire", "Lightning", "Thunder"]);
            if (choice === null) return null; // Query was cancelled;
        } else if (roll_properties.name === "Spirit Guardians") {
            const choice = await queryDamageTypeFromArray(roll_properties.name, damages, damage_types, ["Radiant", "Necrotic"]);
            if (choice === null) return null; // Query was cancelled;
        }

        // TODO: refactor into a method and remove it from build attack roll 
        if (character.hasClass("Rogue") && character.hasClassFeature("Sneak Attack 2024") && 
            character.getSetting("rogue-sneak-attack", false) && 
            !name.includes("Psionic Power: Psychic Whispers") && 
            (properties["Attack Type"] == "Ranged" ||
            (properties["Properties"] && properties["Properties"].includes("Finesse")) ||
            name.includes("Psychic Blade") ||
            name.includes("Shadow Blade") ||
            name.includes("Sneak Attack"))) {
            let sneakDieCount = Math.ceil(character._classes["Rogue"] / 2);
            // Rogue: Sneak Attack
            if (character.hasClassFeature("Cunning Strike") && character.getSetting("rogue-cunning-strike", false)) {
                const choices = await queryCunningStrike();
                const validChoices = [];
                for (const choice of choices) {
                    if (choice.action === "None") continue;
                    if (choice["die"] > sneakDieCount) continue;
                    sneakDieCount -= choice["die"];
                    validChoices.push(choice);
                }
                roll_properties["cunning-strike-effects"] = validChoices.map(m => m.action).join(", ") || undefined;
                settings_to_change["rogue-cunning-strike"] = false;
            }
            const sneak_attack = sneakDieCount > 0 ? `${sneakDieCount}d6` : "0";
            if (name.includes("Sneak Attack")) {
                damages[0] = sneak_attack;
            } else {
                damages.push(sneak_attack);
                damage_types.push("Sneak Attack");
            }
        }
        const crits = damagesToCrits(character, damages, damage_types);
        const crit_damages = [];
        const crit_damage_types = [];
        for (let [i, dmg] of crits.entries()) {
            if (dmg != "") {
                crit_damages.push(dmg);
                crit_damage_types.push(damage_types[i]);
            }
        }      
        if (to_hit) {
            if (character.hasFeat("Piercer")) {
                for (let i = 0; i < damage_types.length; i++) {
                    if (damage_types[i].includes("Piercing")){
                        const piercer_damage = damagesToCrits(character, [damages[i]]);
                        if (piercer_damage.length > 0 && piercer_damage[0] != "") {    
                            piercer_damage[0] = piercer_damage[0].replace(/([0-9]+)d([0-9]+)/, '1d$2');
                            crit_damages.push(piercer_damage[0]);
                            crit_damage_types.push("Piercer Feat");
                            break;
                        }
                    }
                }
            }
            if (roll_properties.name === "Blade of Disaster")
                crit_damages[0] = damagesToCrits(character, ["8d12"])[0];
            if (roll_properties.name === "Jim’s Magic Missile")
                crit_damages[0] = damagesToCrits(character, ["3d4"])[0];
            const matchViciousWeapon = description.match(/When you roll a 20 on your attack roll with this magic weapon, the target takes an extra (\d+) damage of the weapon’s type./);
            if (matchViciousWeapon) {
                if (!damages.some(damage => damage === matchViciousWeapon[1])) {
                    crit_damages.push(matchViciousWeapon[1]);
                    crit_damage_types.push("Vicious (20 On The Attack Roll)");
                } 
            }

            // applies to only 2014 brutal critical 2024 has replaced this with brutal strike
            if (brutal > 0) {
                const rule = parseInt(character.getGlobalSetting("critical-homebrew", CriticalRules.PHB));
                let highest_dice = 0;
                let weapon_damage_counter = 0;
                for (let dmg of damages) {
                    if (weapon_damage_length && weapon_damage_counter >= weapon_damage_length) break;
                    const match = dmg.match(/[0-9]*d([0-9]+)/);
                    if (match) {
                        const sides = parseInt(match[1]);
                        if (sides > highest_dice)
                            highest_dice = sides;
                    }
                    weapon_damage_counter++;
                }
                const isBrutal = character.hasClassFeature("Brutal Critical");
                const isSavage = character.hasRacialTrait("Savage Attacks");
                if (highest_dice != 0) {
                    let brutal_dmg = `${brutal}d${highest_dice}`
                    if (rule == CriticalRules.HOMEBREW_MAX) {
                        crit_damages.push(damagesToCrits(character, [brutal_dmg])[0]);
                    } else {
                        brutal_dmg = applyGWFIfRequired(name, properties, brutal_dmg);
                        crit_damages.push(brutal_dmg);
                    }
                    crit_damage_types.push(isBrutal && isSavage ? "Savage Attacks & Brutal" : (isBrutal ? "Brutal" : "Savage Attacks"));
                }
            }
        }
        // effects
        if(properties["Attack Type"] == "Melee" || properties["Attack Type"] == "Unarmed Strike" || name.includes("Shadow Blade")) {
            if(character.getSetting("effects-enlarge", false)) {
                damages.push("+1d4");
                damage_types.push("Enlarge");
                addEffect(roll_properties, "Enlarge");
            } else if(character.getSetting("effects-reduce", false)) {
                damages.push("-1d4");
                damage_types.push("Reduce");
                addEffect(roll_properties, "Reduce");
            }
        }

        roll_properties["critical-damages"] = crit_damages;
        roll_properties["critical-damage-types"] = crit_damage_types;
        
    }

    return roll_properties;
}

function applyGWFIfRequired(action_name, properties, damage) {
    if((properties["Attack Type"] == "Melee" && 
        ((properties["Properties"].includes("Versatile") && character.getSetting("versatile-choice") != "one") || 
            properties["Properties"].includes("Two-Handed"))) ||
            (action_name.includes("Polearm Master") && character.hasFeat("Polearm Master", false)) ||
            (action_name.includes("Pole Strike") && character.hasFeat("Polearm Master 2024", false))
        ) {
        if(character.hasGreatWeaponFighting(2014)) {
            damage = damage.replace(/[0-9]*d[0-9]+/g, "$&ro<=2");
        } else if(character.hasGreatWeaponFighting(2024)) {
            damage = damage.replace(/([0-9]*)d([0-9]+)([^\s+-]*)(.*)/g, (match, amount, faces, roll_mods, mods) => {
                return new Array(parseInt(amount) || 1).fill(`1d${faces}${roll_mods}min3`).join(" + ") + mods;
            });
        }
    }
    return damage;
}

function addCustomDamages(character, damages, damage_types) {
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
    for (const key in key_modifiers) {
        if (!key.startsWith("custom_damage:") || !key_modifiers[key]) continue;
        const custom_damage = key.slice("custom_damage:".length).trim();
        if (!custom_damage) continue;
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

async function sendRoll(character, rollType, fallback, args) {
    let whisper = parseInt(character.getGlobalSetting("whisper-type", WhisperType.NO));
    const whisper_monster = parseInt(character.getGlobalSetting("whisper-type-monsters", WhisperType.YES));
    let is_monster = character.type() == "Monster" || character.type() == "Vehicle";
    if (is_monster && whisper_monster != WhisperType.NO)
        whisper = whisper_monster;
    // Let the spell card display appear uncensored
    if (rollType === "spell-card" && whisper === WhisperType.HIDE_NAMES)
        whisper = WhisperType.NO;

    advantage = parseInt(character.getGlobalSetting("roll-type", RollType.NORMAL));
    if (args["advantage"] == RollType.OVERRIDE_ADVANTAGE)
        args["advantage"] = advantage == RollType.SUPER_ADVANTAGE ? RollType.SUPER_ADVANTAGE : RollType.ADVANTAGE;
    if (args["advantage"] == RollType.OVERRIDE_DISADVANTAGE)
        args["advantage"] = advantage == RollType.SUPER_DISADVANTAGE ? RollType.SUPER_DISADVANTAGE : RollType.DISADVANTAGE;

    // Default advantage/whisper would get overriden if (they are part of provided args;
    const req = {
        action: "roll",
        character: character.getDict(),
        type: rollType,
        roll: cleanRoll(fallback),
        advantage: advantage,
        whisper: whisper
    }
    for (let key in args)
        req[key] = args[key];
    if (key_modifiers.advantage)
        req["advantage"] = RollType.ADVANTAGE;
    else if (key_modifiers.disadvantage)
        req["advantage"] = RollType.DISADVANTAGE;
    if (key_modifiers.super_advantage)
        req["advantage"] = RollType.SUPER_ADVANTAGE;
    else if (key_modifiers.super_disadvantage)
        req["advantage"] = RollType.SUPER_DISADVANTAGE;
    else if (key_modifiers.normal_roll)
        req["advantage"] = RollType.NORMAL;

    if (key_modifiers.whisper)
        req.whisper = WhisperType.YES;
    else if (key_modifiers.dont_whisper)
        req.whisper = WhisperType.NO;
    else if (is_monster && key_modifiers.whisper_hide_names)
        req.whisper = WhisperType.HIDE_NAMES;

    // Add custom roll modifiers from hotkeys
    if (req.character.settings) {
        for (const key in key_modifiers) {
            if (!key.startsWith("custom_modifier:") || !key_modifiers[key]) continue;
            const modifier = key.slice("custom_modifier:".length).trim();
            const operator = ["+", "-"].includes(modifier[0]) ? "" : "+"
            req.character.settings["custom-roll-dice"] = (req.character.settings["custom-roll-dice"] || "") + ` ${operator}${modifier}`;
        }

        if (req.character.settings["effects-bless"] && (["attack", "spell-attack"].includes(req.type) && req["to-hit"] || req.type === "saving-throw")) {
            req.character.settings["custom-roll-dice"] = (req.character.settings["custom-roll-dice"] || "") + " +1d4";
            addEffect(req, "Bless");
        } else if (req.character.settings["effects-bane"] && (["attack", "spell-attack"].includes(req.type) && req["to-hit"] || req.type === "saving-throw")) {
            req.character.settings["custom-roll-dice"] = (req.character.settings["custom-roll-dice"] || "") + " -1d4";
            addEffect(req, "Bane");
        }

        if (req.character.exhaustion && req.character.exhaustion != 0 && req.character.settings["effects-exhaustion-2024"] && 
            (["attack", "spell-attack"].includes(req.type) && req["to-hit"] || 
            ["initiative", "ability", "saving-throw", "skill", "death-save"].includes(req.type))) {
            req.character.settings["custom-roll-dice"] = (req.character.settings["custom-roll-dice"] || "") + ` -${req.character.exhaustion * 2}`;
            addEffect(req, `Exhaustion (${req.character.exhaustion})`);
        } else if (req.character.exhaustion && req.character.exhaustion != 0 && req.character.settings["effects-exhaustion-2014"]) {
            if((["attack", "spell-attack"].includes(req.type) && req["to-hit"] || ["saving-throw"].includes(req.type)) && req.character.exhaustion && req.character.exhaustion >= 3) {
                adjustRollAndKeyModifiersWithDisadvantage(req);
            } else if (["initiative", "ability", "skill", "death-save"].includes(req.type) && req.character.exhaustion && req.character.exhaustion >= 1) {
                adjustRollAndKeyModifiersWithDisadvantage(req);
            }
            addEffect(req, `Exhaustion (${req.character.exhaustion})`);
        }
    }
        
    if (req.whisper === WhisperType.QUERY) {
        req.whisper = await dndbeyondDiceRoller.queryWhisper(args.name || rollType, is_monster);
        if (req.whisper === null) return; // Query was cancelled
    }
    if (rollType === "custom") {
        req.advantage = RollType.NORMAL;
    }
    if (req.advantage === RollType.QUERY) {
        req.advantage = await dndbeyondDiceRoller.queryAdvantage(args.name || rollType, req["advantage-query"]);
        if (req.advantage === null) return; // Query was cancelled
    }
    if (character.getGlobalSetting("weapon-force-critical", false) || key_modifiers.force_critical) {
        req["rollCritical"] = true;
        if (req["to-hit"]) {
            req["critical-limit"] = 1;
        }
    }

    if(req.character.settings){
        // effects 
        if(["saving-throw", "ability", "skill"].includes(rollType) && req.ability == "STR" && req.character.settings["effects-enlarge"]) {
            adjustRollAndKeyModifiersWithAdvantage(req);
            addEffect(req, "Enlarge");
        } else if(["saving-throw", "ability", "skill"].includes(rollType) && req.ability == "STR" && req.character.settings["effects-reduce"]) {
            adjustRollAndKeyModifiersWithDisadvantage(req);
            addEffect(req, "Reduce");
        }
    }

    if (character.getGlobalSetting("use-digital-dice", false) && DigitalDiceManager.isEnabled()) {
        req.sendMessage = true;
        dndbeyondDiceRoller.handleRollRequest(req);
    } else {
        console.log("Sending message: ", req);
        chrome.runtime.sendMessage(req, (resp) => beyond20SendMessageFailure(character, resp));
        sendRollRequestToDOM(req);
    }
}

function adjustRollAndKeyModifiersWithAdvantage(roll_properties) {
    // Adjust roll_properties["advantage"]
    const advantageMapping = {
        [RollType.NORMAL]: RollType.ADVANTAGE,
        [RollType.DISADVANTAGE]: RollType.NORMAL,
        [RollType.OVERRIDE_DISADVANTAGE]: RollType.NORMAL,
        [RollType.SUPER_DISADVANTAGE]: RollType.DISADVANTAGE
    };

    if (roll_properties["advantage"] === undefined) {
        roll_properties["advantage"] = RollType.ADVANTAGE;
    } else if (roll_properties["advantage"] in advantageMapping) {
        roll_properties["advantage"] = advantageMapping[roll_properties["advantage"]];
    }
}

function adjustRollAndKeyModifiersWithDisadvantage(roll_properties) {
    // Adjust roll_properties["advantage"]
    const disadvantageMapping = {
        [RollType.NORMAL]: RollType.DISADVANTAGE,
        [RollType.ADVANTAGE]: RollType.NORMAL,
        [RollType.OVERRIDE_ADVANTAGE]: RollType.NORMAL,
        [RollType.SUPER_ADVANTAGE]: RollType.ADVANTAGE
    };

    if (roll_properties["advantage"] === undefined) {
        roll_properties["advantage"] = RollType.DISADVANTAGE;
    } else if (roll_properties["advantage"] in disadvantageMapping) {
        roll_properties["advantage"] = disadvantageMapping[roll_properties["advantage"]];
    }
}

function sendRollRequestToDOM(request) {
    sendCustomEvent(request.action, [request]);
    forwardMessageToDOM(request);
}

function isRollButtonAdded(where) {
    if (!where) where = $(document);
    return where.find(".ct-beyond20-roll,.ct-beyond20-roll-display").length > 0;
}

function isCustomRollIconsAdded(where) {
    if (!where) where = $(document);
    return where.find(".ct-beyond20-custom-roll, .ct-beyond20-custom-roll-button").length > 0;
}

function isHitDieButtonAdded() {
    return $(".ct-beyond20-roll-hitdie").length > 0;
}

function getRollTypeButtonClass(character) {
    let advantage = RollType.NORMAL;
    if (character)
        advantage = parseInt(character.getGlobalSetting("roll-type", RollType.NORMAL));
    if (key_modifiers.advantage)
        advantage = RollType.ADVANTAGE;
    else if (key_modifiers.disadvantage)
        advantage = RollType.DISADVANTAGE;
    else if (key_modifiers.normal_roll)
        advantage = RollType.NORMAL;
    else if (key_modifiers.super_advantage)
        advantage = RollType.SUPER_ADVANTAGE;
    else if (key_modifiers.super_disadvantage)
        advantage = RollType.SUPER_DISADVANTAGE;

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
    return chrome.runtime.getURL(`images/icons/badges/${type}${size}.png`);
}

var last_character_used = null;
function updateRollTypeButtonClasses(character) {
    const button_roll_type_classes = "beyond20-roll-type-double beyond20-roll-type-query beyond20-roll-type-thrice beyond20-roll-type-advantage beyond20-roll-type-disadvantage beyond20-roll-type-super-advantage beyond20-roll-type-super-disadvantage";
    const rolltype_class = getRollTypeButtonClass(character || last_character_used);
    if (character)
        last_character_used = character;
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
    const buttonContents = [];
    if (image) {
        const icon = getBadgeIconFromClass(rolltype_class);
        buttonContents.push(E.img({ class: "ct-beyond20-icon", src: icon, style: "margin-right: 6px;" }));
    }
    buttonContents.push(E.span({ class: "ct-button__content" }, text));
    const button = E.div({ class: "ct-beyond20-roll", id },
        E.button({ class: "ct-beyond20-roll-button " + (small ? button_class_small : button_class) + " " + rolltype_class },
            ...buttonContents
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

    $(".ct-beyond20-roll-display").css({
        "margin-left": "auto",
        "margin-right": "auto"
    });
    $(".ct-beyond20-roll-display").css("margin-top", "2px");
    $(button).on('click', (event) => callback());
    return button;
}

function addHitDieButtons(rollCallback) {
    const icon = chrome.runtime.getURL("images/icons/badges/custom20.png");
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
    const icon = custom ? chrome.runtime.getURL("images/icons/badges/custom20.png") :
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

function addRollTableButton(character, where, table) {
    const icon = chrome.runtime.getURL("images/icons/badges/normal32.png");
    const button = E.a({ class: "ct-beyond20-roll button-alt", href: "#" },
        E.span({ class: "label" },
            E.img({ class: "ct-beyond20-roll-table-icon", src: icon, style: "margin-right: 10px;" }),
            "Roll Table to VTT"
        )
    );
    $(where).before(button);
    $(button).css({
        "float": "left",
        "display": "inline-block"
    });
    $(button).on('click', async (event) => {
        event.stopPropagation();
        event.preventDefault();
        // This is because of the prompt for the bardic inspiration dice
        const formula = await table.resolveFormula()
        // Check if there was a query that was cancelled
        if (formula === null) return;
        sendRoll(character, "roll-table", table.formula, {
            "name": table.name,
            "formula": table.formula,
            "table": table.table
        });
    });
}

function removeRollButtons(where) {
    if (!where) where = $(document);
    where.find(`.ct-beyond20-roll,
        .ct-beyond20-roll-hitdie,
        .ct-beyond20-roll-display,
        .ct-beyond20-custom-icon,
        .ct-beyond20-roll-display,
        .ct-beyond20-spell-icon,
        .ct-beyond20-spell-attack-icon`).remove();
    const custom_rolls = where.find("u.ct-beyond20-custom-roll");
    for (let i = 0; i < custom_rolls.length; i++)
        custom_rolls.eq(i).replaceWith(custom_rolls.eq(i).text());
    // We add "beyond20-rolls-added" class to indicate we parsed it. Remove it if we remove dice too
    const added_indicators = where.find(".beyond20-rolls-added");
    for (let i = 0; i < added_indicators.length; i++) {
        added_indicators.removeClass("beyond20-rolls-added");
    }
}


function recursiveDiceReplace(node, cb) {
    if (node.hasChildNodes()) {
        // We need to copy the list since its size could change as we modify it
        const children = [].concat(...node.childNodes);
        for (let child of children) {
            // don't replace anything inside of a roll button itself
            if ($(child).hasClass("ct-beyond20-roll") || $(child).hasClass("ct-beyond20-custom-roll"))
                continue;
            
            // Skip anything inside user comments
            if ($(child).hasClass("homebrew-comments"))
                continue;
            // don't replace anything inside of an embedded script or style tag
            if (["STYLE", "SCRIPT"].includes(node.nodeName))
                continue
            recursiveDiceReplace(child, cb);
        }
    } else if (node.nodeName == "#text") {
        const text = replaceRolls(node.textContent, (...args) => cb(node, ...args));
        // Only replace if we changed it, otherwise we might break existing html code bindings
        if (text != node.textContent) {
            // Try to catch the use case where part of the roll has a tooltip and is therefore a different node
            // <strong><span tooltip>2</span>d4</strong>
            const parent = $(node).parent();
            const parentText = parent.text();
            // The parent has another portion of the same dice formula, so we need to replace the whole parent
            // with the replaced dice
            const parentReplaced = replaceRolls(parentText, () => "-");
            if (parentText !== node.textContent &&
                (parentReplaced === "-" ||
                 parentReplaced === "--" ||
                 parentReplaced === "+-" // Emanate Wrath has "+2d6" which gets "2d6" parsed and leaves "+-"
                )) {
                const text = replaceRolls(parentText, (...args) => cb(node, ...args));
                parent.html($.parseHTML(text));
            } else {
                $(node).replaceWith($.parseHTML(text));
            }
        }
    }
}

function injectDiceToRolls(selector, character, name = "", replacementFn = null) {
    // Parse roll tables
    const tables = $(selector).find("table");
    for (let table of tables.toArray()) {
        table = $(table);
        // Skip any table found inside user comments
        if (table.closest(".homebrew-comments").length > 0) continue;
        if (isRollButtonAdded(table)) continue;
        const tableName = name instanceof Function ? name(table) : name;
        const roll_table = RollTable.parseTable(table, tableName, {character});
        if (roll_table) {
            addRollTableButton(character, table, roll_table);
        }
    }

    let added = 0;
    const icon = chrome.runtime.getURL("images/icons/badges/custom20.png");
    const replaceCB = (node, dice, modifier) => {
        added++;
        dice_formula = (dice == "" ? "1d20" : dice) + modifier;
        const rollName = name instanceof Function ? name(node) : name;
        const defaultReplacement = '<u class="ct-beyond20-custom-roll"><strong>' + dice + modifier + '</strong>' +
            '<img class="ct-beyond20-custom-icon" src="' + icon + '" x-beyond20-name="' + rollName +
            '" x-beyond20-roll="' + dice_formula + '" style="margin-right: 3px; margin-left: 3px;"></img></u>';
        if (!replacementFn) return defaultReplacement;
        return replacementFn(node, dice_formula, dice, modifier, rollName, defaultReplacement);
    }

    const items = $(selector);
    for (let item of items.toArray())
        recursiveDiceReplace(item, replaceCB);

    $(".ct-beyond20-custom-roll").off('click')
        .on('click', (event) => {
        const name = $(event.currentTarget).find("img").attr("x-beyond20-name");
        const roll = $(event.currentTarget).find("img").attr("x-beyond20-roll");
        sendRoll(character, "custom", roll, { "name": name });
    });
    return added;
}

function beyond20SendMessageFailure(character, response) {
    if (!response || (response.request && response.request.action === "update-combat"))
        return;
    console.log("Received response : ", response);
    if (["roll", "rendered-roll"].includes(response.request.action)  && ((response.vtt && response.vtt[0] == "dndbeyond") || response.error)) {
        dndbeyondDiceRoller.handleRollError(response.request, response.error);
    } else if (response.error) {
        alertify.error("<strong>Beyond 20 : </strong>" + response.error);
    }
    if (settings['sticky-hotkeys']) {
        // FIXME: This could reset a key that is being held which the user may want to keep enabled
        resetKeyModifiers();
    }
}


/**
 * Sends messages to the extension if a custom SendMessage is received on the DOM
 * This allows extensions to send DOM API calls to Beyond20 from the ddb site itself
 */
function _sendCustomMessageToBeyond20(message) {
    if (isExtensionDisconnected()) {
        return;
    }
    if (!message || !message.action) {
        console.error("Beyond20: Invalid message received: ", message);
        return;
    }
    // Check for allowed actions only
    if (!["roll", "rendered-roll", "hp-update", "conditions-update", "update-combat"].includes(message.action)) {
        console.error("Beyond20: Invalid action received: ", message.action);
        return;
    }
    chrome.runtime.sendMessage(message, (resp) => beyond20SendMessageFailure(character, resp))
}

function deactivateTooltipListeners(el) {
    return el.off('mouseenter').off('mouseleave').off('click');
}

var quickRollHideId = 0;
var quickRollMouseOverEl = null;
function activateTooltipListeners(el, direction, tooltip, callback) {
    el.on('mouseenter', (e) => {
        if (quickRollHideId)
            clearTimeout(quickRollHideId);
        quickRollHideId = 0;

        const target = $(e.currentTarget)
        const position = target.offset()
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
        quickRollMouseOverEl = el[0];
    }).on('mouseleave', (e) => {
        if (quickRollHideId)
            clearTimeout(quickRollHideId);
        quickRollHideId = setTimeout(() => tooltip.hide(), 250);
        quickRollMouseOverEl = null;
    });
    el.addClass("beyond20-quick-roll-area");
    // If the mouse was over one of the quick roll areas, then we've just destroyed the click handler, so we need to redo it.
    if (quickRollMouseOverEl === el[0]) {
        el.trigger('mouseenter');
    }
}
// If the element on which the tooltip is appearing gets removed from the visible DOM, then we
// can never receive the mouseleave event, so we trigger it manually
function hideTooltipIfDestroyed() {
    if (quickRollMouseOverEl && !document.body.contains(quickRollMouseOverEl)) {
        $(quickRollMouseOverEl).trigger('mouseleave');
    }
}

var quickRollTooltipEl = null;
function getQuickRollTooltip() {
    let beyond20_tooltip = quickRollTooltipEl || $(".beyond20-quick-roll-tooltip");
    if (beyond20_tooltip.length == 0) {
        const rolltype_class = getRollTypeButtonClass(character);
        const icon = getBadgeIconFromClass(rolltype_class, "32");
        const img = E.img({ class: "beyond20-quick-roll-icon", src: icon, style: "margin-right: 5px;margin-left: 5px;padding: 5px 5px;" });
        const indicator = E.img({ class: "beyond20-quick-roll-indicator", src: chrome.runtime.getURL("images/quick-roll-indicator.png") });
        const div = E.div({ class: "beyond20-quick-roll-tooltip " + getRollTypeButtonClass(character) }, img, indicator);
        beyond20_tooltip = $(div);
        beyond20_tooltip.css({
            "position": "absolute",
            "background": `url("${chrome.runtime.getURL("images/quick-roll-background.png")}") 50% center no-repeat transparent`,
            "background-size": "contain",
            "z-index": "10000"
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
        // Cache it
        quickRollTooltipEl = beyond20_tooltip;
    }
    return beyond20_tooltip;
}