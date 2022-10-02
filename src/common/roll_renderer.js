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

    async queryGeneric(title, question, choices, select_id = "generic-query", order, selection, {prefix=""}={}) {
        let html = "<form>";
        if (prefix) {
            html += `<div class="beyond20-query-prefix">${prefix}</div>`;
        }
        html += `<div class="beyond20-form-row"><label>${question}</label><select id="${select_id}" name="${select_id}">`;

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
                if (html) {
                    resolve(html.find("#" + select_id).val());
                } else {
                    // return null in case it got cancelled
                    resolve(null);
                }
            });
        });
    }

    async queryAdvantage(title, reason="") {
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
        reason = reason.split("\n").join("<br/>");
        const result = await this.queryGeneric(title, "Select roll mode : ", choices, "roll-mode", order, lastQuery, {prefix: reason});
        if (result === null) return null;
        const advantage = parseInt(result);
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
        const result = await this.queryGeneric(title, "Select whisper mode : ", choices, "whisper-mode", null, lastQuery);
        if (result === null) return null;
        const whisper = parseInt(result);
        if (lastQuery != whisper) {
            this._mergeSettings({ "last-whisper-query": whisper })
        }
        return whisper;
    }

    getToHit(request, modifier = "", data = {}, type="to-hit") {
        const advantage = request.advantage;

        const d20 = request.d20 || "1d20";
        let rolls = [];
        if ([RollType.DOUBLE, RollType.ADVANTAGE, RollType.DISADVANTAGE].includes(advantage)) {
            const roll_1 = this.createRoll(d20 + modifier, data, type);
            const roll_2 = this.createRoll(d20 + modifier, data, type);
            roll_1.setCriticalFaces(20);
            roll_2.setCriticalFaces(20);

            rolls = [roll_1, roll_2];
        } else if ([RollType.THRICE, RollType.SUPER_ADVANTAGE, RollType.SUPER_DISADVANTAGE].includes(advantage)) {
            const roll_1 = this.createRoll(d20 + modifier, data, type);
            const roll_2 = this.createRoll(d20 + modifier, data, type);
            const roll_3 = this.createRoll(d20 + modifier, data, type);

            rolls = [roll_1, roll_2, roll_3];
        } else { // advantage == RollType.NORMAL
            rolls.push(this.createRoll(d20 + modifier, data, type));
        }
        rolls.forEach(r => r.setCriticalFaces(20));
        return {rolls};
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
        let roll_type_class = 'beyond20-roll-value beyond20-roll-detail-';
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

        let html = '<div class="beyond20-message"><div class="beyond20-header">';
        if (request.whisper == WhisperType.HIDE_NAMES) {
            description = null;
            title = this._settings["hidden-monster-replacement"];
        } else if (request.character && request.character.avatar) {
            html += `<img class="beyond20-character-avatar" src="${request.character.avatar}" title="${title}" width="37" height="37">`;
        }
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
            html += "<span class='beyond20-title'>" +  title + "</span>";
        }
        html += "</div>";

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
        // Only add totals if we have either : 
        // - more than 1 critical damage
        // - or, more than 1 non-critical damage
        // - and the 2 non-critical damages are not 1 handed + 2 handed
        let add_totals = damage_rolls.filter((r) => (r[2] & DAMAGE_FLAGS.CRITICAL) == 0).length > 1 ||
                        damage_rolls.filter((r) => (r[2] & DAMAGE_FLAGS.CRITICAL) != 0).length > 1;
        if (add_totals && damage_rolls.length === 2 &&
            (damage_rolls[0][2] & DAMAGE_FLAGS.REGULAR) != 0 &&
            (damage_rolls[1][2] & DAMAGE_FLAGS.VERSATILE) != 0) {
            add_totals = false;
        }
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
            let dmg_classes = "beyond20-roll-result beyond20-roll-damage";
            if (flags & DAMAGE_FLAGS.CRITICAL) dmg_classes += " beyond20-critical-damage";
            if (flags & DAMAGE_FLAGS.HEALING) dmg_classes += " beyond20-healing";
            html += `<div class='${dmg_classes}'><b>${roll_name}</b>${roll_html}</div>`;
            if (add_totals && typeof (roll) !== "string") {
                let kind_of_damage = "";
                if (flags & DAMAGE_FLAGS.REGULAR) {
                    kind_of_damage = flags & DAMAGE_FLAGS.CRITICAL ? "Critical Damage" : "Damage";
                } else if (flags & DAMAGE_FLAGS.VERSATILE) {
                    kind_of_damage = flags & DAMAGE_FLAGS.CRITICAL ? "Critical 2-Handed Damage" : "2-Handed Damage";
                } else if (flags & DAMAGE_FLAGS.HEALING) {
                    kind_of_damage = "Healing";
                } else if (flags & DAMAGE_FLAGS.ADDITIONAL) {
                    // HACK Alert: crappy code;
                    const regular = flags & DAMAGE_FLAGS.CRITICAL ? "Critical Damage" : "Damage";
                    const versatile = flags & DAMAGE_FLAGS.CRITICAL ? "Critical 2-Handed Damage" : "2-Handed Damage";
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
            if (total_damages["2-Handed Damage"]) {
                total_damages["1-Handed Damage"] = total_damages["Damage"];
                delete total_damages["Damage"];
                // Need to swap them so two-handed goes last
                const two_handed = total_damages["2-Handed Damage"];
                delete total_damages["2-Handed Damage"];
                total_damages["2-Handed Damage"] = two_handed;
            }
            if (total_damages["Critical 2-Handed Damage"]) {
                total_damages["Critical 1-Handed Damage"] = total_damages["Critical Damage"];
                delete total_damages["Critical Damage"];
                // Need to swap them so two-handed goes last
                const two_handed = total_damages["Critical 2-Handed Damage"];
                delete total_damages["Critical 2-Handed Damage"];
                total_damages["Critical 2-Handed Damage"] = two_handed;
            }
            html += "<div class='beyond20-roll-result'><b><hr/></b></div>";
        }

        let roll = null;
        for (let key in total_damages) {
            const is_total = (roll === null);
            roll = this._roller.roll(total_damages[key]);
            roll.setRollType("damage");
            await roll.roll();
            total_damages[key] = roll;
            const roll_html = await this.rollToDetails(roll, is_total);
            let total_classes = "beyond20-total-damage";
            if (key.includes("Critical")) total_classes += " beyond20-critical-damage";
            html += `<div class='beyond20-roll-result ${total_classes}'><b>Total ${key}: </b>${roll_html}</div>`;
        }

        if (request.damages && request.damages.length > 0 && 
            request.rollAttack && !request.rollDamage) {
            html += '<button class="beyond20-button-roll-damages">Roll Damages</button>';
        }

        html += "</div>";
        const character = (request.whisper == WhisperType.HIDE_NAMES) ? this._settings["hidden-monster-replacement"] : request.character.name;
        const discordChannel = getDiscordChannel(this._settings, request.character)
        postToDiscord(discordChannel ? discordChannel.secret : "", request, title, source, attributes, description, attack_rolls, roll_info, damage_rolls, total_damages, open, this._settings).then(discord_error => {
            if (discord_error != undefined)
                this._displayer.displayError("Beyond20 Discord Integration: " + discord_error);
        });

        // Hide the dialog showing the roll result on DDB when whispering to Discord (if the setting is on)
        // Allowing the simulation of Fantasy Ground's 'Dice Tower' feature.
        const isWhispering = request.whisper === WhisperType.YES;
        const isSendingResultToDiscordOnly = this._settings["vtt-tab"] && this._settings["vtt-tab"].vtt === "dndbeyond";
        const shouldHideResultsOnWhispersToDiscord = this._settings["hide-results-on-whisper-to-discord"];

        const canPostHTML = !isWhispering || !isSendingResultToDiscordOnly || !shouldHideResultsOnWhispersToDiscord;

        const json_attack_rolls = attack_rolls.map(r => r.toJSON ? r.toJSON() : r);
        const json_damage_rolls = damage_rolls.map(([l, r, f]) => r.toJSON ? [l, r.toJSON(), f] : [l, r, f]);
        const json_total_damages = Object.fromEntries(Object.entries(total_damages).map(([k, v]) => [k, v.toJSON ? v.toJSON() : v]));
        if (request.sendMessage && this._displayer.sendMessage) {
            this._displayer.sendMessage(request, title, html, character, request.whisper, play_sound, source, attributes, description, json_attack_rolls, roll_info, json_damage_rolls, json_total_damages, open)
        } else if (canPostHTML) {
            this._displayer.postHTML(request, title, html, character, request.whisper, play_sound, source, attributes, description, json_attack_rolls, roll_info, json_damage_rolls, json_total_damages, open);
        }

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
        const character = (request.whisper == WhisperType.HIDE_NAMES) ? this._settings["hidden-monster-replacement"] : request.character.name;
        if (request.whisper == WhisperType.HIDE_NAMES)
            title = this._settings["hidden-monster-replacement"];
        if (request.sendMessage && this._displayer.sendMessage)
            this._displayer.sendMessage(request, title, message, character, request.whisper, false, '', {}, '', [], [], [], [], true);
        else
            this._displayer.postHTML(request, title, message, character, request.whisper, false, '', {}, '', [], [], [], [], true);

    }

    createRoll(dice, data={}, type) {
        const new_data = {}
        const parts = [dice];
        for (let key in data) {
            if (data[key]) {
                const new_key = key.replace("_", "").toLowerCase();
                new_data[new_key] = data[key];
                parts.push(new_key);
            }
        }
        const roll = this._roller.roll(parts.join(" + @"), new_data);
        if (type)
            roll.setRollType(type);
        return roll;
    }

    async rollDice(request, title, dice, data = {}, type) {
        const roll = this.createRoll(dice, data, type);
        await this._roller.resolveRolls(title, [roll], request);
        return this.postDescription(request, title, null, {}, null, [roll]);
    }
    async sendCustomDigitalDice(character, digitalRoll) {
        let whisper = parseInt(character.getGlobalSetting("whisper-type", WhisperType.NO));
        const whisper_monster = parseInt(character.getGlobalSetting("whisper-type-monsters", WhisperType.YES));
        let is_monster = character.type() == "Monster" || character.type() == "Vehicle";
        if (is_monster && whisper_monster != WhisperType.NO)
            whisper = whisper_monster;
        if (whisper === WhisperType.QUERY) {
            whisper = await this.queryWhisper(digitalRoll.name || "Custom Roll", is_monster);
            if (whisper === null) return; // query was cancelled
        }
        // Default advantage/whisper would get overriden if (they are part of provided args;
        const request = {
            action: "roll",
            character: character.getDict(),
            type: "digital-dice",
            roll: digitalRoll.rolls[0].formula,
            advantage: RollType.NORMAL,
            whisper: whisper,
            sendMessage: true,
            name: digitalRoll.name
        }
        return this.postDescription(request, `${request.name} (${request.roll})`, null, {}, null, digitalRoll.rolls);
    }

    async rollD20(request, title, data, type) {
        const {rolls} = this.getToHit(request, "", data, type)
        await this._roller.resolveRolls(title, rolls, request);
        this.processToHitAdvantage(request.advantage, rolls);
        return this.postDescription(request, title, null, {}, null, rolls);
    }

    async rollSkill(request, custom_roll_dice = "") {
        const data = { [request.ability]: request.modifier, "custom_dice": custom_roll_dice }
        return this.rollD20(request, request.skill + "(" + request.modifier + ")", data, "skill-check");
    }

    rollAbility(request, custom_roll_dice = "") {
        const data = { [request.ability]: request.modifier, "custom_dice": custom_roll_dice }
        return this.rollD20(request, request.name + "(" + request.modifier + ")", data, "ability-check");
    }

    rollSavingThrow(request, custom_roll_dice = "") {
        const data = { [request.ability]: request.modifier, "custom_dice": custom_roll_dice }
        return this.rollD20(request, request.name + " Save" + "(" + request.modifier + ")", data, "saving-throw");
    }

    rollInitiative(request, custom_roll_dice = "") {
        const data = { "initiative": request.initiative, "custom_dice": custom_roll_dice }
        return this.rollD20(request, "Initiative" + "(" + request.initiative + ")", data, "initiative");
    }

    rollHitDice(request) {
        const rname = "Hit Dice" + (request.multiclass ? `(${request.class})` : "");
        return this.rollDice(request, rname, request["hit-dice"], {}, "hit-dice");
    }

    rollDeathSave(request, custom_roll_dice = "") {
        const data = { "custom_dice": custom_roll_dice }
        if (request.modifier) data.modifier = request.modifier
        return this.rollD20(request, "Death Saving Throw", data, "death-save");
    }

    rollItem(request) {
        return this.rollTrait(request);
    }

    rollTrait(request) {
        let source = request.type;
        let name = request.name;
        if (request["source-type"] !== undefined) {
            source = request["source-type"];
            if (request.source && request.source.length > 0)
                source += ": " + request.source;
        } else if (request["item-type"] !== undefined) {
            source = request["item-type"];
        }
        if (request.quantity) {
            name = `${request.name} (${request.quantity})`;
        }
        return this.postDescription(request, name, source, {}, request.description, [], [], [], true);
    }

    async queryDamageType(title, damage_types, type_id="damage-type") {
        const choices = {}
        for (let option in damage_types) {
            const value = damage_types[option];
            if (value)
                choices[option] = option + " (" + value + ")";
            else
                choices[option] = option;
        }
        // get/save the last user selection during similar query
        const settingId = `last-query-${type_id}`;
        const lastQuery = this._settings[settingId];
        const result = await this.queryGeneric(title, "Choose Damage Type :", choices, type_id, undefined, lastQuery);
        if (result !== null && lastQuery != result) {
            this._mergeSettings({ [settingId]: result })
        }
        return result;
    }

    async buildAttackRolls(request, custom_roll_dice) {
        let to_hit = [];
        const damage_rolls = [];
        const all_rolls = [];
        let is_critical = false;
        if (request.rollAttack && request["to-hit"] !== undefined) {
            const custom = custom_roll_dice == "" ? "" : (" + " + custom_roll_dice);
            const to_hit_mod = " + " + request["to-hit"] + custom;
            const {rolls} = this.getToHit(request, to_hit_mod)
            to_hit.push(...rolls);
            all_rolls.push(...rolls);
        }

        if (request.rollDamage && request.damages !== undefined) {
            const damages = request.damages;
            const damage_types = request["damage-types"];
            const critical_damages = request["critical-damages"];
            const critical_damage_types = request["critical-damage-types"];

            for (let i = 0; i < (damages.length); i++) {
                const dmg_type = damage_types[i];
                let damage_flags = DAMAGE_FLAGS.REGULAR;
                if (["Healing", "Temp HP", "Alchemical Savant Healing", "Enhanced Bond Healing", "Spiritual Focus Healing"].includes(dmg_type)) {
                    damage_flags = DAMAGE_FLAGS.HEALING;
                } else if (i == 0) {
                    damage_flags = DAMAGE_FLAGS.REGULAR;
                } else if (i == 1 && request.is_versatile) {
                    damage_flags = DAMAGE_FLAGS.VERSATILE;
                } else {
                    damage_flags = DAMAGE_FLAGS.ADDITIONAL;
                }
                const suffix = !(damage_flags & DAMAGE_FLAGS.HEALING) ? " Damage" : "";
                // Avoid adding an empty string
                if (damages[i].trim()) {
                    const roll = this._roller.roll(damages[i]);
                    roll.setRollType("damage");
                    all_rolls.push(roll);
                    damage_rolls.push([dmg_type + suffix, roll, damage_flags]);
                }
                // Handle life transference;
                if (request.name == "Life Transference" && dmg_type == "Necrotic") {
                    damage_rolls.push(["Healing", "Twice the Necrotic damage", DAMAGE_FLAGS.HEALING]);
                } else if (request.name == "Vampiric Touch" && dmg_type == "Necrotic") {
                    damage_rolls.push(["Healing", "Half the Necrotic damage", DAMAGE_FLAGS.HEALING]);
                }
            }
        

            await this._roller.resolveRolls(request.name, all_rolls, request)
            
            // Moved after the new resolveRolls so it can access the roll results
            if (request.name.includes("Chaos Bolt")) {
                for (let [i, dmg_roll] of damage_rolls.entries()) {
                    const [dmg_type, roll, flags] = dmg_roll;
                    if (dmg_type == "Chaotic Energy Damage" && roll.dice[0].faces == 8) {
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
                            chaotic_type = await this.queryDamageType(request.name, damage_choices, "chaos-bolt");
                            if (chaotic_type === null) {
                                // Query was cancelled
                                chaotic_type = Object.keys(damage_choices)[0];
                            }
                        }
                        damage_rolls[i] = [chaotic_type + " Damage", roll, flags];
                        damage_rolls[i + 1][0] = chaotic_type + " Damage";
                        critical_damage_types[0] = chaotic_type;
                        critical_damage_types[1] = chaotic_type;
                        break;
                    }
                }
            }

            // If rolling the attack, check for critical hit, otherwise, use argument.
            if (request.rollAttack && to_hit.length > 0) {
                this.processToHitAdvantage(request.advantage, to_hit)
                const critical_limit = request["critical-limit"] || 20;
                is_critical = this.isCriticalHitD20(to_hit, critical_limit);
            } else {
                is_critical = request.rollCritical;
            }
            if (is_critical) {
                const critical_damage_rolls = []
                for (let i = 0; i < (critical_damages.length); i++) {
                    const roll = this._roller.roll(critical_damages[i]);
                    roll.setRollType("critical-damage");
                    critical_damage_rolls.push(roll);
                    const dmg_type = critical_damage_types[i];
                    let damage_flags = DAMAGE_FLAGS.REGULAR;
                    if (["Healing", "Temp HP", "Alchemical Savant Healing", "Enhanced Bond Healing", "Spiritual Focus Healing"].includes(dmg_type)) {
                        damage_flags = DAMAGE_FLAGS.HEALING;
                    } else if (i == 0) {
                        damage_flags = DAMAGE_FLAGS.REGULAR;
                    } else if (i == 1 && request.is_versatile) {
                        damage_flags = DAMAGE_FLAGS.VERSATILE;
                    } else {
                        damage_flags = DAMAGE_FLAGS.ADDITIONAL;
                    }
                    const suffix = !(damage_flags & DAMAGE_FLAGS.HEALING) ? " Critical Damage" : "";
                    damage_rolls.push([dmg_type + suffix, roll, damage_flags | DAMAGE_FLAGS.CRITICAL]);
                }
                await this._roller.resolveRolls(request.name, critical_damage_rolls, request);
            }
        } else {
            // If no damages, still need to resolve to hit rolls
            
            await this._roller.resolveRolls(request.name, all_rolls, request)
            if (to_hit.length > 0)
                this.processToHitAdvantage(request.advantage, to_hit)
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
        if (request.range !== undefined) {
            data["Range"] = request.range;
            if (request.aoe)
                data["Area of Effect"] = request.aoe;
            if (request["aoe-shape"])
                data["AoE Shape"] = request["aoe-shape"];
        }

        const roll_info = [];
        if (request["save-dc"] != undefined)
            roll_info.push(["Save", request["save-ability"] + " DC " + request["save-dc"]]);

        return this.postDescription(request, request.name, null, data, request.description || "", to_hit, roll_info, damage_rolls);
    }


    buildSpellCard(request) {
        const data = {
            "Casting Time": request["casting-time"],
            "Duration": request.duration,
            "Components": request.components,
            "Range": request.range
        }
        if (request["aoe"] !== undefined)
            data["Area of Effect"] = request["aoe"];
        if (request["aoe-shape"] !== undefined)
            data["AoE Shape"] = request["aoe-shape"];

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
        if (request.range !== undefined) {
            roll_info.push(["Range", request.range]);
            if (request.aoe)
                roll_info.push(["Area of Effect", request.aoe]);
            if (request["aoe-shape"])
                roll_info.push(["AoE Shape", request["aoe-shape"]]);
        }

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
        const character = (request.whisper !== WhisperType.NO) ? this._settings["hidden-monster-replacement"] : request.character.name;
        this._displayer.postHTML(request, request.name, `<img src='${request.character.avatar}' width='100%'>`, {}, character, false, false);
        this.displayAvatarToDiscord(request);
    }
    displayAvatarToDiscord(request) {
        const discordChannel = getDiscordChannel(this._settings, request.character);
        postToDiscord(discordChannel ? discordChannel.secret : "", request, request.name, "", {}, "", [], [], [], [], false, this._settings).then((error) => {
            if (error)
                this._displayer.displayError("Beyond20 Discord Integration: " + error);
        });
    }

    async rollRollTable(request, name, formula, data) {
        const table = new RollTable(name, formula, data);
        const roll = this.createRoll(formula);
        await this._roller.resolveRolls(name, [roll], request);
        table.setTotal(roll.total);
        const results = Object.entries(table.results);
        return this.postDescription(request, name, null, {}, null, [roll], results);
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
        } else if (request.type == "roll-table") {
            return this.rollRollTable(request, request.name, request.formula, request.table);
        } else {
            // 'custom' or anything unexpected
            const mod = request.modifier || request.roll;
            const rname = request.name || request.type;

            return this.rollDice(request, rname + "(" + mod + ")", mod, {});
        }
    }
}
