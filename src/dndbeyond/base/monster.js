class Monster extends CharacterBase {
    constructor(_type, base = null, global_settings = null, {character, creatureType}={}) {
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
        if (base) {
            this._base = base;
        }
        this._creatureType = creatureType;
        this._parent_character = character;
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
            stat_block.find(".ct-beyond20-settings-button").remove();
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
                addDisplayButton(() => this.displayAvatar(), avatarImg, { small: false, image: true });
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
                    const match = skill.match(/(.+?)([+-]?)\s*([0-9]+)/);
                    if (match) {
                        const name = match[1].trim();
                        const mod = `${match[2] || "+"}${match[3]}`;
                        this._skills[name] = mod;
                    }
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
                const roll_properties = {
                    "name": name,
                    "ability": abbr,
                    "modifier": modifier,
                    "ability-score": score
                };
                if (abbr == "STR" && this.type() == "Creature" && this._creatureType === "Wildshape" && this._parent_character && 
                    this._parent_character.hasClassFeature("Rage") && this._parent_character.getSetting("barbarian-rage", false)) {
                    roll_properties["advantage"] = RollType.OVERRIDE_ADVANTAGE;
                }
                sendRoll(this, "ability", "1d20" + modifier, roll_properties);
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
        const roll_properties = {
            "name": name,
            "ability": abbr,
            "modifier": mod
        };
        if (abbr == "STR" && this.type() == "Creature" && this._creatureType === "Wildshape" && this._parent_character && 
            this._parent_character.hasClassFeature("Rage") && this._parent_character.getSetting("barbarian-rage", false)) {
            roll_properties["advantage"] = RollType.OVERRIDE_ADVANTAGE;
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
        if (ability == "STR" && this.type() == "Creature" && this._creatureType === "Wildshape" && this._parent_character && 
            this._parent_character.hasClassFeature("Rage") && this._parent_character.getSetting("barbarian-rage", false)) {
            roll_properties["advantage"] = RollType.OVERRIDE_ADVANTAGE;
        }
        sendRoll(this, "skill", "1d20" + modifier, roll_properties);
    }

    parseAttackInfo(description) {
        const m = description.match(/(Melee|Ranged)(?: Weapon| Spell)? Attack:.*?(\+[0-9]+) to hit.*?, (?:reach |ranged? |Gibletish )?(.*?)(?:,.*?)?\./i)
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
        const damage_regexp = new RegExp(/([\w]* )(?:([0-9]+)[^d])?(?: *\(?([0-9]*d[0-9]+(?:\s*[-+]\s*[0-9]+)?(?: plus [^\)]+)?)\)?)? ([\w ]+?) damage/)
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
                let description = descriptionToString(action);
                description = description.replace(/−/g, "-");
                const roll_properties = this.buildAttackRoll(action_name, description);
                if (roll_properties) {
                    const id = addRollButton(this, () => {
                        // Need to recreate roll properties, in case settings (whisper, custom dmg, etc..) have changed since button was added
                        const roll_properties = this.buildAttackRoll(action_name, description);
                        if (this.type() == "Creature" && this._creatureType === "Wildshape" && this._parent_character && 
                            this._parent_character.hasClass("Barbarian") && this._parent_character.hasClassFeature("Rage") &&
                            this._parent_character.getSetting("barbarian-rage", false) && description.match(/Melee(?: Weapon)? Attack:/) &&
                            roll_properties["damages"] && roll_properties["damages"].length > 0) {
                            // Barbarian: Rage
                            const barbarian_level = this._parent_character.getClassLevel("Barbarian");
                            const rage_damage = barbarian_level < 9 ? 2 : (barbarian_level < 16 ? 3 : 4);
                            roll_properties["damages"].push(String(rage_damage));
                            roll_properties["damage-types"].push("Rage");
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
                let action_name = $(firstChild).find("> :first-child").text().trim() || $(firstChild).text().trim();
                if (!action_name) continue;
                const description = descriptionToString(action);
                if (!description.startsWith(action_name)) continue;
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
                action = $(block).find(this._base + "__action");
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