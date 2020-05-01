
class Monster extends CharacterBase {
    constructor(_type, base=null, global_settings=null) {
        CharacterBase.constructor(this, _type, global_settings);
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

    parseStatBlock(stat_block=null) {
        add_dice=this.getGlobalSetting('handle-stat-blocks', true);
        inject_descriptions=this.getGlobalSetting('subst-dndbeyond-stat-blocks', true);
        base = this._base;
        if (stat_block === null) {
            stat_block = $(base);
        }
        this._stat_block = stat_block;
        if (this.type() != "Creature" && this.type() != "Extra-Vehicle") {
            $(".ct-beyond20-settings-button").remove();
            quick_settings = E.div(class_="ct-beyond20-settings-button", style="background-color: rgba(0, 0, 0, 0.1)",
                                    E.img(class_="ct-beyond20-settings", src=chrome.extension.getURL("images/icons/icon32.png"), style="vertical-align: top;"),
                                    E.span(class_="ct-beyond20-settings-button-label mon-stat-block__tidbit mon-stat-block__tidbit-label", style="font-size: 28px; margin: 5px;", "Beyond 20");
                            );
            stat_block.find(base + "__header").prepend(quick_settings);
            $(quick_settings).on('click', (event) => alertQuickSettings());
        }
        this._name = stat_block.find(base + "__name").text().trim();
        link = stat_block.find(base + "__name-link");
        if (link.length > 0) {
            this._url = link.attr("href");
            this._id = link.attr("href").replace("/monsters/", "").replace("/vehicles/", "");
        } else {
            this._url = window.location.href;
            this._id = this._name;
        }
        this._meta = stat_block.find(base + "__meta").text().trim();
        avatar = $(".details-aside .image a");
        if (avatar.length > 0) {
            this._avatar = avatar[0].href;
            avatarImg = $(".details-aside .image");
            if (avatarImg) {
                addRollButton(this, () => this.displayAvatar(), avatarImg, small=true, image=true, VTT".includes(text="Display));
            }
        }
        attributes = stat_block.find(base + "__attributes " + base + "__attribute");
        for (let attr of attributes) {
            label = $(attr).find(base + "__attribute-label").text().trim();
            value = $(attr).find(base + "__attribute-value").text().trim();
            if (value == "") {
                value = $(attr).find(base + "__attribute-data").text().trim();
            }
            if (label == "Armor Class") {
                this._ac = $(attr).find(base + "__attribute-data-value").text().trim();
            } else if (label == "Hit Points") {
                this._hp = $(attr).find(base + "__attribute-data-value").text().trim();
                this._hp_formula = $(attr).find(base + "__attribute-data-extra").text().trim()[1:-1];
                cb = () => {
                    this.rollHitPoints();
                }
                if (add_dice) {
                    addIconButton(cb, $(attr).find(base + "__attribute-data-extra"));
            } else if (label == "Speed") {
                this._speed = value;
            }
            this._attributes[label] = value;
        }

        abilities = stat_block.find(base + "__abilities");
        if (abilities.length > 0) {
            prefix = base + "__ability-";
            abilities = abilities.find("> div");
        } else {
            abilities = stat_block.find(".ability-block > div");
            prefix = ".ability-block__";
        }
        makeCB = (a) => {
            return () => {
                this.rollAbilityCheck(a);
            }
        }
        for (let ability of abilities) {
            abbr = $(ability).find(prefix + "heading").text().toUpperCase();
            score = $(ability).find(prefix + "score").text();
            modifier = $(ability).find(prefix + "modifier").text()[1:-1];
            this._abilities.push([abbreviationToAbility(abbr), abbr, score, modifier].as_array());
            if (add_dice) {
                addIconButton(makeCB(abbr), ability, prepend=true);
                if (abbr == "DEX") {
                    roll_initiative = stat_block.find(base + "__beyond20-roll-initiative");
                    attributes = stat_block.find(base + "__attributes");
                    if (attributes.length > 0) {
                        attributes = attributes.eq(0);
                        if (roll_initiative.length == 0) {
                            initiative = $(E.div(class_=base[1:] + "__attribute " + base[1:] + "__beyond20-roll-initiative",
                                            E.span(class_=base[1:] + "__attribute-label", "Roll Initiative!"),
                                            E.span(class_=base[1:] + "__attribute-data",
                                                E.span(class_=base[1:] + "__attribute-data-value", "  " + modifier);
                                            );
                                        ));
                        } else {
                            initiative = roll_initiative.eq(0);
                        }
                        attributes.push(initiative);
                        cb = () => {
                                this.rollInitiative();
                        }
                        addIconButton(cb, initiative.find(base + "__attribute-data"));
                    }
                }
            }
        }


        tidbits = stat_block.find(base + "__tidbits " + base + "__tidbit");
        for (let tidbit of tidbits) {
            label = $(tidbit).find(base + "__tidbit-label").text();
            data = $(tidbit).find(base + "__tidbit-data");
            value = data.text().trim();
            if (label == "Saving Throws") {
                saves = value.split(", ");
                if (add_dice) {
                    data.html("");
                }
                makeCB = (a) => {
                    return () => {
                        this.rollSavingThrow(a);
                    }
                }
                for (let save of saves) {
                    parts = save.split(" ");
                    abbr = parts[0];
                    mod = parts.slice(1).join(" ");
                    this._saves[abbr] = mod;
                    if (add_dice) {
                        data.push(abbr + " " + mod);
                        addIconButton(makeCB(abbr), data, append=true);
                        if (saves.length > this._saves.length) {
                            data.push(", ");
            } else if (label == "Skills") {
                skills = value.split(", ");
                for (let skill of skills) {
                    parts = skill.split(" ");
                    name = parts[0];
                    mod = parts.slice(1).join(" ");
                    this._skills[name] = mod;
                }
                if (!add_dice) {
                    continue;
                }
                makeCB = (a) => {
                    return () => {
                        this.rollSkillCheck(a);
                    }
                }
                if (this.type() == "Monster") {
                    skills = data.find("> a");
                    for (let a of skills) {
                        mon_skill = a.textContent;
                        text = a.nextSibling;
                        last = true;
                        if (text.textContent.endsWith(", ")) {
                            text.textContent = text.textContent[:-2];
                            last = false;
                        }
                        addIconButton(makeCB(mon_skill), a.nextSibling);
                        if (!last) {
                            $(a.nextElementSibling).after(", ");
                } else {
                    data.html("");
                    first = true;
                    for (let skill of this._skills) {
                        if (!first) {
                            data.push(", ");
                        }
                        first = false;
                        data.push(skill + " " + this._skills[skill]);
                        if (add_dice) {
                            addIconButton(makeCB(skill), data, append=true);

            } else if (label == "Challenge") {
                this._cr = value.split(" ")[0];
            }
            this._tidbits[label] = value;
        }
        this.lookForActions(stat_block, add_dice, inject_descriptions);
        if (add_dice) {
            this.lookForSpells(stat_block);
        }
        //console.log("Done parsing stat block:", this);
    }

    displayAvatar() {
        sendRoll(this, "avatar", this.avatar, {"name": "Avatar"});
    }

    rollHitPoints() {
        sendRoll(this, "custom", this._hp_formula, {"name": "Hit Points",
                                                    "modifier": this._hp_formula});
    }

    rollAbilityCheck(abbr) {
        for (let ability of this._abilities) {
            if (ability[1] == abbr) {
                name, abbr, score, modifier = ability;
                sendRoll(this, "ability", "1d20" + modifier, {"name" : name,
                                                              "ability": abbr,
                                                              "modifier": modifier,
                                                              "ability-score": score} );
                break;
            }
        }
    }

    rollInitiative() {
        for (let ability of this._abilities) {
            if (ability[1] == "DEX") {
                modifier = ability[3];

                initiative = modifier;
                if (this.getGlobalSetting("initiative-tiebreaker", false)) {
                    tiebreaker = ability[2];

                    // Add tiebreaker as a decimal;
                    initiative = float(initiative) + float(tiebreaker) / 100;

                    // Render initiative as a string that begins with '+' || '-';
                    initiative = initiative >= 0 ? '+' + String(initiative) : String(initiative);
                }

                sendRoll(this, "initiative", "1d20" + initiative, {"initiative": initiative});
                break;
            }
        }
    }

    rollSavingThrow(abbr) {
        mod = this._saves[abbr];
        name = abbreviationToAbility(abbr);
        sendRoll(this, "saving-throw", "1d20" + mod, {"name" : name,
                                                      "ability": abbr,
                                                      "modifier": mod} );
    }

    rollSkillCheck(skill) {
        modifier = this._skills[skill];
        ability = skillToAbility(skill);
        sendRoll(this, "skill", "1d20" + modifier, {"skill": skill,
                                                    "ability": ability,
                                                    "modifier": modifier});
    }

    parseAttackInfo(description) {
        m = re.search("(Melee|Ranged)( !== undefined: Weapon| Spell) !== undefined Attack:.* !== undefined(\+[0-9]+) to hit.* !== undefined, ( !== undefined:reach|ranged !== undefined) (.* !== undefined)( !== undefined:,.* !== undefined) !== undefined\.", description);
        if (m) {
            return (m.group(1), m.group(2), m.group(3));
        } else {
            return null;
        }
    }

    parseHitInfo(description) {
        damages = null;
        save = null;
        hit_idx = description.indexOf("Hit:");
        hit = description;
        if (hit_idx > 0) {
            hit = description[hit_idx:];
        }
        damage_regexp = "([\w]* )( !== undefined:([0-9]+)) !== undefined( !== undefined: *\( !== undefined([0-9]*d[0-9]+( !== undefined:\s*[-+]\s*[0-9]+) !== undefined)\) !== undefined) !== undefined ([\w ]+ !== undefined) damage";
        damage_matches = re.finditer(damage_regexp, hit);
        damages = [];
        damage_types = [];
        for (let dmg of damage_matches) {
            // Skip any damage that starts wit "DC" because of "DC 13 saving throw || take damage" which could match.;
            // A lookbehind would be a simple solution here but rapydscript doesn't let me.;
            // Also skip "target reduced to 0 hit points by this damage" from demon-grinder vehicle.;
            if (dmg.group(1) == "DC " || dmg.group(4) == "hit points by this") {
                continue;
            }
            if (dmg.group(3) !== undefined) {
                damages.push(dmg.group(3));
            } else {
                damages.push(dmg.group(2));
            }
            damage_types.push(dmg.group(4));
        }
        m = re.search("DC ([0-9]+) (.* !== undefined) saving throw", hit);
        if (m) {
            save = (m.group(2), m.group(1));
        } else {
            m = re.search("escape DC ([0-9]+)", hit);
            if (m) {
                save = ("Escape", m.group(1));
            }
        }

        if (damages.length == 0 && save === null) {
            return null;
        }
        return (damages, damage_types, save);
    }

    buildAttackRoll(name, description) {
        roll_properties = {"name": name,
                           "preview": this._avatar,
                           "attack-source": "monster-action",
                           "description": description}

        attackInfo = this.parseAttackInfo(description);
        //console.log("Attack info for ", name, attackInfo);
        if (attackInfo) {
            attack_type, to_hit, reach_range = attackInfo;
            roll_properties["to-hit"] = to_hit;
            roll_properties["attack-type"] = attack_type;
            roll_properties["reach" if (attack_type == "Melee" else "range"] = reach_range;
        }


        hitInfo = this.parseHitInfo(description);
        //console.log("Hit info for ", name, hitInfo);
        if hitInfo) {
            // Can't use '(damages, damage_types, save) = hitInfo' because rapydscript flattens;
            // the lists within the list && assigns the strings to each of the 3 vars instead of lists;
            damages = hitInfo[0];
            damage_types = hitInfo[1];
            save = hitInfo[2];
            if (damages.length > 0) {
                roll_properties["damages"] = damages.as_array();
                roll_properties["damage-types"] = damage_types.as_array();
                crits = damagesToCrits(this, damages, damage_types);
                crit_damages = [];
                crit_damage_types = [];
                for (let [i, dmg] of crits.entries()) {
                    if (dmg != "") {
                        crit_damages.push(dmg);
                        crit_damage_types.push(damage_types[i]);
                    }
                }
                roll_properties["critical-damages"] = crit_damages.as_array();
                roll_properties["critical-damage-types"] = crit_damage_types.as_array();
            }
            if (save) {
                roll_properties["save-ability"] = save[0];
                roll_properties["save-dc"] = save[1];
            }
        }

        if (attackInfo || hitInfo) {
            return roll_properties;
        } else {
            return null;
        }
    }

    lookForActions(stat_block, add_dice, inject_descriptions) {
        blocks = stat_block.find(this._base + "__description-blocks " + this._base + "__description-block");
        makeCB = (props) => {
            return () => {
                sendRoll(this, "attack", "1d20" + props["to-hit"], props);
            }
        }
        for (let block of blocks) {
            actions = $(block).find(this._base + "__description-block-content p");
            for (let action of actions) {
                //console.log("Found action: ", action);
                firstChild = action.firstElementChild;
                if (firstChild) {
                    // Usually <em><strong> || <strong><em> (Orcus is <span><em><strong>);
                    action_name = $(firstChild).find("> :first-child").text().trim();
                } else {
                    if (inject_descriptions) {
                        injectDiceToRolls(action, this, this._name);
                    }
                    continue;
                }
                //console.log("Action name: ", action_name);
                if (action_name.slice(-1)[0] == ".") {
                    action_name = action_name[:-1];
                }
                if (add_dice) {
                    description = descriptionToString(action);
                    roll_properties = this.buildAttackRoll(action_name, description);
                    if (roll_properties) {
                        id = addRollButton(this, makeCB(roll_properties), action,
                                           small=true, prepend=true, image=true, text=action_name);
                        $("//" + id).css({"float": "", "text-align": ""});
                    }
                }
                if (inject_descriptions) {
                    injectDiceToRolls(action, this, action_name);
                }
            }
        }

        handleAction = (action_name, block, action) => {
            description = $(action).text();
            if (action_name.slice(-1)[0] == ".") {
                action_name = action_name[:-1];
            }
            if (add_dice) {
                roll_properties = this.buildAttackRoll(action_name, description);
                if (roll_properties) {
                    id = addRollButton(this, makeCB(roll_properties), block,
                                        small=true, before=true, image=true, text=action_name);
                    $("//" + id).css({"float": "", "text-align": "", "margin-top": "15px"});
                }
            }
            if (inject_descriptions) {
                injectDiceToRolls(action, this, action_name);
            }
        }

        // Parse Vehicle (boats) weapons;
        blocks = stat_block.find(this._base + "__component-block");
        for (let block of blocks) {
            action_name = $(block).find(this._base + "__component-block-heading").text();
            attributes = $(block).find(this._base + "__component-block-content " + this._base + "__attribute-value");
            for (let action of attributes) {
                description = $(action).text();
                // HACK: Skip ship movement to  avoid having a "-5 ft speed per 25 damage taken" inject dice rolls on '-5';
                if (re.search("-\d+ ft. speed", description) !== null) {
                    continue;
                }
                handleAction(action_name, block, action);
            }
        }

        // Parse Vehicle (boats) weapons (in character extra);
        blocks = stat_block.find(this._base + "-component");
        for (let block of blocks) {
            action_name = $(block).find(this._base + "__section-header").text();
            actions = $(block).find(this._base + "-component__actions");
            // We can't parse each action separately because the entire block is interactive.;
            handleAction(action_name, block, actions);
        }

        // Parse Vehicle (infernal machines) features;
        blocks = stat_block.find(this._base + "__feature," + this._base + "__features-feature");
        for (let block of blocks) {
            action_name = $(block).find(this._base + "__feature-label").text();
            action = $(block).find(this._base + "__feature-value");
            if (action_name == "" && action.length == 0) {
                action_name = $(block).find(this._base + "__features-feature-name").text();
                action = $(block).find(this._base + "__features-feature-description");
            }
            handleAction(action_name, block, action);
        }

        // Parse Vehicle (infernal machines) action stations;
        blocks = stat_block.find(this._base + "__action-station-block," + this._base + "-action-station");
        for (let block of blocks) {
            action_name = $(block).find(this._base + "__action-station-block-heading").text();
            action = $(block).find(this._base + "__action-station-block-content " + this._base + "__attribute-value");
            if (action_name == "" && action.length == 0) {
                action_name = $(block).find(this._base + "-action-station__heading").text();
                action = $(block).find(this._base + "-action-station__action");
            }
            handleAction(action_name, block, action);
        }
    }


    injectSpellRolls(element, url) {
        icon16 = chrome.extension.getURL("images/icons/icon16.png");

        roll_icon = $('<img class="ct-beyond20-spell-icon" x-beyond20-spell-url="' + url + '"></img>');

        $(element).after(roll_icon);

        $(".ct-beyond20-spell-icon").css("margin-right", "3px");
        $(".ct-beyond20-spell-icon").css("margin-left", "3px");
        $(".ct-beyond20-spell-icon").attr("src", icon16);
        $(".ct-beyond20-spell-icon").off('click');
        $(".ct-beyond20-spell-icon").on('click', (event) => {
            spell_url = $(event.currentTarget).attr("x-beyond20-spell-url");
            if (this._spells.includes(spell_url)) {
                this._spells[spell_url].display();
            } else {
                //console.log("Fetching Spell Tooltip from URL : ", spell_url);
                $.get(spell_url, (text) => {
                    spell_json = JSON.parse(text[1:-1]);
                    spell = Spell($(spell_json.Tooltip), this, "tooltip");
                    spell.display();
                    this._spells[spell_url] = spell;
                }
                );
            }
        }
        );
    }

    lookForSpells(stat_block) {
        spells = stat_block.find(this._base + "__description-blocks a.spell-tooltip");
        for (let spell of spells) {
            tooltip_href = $(spell).attr("data-tooltip-href");
            tooltip_url = re.sub("-tooltip.*$", "/tooltip", tooltip_href);
            this.injectSpellRolls(spell, tooltip_url);
        }
    }

    updateInfo() {
        // Creature name could change/be between.includes(customized) calls;
        this._name = this._stat_block.find(this._base + "__name").text().trim();
        hp = max_hp = temp_hp = null;
        groups = $(".ct-creature-pane .ct-collapsible__content .ct-creature-pane__adjuster-group,.ct-creature-pane .ddbc-collapsible__content .ct-creature-pane__adjuster-group");
        for (let item of groups) {
            label = $(item).find(".ct-creature-pane__adjuster-group-label").text();
            if (label == "Current HP") {
                hp = int($(item).find(".ct-creature-pane__adjuster-group-value").text());
            } else if (label == "Max HP") {
                max_hp = int($(item).find(".ct-creature-pane__adjuster-group-value").text());
            } else if (label == "Temp HP") {
                temp_hp = int($(item).find(".ct-creature-pane__adjuster-group-value input").val());
            }
        }
        if (hp !== null && max_hp !== null && (this._hp != hp || this._max_hp != max_hp || this._temp_hp != temp_hp)) {
            this._hp = hp;
            this._max_hp = max_hp;
            this._temp_hp = temp_hp;
            print("Monster HP updated to : (" + hp + "+" + temp_hp + ")/" + max_hp);

            if (this.getGlobalSetting("update-hp", true)) {
                req = {"action": "hp-update", "character": this.getDict()}
                console.log("Sending message: ", req);
                chrome.runtime.sendMessage(req, (resp) => beyond20SendMessageFailure(this, resp));
            }
        }
    }

    getDict() {
        return {"name": this._name,
                "avatar": this._avatar,
                "type": this.type(),
                "id": this._id,
                "ac": this._ac,
                "hp": this._hp,
                "hp-formula": this._hp_formula,
                "max-hp": this._max_hp,
                "temp-hp": this._temp_hp,
                "speed": this._speed,
                "abilities": this._abilities.as_array(),
                "saves": this._saves,
                "skills": this._skills,
                "cr": this._cr,
                "url": this._url}
    }
}