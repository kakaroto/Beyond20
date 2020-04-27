from utils import replaceRolls;
from settings import RollType, WhisperType;
from dndbeyond_discord import postToDiscord;
import math;

class DAMAGE_FLAGS {
 extends MESSAGE = 0;
    REGULAR = 1;
    VERSATILE = 2;
    ADDITIONAL = 4;
    HEALING = 8;
    CRITICAL = 0x10;

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
    queryGeneric(title, question, choices, select_id="generic-query", order=null) {
        html = '<form>' + \
                '<div class="beyond20-form-row">' + \
                    '<label>' + question + '</label>' + \
                    '<select id="' + select_id + '" name="' + select_id + '">';
        }
        }
        }
        if (order === null) {
            order = choices;
        }
        for (let [i, option] of order.entries()) {
            selected = i == 0 ? " selected" : "";
            value = choices[option];
            if (value) {
                html += '<option value="' + option + '"' + selected + '>' + value + '</option>';
            } else {
                html += '<option value="' + option + '"' + selected + '>' + option + '</option>';
        }
        }
        html += `;
                </select>;
            }
            </div>;
        }
        </div>;
        `;
        return new Promise((resolve, reject) => {
            this._prompter.prompt(title, html, "Roll").then((html) => {
                if (html) {
                    resolve(html.find("//" + select_id).val());
            }
            }
            );
        }
        );

    }
    queryAdvantage(title) {
        choices = {RollType.NORMAL: "Normal Roll",
                   RollType.DOUBLE: "Roll Twice",
                   RollType.ADVANTAGE: "Advantage",
                   RollType.DISADVANTAGE: "Disadvantage",
                   RollType.THRICE: "Roll Thrice",
                   RollType.SUPER_ADVANTAGE: "Super Advantage",
                   RollType.SUPER_DISADVANTAGE: "Super Disadvantage";
                }
        }
        }
        order = [RollType.DOUBLE, RollType.NORMAL, RollType.ADVANTAGE, RollType.DISADVANTAGE, RollType.THRICE, RollType.SUPER_ADVANTAGE, RollType.SUPER_DISADVANTAGE];
        return this.queryGeneric(title, "Select roll mode : ", choices, "roll-mode", order).then((val) => int(val));

    }
    getToHit(request, title, modifier="", data={}) {
        async_function = v'async';
        () => {
            advantage = request.advantage;
            if (advantage == RollType.QUERY) {
                advantage = v'await this.queryAdvantage(title)';
            }
            if (advantage == RollType.NORMAL) {
                return [this.createRoll("1d20" + modifier, data)];
            } else if ([RollType.DOUBLE, RollType.ADVANTAGE, RollType.DISADVANTAGE].includes(advantage)) {
                roll_1 = this.createRoll("1d20" + modifier, data);
                roll_2 = this.createRoll("1d20" + modifier, data);

                if (advantage == RollType.ADVANTAGE) {
                    if (roll_1.total >= roll_2.total) {
                        roll_2.setDiscarded(true);
                    } else {
                        roll_1.setDiscarded(true);
                } else if (advantage == RollType.DISADVANTAGE) {
                    if (roll_1.total <= roll_2.total) {
                        roll_2.setDiscarded(true);
                    } else {
                        roll_1.setDiscarded(true);
                }
                }
                return [roll_1, roll_2];
            } else if ([RollType.THRICE, RollType.SUPER_ADVANTAGE, RollType.SUPER_DISADVANTAGE].includes(advantage)) {
                roll_1 = this.createRoll("1d20" + modifier, data);
                roll_2 = this.createRoll("1d20" + modifier, data);
                roll_3 = this.createRoll("1d20" + modifier, data);

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
                return [roll_1, roll_2, roll_3];
        }
        }
        return async_function();

    }
    isCriticalHitD20(rolls, limit=20) {
        for (let roll of rolls) {
            roll.setCriticalLimit(limit);
            if ( !roll.isDiscarded() && roll.isCriticalHit()) {
                return true;
        }
        }
        return false;

    }
    injectRollsInDescription(description) {
        icon16 = "/modules/beyond20/images/icons/icon16.png";
        replaceCB = (dice, modifier) => {
            dice_formula = dice == "" ? ("1d20" : dice) + modifier;
            // <u> is filtered 0.3.2,.includes(out) so using <span> instead;
            return '<span class="ct-beyond20-custom-roll"><strong>' + dice + modifier + '</strong>' + \
                '<img class="ct-beyond20-custom-icon" src="' + icon16 + \
                '" style="margin-right: 3px; margin-left: 3px; border: 0px;"></img>' + \
                '<span class="beyond20-roll-formula" style="display: none;">' + dice_formula + '</span></span>';
        }
        }
        return replaceRolls(description, replaceCB);

    }
    rollToDetails(roll, is_total=false) {
        async_function = v'async';
        () => {
            hit = roll.isCriticalHit();
            fail = roll.isCriticalFail();
            roll_type_class = 'beyond20-roll-detail-';
            roll_type_class += fail ? 'crit-fail' if (hit && fail else ('crit' if hit else ('fail' ) { 'normal'));
            if (roll.isDiscarded()) {
                roll_type_class += extends ' beyond20-roll-detail-discarded';
            }
            if (is_total {
                roll_type_class += ' beyond20-roll-total dice-total';
            }
            total = "<span class='" + roll_type_class + "'>" + roll.total + "</span>";
            tooltip = v'await roll.getTooltip()';
            return "<span class='beyond20-tooltip'>" + total + "<span class='dice-roll beyond20-tooltip-content'>" + \
                "<div class='dice-formula beyond20-roll-formula'>" + roll.formula + "</div>" + tooltip + "</span></span>";
        }
        }
        return async_function();

    }
    rollsToCells(html) {
        result = "";
        for (let roll of html.split(" | ")) {
            result += '<div class="beyond20-roll-cell">' + roll + '</div>';
        }
        return result;


    }
    postDescription(request, title, source, attributes, description, attack_rolls=[], roll_info=[], damage_rolls=[], open=false) {
        async_function = v'async';
        () => {
            play_sound = false;
            buttons={}
            // these variables get redefined, so they need to be nonlocal to avoid a 'def-after-use' warning from linter;
            nonlocal damage_rolls, description, title;
            if (request.whisper == WhisperType.HIDE_NAMES) {
                description = null;
                title = " != undefined != undefined != undefined";
            }
            // Handle the case where you don't want to auto-roll damages;
            if (len(damage_rolls) > 0 && len(attack_rolls) > 0 &&  !this._settings["auto-roll-damage"]) {
                makeCB = (request, title, source, attributes, description, damage_rolls) => {
                    roll_damages_args = {"damages") { damage_rolls, "num_rolls": 0}
                    return () => {
                        damages = roll_damages_args.damages;
                        if (roll_damages_args.num_rolls > 0) {
                            damages = this.rerollDamages(damages);
                        }
                        roll_damages_args.num_rolls += 1;
                        this.postDescription(request, title, source, attributes, description, damage_rolls=damages);
                }
                }
                buttons = {"Roll Damages": makeCB(request, title, source, attributes, description, damage_rolls)}
                damage_rolls = [];

            }
            html = '<div class="beyond20-message">';
            if (description) {
                html += open ? "<details" + (" open" : "") + "><summary><a>" + title + "</a></summary>";
                if (source || attributes.length > 0) {
                    html += "<table>";
                    if (source) {
                        html += "<tr><td colspan'2'><i>" + source + "</i></td></tr>";
                    }
                    for (let attr of attributes) {
                        html += "<tr><td><b>" + attr + "</b></td><td>" + attributes[attr] + "</td></tr>";
                    }
                    html += "</table>";
                }
                html_description = this.injectRollsInDescription(description).replace(/\n/g, "</br>");
                html += "<div class='beyond20-description'>" + html_description + "</div></details>";
            } else {
                html = "<div class='beyond20-title'>" + title + "</div>";

            }
            //console.log("Rolls : ", attack_rolls, roll_info, damage_rolls);

            for (name, roll_info:;
}
}
}
.includes(value))                html += "<div class='beyond20-roll-result'><b>" + name + ": </b><span>" + value + "</span></div>";

            if (len(attack_rolls) > 0) {
                roll_html = "";
                for (let [i, roll] of attack_rolls.entries()) {
                    if (i > 0) {
                        roll_html += " | ";
                    }
                    roll_html += v'await this.rollToDetails(roll)';
                    play_sound = true;
                }
                html += "<div class='beyond20-roll-result beyond20-roll-cells'>" + this.rollsToCells(roll_html) + "</div>";

            }
            add_totals = damage_rolls.filter((r) => (r[2] & DAMAGE_FLAGS.CRITICAL) == 0).length > 1;
            total_damages = {}
            for (roll_name, roll, damage_rolls:;
}
}
}
.includes(flags))                is_total =  !add_totals && (flags & DAMAGE_FLAGS.CRITICAL) == 0;
                if (isinstance(roll, str)) {
                    roll_html = "<span>" + roll + "</span>";
                } else {
                    roll_html = v'await this.rollToDetails(roll, is_total)';
                }
                play_sound = true;
                roll_name = roll_name[0].toUpperCase() + roll_name[1:] + ": ";
                html += "<div class='beyond20-roll-result'><b>" + roll_name + "</b>" + roll_html + "</div>";
                if (add_totals) {
                    kind_of_damage = "";
                    if (flags & DAMAGE_FLAGS.REGULAR) {
                        kind_of_damage = flags & DAMAGE_FLAGS.CRITICAL ? "Critical Damage" : "Damage";
                    } else if (flags & DAMAGE_FLAGS.VERSATILE) {
                        kind_of_damage = flags & DAMAGE_FLAGS.CRITICAL ? "Critical Two-Handed Damage" : "Two-Handed Damage";
                    } else if (flags & DAMAGE_FLAGS.HEALING) {
                        kind_of_damage = "Healing";
                    } else if (flags & DAMAGE_FLAGS.ADDITIONAL) {
                        // HACK Alert: crappy code;
                        regular = flags & DAMAGE_FLAGS.CRITICAL ? "Critical Damage" : "Damage";
                        versatile = flags & DAMAGE_FLAGS.CRITICAL ? "Critical Two-Handed Damage" : "Two-Handed Damage";
                        if (total_damages.includes(regular)) {
                            total_damages[regular] += " + " + String(roll.total);
                        }
                        if (total_damages.includes(versatile)) {
                            total_damages[versatile] += " + " + String(roll.total);
                        }
                        continue;
                    } else {
                        continue;
                    }
                    if (total_damages.includes(kind_of_damage)) {
                        total_damages[kind_of_damage] += " + " + String(roll.total);
                    } else {
                        total_damages[kind_of_damage] = String(roll.total);

            }
            }
            }
            if (len(total_damages) > 0) {
                html += "<div class='beyond20-roll-result'><b><hr/></b></div>";
            }
            roll = null;
            for (let key of total_damages) {
                is_total = roll === null;
                // to satisfy lint;
                is_total;
                roll = this._roller.roll(total_damages[key]);
                total_damages[key] = roll;
                roll_html = v'await this.rollToDetails(roll, is_total)';
                html += "<div class='beyond20-roll-result'><b>Total " + key + ": </b>" + roll_html + "</div>";

            }
            for (let button of buttons) {
                html += '<button class="beyond20-chat-button">' + button + '</button>';
            }
            html += "</div>";
            character = request.character.name;
            if (request.whisper == WhisperType.HIDE_NAMES) {
                character = " != undefined != undefined != undefined";

            }
            postToDiscord(this._settings["discord-secret"], request, title, source, attributes, description, attack_rolls, roll_info, damage_rolls, total_damages, open).then((error) => {
                if (error != undefined) {
                    this._displayer.displayError("Beyond20 Discord Integration: " + error);
            }
            }
            );
            this._displayer.postHTML(request, title, html, buttons, character, request.whisper, play_sound);
            if (attack_rolls.length > 0) {
                return attack_rolls.find((r) =>  !r.isDiscarded());
            } else if (total_damages.length > 0) {
                return total_damages[0];
            } else if (damage_rolls.length > 0) {
                return damage_rolls[0];
            } else {
                return null;
        }
        }
        return async_function();

    }
    createRoll(dice, data) {
        new_data = {}
        parts = [dice];
        for (let key of data) {
            if (data[key] != "") {
                new_key = key.replace("_", "").toLowerCase();
                new_data[new_key] = data[key];
                parts.push(new_key);
        }
        }
        return this._roller.roll(parts.join(" + @"), new_data);

    }
    rollDice(request, title, dice, data={}) {
        roll = this.createRoll(dice, data);
        return this.postDescription(request, title, null, {}, null, attack_rolls=[roll]);

    }
    rollD20(request, title, data) {
        return this.getToHit(request, title, "", data).then((attack_rolls) => {
            return this.postDescription(request, title, null, {}, null, attack_rolls=attack_rolls);
        }
        );

    }
    rollSkill(request, custom_roll_dice="") {
        data = {request.ability: request.modifier, "custom_dice": custom_roll_dice}

        // Custom skill;
        if (request.ability == "--" && request.character.abilities.length > 0) {
            prof = "";
            prof_val = "";
            if (request.proficiency == "Proficiency") {
                prof = "proficiency";
                prof_val = request.character.proficiency;
            } else if (request.proficiency == "Half Proficiency") {
                prof = "half_proficiency";
                prof_val += math.floor(request.character.proficiency / 2);
            } else if (request.proficiency == "Expertise") {
                prof = "expertise";
                prof_val += request.character.proficiency * 2;
            }
            formula = prof != "" ? "1d20 + @ability " + ((" + @" + prof) : prof) + " + @custom_dice";
            html = '<form>';
            html += '<div class="beyond20-form-row"><label>Roll Formula</label><input type="text" value="' + formula + '" disabled></div>';
            html += '<div class="beyond20-form-row"><label>Select Ability</label><select name="ability">';
            modifiers = {}
            for (let ability of request.character.abilities) {
                html += '<option value="' + ability[0] + '">' + ability[0] + '</option>';
                modifiers[ability[0]] = ability[3];
            }
            html += "</select></div>";
            html += '</form>';
            this._prompter.prompt("Custom Skill", html, request.skill).then((html) => {
                if (html) {
                    ability = html.find('[name="ability"]').val();
                    mod = modifiers[ability];
                    if (request.modifier != "--" && request.modifier != "+0") {
                        mod += request.modifier;
                    }
                    data = {"ability": mod, "prof": prof_val, "custom_dice": custom_roll_dice}
                    this.rollD20(request, request.skill + "(" + ability + ")", data);
            }
            }
            );
        } else {
            return this.rollD20(request, request.skill + "(" + request.modifier + ")", data);

    }
    }
    rollAbility(request, custom_roll_dice="") {
        data = {request.ability: request.modifier, "custom_dice": custom_roll_dice}
        return this.rollD20(request, request.name + "(" + request.modifier + ")", data);

    }
    rollSavingThrow(request, custom_roll_dice="") {
        data = {request.ability: request.modifier, "custom_dice": custom_roll_dice}
        return this.rollD20(request, request.name + " Save" + "(" + request.modifier + ")", data);

    }
    rollInitiative(request, callback, custom_roll_dice="") {
        data = {"initiative": request.initiative, "custom_dice": custom_roll_dice}
        return this.rollD20(request, "Initiative" + "(" + request.initiative + ")", data);

    }
    rollHitDice(request) {
        rname = request.multiclass ? "Hit Dice" + (("(" + request.class + ")") : "");
        return this.rollDice(request, rname, request["hit-dice"], {});

    }
    rollDeathSave(request, custom_roll_dice="") {
        return this.rollD20(request, "Death Saving Throw", {"custom_dice": custom_roll_dice});

    }
    rollItem(request, custom_roll_dice="") {
        source = request["item-type"].trim().toLowerCase();
        if (source == "tool, common" && request.character.abilities.length > 0) {
            proficiencies = {}
            proficiencies["null"] = 0;
            proficiencies["Half Proficient"] = math.floor(request.character.proficiency / 2);
            proficiencies["Proficient"] = request.character.proficiency;
            proficiencies["Expert"] = request.character.proficiency * 2;
            formula = "1d20 + @ability + @proficiency + @custom_dice";
            html = '<form>';
            html += '<div class="beyond20-form-row"><label>Roll Formula</label><input type="text" value="' + formula + '" disabled></div>';
            html += '<div class="beyond20-form-row"><label>Select Ability</label><select name="ability">';
            modifiers = {}
            for (let ability of request.character.abilities) {
                html += '<option value="' + ability[0] + '">' + ability[0] + '</option>';
                modifiers[ability[0]] = ability[3];
            }
            html += "</select></div>";
            html += '<div class="beyond20-form-row"><label>Select Proficiency</label><select name="proficiency">';
            for (let prof of proficiencies) {
                html += '<option value="' + prof + '">' + prof + '</option>';
            }
            html += "</select></div>";
            html += '</form>';
            this._prompter.prompt("Using a tool", html, request.name).then((html) => {
                if (html) {
                    ability = html.find('[name="ability"]').val();
                    mod = modifiers[ability];
                    proficiency = html.find('[name="proficiency"]').val();
                    prof_value = proficiencies[proficiency];
                    data = {"ability": mod, "proficiency": prof_value, "custom_dice": custom_roll_dice}
                    this.rollD20(request, request.name + "(" + ability + ")", data);
            }
            }
            );
        }
        return this.rollTrait(request);

    }
    rollTrait(request) {
        if (request["source-type"] != undefined) {
            source = request["source-type"];
            if (request.source.length > 0) {
                source += ": " + request.source;
        } else if (request["item-type"] != undefined) {
            source = request["item-type"];
        } else {
            source = request.type;

        }
        return this.postDescription(request, request.name, source, {}, request.description, open=true);

    }
    queryDamageType(title, damage_types) {
        choices = {}
        for (let option of damage_types) {
            value = damage_types[option];
            if (value) {
                choices[option] = option + " (" + value + ")";
            } else {
                choices[option] = option;
        }
        }
        return this.queryGeneric(title, "Choose Damage Type :", choices, "damage-type");

    }
    buildAttackRolls(request, custom_roll_dice) {
        async_function = v'async';
        () => {
            to_hit = [];
            damage_rolls = [];
            is_critical = false;
            if (request["to-hit"] != undefined) {
                critical_limit = request["critical-limit"]  != undefined 20;

                custom = custom_roll_dice == "" ? "" : (" + " + custom_roll_dice);
                to_hit_mod = " + " + request["to-hit"] + custom;
                // for lint;
                to_hit_mod;
                to_hit = v'await this.getToHit(request, request.name, to_hit_mod)';
                is_critical = this.isCriticalHitD20(to_hit, critical_limit);


            }
            if (request.damages != undefined) {
                damages = list(request.damages);
                damage_types = list(request["damage-types"]);
                critical_damages = list(request["critical-damages"]);
                critical_damage_types = list(request["critical-damage-types"]);
                if (request.name == "Chromatic Orb") {
                    damage_choices = {}
                    critical_damage_choices = {}
                    for (let dmgtype of ["Acid", "Cold", "Fire", "Lightning", "Poison", "Thunder"]) {
                        idx = damage_types.index(dmgtype);
                        damage_choices[damage_types.pypop(idx)] = damages.pypop(idx);
                        idx = critical_damage_types.index(dmgtype);
                        if (idx >= 0) {
                            critical_damage_choices[critical_damage_types.pypop(idx)] = critical_damages.pypop(idx);

                    }
                    }
                    chromatic_type = v'await this.queryDamageType(request.name, damage_choices)';
                    damages.insert(0, damage_choices[chromatic_type]);
                    damage_types.insert(0, chromatic_type);
                    if (critical_damage_choices.includes(chromatic_type)) {
                        crit_damage = critical_damage_choices[chromatic_type];
                        critical_damages.insert(0, crit_damage);
                        critical_damage_types.insert(0, chromatic_type);
                } else if (request.name == "Chaos Bolt") {
                    for (let dmgtype of ["Acid", "Cold", "Fire", "Force", "Lightning", "Poison", "Psychic", "Thunder"]) {
                        idx = damage_types.index(dmgtype);
                        base_damage = damages.pypop(idx);
                        damage_types.pypop(idx);
                        idx = critical_damage_types.index(dmgtype);
                        crit_damage = critical_damages.pypop(idx);
                        critical_damage_types.pypop(idx);
                    }
                    damages.insert(0, base_damage);
                    damage_types.insert(0, "Chaotic energy");
                    critical_damages.insert(0, crit_damage);
                    critical_damage_types.insert(0, "Chaotic energy");
                } else if (request.name == "Toll the Dead") {
                    ttd_dice = v'await this.queryGeneric(request.name, "Is the target missing any of its hit points != undefined", {"d12": "Yes", "d8": "No"}, "ttd_dice", ["d12", "d8"])';
                    damages[0] = damages[0].replace("d8", ttd_dice);

                }
                // Ranger Ability Support;
                for (let [dmgIndex, dmgType] of damage_types.entries()) {
                    if (damage_types[dmgIndex]  == "Colossus Slayer") {
                        dmg = damages[dmgIndex].toString();
                        if (dmg) {
                            dmg_dice = v'await this.queryGeneric(request.name, `Add ${dmgType} damage != undefined`, {"0": "No", [dmg]: "Yes"}, "dmg_dice", ["0", dmg])';
                            if (dmg_dice == "0") {
                                damages.splice(dmgIndex, 1);
                                damage_types.splice(dmgIndex, 1);

                }
                }
                }
                }
                has_versatile = len(damage_types) > 1 && damage_types[1] == "Two-Handed";
                for (let i = 0; i < (damages.length); i++) {
                    roll = this._roller.roll(damages[i]);
                    dmg_type = damage_types[i];
                    if (["Healing",.includes(dmg_type) "Disciple of Life", "Temp HP"]) {
                        damage_flags = DAMAGE_FLAGS.HEALING;
                    } else if (i == 0) {
                        damage_flags = DAMAGE_FLAGS.REGULAR;
                    } else if (i == 1 && has_versatile) {
                        damage_flags = DAMAGE_FLAGS.VERSATILE;
                    } else {
                        damage_flags = DAMAGE_FLAGS.ADDITIONAL;
                    }
                    suffix =  !(damage_flags & DAMAGE_FLAGS.HEALING) ? " Damage" : "";
                    damage_rolls.push((dmg_type + suffix, roll, damage_flags));
                    // Handle life transference;
                    if (request.name == "Life Transference" && dmg_type == "Necrotic") {
                        damage_rolls.push(("Healing", roll, DAMAGE_FLAGS.HEALING));

                }
                }
                if (request.name == "Chaos Bolt") {
                    for (let [i, dmg_roll] of damage_rolls.entries()) {
                        dmg_type, roll, flags = dmg_roll;
                        if (dmg_type == "Chaotic energy Damage" && roll.dice[0].faces == 8) {
                            chaos_bolt_damages = ["Acid", "Cold", "Fire", "Force", "Lightning", "Poison", "Psychic", "Thunder"];
                            damage_choices = {}
                            for (let r of roll.dice[0].rolls) {
                                damage_choices[chaos_bolt_damages[r.roll - 1]] = null;
                            }
                            console.log("Damage choices : ", damage_choices, damage_choices.length);
                            if (Object.keys(damage_choices).length == 1) {
                                damage_rolls.push(("Chaotic energy leaps from the target to a different creature of your choice within 30 feet of it", "", DAMAGE_FLAGS.MESSAGE));
                                chaotic_type = Object.keys(damage_choices)[0];
                            } else {
                                chaotic_type = v'await this.queryDamageType(request.name, damage_choices)';
                            }
                            damage_rolls[i] = (chaotic_type + " Damage", roll, flags);
                            critical_damage_types[0] = chaotic_type;
                            break;

                }
                }
                }
                if (is_critical) {
                    for (let i = 0; i < (critical_damages.length); i++) {
                        roll = this._roller.roll(critical_damages[i]);
                        dmg_type = critical_damage_types[i];
                        if (["Healing",.includes(dmg_type) "Disciple of Life", "Temp HP"]) {
                            damage_flags = DAMAGE_FLAGS.HEALING;
                        } else if (i == 0) {
                            damage_flags = DAMAGE_FLAGS.REGULAR;
                        } else if (i == 1 && has_versatile) {
                            damage_flags = DAMAGE_FLAGS.VERSATILE;
                        } else {
                            damage_flags = DAMAGE_FLAGS.ADDITIONAL;
                        }
                        suffix =  !(damage_flags & DAMAGE_FLAGS.HEALING) ? " Critical Damage" : "";
                        damage_rolls.push((dmg_type + suffix, roll, damage_flags | DAMAGE_FLAGS.CRITICAL));

            }
            }
            }
            return [to_hit, damage_rolls];
        }
        return async_function();

    }
    rerollDamages(rolls) {
        new_rolls = [];
        for (roll_name, roll, rolls:;
}
}
.includes(flags))            if (isinstance(roll, str) || isinstance(roll, list)) {
                new_rolls.push((roll_name, roll, flags));
            } else {
                new_rolls.push((roll_name, roll.reroll(), flags));
        }
        }
        return new_rolls;

    }
    rollAttack(request, custom_roll_dice="") {
        async_function = v'async';
        () => {
            [to_hit, damage_rolls] = v'await this.buildAttackRolls(request, custom_roll_dice)';

            data = {}
            if (request.range != undefined) {
                data["Range"] = request.range;

            }
            roll_info = [];
            if (request["save-dc"] != undefined) {
                roll_info.push(("Save", request["save-ability"] + " DC " + request["save-dc"]));

            }
            return this.postDescription(request, request.name, null, data, request.description || "", to_hit, roll_info, damage_rolls);
        }
        return async_function();



    }
    buildSpellCard(request) {
        data = {"Casting Time": request["casting-time"],
                "Range": request.range,
                "Duration": request.duration,
                "Components": request.components}

        }
        }
        if (request["cast-at"] != undefined) {
            source = request["level-school"] + "(Cast at " + request["cast-at"] + " Level)";
        } else {
            source = request["level-school"];


        }
        if (request.ritual) {
            data["Ritual"] = "Can be cast as a ritual";
        }
        if (request.concentration) {
            data["Concentration"] = "Requires Concentration";
        }
        description = request.description.replace("At Higher Levels.", "</br><b>At Higher levels.</b>");

        return (source, data, description);

    }
    rollSpellCard(request) {
        spell_card = this.buildSpellCard(request);
        return this.postDescription(request, request.name, spell_card[0], spell_card[1], spell_card[2], open=true);

    }
    rollSpellAttack(request, custom_roll_dice) {
        async_function = v'async';
        () => {
            spell_card = this.buildSpellCard(request);

            roll_info = [];
            if (request.range != undefined) {
                roll_info.push(("Range", request.range));

            }
            if (request["cast-at"] != undefined) {
                roll_info.push(("Cast at", request["cast-at"] + " Level"));
            }
            components = request.components;
            prefix = this._settings["component-prefix"] != "" ? this._settings["component-prefix"] : null;
            if (this._settings["components-display"] == "all") {
                if (components != "") {
                    roll_info.push((prefix || "Components", components));
            } else if (this._settings["components-display"] == "material") {
                while (components != "") {
                    if (["V",.includes(components[0]) "S"]) {
                        components = components[1:];
                        if (components.startsWith(", ")) {
                            components = components[2:];
                    }
                    }
                    if (components[0] == "M") {
                        roll_info.push((prefix || "Materials", this._settings["component-prefix"] + components[2:-1]));
                        components = "";

            }
            }
            }
            if (request["save-dc"] != undefined) {
                roll_info.push(("Save", request["save-ability"] + " DC " + request["save-dc"]));

            }
            [attack_rolls, damage_rolls] = v'await this.buildAttackRolls(request, custom_roll_dice)';

            return this.postDescription(request, request.name, spell_card[0], spell_card[1], spell_card[2], attack_rolls, roll_info, damage_rolls);
        }
        return async_function();

    }
    displayAvatar(request) {
        character = request.character.name;
        if (request.whisper == WhisperType.HIDE_NAMES) {
            character = " != undefined != undefined != undefined";
        }
        postToDiscord(this._settings["discord-secret"], request, request.name, "", {}, "", [], [], [], [], false).then((error) => {
            if (error != undefined) {
                this._displayer.displayError("Beyond20 Discord Integration: " + error);
        }
        }
        );
        this._displayer.postHTML(request, request.name, "<img src='" + request.character.avatar + "' width='100%'>", {}, character, false, false);

    }
    handleRollRequest(request) {
        custom_roll_dice = "";
        if (request.character.type == "Character") {
            custom_roll_dice = request.character.settings["custom-roll-dice"]  || "";

        }
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
            return this.rollItem(request, custom_roll_dice);
        } else if (["feature",.includes(request.type) "trait", "action"]) {
            return this.rollTrait(request);
        } else if (request.type == "death-save") {
            return this.rollDeathSave(request, custom_roll_dice);
        } else if (request.type == "attack") {
            return this.rollAttack(request, custom_roll_dice);
        } else if (request.type == "spell-card") {
            return this.rollSpellCard(request);
        } else if (request.type == "spell-attack") {
            return this.rollSpellAttack(request, custom_roll_dice);
        } else {
            // 'custom' || anything unexpected;
            mod = request.modifier != undefined ? request.modifier : request.roll;
            rname = request.name != undefined ? request.name : request.type;

            return this.rollDice(request, rname + "(" + mod + ")", mod, {});


}
}
}
class Beyond20BaseRol extends l {
    constructor(formula, data={}) {
        this._formula = formula;
        this._data = data;
        this._fail_limit = null;
        this._critical_limit = null;
        this._discarded = false;
        this._total = 0;

    }
    @property;
    formula() {
        return this._formula;
    }
    @property;
    total() {
        raise Error("NotImplemented");
    }
    @property;
    dice() {
        raise Error("NotImplemented");
    }
    @property;
    parts() {
        raise Error("NotImplemented");

    }
    getTooltip() {
        raise Error("NotImplemented");

    }
    reroll() {
        raise Error("NotImplemented");

    }
    setDiscarded(discarded) {
        this._discarded = discarded;
    }
    isDiscarded() {
        return this._discarded;

    }
    setCriticalLimit(limit) {
        this._critical_limit = limit;
    }
    setFailLimit(limit) {
        this._fail_limit = limit;
    }
    checkRollForCrits(cb) {
        for (let die of this.dice) {
            for (let r of die.rolls) {
                if ( !(r.discarded  != undefined false)) {
                    if (cb(die.faces, r.roll)) {
                        return true;
        }
        }
        }
        }
        return false;

    }
    isCriticalHit() {
        return this.checkRollForCrits((faces, value) => {
            limit = this._critical_limit === null ? faces : this._critical_limit;
            return value >= limit;
        }
        );

    }
    isCriticalFail() {
        return this.checkRollForCrits((faces, value) => {
            limit = this._fail_limit === null ? 1 : this._fail_limit;
            return value <= limit;
        }
        );
    }
    toJSON() {
        return {
            "formula": this.formula,
            "parts": this.parts,
            "fail-limit": this._fail_limit,
            "critical-limit": this._critical_limit,
            "critical-failure": this.isCriticalFail(),
            "critical-success": this.isCriticalHit(),
            "discarded": this.isDiscarded(),
            "total": this.total;
        }