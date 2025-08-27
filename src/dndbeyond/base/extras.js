class MonsterExtras extends CharacterBase {
    constructor(_type, base = null, global_settings = null, {character, creatureType}={}) {
        super(_type, global_settings);
        if (this.type() == "Monster") {
            this._base = ".mon-stat-block-2024";
        }
        if (base) {
            this._base = base;
        }
        this._prefix = "monster_extras_";
        this._creatureType = creatureType;
        this._parent_character = character;
        this._stat_block = $(this._base);
        this._id = null;
        this._name = null;
        this._avatar = null;
        this._meta = null;
        this._attributes = {}
        this._initiative = null;
        this._ac = null;
        this._ac_meta = null;
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

    // ddbc-creature-block styles_creatureBlock__OEQz9 blockfinder
    
    getSetting(key, default_value = "", settings = null) {
        // Use parent's settings for wild shape creatures
        if (this.type() == "Creature" && this._creatureType?.startsWith("Wild Shape") && this._parent_character) {
            return this._parent_character.getSetting(key, default_value, settings);
        }
        return super.getSetting(key, default_value, settings);
    }

    parseStatBlock(stat_block) {
        const add_dice = this.getGlobalSetting('handle-stat-blocks', true);
        const inject_descriptions = this.getGlobalSetting('subst-dndbeyond-stat-blocks', true);
        const beyond20_tooltip = add_dice || inject_descriptions ? getQuickRollTooltip() : null;
        const base = this._base;
        const classNames = {};
        if (!stat_block)
            stat_block = $(base);

        this._stat_block = stat_block;
        this._name = stat_block.find("section[class*='styles_creatureBlock'] > h1[class*='styles_header'], .mon-stat-block-2024__name-link").text().trim();
        this._id = this._name;

        const link = stat_block.find(".mon-stat-block-2024__name-link");

        this._url = stat_block.find(".mon-stat-block-2024__name-link").length != 0 ? link.href : window.location.href;
        this._meta = stat_block.find("section[class*='styles_creatureBlock'] > p[class*='styles_meta'], .mon-stat-block-2024__meta").text().trim();

        const avatar = $(base).parent().find("img[class*='styles_img'], div.image > a > img.monster-image");
        const asideAvatar = $(base).parent().parent().find(".details-aside > div > a > img.monster-image");
        if (avatar.length > 0) {
            this._avatar = avatar[0].src;
            addDisplayButton(() => this.displayAvatar(), avatar, { append: false, small: false, image: true });
            addDisplayButton(() => this.displayAvatar(), asideAvatar, { append: false, small: false, image: true });
        }

        // Attributes, tidbits

        const attributes = stat_block.find("div[class*='styles_attribute__'], .mon-stat-block-2024__attribute, .mon-stat-block-2024__tidbit");
        for (let attr of attributes.toArray()) {
            const labels = $(attr).find("h2[class*='styles_attributeLabel'], .mon-stat-block-2024__attribute-label, .mon-stat-block-2024__tidbit-label");
            const data = $(attr).find("p, span.mon-stat-block-2024__attribute-data-value, span.mon-stat-block-2024__tidbit-data");
                       
            for (const [index, lvalue] of labels.toArray().entries()) {
                const label = $(lvalue).text().trim();
                const value = $(data[index]).text().trim();

                classNames["attribute"] = $(attr).attr("class");
                classNames["label"] = $(attr).find("h2[class*='styles_attributeLabel'], span:first").attr("class");

                const digitalDiceBoxes = data.find(".integrated-dice__container");

                const addAttribute = (label, data) => this._attributes[label] = [...$(data)].map(m => $(m).text().trim()).filter(Boolean).join(", ");
                const addTidbits = (label, data) => this._tidbits[label] = $(data).text().trim();

                if (["Armor Class", "AC"].includes(label)) {
                    if(data.length != 0) {
                        const acValues = value.split(' ');
                        this._ac = acValues[0];
                        this._ac_meta = acValues.length > 1 ? acValues[1].replace(/^\(|\)$/g, '') : undefined;

                        addAttribute(label, data[index]);
                    }
                    // add wild shape 2024 feature here if the player has the class level
                } else if (["Hit Points", "HP"].includes(label)) {
                    if(data.length != 0) {
                        const hpValues = value.split(' ');
                        this._hp = hpValues[0];
                        this._hp_formula = hpValues.length > 1 ? value.split(' ')[1].replace(/[()]/g, '') : undefined;

                        if(!this._hp_formula) {
                            const formula = $(attr).find(".mon-stat-block-2024__attribute-data-extra").text().trim();
                            this._hp_formula = formula.replace(/[()]/g, '');
                        }
                        
                        if (add_dice && this._hp_formula) {
                            const digitalDiceBox = $(attr).find(this._prefix + "__attribute-data-extra .integrated-dice__container");
                            if (digitalDiceBox.length > 0) {
                                // Use the digital Dice box (encounters page)
                                digitalDiceBox.off('click').on('click', (e) => {
                                    e.stopPropagation();
                                    this.rollHitPoints();
                                })
                                deactivateTooltipListeners(digitalDiceBox);
                                activateTooltipListeners(digitalDiceBox, "right", beyond20_tooltip, () => this.rollHitPoints());
                            } else {
                                if (this.isBlockFinder) {
                                    addIconButton(this, () => this.rollHitPoints(), $(attr), {custom: true, append: true});
                                } else {
                                    const monsterPage = this.type() == "Monster";
                                    addIconButton(this, () => this.rollHitPoints(), monsterPage ? $(attr).find(".mon-stat-block-2024__attribute-data-extra") : $(data[index]), {custom: true});
                                }
                            }
                        }
                        addAttribute(label, data[index]);
                    }
            
                } else if (["Initiative"].includes(label)) {
                    if(data.length != 0) {
                        const initValues = value.split(' ');
                        this._initiative = initValues[0];
                                            
                        if (add_dice) {
                            const digitalDiceBox = $(attr).find(this._prefix + "__attribute-data-extra .integrated-dice__container");
                            if (digitalDiceBox.length > 0) {
                                // Use the digital Dice box (encounters page)
                                digitalDiceBox.off('click').on('click', (e) => {
                                    e.stopPropagation();
                                    this.rollInitiative();
                                })
                                deactivateTooltipListeners(digitalDiceBox);
                                activateTooltipListeners(digitalDiceBox, "right", beyond20_tooltip, () => this.rollInitiative());
                            } else {
                                if (this.isBlockFinder) {
                                    addIconButton(this, () => this.rollInitiative(), $(attr), {custom: true, append: true});
                                } else {
                                    addIconButton(this, () => this.rollInitiative(), $(data[index]), {custom: true});
                                }
                            }
                        }
                        addAttribute(label, data[index]);
                    }
                } else if (label == "Speed") {
                    this._speed = value;
                    addAttribute(label, data[index]);
                } else if (label == "Saving Throws") { // 2014 ONLY
                    const saves = value.split(", ");
                    const useDigitalDice = digitalDiceBoxes.length === saves.length;
                    if (add_dice && !useDigitalDice) data.html("");
                    for (let save of saves) {
                        const parts = save.split(" ");
                        const abbr = parts[0];
                        const mod = parts.slice(1).join(" ");
                        this._saves[abbr] = mod;
                        if (useDigitalDice) {
                            // Hook into the existing digital dice boxes
                            const idx = saves.indexOf(save);
                            const digitalDiceBox = digitalDiceBoxes.eq(idx);
                            // Use the digital Dice box (encounters page)
                            digitalDiceBox.off('click').on('click', (e) => {
                                e.stopPropagation();
                                this.rollSavingThrow(abbr);
                            })
                            deactivateTooltipListeners(digitalDiceBox);
                            activateTooltipListeners(digitalDiceBox, "down", beyond20_tooltip, () => this.rollSavingThrow(abbr));
                        } else if (add_dice) {
                            data.append(abbr + " " + mod);
                            addIconButton(this, () => this.rollSavingThrow(abbr), data, { append: true });
                            if (saves.length > Object.keys(this._saves).length)
                                data.append(", ");
                        }
                    }
                    addTidbits(label, data[index]);
                } else if (label == "Skills") {
                    const skills = value.split(", ");
                    const useDigitalDice = digitalDiceBoxes.length === skills.length;
                    for (let skill of skills) {
                        const match = skill.match(/(.+?)([+-]?)\s*([0-9]+)/);
                        if (match) {
                            const name = match[1].trim();
                            const mod = `${match[2] || "+"}${match[3]}`;
                            this._skills[name] = mod;
                            // Hook into the existing digital dice boxes
                            if (useDigitalDice) {
                                const idx = skills.indexOf(skill);
                                const digitalDiceBox = digitalDiceBoxes.eq(idx);
                                // Use the digital Dice box (encounters page)
                                digitalDiceBox.off('click').on('click', (e) => {
                                    e.stopPropagation();
                                    this.rollSkillCheck(name)
                                })
                                deactivateTooltipListeners(digitalDiceBox);
                                activateTooltipListeners(digitalDiceBox, "down", beyond20_tooltip, () => this.rollSkillCheck(name));
                            }
                        }
                    }
                    if (useDigitalDice || !add_dice)
                        continue;
                    data.html("");
                    let first = true;
                    for (let skill in this._skills) {
                        if (!first)
                            data.append(", ");
                        first = false;
                        data.append(skill + " " + this._skills[skill]);
                        addIconButton(this, () => this.rollSkillCheck(skill), data, { append: true });
                    }
                    addTidbits(label, data[index]);
                } else if (label == "Challenge") {
                    this._cr = value.split(" ")[0];
                    addTidbits(label, data[index]);
                } // TODO add immunities, senses, languages, cr
            }
        }

        // Abilities
        const abilities = stat_block.find("div[class*='styles_stats'] > div[class*='styles_stat'], div[class*='styles_stats'] table[class*='styles_statTable'] tbody > tr, div[class*='mon-stat-block-2024__stats'] table[class*='stat-table'] tbody > tr");
        let initiative_selector = this._prefix + "__beyond20-roll-initiative";
        for (let ability of abilities.toArray()) {
            const abbr = $(ability).find("h2[class*='styles_statHeading'], th").text().toUpperCase();
            const score = $(ability).find("p[class*='styles_statScore']").text() || $(ability).find("td:first").text();
            const modifier = $(ability).find("p[class*='styles_statModifier']").text().slice(1, -1) || $(ability).find("td[class*='styles_modifier']:first, td[class*='modifier']:first").text();
            const save = $(ability).find("td[class*='styles_modifier']:last, td[class*='modifier']:last").text();
            const is2024StatBlock = save ? true : false;

            this._abilities.push([abbreviationToAbility(abbr), abbr, score, modifier]);
            if(is2024StatBlock) {
                this._saves[abbr] = save;
            }
            if (add_dice) {
                const elementAbilityDiceRoll = is2024StatBlock ? $(ability).find("td[class*='styles_modifier']:first, td[class*='modifier']:first") : ability;
                const elementSaveDiceRoll = $(ability).find("td[class*='styles_modifier']:last, td[class*='modifier']:last");
                const digitalDiceBox = $(ability).find(this._prefix + "modifier .integrated-dice__container");
                if (digitalDiceBox.length > 0) {
                    // Use the digital Dice box (encounters page)
                    digitalDiceBox.off('click').on('click', (e) => {
                        e.stopPropagation();
                        this.rollAbilityCheck(abbr)
                    })
                    deactivateTooltipListeners(digitalDiceBox);
                    activateTooltipListeners(digitalDiceBox, "down", beyond20_tooltip, () => this.rollAbilityCheck(abbr));
                } else {
                    const margins = this.type() == "Monster";
                    const button = addIconButton(this, () => this.rollAbilityCheck(abbr), elementAbilityDiceRoll, { prepend: !is2024StatBlock, append: is2024StatBlock, margins: margins });
                    $(button).css({"display": "block"});
                    if(is2024StatBlock) {
                        const button = addIconButton(this, () => this.rollSavingThrow(abbr), elementSaveDiceRoll, { append: true, margins: margins });
                        $(button).css({"display": "block"});
                    }
                }
                if (abbr == "DEX") {
                    let roll_initiative = stat_block.find(initiative_selector);
                    const lastAttribute = stat_block.find("div[class*='styles_attribute__']").last();
                    if (lastAttribute.length > 0) {
                        let initiative = roll_initiative.eq(0);
                        this._initiative = this._initiative || modifier;
                        // Make sure the modifier didn't change (encounters)
                        if (roll_initiative.length > 0 && roll_initiative.attr("data-modifier") !== modifier) {
                            initiative = null;
                            roll_initiative.remove();
                            roll_initiative = [];
                        }
                        if (roll_initiative.length == 0) {
                            if (this.isBlockFinder) {
                                initiative = $(
                                    E.p({ class: `Stat-Block-Styles_Stat-Block-Data ${initiative_selector.slice(1)}`,
                                            "data-modifier": this._initiative },
                                        E.strong({ class: `block-finder-attribute-label` }, "Roll Initiative!"),
                                        E.span({ class: `block-finder-data` }, "  " + this._initiative)
                                    )
                                );
                            } else { 
                                const attribute_prefix = `${this._prefix}__attribute`
                                initiative = $(
                                    E.div({ class: `${attribute_prefix} ${initiative_selector} ${classNames["attribute"]}`,
                                            "data-modifier": this._initiative },
                                        E.strong({ class: `${attribute_prefix}-label ${classNames["label"]}` }, "Roll Initiative!"),
                                        E.span({ class: `${attribute_prefix}-data` },
                                            E.span({ class: `${attribute_prefix}-data-value ${classNames["value"]}` }, "  " + this._initiative)
                                        )
                                    )
                                );
                            }
                        }
                        lastAttribute.after(initiative);
                        addIconButton(this, () => this.rollInitiative(), initiative, { append: true });
                    }
                }
            }
        }

        this.lookForActions(stat_block, add_dice, inject_descriptions);
        if (add_dice)
            this.lookForSpells(stat_block);
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
                const roll_properties = {
                    "name": name,
                    "ability": abbr,
                    "modifier": modifier,
                    "ability-score": score
                };
                if (abbr == "STR" && this.type() == "Creature" && this._creatureType?.startsWith("Wild Shape") && this._parent_character && 
                    this._parent_character.hasClassFeature("Rage") && this._parent_character.getSetting("barbarian-rage", false)) {
                    roll_properties["advantage"] = RollType.OVERRIDE_ADVANTAGE;
                    addEffect(roll_properties, "Rage");
                }
                
                if (this.type() == "Creature" && this._creatureType?.startsWith("Wild Shape") && this._parent_character &&
                    this._parent_character.getSetting("custom-ability-modifier", "")) {
                    const custom = parseInt(this._parent_character.getSetting("custom-ability-modifier", "0")) || 0;
                    if (custom != 0)  {
                        let customModifier = parseInt(modifier) + custom;
                        customModifier = customModifier >= 0 ? `+${customModifier}` : `${customModifier}`;
                        roll_properties["modifier"] = customModifier;
                    }
                }
                sendRoll(this, "ability", "1d20" + modifier, roll_properties);
                break;
            }
        }
    }
    
    rollInitiative() {
        for (let ability of this._abilities) {
            if (ability[1] == "DEX") {
                let initiative = this._initiative;

                if (this.getGlobalSetting("initiative-tiebreaker", false)) {
                    const tiebreaker = ability[2];

                    // Add tiebreaker as a decimal;
                    initiative = parseFloat(initiative) + parseFloat(tiebreaker) / 100;

                    // Render initiative as a string that begins with '+' || '-';
                    initiative = initiative >= 0 ? '+' + initiative.toFixed(2) : initiative.toFixed(2);
                }

                sendRoll(this, "initiative", "1d20" + initiative, { "initiative": initiative });
                break;
            }
        }
    }

    rollSavingThrow(abbr) {
        const mod = this._saves[abbr];
        const name = abbreviationToAbility(abbr);
        const roll_properties = {
            "name": name,
            "ability": abbr,
            "modifier": mod
        };
        if (abbr == "STR" && this.type() == "Creature" && this._creatureType?.startsWith("Wild Shape") && this._parent_character && 
            this._parent_character.hasClassFeature("Rage") && this._parent_character.getSetting("barbarian-rage", false)) {
            roll_properties["advantage"] = RollType.OVERRIDE_ADVANTAGE;
            addEffect(roll_properties, "Rage");
        }
        sendRoll(this, "saving-throw", "1d20" + mod, roll_properties);
    }

    rollSkillCheck(skill) {
        const modifier = this._skills[skill];
        const ability = skillToAbility(skill);
        const roll_properties = {
            "skill": skill,
            "ability": ability,
            "modifier": modifier
        };
        if (ability == "STR" && this.type() == "Creature" && this._creatureType?.startsWith("Wild Shape") && this._parent_character && 
            this._parent_character.hasClassFeature("Rage") && this._parent_character.getSetting("barbarian-rage", false)) {
            roll_properties["advantage"] = RollType.OVERRIDE_ADVANTAGE;
            addEffect(roll_properties, "Rage");
        }
        sendRoll(this, "skill", "1d20" + modifier, roll_properties);
    }

    displayAvatar() {
        sendRoll(this, "avatar", this._avatar, { "name": "Avatar" });
    }

    parseAttackInfo(description) {
        // changed for 2024 info descriptions
        const m = description.match(/(Melee|Ranged|Spell)(?: Weapon| Spell| Attack) ?(?: Attack|Roll):.*?(\+[0-9]+)(?: to hit.*?|\s?,) (?:reach |ranged? |Gibletish )?(.*?)(?:,.*?)?\./i);
        if (m)
            return m.slice(1, 4);
        else
            return null;
    }

    parseSaveInfo(description) {
        const regex2024 = /(?<save>Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma)(?: Saving Throw:).DC (?<dc>[0-9]+)/;
        const regex2014 = /DC ([0-9]+) (.*?) saving throw/;

        const match2014 = description.match(regex2014);
        const match2024 = description.match(regex2024);

        if(match2014) return [match2014[2], match2014[1]];
        else if(match2024) return [match2024[1], match2024[2]]
        else return null;
    }

    parseHitInfo(description) {
        const hit_idx = description.indexOf("Hit:");
        let hit = description;
        if (hit_idx > 0)
            hit = description.slice(hit_idx);
        // Using match with global modifier then map to regular match because RegExp.matchAll isn't available on every browser
        const damage_regexp = new RegExp(/([\w]* )(?:([0-9]+)(?!d))?(?: *\(?([0-9]*d[0-9]+(?:\s*[-+]\s*[0-9]+)?(?: plus [^\)]+)?)\)?)? ([\w ]+?) damage/)
        const healing_regexp = new RegExp(/gains (?:([0-9]+)(?!d))?(?: *\(?([0-9]*d[0-9]+(?:\s*[-+]\s*[0-9]+)?)(?: plus [^\)]+)?\)?)? (temporary)?\s*hit points/)
        const damage_matches = reMatchAll(damage_regexp, hit) || [];
        const healing_matches = reMatchAll(healing_regexp, hit) || [];
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
        for (let dmg of healing_matches) {
            const damage = dmg[2] || dmg[1];
            const healingType = dmg[3] ? "Temp HP" : "Healing"
            if (damage) {
                damages.push(damage.replace("plus", "+"));
                damage_types.push(healingType);
            }
        }
        let save = null;
        const m = this.parseSaveInfo(hit);
        let preDCDamages = damages.length;
        if (m) {
            save = m;
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
        const headings = stat_block.find("div[class*='styles_descriptions'] > h2[class*='styles_descriptionHeading'], .mon-stat-block-2024__description-block-heading");
        const descriptions = stat_block.find("div[class*='styles_descriptions'] > div[class*='styles_description'], .mon-stat-block-2024__description-block-content");

        this._actions = [];

        const handleAction = (action_name, block, action) => {
            if (action_name.slice(-1)[0] == ".")
                action_name = action_name.slice(0, -1);
            this._actions.push(action_name);
            //console.log("Action name: ", action_name);
            if (add_dice) {
                let description = action.toArray ? 
                    action.toArray().map(a => descriptionToString(a)).join("\n")
                    : descriptionToString(action);
                description = description.replace(/−/g, "-");
                const roll_properties = this.buildAttackRoll(action_name, description);
                if (roll_properties) {
                    const id = addRollButton(this, () => {
                        // Need to recreate roll properties, in case settings (whisper, custom dmg, etc..) have changed since button was added
                        const roll_properties = this.buildAttackRoll(action_name, description);
                        if (this.type() == "Creature" && this._creatureType?.startsWith("Wild Shape") && this._parent_character &&
                            roll_properties["damages"] && roll_properties["damages"].length > 0) {
                            if (this._parent_character.hasClass("Barbarian") && this._parent_character.hasClassFeature("Rage") &&
                                this._parent_character.getSetting("barbarian-rage", false) && description.match(/Melee(?: Weapon)? Attack:/)) {
                                // Barbarian: Rage
                                const barbarian_level = this._parent_character.getClassLevel("Barbarian");
                                const rage_damage = barbarian_level < 9 ? 2 : (barbarian_level < 16 ? 3 : 4);
                                roll_properties["damages"].push(String(rage_damage));
                                roll_properties["damage-types"].push("Rage");
                                addEffect(roll_properties, "Rage");
                            }

                            if(this._parent_character.hasClass("Druid") && this._parent_character.hasClassFeature("Improved Lunar Radiance", true) && this._parent_character.getSetting("druid-improved-lunar-radiance", false))
                            {
                                roll_properties["damages"].push(String("2d10"));
                                roll_properties["damage-types"].push("Lunar Radiance");
                            }
                            // Add custom damages to wild shape attacks
                            addCustomDamages(character, roll_properties["damages"], roll_properties["damage-types"]);
                        }
                        if (roll_properties["damages"] && roll_properties["damages"].length > 0) {
                            for (const key in key_modifiers) {
                                if (!key.startsWith("custom_damage:") || !key_modifiers[key]) continue;
                                const custom_damage = key.slice("custom_damage:".length);
                                if (custom_damage.includes(":")) {
                                    const parts = custom_damage.split(":", 2);
                                    roll_properties["damages"].push(parts[1].trim());
                                    roll_properties["damage-types"].push(parts[0].trim());
                                } else {
                                    roll_properties["damages"].push(custom_damage.trim());
                                    roll_properties["damage-types"].push("Custom");
                                }
                            }
                        }
                        if (roll_properties["to-hit"]) {
                            for (const key in key_modifiers) {
                                if (!key.startsWith("custom_modifier:") || !key_modifiers[key]) continue;
                                const modifier = key.slice("custom_modifier:".length).trim();
                                const operator = ["+", "-"].includes(modifier[0]) ? "" : "+ "
                                roll_properties["to-hit"] += ` ${operator}${modifier}`;
                            }
                        }
                    
                        if (key_modifiers["display_attack"]) {
                            return sendRoll(this, "trait", "0", roll_properties);
                        }
                        sendRoll(this, "attack", "1d20" + (roll_properties["to-hit"] || ""), roll_properties)
                    }, block, {small: true, before: true, image: true, text: action_name});
                    $("#" + id).css({ "float": "", "text-align": "", "margin-top": "15px" });
                } else {
                    const id = addRollButton(this, () => {
                        const roll_properties = {
                            name: action_name,
                            description
                        };
                        sendRoll(this, "trait", "0", roll_properties);
                    }, block, {small: true, before: true, image: false, text: action_name});
                    $("#" + id).css({ "float": "", "text-align": "", "margin-top": "15px" });
                }
            }
            if (inject_descriptions) {
                injectDiceToRolls(action, this, action_name, (...args) => this._injectDiceReplacement(...args));
            }
        }

        let blockFinderPastTidbits = false;

        const headingsArray = headings.toArray();
        const descriptionsArray = descriptions.toArray();

        // Ensure the iteration accounts for mismatched pairs
        for (let i = 0; i < headingsArray.length; i++) {
            let heading = headingsArray[i];
            let description = descriptionsArray[i]; // Attempt to get the paired description
            
            // Extract heading text
            const headingText = $(heading).text().trim();
            let paragraphs;
            let outerParagraphs;
            // Determine the appropriate method to extract paragraphs
            if (description) {
                if (!$(description).hasClass('ddbc-html-content')) {
                    // Case 1: No 'ddbc-html-content' class; check for direct <p> or nested within '.ddbc-html-content > p'
                    paragraphs = $(description).find('.ddbc-html-content > p').toArray();

                    // Case 1: Look for <p> tags directly inside the description container
                    outerParagraphs = $(description).children('p').toArray();

                    // Combine both lists into a single array
                    if (paragraphs.length === 0) {
                        // Fallback to any <p> directly within the description
                        paragraphs = $(description).find('p').toArray();
                    } else if (outerParagraphs.length !== 0) {
                        paragraphs = [...paragraphs, ...outerParagraphs];
                    }
                } else if ($(description).hasClass('ddbc-html-content')) {
                    // Case 2: Properly nested content with 'ddbc-html-content'
                    paragraphs = $(description).find('p').toArray();
                } else {
                    // Case 3: No specific class, fallback to find any <p>
                    paragraphs = $(description).find('p').toArray();
                }                 
            }

            let lastAction = null;
            for (const p of paragraphs) {
                //console.log("Found action: ", action);
                const firstChild = p.firstElementChild;
                if (!firstChild) continue;
                // Usually <em><strong> || <strong><em> (Orcus is <span><em><strong>);
                let action_name = $(firstChild).find("> :first-child").text().trim() || $(firstChild).text().trim();
                if (!action_name) continue;
                // Replace non-breaking space character with regular space so it can match the description
                action_name = action_name.replace(/ /g, " ");
                const description = descriptionToString(p).trim();
                if (!description.startsWith(action_name)) continue;
                if (lastAction) {
                    // Found a new action, parse all DOM elements in between as an action
                    const action = $(lastAction.block).nextUntil(p).addBack();
                    handleAction(lastAction.name, lastAction.block, action);
                }
                // Store action for later processing
                lastAction = { name: action_name, block: p };
            }
            if (lastAction) {
                // Grab all the remaining elements
                const action = $(lastAction.block).nextUntil().addBack();
                handleAction(lastAction.name, lastAction.block, action);
            }
        }
    }

    _injectDiceReplacement(node, formula, dice, modifier, name, defaultReplacement) {
        // Check if the formula is inside a digital dice button, if yes, don't replace anything
        const originalFormula = dice + modifier;
        const digitalDiceBox = $(node).closest(".integrated-dice__container");
        if (digitalDiceBox.length === 1) {
            // Trim parenthesis from the formula, as DDB tends to add them
            const digitalDiceFormula = digitalDiceBox.text().replace(/^[\(\)]+|[\(\)]+$/g, "");
            // Make sure the closest dice box contains the formula we're replacing
            if (digitalDiceFormula === originalFormula) {
                digitalDiceBox.off('click').on('click', (e) => {
                    e.stopPropagation();
                    sendRoll(this, "custom", formula, { "name": name });
                })
                deactivateTooltipListeners(digitalDiceBox);
                activateTooltipListeners(digitalDiceBox, "up", getQuickRollTooltip(), () => sendRoll(this, "custom", formula, { "name": name }));
                // Return null to prevent modifying the html
                return null;
            }
        }
        return defaultReplacement;
    }

    injectSpellRolls(element, url) {
        const icon = chrome.runtime.getURL("images/icons/badges/spell20.png");
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
        const spells = stat_block.find("div[class*='styles_descriptions'] > div[class*='styles_description'], .mon-stat-block-2024__description-block > .mon-stat-block-2024__description-block-content").find("a.spell-tooltip");
        for (let spell of spells.toArray()) {
            const tooltip_href = $(spell).attr("data-tooltip-href");
            const tooltip_url = tooltip_href.replace(/-tooltip.*$/, "/tooltip");
            this.injectSpellRolls(spell, tooltip_url);
        }
    }

    updateInfo() {
        if (this.type() != "Creature" && this.type() != "Extra-Vehicle") return;
        // Creature name could change/be between.includes(customized) calls;
        this._name = this._stat_block.find("section[class*='styles_creatureBlock'] > h1[class*='styles_header']").text().trim();
        let hp = null;
        let max_hp = null;
        let temp_hp = null;
        const groups = $(".b20-creature-pane .ddbc-collapsible__content div[class*='styles_adjusterGroup']");
        for (let item of groups.toArray()) {
            const label = $(item).find("div[class*='styles_adjusterLabel']").text();
            if (label == "Current HP") {
                hp = parseInt($(item).find("div[class*='styles_adjusterValue']").text());
            } else if (label == "Max HP") {
                max_hp = parseInt($(item).find("div[class*='styles_adjusterValue']").text());
            } else if (label == "Temp HP") {
                temp_hp = parseInt($(item).find("div[class*='styles_adjusterValue'] input").val());
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
                sendRollRequestToDOM(req);
            }
        }
    }

    getDict() {
        let settings = undefined;
        if (this.type() == "Creature" && this._parent_character && this._creatureType?.startsWith("Wild Shape")) {
            const parentDict = this._parent_character.getDict();
            settings = parentDict.settings;
        }
        return {
            "name": this._name,
            "source": "D&D Beyond",
            "avatar": this._avatar,
            "type": this.type(),
            "creatureType": this._creatureType,
            "settings": settings,
            "id": this._id,
            "ac": this._ac,
            "hp": this._hp,
            "hp-formula": this._hp_formula,
            "max-hp": this._max_hp,
            "temp-hp": this._temp_hp,
            "speed": this._speed,
            "abilities": this._abilities,
            "actions": this._actions,
            "discord-target": this._parent_character && this._parent_character.getSetting("discord-target", undefined),
            "saves": this._saves,
            "skills": this._skills,
            "cr": this._cr,
            "url": this._url
        }
    }
}