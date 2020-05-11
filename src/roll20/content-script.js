console.log("Beyond20: Roll20 module loaded.");

const ROLL20_WHISPER_QUERY = "?{Whisper?|Public Roll,|Whisper Roll,/w gm }"
const ROLL20_ADVANTAGE_QUERY = "{{query=1}} ?{Advantage?|Normal Roll,&#123&#123normal=1&#125&#125|Advantage,&#123&#123advantage=1&#125&#125 &#123&#123r2={r2}&#125&#125|Disadvantage,&#123&#123disadvantage=1&#125&#125 &#123&#123r2={r2}&#125&#125|Super Advantage,&#123&#123advantage=1&#125&#125 &#123&#123r2={r2kh}&#125&#125|Super Disadvantage,&#123&#123disadvantage=1&#125&#125 &#123&#123r2={r2kl}&#125&#125}"
const ROLL20_INITIATIVE_ADVANTAGE_QUERY = "?{Roll Initiative with advantage?|Normal Roll,1d20|Advantage,2d20kh1|Disadvantage,2d20kl1|Super Advantage,3d20kh1|Super Disadvantage,3d20kl1}"
const ROLL20_TOLL_THE_DEAD_QUERY = "?{Is the target missing any of its hit points?|Yes,d12|No,d8}"
const ROLL20_ADD_GENERIC_DAMAGE_DMG_QUERY = "?{Add %dmgType% damage?|No,0|Yes,%dmg%}"


const chat = document.getElementById("textchat-input");
const txt = chat.getElementsByTagName("textarea")[0];
const btn = chat.getElementsByTagName("button")[0];
const speakingas = document.getElementById("speakingas");
var settings = getDefaultSettings();

function postChatMessage(message, character = null) {
    let set_speakingas = true;
    const old_as = speakingas.value;
    if (character) {
        character = character.toLowerCase();
        for (let i = 0; i < (speakingas.children.length); i++) {
            if (speakingas.children[i].text.toLowerCase() === character) {
                speakingas.children[i].selected = true;
                set_speakingas = false;
                break;
            }
        }
    }
    if (set_speakingas)
        speakingas.children[0].selected = true;
    const old_text = txt.value;
    txt.value = message;
    btn.click();
    txt.value = old_text;
    speakingas.value = old_as;
}

function escapeRoll20Macro(text) {
    const regexp = new RegExp("\n[]{}()%@&?".split("").join("|\\"), "gm");
    return text.replace(regexp, (...match) => {
        let o = match[0].charCodeAt(0);
        if (o == 10)
            o = 13;
        return "&#" + String(o) + ";";
    });
}

function genRoll(dice, modifiers = {}) {
    let roll = "[[" + dice;
    for (let m in modifiers) {
        const mod = modifiers[m];
        if (mod.length > 0) {
            if (mod[0] == '+' || mod[0] == '-' || mod[0] == '?' || mod[0] == '&') {
                roll += " " + mod;
            } else {
                roll += "+" + mod;
            }
            if (m.length > 0)
                roll += "[" + m + "]";
        }
    }
    roll += "]]";
    return roll;
}

function subRolls(text, damage_only = false, overrideCB = null) {
    let replaceCB = overrideCB;
    if (!overrideCB) {
        replaceCB = (dice, modifier) => {
            if (damage_only && dice == "")
                return dice + modifier;
            const dice_formula = (dice === "" ? "1d20" : dice) + modifier;
            return genRoll(dice_formula);
        }
    }

    return replaceRolls(text, replaceCB);
}

function subDescriptionRolls(request, description) {
    if (!settings["subst-vtt"])
        return description;
    const replaceCB = (dice, modifier) => {
        const roll = (dice == "" ? "1d20" : dice) + modifier;
        const roll_template = template(request, "simple",
            {
                "charname": request.character.name,
                "rname": request.name,
                "mod": dice + modifier,
                "r1": genRoll(roll),
                "normal": 1
            });
        return "[" + dice + modifier + "](!\n" + escapeRoll20Macro(roll_template) + ")";
    }
    return subRolls(description, false, replaceCB);
}

function subDamageRolls(text) {
    return subRolls(text, true);
}

function damagesToRollProperties(damages, damage_types, crits, crit_types) {
    const properties = {
        "damage": 1,
        "dmg1flag": 1
    }

    properties["dmg1"] = subDamageRolls(damages[0]);
    properties["dmg1type"] = damage_types[0];
    if (crits && crits.length > 0)
        properties["crit1"] = settings["crit-prefix"] + subDamageRolls(crits[0]);

    if (damages.length > 1) {
        properties["dmg2flag"] = 1;
        properties["dmg2"] = subDamageRolls(damages.slice(1).join(" | "));
        properties["dmg2type"] = damage_types.slice(1).join(" | ");
        if (crits && crits.length > 1)
            properties["crit2"] = settings["crit-prefix"] + subDamageRolls(crits.slice(1).join(" | "));
    } else if (crits != undefined && crits.length > 1) {
        // If there are more than 1 crit but only 1 damage (brutal critical/savage attacks), then show all the crits as part of the first damage;
        properties["crit1"] = settings["crit-prefix"] + subDamageRolls(crits.join(" | "));
    }

    return properties;
}

function advantageString(advantage, r1) {
    try {
        const format = (str, args) => {
            for (const [key, value] of Object.entries(args))
                str = str.replace(new RegExp(`{${key}}`, "g"), value)
            return str;
        }
        return {
            [RollType.NORMAL]: " {{normal=1}}",
            [RollType.DOUBLE]: " {{always=1}} {{r2=" + r1 + "}}",
            [RollType.THRICE]: " {{always=1}} {{r2=" + r1 + "}} {{r3=" + r1 + "}}",
            [RollType.QUERY]: format(ROLL20_ADVANTAGE_QUERY, { r2: r1, r2kh: r1.replace("1d20", "2d20kh1"), r2kl: r1.replace("1d20", "2d20kl1") }),
            [RollType.ADVANTAGE]: " {{advantage=1}} {{r2=" + r1 + "}}",
            [RollType.DISADVANTAGE]: " {{disadvantage=1}} {{r2=" + r1 + "}}",
            [RollType.SUPER_ADVANTAGE]: " {{advantage=1}} {{r2=" + r1.replace("1d20", "2d20kh1") + "}}",
            [RollType.SUPER_DISADVANTAGE]: " {{disadvantage=1}} {{r2=" + r1.replace("1d20", "2d20kl1") + "}}",
        }[advantage];
    } catch (err) {
        return " {{normal=1}}";
    }
}

function whisperString(whisper) {
    try {
        return {
            [WhisperType.NO]: "",
            [WhisperType.HIDE_NAMES]: "",
            [WhisperType.YES]: "/w gm",
            [WhisperType.QUERY]: ROLL20_WHISPER_QUERY
        }[whisper];
    } catch (err) {
        return "";
    }
}

function template(request, name, properties) {
    let result = whisperString(request.whisper);

    const renameProp = (old_key, new_key) => {
        result = result.replace("{{" + old_key + "=", "{{" + new_key + "=");
    }
    const removeProp = (key) => {
        result = result.replace("{{" + key + "=" + (Object.keys(properties).includes(key) ? properties[key] : "1") + "}}", "");
        result = result.replace("&//123&//123" + key + "=" + (Object.keys(properties).includes(key) ? properties[key] : "1") + "&//125&//125", "");
    }

    result += " &{template:" + name + "}";
    for (let key in properties)
        result += " {{" + key + "=" + properties[key] + "}}";

    if (request.advantage && properties.normal === undefined && ["simple", "atk", "atkdmg"].includes(name))
        result += advantageString(request.advantage, properties["r1"]);

    if (request.whisper == WhisperType.HIDE_NAMES) {
        removeProp("charname");
        removeProp("rname");
        removeProp("rnamec");
        removeProp("description");
    }

    if (settings["roll20-template"] == "default") {
        result = result.replace("&{template:" + name + "}", "&{template:default}");

        renameProp("charname", "Character name");
        renameProp("rname", "name");
        if (result.includes("{{r2=") || result.includes("&//123&//123r2=")) {
            renameProp("r1", "Regular Roll");
            renameProp("r2", "Roll with [Dis]Advantage");
            renameProp("r3", "Roll with Super [Dis]Advantage");
            result = result.replace("&//123&//123r2=", "&//123&//123Roll with Advantage=");
            result = result.replace("&//123&//123r2=", "&//123&//123Roll with Disadvantage=");
            result = result.replace("&//123&//123r2=", "&//123&//123Roll with Super Advantage=");
            result = result.replace("&//123&//123r2=", "&//123&//123Roll with Super Disadvantage=");
        } else {
            renameProp("r1", "Dice Roll");
        }
        renameProp("mod", "Modifier");
        if (properties["dmg2"] !== undefined) {
            renameProp("dmg1", "First Damage");
            renameProp("dmg1type", "First Damage Type");
            renameProp("crit1", "First Crit Damage IF Critical");
            renameProp("dmg2", "Second Damage");
            renameProp("dmg2type", "Second Damage Type");
            renameProp("crit2", "Second Crit Damage IF Critical");
        }
        if (properties["dmg1"] !== undefined) {
            renameProp("dmg1", "Damage");
            renameProp("dmg1type", "Damage Type");
            renameProp("crit1", "Crit Damage IF Critical");
        }
        renameProp("saveattr", "Save Ability");
        renameProp("savedc", "Save DC");
        renameProp("athigherlevels", "At Higher Levels");
        renameProp("castingtime", "Casting Time");
        renameProp("hldmg", "Higher level cast");

        removeProp("attack");
        removeProp("attack");
        removeProp("damage");
        removeProp("save");
        removeProp("dmg1flag");
        removeProp("dmg2flag");
        removeProp("always");
        removeProp("normal");
        removeProp("advantage");
        removeProp("disadvantage");
        removeProp("query");
    } else {
        properties["r3"] = properties["r1"];
        removeProp("r3");
        delete properties["r3"];
    }

    return result;
}

function createTable(request, name, properties) {
    let result = whisperString(request.whisper);

    result += ` &{template:default} {{name=${name}}}`;
    for (let key in properties)
        result += " {{" + key + "=" + properties[key] + "}}";
    return result;
}

function rollAvatarDisplay(request) {
    // Use query string to override url for image detection so the avatar link is always Roll20.includes(displayed) as an image;
    return "[x](" + request.character.avatar + "#.png)";
}

function rollSkill(request, custom_roll_dice = "") {
    let modifier = request.modifier;
    // Custom skill;
    if (request.ability === "--" && request.character.abilities.length > 0) {
        modifier = "?{Choose Ability";
        // [name, abbr, value, mod];
        let magic = "";
        if (request.modifier != "--" && request.modifier != "+0")
            magic = request.modifier;
        for (let ability of request.character.abilities)
            modifier += "|" + ability[0] + ", " + ability[3] + magic;
        modifier += "}";
        let prof = "";
        let prof_val = "";
        if (request.proficiency === "Proficiency") {
            prof = "PROF";
            prof_val += request.character.proficiency;
        } else if (request.proficiency === "Half Proficiency") {
            prof = "HALF-PROFICIENCY";
            prof_val += "+[[floor(" + request.character.proficiency + " / 2)]]";
        } else if (request.proficiency === "Expertise") {
            prof = "EXPERTISE";
            prof_val += "+[[" + request.character.proficiency + " * 2]]";
        }
        return template(request, "simple", {
            "charname": request.character.name,
            "rname": request.skill,
            "mod": "[[" + modifier + prof_val + "]]",
            "r1": genRoll("1d20", { "--": modifier, [prof]: prof_val, "CUSTOM": custom_roll_dice })
        });
    } else {
        return template(request, "simple", {
            "charname": request.character.name,
            "rname": request.skill,
            "mod": modifier,
            "r1": genRoll("1d20", { [request.ability]: modifier, "CUSTOM": custom_roll_dice })
        });
    }
}

function rollAbility(request, custom_roll_dice = "") {
    const dice_roll = genRoll("1d20", { [request.ability]: request.modifier, "CUSTOM": custom_roll_dice });
    return template(request, "simple", {
        "charname": request.character.name,
        "rname": request.name,
        "mod": request.modifier,
        "r1": dice_roll
    });
}

function rollSavingThrow(request, custom_roll_dice = "") {
    return template(request, "simple", {
        "charname": request.character.name,
        "rname": request.name + " Save",
        "mod": request.modifier,
        "r1": genRoll("1d20", { [request.ability]: request.modifier, "CUSTOM": custom_roll_dice })
    });
}

function rollInitiative(request, custom_roll_dice = "") {
    const roll_properties = {
        "charname": request.character.name,
        "rname": "Initiative",
        "mod": request.initiative
    }
    if (settings["initiative-tracker"]) {
        let dice = "1d20";
        if (request.advantage == RollType.ADVANTAGE)
            dice = "2d20kh1";
        else if (request.advantage == RollType.SUPER_ADVANTAGE)
            dice = "3d20kh1";
        else if (request.advantage == RollType.DISADVANTAGE)
            dice = "2d20kl1";
        else if (request.advantage == RollType.SUPER_DISADVANTAGE)
            dice = "3d20kl1";
        else if (request.advantage == RollType.DOUBLE || request.advantage == RollType.THRICE || request.advantage == RollType.QUERY)
            dice = ROLL20_INITIATIVE_ADVANTAGE_QUERY;
        roll_properties["r1"] = genRoll(dice, { "INIT": request.initiative, "CUSTOM": custom_roll_dice, "": "&{tracker}" });
        roll_properties["normal"] = 1;
    } else {
        roll_properties["r1"] = genRoll("1d20", { "INIT": request.initiative, "CUSTOM": custom_roll_dice });
    }
    return template(request, "simple", roll_properties);
}

function rollHitDice(request) {
    const rname = "Hit Dice" + (request.multiclass ? `(${request.class})` : "");
    return template(request, "simple", {
        "charname": request.character.name,
        "rname": rname,
        "mod": request["hit-dice"],
        "r1": subRolls(request["hit-dice"]),
        "normal": 1
    });
}

function rollDeathSave(request, custom_roll_dice = "") {
    return template(request, "simple", {
        "charname": request.character.name,
        "rname": "Death Saving Throw",
        "r1": genRoll("1d20", { "CUSTOM": custom_roll_dice }),
        "normal": 1
    });
}

function rollItem(request, custom_roll_dice = "") {
    const source = request["item-type"].trim().toLowerCase();
    if (source == "tool, common" && request.character.abilities && request.character.abilities.length > 0) {
        let modifier = "?{Choose Ability";
        // [name, abbr, value, mod];
        for (let ability of request.character.abilities)
            modifier += "|" + ability[0] + ", " + ability[3];
        modifier += "}";
        const proficiency = request.character.proficiency;
        const half_proficiency = "+[[floor(" + proficiency + " / 2)]]";
        const expertise = "+[[" + proficiency + " * 2]]";
        const prof = "?{Select Proficiency|null,+0|Half-Proficient," + half_proficiency + "|Profient," + proficiency + "|Expert," + expertise + "}";
        return rollTrait(request) + "\n" +
            template(request, "simple", {
                "charname": request.character.name,
                "rname": request.name,
                "mod": "[[" + modifier + prof + "]]",
                "r1": genRoll("1d20", { "ABILITY": modifier, "PROF": prof, "CUSTOM": custom_roll_dice })
            });
    } else {
        return rollTrait(request);
    }
}

function rollTrait(request) {
    let source = request.type;
    if (request["source-type"] !== undefined) {
        source = request["source-type"];
        if (request.source.length > 0)
            source += ": " + request.source;
    } else if (request["item-type"] !== undefined) {
        source = request["item-type"];
    }
    return template(request, "traits", {
        "charname": request.character.name,
        "name": request.name,
        "source": source,
        "description": subDescriptionRolls(request, request.description)
    });
}

function rollAttack(request, custom_roll_dice = "") {
    const properties = {
        "charname": request.character.name,
        "rname": request.name
    }
    let template_type = "atkdmg";
    let dmg_props = {}
    if (request["to-hit"] !== undefined) {
        let d20_roll = "1d20";
        if (request["critical-limit"])
            d20_roll = "1d20cs>" + request["critical-limit"];
        properties["mod"] = request["to-hit"];
        properties["r1"] = genRoll(d20_roll, { "": request["to-hit"], "CUSTOM": custom_roll_dice });
        properties["attack"] = 1;
    }
    if (request.damages !== undefined) {
        const damages = request.damages;
        const damage_types = request["damage-types"];
        const crit_damages = request["critical-damages"];
        const crit_damage_types = request["critical-damage-types"];

        // Ranger Ability Support;
        for (let [dmgIndex, dmgType] of damage_types.entries()) {
            if (damage_types[dmgIndex] == "Colossus Slayer")
                damages[dmgIndex] = ROLL20_ADD_GENERIC_DAMAGE_DMG_QUERY.replace(/%dmgType%/, damage_types[dmgIndex]).replace(/%dmg%/, damages[dmgIndex]);
        }

        dmg_props = damagesToRollProperties(damages, damage_types, crit_damages, crit_damage_types);
    }
    if (request.range !== undefined)
        properties["range"] = request.range;

    if (request["save-dc"] !== undefined) {
        dmg_props["save"] = 1;
        dmg_props["saveattr"] = request["save-ability"];
        dmg_props["savedc"] = request["save-dc"];
    }

    if (request.damages !== undefined && request["to-hit"] !== undefined && !settings["auto-roll-damage"]) {
        template_type = "atk";
        dmg_props["charname"] = request.character.name;
        dmg_props["rname"] = request.name;
        dmg_props["crit"] = 1;
        const dmg_template_crit = template(request, "dmg", dmg_props);
        delete dmg_props["crit"];
        delete dmg_props["crit1"];
        delete dmg_props["crit2"];
        dmg_template = template(request, "dmg", dmg_props);
        properties["rname"] = "[" + request.name + "](!\n" + escapeRoll20Macro(dmg_template) + ")";
        properties["rnamec"] = "[" + request.name + "](!\n" + escapeRoll20Macro(dmg_template_crit) + ")";
    } else {
        for (let key in dmg_props)
            properties[key] = dmg_props[key];
    }

    return template(request, template_type, properties);
}

function rollSpellCard(request) {
    const properties = {
        "charname": request.character.name,
        "name": request.name,
        "castingtime": request["casting-time"],
        "range": request.range,
        "duration": request.duration
    }

    if (request["cast-at"] !== undefined)
        properties["level"] = request["level-school"] + "(Cast at " + request["cast-at"] + " Level)";
    else
        properties["level"] = request["level-school"];

    let components = request.components;
    while (components != "") {
        if (components[0] == "V") {
            properties["v"] = 1;
            components = components.slice(1);
        } else if (components[0] == "S") {
            properties["s"] = 1;
            components = components.slice(1);
        } else if (components[0] == "M") {
            properties["m"] = 1;
            properties["material"] = components.slice(2, -1);
            components = "";
        }
        if (components.startsWith(", ")) {
            components = components.slice(2);
        }
    }
    if (request.ritual)
        properties["ritual"] = 1;
    if (request.concentration)
        properties["concentration"] = 1;
    const description = request.description;
    const higher = description.indexOf("At Higher Levels.");
    if (higher > 0) {
        properties["description"] = subDescriptionRolls(request, description.slice(0, higher - 1));
        properties["athigherlevels"] = subDescriptionRolls(request, description.slice(higher + "At Higher Levels.".length));
    } else {
        properties["description"] = subDescriptionRolls(request, description);
    }

    return template(request, "spell", properties);
}

function rollSpellAttack(request, custom_roll_dice) {
    const properties = {
        "charname": request.character.name,
        "rname": request.name
    }
    let template_type = "atkdmg";
    let dmg_props = {}
    if (request["to-hit"] !== undefined) {
        const d20_roll = "1d20";
        if (request["critical-limit"])
            d20_roll = "1d20cs>" + request["critical-limit"];
        properties["mod"] = request["to-hit"];
        properties["r1"] = genRoll(d20_roll, { "": request["to-hit"], "CUSTOM": custom_roll_dice });
        properties["attack"] = 1;
    }
    if (request.damages !== undefined) {
        const damages = request.damages;
        const damage_types = request["damage-types"];
        const critical_damages = request["critical-damages"];
        const critical_damage_types = request["critical-damage-types"];
        if (request.name === "Chromatic Orb") {
            let chromatic_type = "?{Choose damage type";
            let chromatic_damage = null;
            let crit_damage = null;
            for (let dmgtype of ["Acid", "Cold", "Fire", "Lightning", "Poison", "Thunder"]) {
                let idx = damage_types.findIndex(t => t === dmgtype);
                chromatic_damage = damages.splice(idx, 1)[0];
                damage_types.splice(idx, 1);
                idx = critical_damage_types.findIndex(t => t === dmgtype);
                if (idx >= 0) {
                    crit_damage = critical_damages.splice(idx, 1)[0];
                    critical_damage_types.splice(idx, 1)[0];
                }
                chromatic_type += "|" + dmgtype;
            }
            chromatic_type += "}";
            damages.splice(0, 0, chromatic_damage);
            damage_types.splice(0, 0, chromatic_type);
            critical_damages.splice(0, 0, crit_damage);
            critical_damage_types.splice(0, 0, chromatic_type);
        } else if (request.name === "Chaos Bolt") {
            let base_damage = null;
            let crit_damage = null;
            for (let dmgtype of ["Acid", "Cold", "Fire", "Force", "Lightning", "Poison", "Psychic", "Thunder"]) {
                let idx = damage_types.findIndex(t => t === dmgtype);
                base_damage = damages.splice(idx, 1)[0];
                damage_types.splice(idx, 1);
                idx = critical_damage_types.findIndex(t => t === dmgtype);
                crit_damage = critical_damages.splice(idx, 1)[0];
                critical_damage_types.splice(idx, 1)[0];
            }
            damages.splice(0, 0, base_damage);
            damage_types.splice(0, 0, "Chaotic energy");
            critical_damages.splice(0, 0, crit_damage);
            critical_damage_types.splice(0, 0, "Chaotic energy");
        } else if (request.name === "Life Transference") {
            damages.push("Equal to Necrotic damage");
            damage_types.push("Healing");
        } else if (request.name === "Toll the Dead") {
            damages[0] = ROLL20_TOLL_THE_DEAD_QUERY.replace("d8", damages[0]).replace("d12", damages[0].replace("d8", "d12"));
        }
        dmg_props = damagesToRollProperties(damages, damage_types, critical_damages, critical_damage_types);
    }
    if (request.range !== undefined)
        properties["range"] = request.range;
    if (request["save-dc"] != undefined) {
        dmg_props["save"] = 1;
        dmg_props["saveattr"] = request["save-ability"];
        dmg_props["savedc"] = request["save-dc"];
    }
    if (request["cast-at"] !== undefined)
        dmg_props["hldmg"] = genRoll(request["cast-at"][0]) + request["cast-at"].slice(1) + " Level";
    let components = request.components;
    if (settings["components-display"] === "all") {
        if (components != "") {
            properties["desc"] = settings["component-prefix"] + components;
            components = "";
        }
    } else if (settings["components-display"] === "material") {
        while (components != "") {
            if (["V", "S"].includes(components[0])) {
                components = components.slice(1);
                if (components.startsWith(", "))
                    components = components.slice(2);
            }
            if (components[0] == "M") {
                properties["desc"] = settings["component-prefix"] + components.slice(2, -1);
                components = "";
            }
        }
    }

    if (request.damages !== undefined && request["to-hit"] !== undefined && !settings["auto-roll-damage"]) {
        template_type = "atk";
        dmg_props["charname"] = request.character.name;
        dmg_props["rname"] = request.name;
        dmg_props["crit"] = 1;
        const dmg_template_crit = template(request, "dmg", dmg_props);
        delete dmg_props["crit"];
        delete dmg_props["crit1"];
        delete dmg_props["crit2"];
        const dmg_template = template(request, "dmg", dmg_props);
        properties["rname"] = "[" + request.name + "](!\n" + escapeRoll20Macro(dmg_template) + ")";
        properties["rnamec"] = "[" + request.name + "](!\n" + escapeRoll20Macro(dmg_template_crit) + ")";
    } else {
        for (let key in dmg_props)
            properties[key] = dmg_props[key];
    }

    roll = template(request, template_type, properties);
    return roll;
}

function convertRollToText(whisper, roll, standout=false) {
    const total = roll.total || 0;
    const prefix = (standout && !roll.discarded) ? '{' : '';
    const suffix = (standout && !roll.discarded) ? '}' : '';
    if (whisper === WhisperType.HIDE_NAMES) return `[[${total}]]`;
    const formula = roll.formula || "";
    const parts = roll.parts || [];
    let result = `${prefix}[[ ${total} [${formula}] = `;
    let plus = '';
    for (let part of parts) {
        if (part.rolls) {
            result += `${plus}(`
            let part_plus = '';
            for (let die of part.rolls) {
                result += die.discarded ? `~${part_plus}${die.roll}~` : `${part_plus}${die.roll}`;
                part_plus = ' + ';
            }
            result += ')';
        } else {
            if (['+', '-'].includes(String(part).trim())) {
                plus = ` ${part} `;
            } else {
                part = isNaN(part) ? part : Number(part);
                if (part < 0) {
                    part = -1 * part;
                    plus = ' - ';
                }
                result += `${plus}${part}`;
            }
        }
        plus = ' + ';
    }
    result += `]]${suffix}`;
    return result;
};

function injectSettingsButton() {
    const icon = chrome.extension.getURL("images/icons/icon32.png");
    let img = document.getElementById("beyond20-settings");
    if (img)
        img.remove();
    img = E.img({ id: "beyond20-settings", src: icon, style: "margin-left: 5px;" });
    btn.after(img);
    img.onclick = alertQuickSettings;
}


function updateSettings(new_settings = null) {
    if (new_settings) {
        settings = new_settings;
    } else {
        getStoredSettings((saved_settings) => {
            settings = saved_settings;
        });
    }
}

function handleMessage(request, sender, sendResponse) {
    console.log("Got message : ", request);
    if (request.action == "settings") {
        if (request.type == "general")
            updateSettings(request.settings);
    } else if (request.action == "open-options") {
        alertFullSettings();
    } else if (request.action == "hp-update") {
        if (settings["update-hp"])
            sendCustomEvent("UpdateHP", [request.character.name, request.character.hp, request.character["max-hp"], request.character["temp-hp"]]);
    } else if (request.action == "conditions-update") {
        if (settings["display-conditions"]) {
            const character_name = request.character.name;
            if (request.character.exhaustion == 0) {
                conditions = request.character.conditions;
            } else {
                conditions = request.character.conditions.concat([`Exhausted (Level ${request.character.exhaustion})`]);
            }

            // We can't use window.is_gm because it's  !available to the content script;
            const is_gm = $("#textchat .message.system").text().includes("The player link for this campaign is");
            const em_command = is_gm ? "/emas " : "/em ";
            let message = "";
            if (conditions.length == 0) {
                message = em_command + character_name + " has no active condition";
            } else {
                message = em_command + character_name + " is : " + conditions.join(", ");
            }
            postChatMessage(message, character_name);
        }
    } else if (request.action == "roll") {
        let custom_roll_dice = "";
        if (request.character.type == "Character") {
            custom_roll_dice = request.character.settings["custom-roll-dice"] || "";
            custom_roll_dice = custom_roll_dice.replace(/([0-9]*d[0-9]+)/, "$1cs>100cf<0");
        }
        if (request.type == "skill") {
            roll = rollSkill(request, custom_roll_dice);
        } else if (request.type == "ability") {
            roll = rollAbility(request, custom_roll_dice);
        } else if (request.type == "saving-throw") {
            roll = rollSavingThrow(request, custom_roll_dice);
        } else if (request.type == "initiative") {
            roll = rollInitiative(request, custom_roll_dice);
        } else if (request.type == "hit-dice") {
            roll = rollHitDice(request);
        } else if (request.type == "item") {
            roll = rollItem(request, custom_roll_dice);
        } else if (["feature", "trait", "action"].includes(request.type)) {
            roll = rollTrait(request);
        } else if (request.type == "death-save") {
            roll = rollDeathSave(request, custom_roll_dice);
        } else if (request.type == "attack") {
            roll = rollAttack(request, custom_roll_dice);
        } else if (request.type == "spell-card") {
            roll = rollSpellCard(request);
        } else if (request.type == "spell-attack") {
            roll = rollSpellAttack(request, custom_roll_dice);
        } else if (request.type == "avatar") {
            roll = rollAvatarDisplay(request);
        } else {
            // 'custom' || anything unexpected;
            const mod = request.modifier != undefined ? request.modifier : request.roll;
            const rname = request.name != undefined ? request.name : request.type;
            roll = template(request, "simple", {
                "charname": request.character.name,
                "rname": rname,
                "mod": mod,
                "r1": subRolls(request.roll),
                "normal": 1
            });
        }
        const character_name = request.whisper == WhisperType.HIDE_NAMES ? "???" : request.character.name;
        postChatMessage(roll, character_name);
    } else if (request.action == "rendered-roll") {
        const properties = {};
        if (request.source)
            properties.source = request.source;
        if (Object.keys(request.attributes).length) {
            for (let attr in request.attributes)
                request[attr] = attributes[attr];
        }
        if (request.open)
            properties.description = request.description;

        for (let [name, value] of request.roll_info)
            properties[name] = value;

        if (request.attack_rolls.length > 0) {
            properties["To Hit"] = request.attack_rolls.map(roll => convertRollToText(request.whisper, roll, true)).join(" | ")
        }
        for (let [roll_name, roll, flags] of request.damage_rolls) {
            if (typeof (roll) === "string")
                properties[roll_name] = roll
            else
                properties[roll_name] = convertRollToText(request.whisper, roll);
        }
        if (Object.keys(request.total_damages).length > 0)
            properties["Totals"] = "";

        for (let [key, roll] of Object.entries(request.total_damages))
            properties["Total " + key] = convertRollToText(request.whisper, roll);

        const message = createTable(request, request.title, properties);
        postChatMessage(message, request.character);
    }
}

chrome.runtime.onMessage.addListener(handleMessage);
updateSettings();
chrome.runtime.sendMessage({ "action": "activate-icon" });
sendCustomEvent("disconnect");
injectPageScript(chrome.runtime.getURL('dist/roll20_script.js'));
injectSettingsButton();
