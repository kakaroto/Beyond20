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

    async queryGeneric(title, question, choices, select_id = "generic-query", order, selection) {
        let html = `<form><div class="beyond20-form-row"><label>${question}</label><select id="${select_id}" name="${select_id}">`;

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
                if (html)
                    resolve(html.find("#" + select_id).val());
            });
        });
    }

    async queryAdvantage(title) {
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
        const advantage = parseInt(await this.queryGeneric(title, "Select roll mode : ", choices, "roll-mode", order, lastQuery));
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
        const whisper = parseInt(await dndbeyondDiceRoller.queryGeneric(title, "Select whisper mode : ", choices, "whisper-mode", null, lastQuery));
        if (lastQuery != whisper) {
            this._mergeSettings({ "last-whisper-query": whisper })
        }
        return whisper;
    }

    async getToHit(request, title, modifier = "", data = {}) {
        let advantage = request.advantage;
        if (advantage == RollType.QUERY)
            advantage = await this.queryAdvantage(title);

        const d20 = request.d20 || "1d20";
        let rolls = [];
        if ([RollType.DOUBLE, RollType.ADVANTAGE, RollType.DISADVANTAGE].includes(advantage)) {
            const roll_1 = this.createRoll(d20 + modifier, data);
            const roll_2 = this.createRoll(d20 + modifier, data);
            roll_1.setCriticalFaces(20);
            roll_2.setCriticalFaces(20);

            rolls = [roll_1, roll_2];
        } else if ([RollType.THRICE, RollType.SUPER_ADVANTAGE, RollType.SUPER_DISADVANTAGE].includes(advantage)) {
            const roll_1 = this.createRoll(d20 + modifier, data);
            const roll_2 = this.createRoll(d20 + modifier, data);
            const roll_3 = this.createRoll(d20 + modifier, data);

            rolls = [roll_1, roll_2, roll_3];
        } else { // advantage == RollType.NORMAL
            rolls.push(this.createRoll(d20 + modifier, data));
        }
        rolls.forEach(r => r.setCriticalFaces(20));
        return {advantage, rolls};
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
        let roll_type_class = 'beyond20-roll-detail-';
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

        if (request.whisper == WhisperType.HIDE_NAMES) {
            description = null;
            title = "???";
        }

        let html = '<div class="beyond20-message">';
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
            html = "<div class='beyond20-title'>" + title + "</div>";
        }

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
        const add_totals = damage_rolls.filter((r) => (r[2] & DAMAGE_FLAGS.CRITICAL) == 0).length > 1 || damage_rolls.filter((r) => (r[2] & DAMAGE_FLAGS.CRITICAL) != 0).length > 1;
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
            html += "<div class='beyond20-roll-result'><b>" + roll_name + "</b>" + roll_html + "</div>";
            if (add_totals) {
                let kind_of_damage = "";
                if (flags & DAMAGE_FLAGS.REGULAR) {
                    kind_of_damage = flags & DAMAGE_FLAGS.CRITICAL ? "Critical Damage" : "Damage";
                } else if (flags & DAMAGE_FLAGS.VERSATILE) {
                    kind_of_damage = flags & DAMAGE_FLAGS.CRITICAL ? "Critical Two-Handed Damage" : "Two-Handed Damage";
                } else if (flags & DAMAGE_FLAGS.HEALING) {
                    kind_of_damage = "Healing";
                } else if (flags & DAMAGE_FLAGS.ADDITIONAL) {
                    // HACK Alert: crappy code;
                    const regular = flags & DAMAGE_FLAGS.CRITICAL ? "Critical Damage" : "Damage";
                    const versatile = flags & DAMAGE_FLAGS.CRITICAL ? "Critical Two-Handed Damage" : "Two-Handed Damage";
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
            if (total_damages["Two-Handed Damage"]) {
                total_damages["One-Handed Damage"] = total_damages["Damage"];
                delete total_damages["Damage"];
                // Need to swap them so two-handed goes last
                const two_handed = total_damages["Two-Handed Damage"];
                delete total_damages["Two-Handed Damage"];
                total_damages["Two-Handed Damage"] = two_handed;
            }
            if (total_damages["Critical Two-Handed Damage"]) {
                total_damages["Critical One-Handed Damage"] = total_damages["Critical Damage"];
                delete total_damages["Critical Damage"];
                // Need to swap them so two-handed goes last
                const two_handed = total_damages["Critical Two-Handed Damage"];
                delete total_damages["Critical Two-Handed Damage"];
                total_damages["Critical Two-Handed Damage"] = two_handed;
            }
            html += "<div class='beyond20-roll-result'><b><hr/></b></div>";
        }

        let roll = null;
        for (let key in total_damages) {
            const is_total = (roll === null);
            roll = this._roller.roll(total_damages[key]);
            await roll.roll();
            total_damages[key] = roll;
            const roll_html = await this.rollToDetails(roll, is_total);
            html += "<div class='beyond20-roll-result'><b>Total " + key + ": </b>" + roll_html + "</div>";
        }

        if (request.damages && request.damages.length > 0 && 
            request.rollAttack && !request.rollDamage) {
            html += '<button class="beyond20-button-roll-damages">Roll Damages</button>';
        }

        html += "</div>";
        const character = (request.whisper == WhisperType.HIDE_NAMES) ? "???" : request.character.name;
        const discordChannel = getDiscordChannel(this._settings, request.character)
        postToDiscord(discordChannel ? discordChannel.secret : "", request, title, source, attributes, description, attack_rolls, roll_info, damage_rolls, total_damages, open).then(discord_error => {
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
        if (request.sendMessage && this._displayer.sendMessage)
            this._displayer.sendMessage(request, title, html, character, request.whisper, play_sound, source, attributes, description, json_attack_rolls, roll_info, json_damage_rolls, json_total_damages, open)
        else if (canPostHTML) {
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
        const character = (request.whisper == WhisperType.HIDE_NAMES) ? "???" : request.character.name;
        if (request.whisper == WhisperType.HIDE_NAMES)
            title = "???";
        if (request.sendMessage && this._displayer.sendMessage)
            this._displayer.sendMessage(request, title, message, character, request.whisper, false, '', {}, '', [], [], [], [], true);
        else
            this._displayer.postHTML(request, title, message, character, request.whisper, false, '', {}, '', [], [], [], [], true);

    }

    createRoll(dice, data={}) {
        const new_data = {}
        const parts = [dice];
        for (let key in data) {
            if (data[key]) {
                const new_key = key.replace("_", "").toLowerCase();
                new_data[new_key] = data[key];
                parts.push(new_key);
            }
        }
        return this._roller.roll(parts.join(" + @"), new_data);
    }

    async rollDice(request, title, dice, data = {}) {
        const roll = this.createRoll(dice, data);
        await this._roller.resolveRolls(title, [roll]);
        return this.postDescription(request, title, null, {}, null, [roll]);
    }
    async sendCustomDigitalDice(character, digitalRoll) {
        let whisper = parseInt(character.getGlobalSetting("whisper-type", WhisperType.NO));
        const whisper_monster = parseInt(character.getGlobalSetting("whisper-type-monsters", WhisperType.YES));
        let is_monster = character.type() == "Monster" || character.type() == "Vehicle";
        if (is_monster && whisper_monster != WhisperType.NO)
            whisper = whisper_monster;
        if (whisper === WhisperType.QUERY)
            whisper = await this.queryWhisper(args.name || rollType, is_monster);
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

    async rollD20(request, title, data, modifier="") {
        const {advantage, rolls} = await this.getToHit(request, title, modifier, data)
        await this._roller.resolveRolls(title, rolls);
        this.processToHitAdvantage(advantage, rolls);
        return this.postDescription(request, title, null, {}, null, rolls);
    }

    async rollSkill(request, custom_roll_dice = "") {
        const data = { [request.ability]: request.modifier, "custom_dice": custom_roll_dice }
        return this.rollD20(request, request.skill + "(" + request.modifier + ")", data);
    }

    rollAbility(request, custom_roll_dice = "") {
        const data = { [request.ability]: request.modifier, "custom_dice": custom_roll_dice }
        return this.rollD20(request, request.name + "(" + request.modifier + ")", data);
    }

    rollSavingThrow(request, custom_roll_dice = "") {
        const data = { [request.ability]: request.modifier, "custom_dice": custom_roll_dice }
        return this.rollD20(request, request.name + " Save" + "(" + request.modifier + ")", data);
    }

    rollInitiative(request, custom_roll_dice = "") {
        const data = { "initiative": request.initiative, "custom_dice": custom_roll_dice }
        return this.rollD20(request, "Initiative" + "(" + request.initiative + ")", data);
    }

    rollHitDice(request) {
        const rname = "Hit Dice" + (request.multiclass ? `(${request.class})` : "");
        return this.rollDice(request, rname, request["hit-dice"], {});
    }

    rollDeathSave(request, custom_roll_dice = "") {
        return this.rollD20(request, "Death Saving Throw", { "custom_dice": custom_roll_dice });
    }

    rollItem(request) {
        return this.rollTrait(request);
    }

    rollTrait(request) {
        let source = request.type;
        if (request["source-type"] !== undefined) {
            source = request["source-type"];
            if (request.source && request.source.length > 0)
                source += ": " + request.source;
        } else if (request["item-type"] !== undefined) {
            source = request["item-type"];
        }
        return this.postDescription(request, request.name, source, {}, request.description, [], [], [], true);
    }

    queryDamageType(title, damage_types) {
        const choices = {}
        for (let option in damage_types) {
            const value = damage_types[option];
            if (value)
                choices[option] = option + " (" + value + ")";
            else
                choices[option] = option;
        }
        return this.queryGeneric(title, "Choose Damage Type :", choices, "damage-type");
    }

    async buildAttackRolls(request, custom_roll_dice) {
        let to_hit = [];
        let to_hit_advantage = null;
        const damage_rolls = [];
        const all_rolls = [];
        let is_critical = false;
        if (request.rollAttack && request["to-hit"] !== undefined) {
            const custom = custom_roll_dice == "" ? "" : (" + " + custom_roll_dice);
            const to_hit_mod = " + " + request["to-hit"] + custom;
            const {advantage, rolls} = await this.getToHit(request, request.name, to_hit_mod)
            to_hit_advantage = advantage;
            to_hit.push(...rolls);
            all_rolls.push(...rolls);
        }

        if (request.rollDamage && request.damages !== undefined) {
            const damages = request.damages;
            const damage_types = request["damage-types"];
            const critical_damages = request["critical-damages"];
            const critical_damage_types = request["critical-damage-types"];
            if (request.name === "Chromatic Orb") {
                const damage_choices = {}
                const critical_damage_choices = {}
                for (let dmgtype of ["Acid", "Cold", "Fire", "Lightning", "Poison", "Thunder"]) {
                    let idx = damage_types.findIndex(t => t === dmgtype);
                    damage_choices[damage_types.splice(idx, 1)[0]] = damages.splice(idx, 1)[0];
                    idx = critical_damage_types.findIndex(t => t === dmgtype);
                    if (idx >= 0)
                        critical_damage_choices[critical_damage_types.splice(idx, 1)[0]] = critical_damages.splice(idx, 1)[0];
                }

                const chromatic_type = await this.queryDamageType(request.name, damage_choices);
                damages.splice(0, 0, damage_choices[chromatic_type]);
                damage_types.splice(0, 0, chromatic_type);
                if (critical_damage_choices[chromatic_type] !== undefined) {
                    const crit_damage = critical_damage_choices[chromatic_type];
                    critical_damages.splice(0, 0, crit_damage);
                    critical_damage_types.splice(0, 0, chromatic_type);
                }
            } else if (request.name === "Dragon's Breath") {
                const damage_choices = {}
                for (let dmgtype of ["Acid", "Cold", "Fire", "Lightning", "Poison"]) {
                    let idx = damage_types.findIndex(t => t === dmgtype);
                    damage_choices[damage_types.splice(idx, 1)[0]] = damages.splice(idx, 1)[0];
                }

                const dragons_breath_type = await this.queryDamageType(request.name, damage_choices);
                damages.splice(0, 0, damage_choices[dragons_breath_type]);
                damage_types.splice(0, 0, dragons_breath_type);
            } else if (request.name.includes("Chaos Bolt")) {
                let base_damage = null;
                let crit_damage = null;
                for (let dmgtype of ["Acid", "Cold", "Fire", "Force", "Lightning", "Poison", "Psychic", "Thunder"]) {
                    let idx = damage_types.findIndex(t => t === dmgtype);
                    base_damage = damages.splice(idx, 1)[0];
                    damage_types.splice(idx, 1);
                    idx = critical_damage_types.findIndex(t => t === dmgtype);
                    crit_damage = critical_damages.splice(idx, 1)[0];
                    critical_damage_types.splice(idx, 1);
                }
                damages.splice(0, 0, base_damage);
                damage_types.splice(0, 0, "Chaotic energy");
                critical_damages.splice(0, 0, crit_damage);
                critical_damage_types.splice(0, 0, "Chaotic energy");
            } else if (request.name == "Toll the Dead") {
                const ttd_dice = await this.queryGeneric(request.name, "Is the target missing any of its hit points ?", { "d12": "Yes", "d8": "No" }, "ttd_dice", ["d12", "d8"]);
                damages[0] = damages[0].replace("d8", ttd_dice);
            }

            const has_versatile = damage_types.length > 1 && damage_types[1].includes("Two-Handed");
            for (let i = 0; i < (damages.length); i++) {
                const roll = this._roller.roll(damages[i]);
                all_rolls.push(roll);
                const dmg_type = damage_types[i];
                let damage_flags = DAMAGE_FLAGS.REGULAR;
                if (["Healing", "Temp HP", "Alchemical Savant Healing", "Enhanced Bond Healing"].includes(dmg_type)) {
                    damage_flags = DAMAGE_FLAGS.HEALING;
                } else if (i == 0) {
                    damage_flags = DAMAGE_FLAGS.REGULAR;
                } else if (i == 1 && has_versatile) {
                    damage_flags = DAMAGE_FLAGS.VERSATILE;
                } else {
                    damage_flags = DAMAGE_FLAGS.ADDITIONAL;
                }
                const suffix = !(damage_flags & DAMAGE_FLAGS.HEALING) ? " Damage" : "";
                damage_rolls.push([dmg_type + suffix, roll, damage_flags]);
                // Handle life transference;
                if (request.name == "Life Transference" && dmg_type == "Necrotic") {
                    damage_rolls.push(["Healing", "Twice the Necrotic damage", DAMAGE_FLAGS.HEALING]);
                }
            }
        

            await this._roller.resolveRolls(request.name, all_rolls)
            
            //Moved after the new resolveRolls so it can access the roll results
            if (request.name.includes("Chaos Bolt")) {
                for (let [i, dmg_roll] of damage_rolls.entries()) {
                    const [dmg_type, roll, flags] = dmg_roll;
                    if (dmg_type == "Chaotic energy Damage" && roll.dice[0].faces == 8) {
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
                            chaotic_type = await this.queryDamageType(request.name, damage_choices);
                        }
                        damage_rolls[i] = [chaotic_type + " Damage", roll, flags];
                        critical_damage_types[0] = chaotic_type;
                        break;
                    }
                }
            }

            // If rolling the attack, check for critical hit, otherwise, use argument.
            if (request.rollAttack) {
                if (to_hit.length > 0)
                    this.processToHitAdvantage(to_hit_advantage, to_hit)
                const critical_limit = request["critical-limit"] || 20;
                is_critical = this.isCriticalHitD20(to_hit, critical_limit);
            } else {
                is_critical = request.rollCritical;
            }
            if (is_critical) {
                const critical_damage_rolls = []
                for (let i = 0; i < (critical_damages.length); i++) {
                    const roll = this._roller.roll(critical_damages[i]);
                    critical_damage_rolls.push(roll);
                    const dmg_type = critical_damage_types[i];
                    let damage_flags = DAMAGE_FLAGS.REGULAR;
                    if (["Healing", "Temp HP", "Alchemical Savant Healing", "Enhanced Bond Healing"].includes(dmg_type)) {
                        damage_flags = DAMAGE_FLAGS.HEALING;
                    } else if (i == 0) {
                        damage_flags = DAMAGE_FLAGS.REGULAR;
                    } else if (i == 1 && has_versatile) {
                        damage_flags = DAMAGE_FLAGS.VERSATILE;
                    } else {
                        damage_flags = DAMAGE_FLAGS.ADDITIONAL;
                    }
                    const suffix = !(damage_flags & DAMAGE_FLAGS.HEALING) ? " Critical Damage" : "";
                    damage_rolls.push([dmg_type + suffix, roll, damage_flags | DAMAGE_FLAGS.CRITICAL]);
                }
                await this._roller.resolveRolls(request.name, critical_damage_rolls);
            }
        } else {
            // If no damages, still need to resolve to hit rolls
            
            await this._roller.resolveRolls(request.name, all_rolls)
            if (to_hit.length > 0)
                this.processToHitAdvantage(to_hit_advantage, to_hit)
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
        const character = (request.whisper !== WhisperType.NO) ? "???" : request.character.name;
        this._displayer.postHTML(request, request.name, `<img src='${request.character.avatar}' width='100%'>`, {}, character, false, false);
        this.displayAvatarToDiscord(request);
    }
    displayAvatarToDiscord(request) {
        const discordChannel = getDiscordChannel(this._settings, request.character);
        postToDiscord(discordChannel ? discordChannel.secret : "", request, request.name, "", {}, "", [], [], [], [], false).then((error) => {
            if (error)
                this._displayer.displayError("Beyond20 Discord Integration: " + error);
        });
    }

    async rollRollTable(request, name, formula, data) {
        const table = new RollTable(name, formula, data);
        const roll = this.createRoll(formula);
        await this._roller.resolveRolls(name, [roll]);
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


alertify.defaults.transition = "zoom";
if (alertify.Beyond20Prompt === undefined) {
    const factory = function () {
        return {
            "settings": {
                "content": undefined,
                "ok_label": undefined,
                "cancel_label": undefined,
                "resolver": undefined,
            },
            "main": function (title, content, ok_label, cancel_label, resolver) {
                this.set('title', title);
                this.set('content', content);
                this.set('resolver', resolver);
                this.set('ok_label', ok_label);
                this.set("cancel_label", cancel_label);
            },
            "setup": () => {
                return {
                    "buttons": [
                        {
                            "text": alertify.defaults.glossary.ok,
                            "key": 13, //keys.ENTER;
                            "className": alertify.defaults.theme.ok,
                        },
                        {
                            "text": alertify.defaults.glossary.cancel,
                            "key": 27, //keys.ESC;
                            "invokeOnClose": true,
                            "className": alertify.defaults.theme.cancel,
                        }
                    ],
                    "focus": {
                        "element": 0,
                        "select": true
                    },
                    "options": {
                        "maximizable": false,
                        "resizable": false
                    }
                }
            },
            "build": () => { },
            "prepare": function () {
                this.elements.content.innerHTML = this.get('content');
                this.__internal.buttons[0].element.innerHTML = this.get('ok_label');
                this.__internal.buttons[1].element.innerHTML = this.get('cancel_label');
            },
            "callback": function (closeEvent) {
                if (closeEvent.index == 0) {
                    this.get('resolver').call(this, $(this.elements.content.firstElementChild));
                } else {
                    this.get('resolver').call(this, null);
                }
            }
        }
    }
    alertify.dialog('Beyond20Prompt', factory, false, "prompt");
}


if (alertify.Beyond20Roll === undefined)
    alertify.dialog('Beyond20Roll', function () { return {}; }, false, "alert");
