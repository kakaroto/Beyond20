async function postChatMessage({characterName, message, color, icon, title, whisper}) {
    sendCustomEvent("AstralChatMessage", [characterName, message, color, icon, title, whisper]);
}

async function updateHpBar(characterName, hp, maxHp, tempHp) {
    sendCustomEvent("AstralUpdateHPBar", [characterName, hp, maxHp, tempHp]);
}

function formatPlusMod(custom_roll_dice) {
    const prefix = custom_roll_dice && !["+", "-", "?", ""].includes(custom_roll_dice.trim()[0]) ? " + " : "";
    return prefix + (custom_roll_dice || "").replace(/([0-9]*d[0-9]+)/, "$1cs0cf0");;
}

function subRolls(text, overrideCB = null) {
    let replaceCB = overrideCB;
    
    if (!overrideCB) {
        replaceCB = (dice, modifier) => {
            return dice == "" ? modifier : `!!(${dice}${formatPlusMod(modifier)})`;
        }
    }

    const result = replaceRolls(text, replaceCB);
    return result.replace(/\]\](\s*\+\s*)\[\[/g, '$1')
}

function parseDescription(request, description, {
    bulletList = true,
    notes = true,
    tables = true,
    bolded = true
} = {}) {
    // Trim lines
    description = description.split('\n').map(s => s.trim()).join('\n');
    // Trim leading empty lines
    description = description.replace(/$[\n]*/m, match => "");

    if (!settings["subst-vtt"])
        return description;
        
    if (notes) description = formatNotesInDescription(description);
    if (tables) description = formatTableInDescription(description);
    if (bulletList) {
        description = formatBulletListsInDescription(description);
    } else {
        description = formatSeparateParagraphsInDescription(description);
    }
    // if (bolded) description = formatBoldedSectionInDescription(description);
    const replaceCB = (dice, modifier) => {
        return dice == "" ? modifier : `${dice}${modifier} (!!(${dice}${modifier}))`;
    }
    return subRolls(description, replaceCB);
}

function subDamageRolls(text) {
    return subRolls(text, (dice, modifier) => {
        const prefix = settings["auto-roll-damage"] ? "!" : "!!";
        return dice == "" ? modifier : `${prefix}(${dice}${formatPlusMod(modifier)})`;
    });
}

function damagesToRolls(damages, damage_types, crits, crit_types) {
    return [
        ...damages.map((value, index) => [damage_types[index], subDamageRolls(value)]),
        ...crits.map((value, index) => ["Crit " + crit_types[index], subDamageRolls(value)])
    ];
}

function template(rolls, col1 = "Name", col2 = "Roll") {
    return `| ${col1} | ${col2} |
| :--- | :--- |
${rolls.map(([key, value]) => {
    return `| ${key} | ${value} |`
}).join('\n')}    

`;
}

const matchTable = new RegExp(/(^\n\n([^\n\r]+)\n([^\n\r]+)\n\n\n\n$)(^\n([^\n\r]+)\n([^\n\r]+)\n\n$)+/m);
const matchHead = new RegExp(/(^\n\n([^\n\r]+)\n([^\n\r]+)\n\n\n\n$)/m);
const matchRow = new RegExp(/(^\n([^\n\r]+)\n([^\n\r]+)\n\n$)/m);
function formatTableInDescription(description) {
    return description.replace(matchTable, (match) => {
        let [_1, _2, firstHead, secondHead] = reMatchAll(matchHead, match)[0];
        
        const allMatches = reMatchAll(match, matchRow);
        // Skip first as it is matched by the matchHead too
        const rows = allMatches.map(match => `| ${match[2]} | ${match[3]} |`).slice(1);
        return `

| ${firstHead} | ${secondHead} |
| :--- | :--- |
${rows.join('\n')}

`;
    })
}

const notesRegex = /Notes: [^\n]*/g;
function formatNotesInDescription(description) {
    return description.replace(notesRegex, (match) => `_${match}_`);
}

// Regex doesn't apply anymore, no way to detect bolded section without arbitrary length check.
// const boldedSectionRegex = /([^\n\.])*\.\&nbsp\;/g;
// function formatBoldedSectionInDescription(description) {
//     return description.replace(boldedSectionRegex, match => `\n**${match}**`)
// }

const bulletListRegex = /^(?!\|)(([^\n\r]+)\n)+([^\n\r]+)/gm;
function formatBulletListsInDescription(description) {
    // Short-circuit in case the description has no whitespace formatting so it doesn't become only a bullet list.
    if (description.match(bulletListRegex) == description) return formatSeparateParagraphsInDescription(description);

    return description.replace(bulletListRegex, match => {
        // Short-circuit in case the match is at the start of the description, this isually fixes formatting for feats and magic items.
        if (description.indexOf(match) == 0) {
            return formatSeparateParagraphsInDescription(match);
        }
        return match.split('\n').map(r => `* ${r}`).join('\n');
    })
}

const separateParagraphsRegex = /^(?!\|)(([^\n\r]+)\n)+([^\n\r]+)/gm;
function formatSeparateParagraphsInDescription(description) {
    return description.replace(separateParagraphsRegex, match => {
        return match.split('\n').join('\n\n');
    })
}

const advantageMap = {
    [RollType.NORMAL]: (name, roll) => [name, roll],
    [RollType.QUERY]: (name, roll) => [name, roll],
    [RollType.DOUBLE]: (name, roll) => [`${name} (Double Roll)`, `${roll} ${roll}`],
    [RollType.THRICE]: (name, roll) => [`${name} (Triple Roll)`, `${roll} ${roll} ${roll}`],
    [RollType.ADVANTAGE]: (name, roll) => [`${name} (Advantage)`, `${roll} ${roll}`],
    [RollType.DISADVANTAGE]: (name, roll) => [`${name} (Disadvantage)`, `${roll} ${roll}`],
    [RollType.OVERRIDE_ADVANTAGE]: (name, roll) => [`${name} (Advantage)`, `${roll} ${roll}`],
    [RollType.OVERRIDE_DISADVANTAGE]: (name, roll) => [`${name} (Disadvantage)`, `${roll} ${roll}`],
    [RollType.SUPER_ADVANTAGE]: (name, roll) => [`${name} (Super Advantage)`, `${roll} ${roll} ${roll}`],
    [RollType.SUPER_DISADVANTAGE]: (name, roll) => [`${name} (Super Disadvantage)`, `${roll} ${roll} ${roll}`],
}

const defaultRoll = (name, roll) => [name, roll];

function advantageRoll(request, name, roll) {
    return (advantageMap[request.advantage] || defaultRoll)(name, roll);
}

function generateRoll(d20, rolls, prefix="") {
    return `${prefix}!(${d20}${rolls.map(formatPlusMod).join('')})`;
}

function rollSkill(request, custom_roll_dice = "") {
    // Custom skill;
    if (request.ability === "--" && request.character.abilities.length > 0) {
        let prof = "";
        let prof_val = "";
        let reliableTalent = false;
        if (request.proficiency === "Proficiency") {
            prof = "PROF";
            prof_val += request.character.proficiency;
            reliableTalent = request.reliableTalent;
        } else if (request.proficiency === "Half Proficiency") {
            prof = "HALF-PROFICIENCY";
            prof_val += "floor(" + request.character.proficiency + " / 2)";
        } else if (request.proficiency === "Expertise") {
            prof = "EXPERTISE";
            prof_val += `${request.character.proficiency} * 2`;
            reliableTalent = request.reliableTalent;
        }
        const d20 = reliableTalent ? "1d20min10" : "1d20";

        const roll = `!(${d20}${formatPlusMod(prof_val)}${formatPlusMod(custom_roll_dice)})`;
        return {
            icon: "bunker-soldier-standing",
            color: "#7ED321",
            title: request.skill + " Skill Check",
            message: template([advantageRoll(request, "Skill Check", generateRoll(d20, [prof_val, custom_roll_dice]))])
        }
        
    } else {
        let d20 = request.reliableTalent ? "1d20min10" : "1d20";
        if (request.silverTongue && (request.skill === "Deception" || request.skill === "Persuasion"))
            d20 = "1d20min10";

        
        return {
            icon: "bunker-soldier-standing",
            color: "#7ED321",
            title: request.skill + " Skill Check",
            message: template([advantageRoll(request, "Skill Check", generateRoll(d20, [request.modifier, custom_roll_dice]))])
        }
    }
}

function rollAbility(request, custom_roll_dice = "") {
    return {
        icon: "coin-star",
        color: "#4A90E2",
        title: request.ability + " Ability Check",
        message:  template([advantageRoll(request, "Ability Check",  generateRoll("d20", [request.modifier, custom_roll_dice]))])
    }
}

function rollSavingThrow(request, custom_roll_dice = "") {
    return {
        icon: "report-problem-triangle",
        color: "#F5A623",
        title: request.ability + " Saving Throw",
        message:  template([advantageRoll(request, "Saving Throw",  generateRoll("d20", [request.modifier, custom_roll_dice]))])
    }
}

function rollInitiative(request, custom_roll_dice = "") {
    return {
        icon: "arrow-down-9",
        color: "#7ED321",
        title: "Initiative",
        message:  template([
            ["Initiative",  generateRoll("d20", [request.initiative, custom_roll_dice], 'i')]
        ])
    }
}

function rollHitDice(request) {
    return {
        icon: "heart-beat",
        color: "#D0021B",
        title: "Hit Dice" + (request.multiclass ? `(${request.class})` : ""),
        message:  template([
            ["Hit Points", `!(${request["hit-dice"]})`]
        ])
    }
}

function rollDeathSave(request, custom_roll_dice = "") {
    return {
        icon: "skull-2",
        color: "#FFFFFF",
        title: "Death Saving Throw",
        message:  template([
            ["Normal", generateRoll('d20', [custom_roll_dice])]
        ])
    }
}

function rollItem(request, custom_roll_dice = "") {
    const source = request["item-type"].trim().toLowerCase();
    if ((source === "tool, common" || (source === "gear, common" && request.name.endsWith("Tools"))) && request.character.abilities && request.character.abilities.length > 0) {
        const ret = rollTrait(request);
        ret.message += "\n" + template([advantageRoll(request, request.name, generateRoll("d20", custom_roll_dice))])
        return ret;
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

    return {
        icon: "pyramid-eye",
        color: "#50E3C2",
        title: request.name,
        message: `_**Source:** ${source}_

${ parseDescription(request, request.description)}
`
    }
}

function rollAttack(request, custom_roll_dice = "") {
    let rolls = [];
    if (request["to-hit"] !== undefined) {
        rolls.push(advantageRoll(request, "To Hit", generateRoll(`1d20cr>=${request["critical-limit"] || 20}`, [request["to-hit"], custom_roll_dice])))
    }
    
    if (request["save-dc"] !== undefined) {
        rolls.push(["Save DC", `DC ${request["save-dc"]} ${request["save-ability"]}`]);
    }

    if (request.range !== undefined)
        rolls.push(["Range", request.range]);
        
    if (request.damages !== undefined) {
        const damages = request.damages;
        const damage_types = request["damage-types"];
        const crit_damages = request["critical-damages"] || [];
        const crit_damage_types = request["critical-damage-types"] || [];

        rolls.push(...damagesToRolls(damages, damage_types, crit_damages, crit_damage_types))
    }

    return {
        icon: "knife",
        color: "#D0021B",
        title: request.name,
        message: template(rolls)
    }
}

function rollSpellCard(request) {
    let rolls = [
        ["Level", request["cast-at"] !== undefined ? `${request["level-school"]} (Cast at ${request["cast-at"]} Level)` :  request["level-school"]],
        ["Components", request.components],
        ["Range", request.range],
        ["Casting Time", request["casting-time"]],
        ["Duration", request.duration],
    ];

    if (request.ritual) rolls.push(["Ritual", "Yes"]);
    if (request.concentration) rolls.push(["Concentration", "Yes"])

    let description = request.description;
    let higher = description.indexOf("At Higher Levels.");
    let higherDesc = null;
    if (higher > 0) {
        higherDesc = parseDescription(request, description.slice(higher + "At Higher Levels. ".length));
        description = description.slice(0, higher - 1);
    }
    description = parseDescription(request, description);
    return {
        icon: "torch",
        color: "#BD10E0",
        title: request.name,
        message: `${template(rolls)}

${description}

${(higher > 0 ? "**At Higher Levels.** " + higherDesc : "" )}
` 
    }
}

function rollSpellAttack(request, custom_roll_dice) {
    let rolls = [
        ["Level", request["cast-at"] !== undefined ? `${request["level-school"]} (Cast at ${request["cast-at"]} Level)` :  request["level-school"]],
        ["Components", request.components],
        ["Range", request.range],
        ["Casting Time", request["casting-time"]],
        ["Duration", request.duration],
    ];

    if (request.ritual) rolls.push(["Ritual", "Yes"]);
    if (request.concentration) rolls.push(["Concentration", "Yes"])

    if (request["save-dc"] !== undefined) {
        rolls.push(["Save DC", `DC ${request["save-dc"]} ${request["save-ability"]}`]);
    }
      
    if (request["to-hit"] !== undefined) {
        rolls.push(advantageRoll(request, "To Hit", generateRoll(`1d20cr>=${request["critical-limit"] || 20}`, [request["to-hit"], custom_roll_dice])))
    }

    if (request.damages !== undefined) {
        const damages = request.damages;
        const damage_types = request["damage-types"];
        const critical_damages = request["critical-damages"] || [];
        const critical_damage_types = request["critical-damage-types"] || [];
        if (request.name === "Chromatic Orb") {
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
            }
            damages.splice(0, 0, chromatic_damage);
            damage_types.splice(0, 0, "Chromatic Damage");
            critical_damages.splice(0, 0, crit_damage);
            critical_damage_types.splice(0, 0, "Chromatic Damage");

            rolls.push(["Choose Damage", ["Acid", "Cold", "Fire", "Lightning", "Poison", "Thunder"].join(', ')])
        } else if (request.name === "Dragon's Breath") {
            let dragons_breath_damage = null;
            for (let dmgtype of ["Acid", "Cold", "Fire", "Lightning", "Poison"]) {
                let idx = damage_types.findIndex(t => t === dmgtype);
                dragons_breath_damage = damages.splice(idx, 1)[0];
                damage_types.splice(idx, 1);
            }
            damages.splice(0, 0, dragons_breath_damage);
            damage_types.splice(0, 0, "Breath Damage");
            rolls.push(["Choose Damage", ["Acid", "Cold", "Fire", "Lightning", "Poison"].join(', ')])
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
            damages.push("Twice the Necrotic damage");
            damage_types.push("Healing");
        } else if (request.name === "Toll the Dead") {
            damages[0] = `${damages[0]} or if hurt ${damages[0].replace("d8", "d12")}`
        } else if (request.name === "Booming Blade") {
            damage_types[1] = damage_types[1] + " on Moving";
        }
        
        rolls.push(...damagesToRolls(damages, damage_types, critical_damages, critical_damage_types))
    }

    return {
        icon: "torch",
        color: "#BD10E0",
        title: request.name,
        message: template(rolls) + (request.name === "Chaos Bolt" ? "\n\n### Damage Type Table\n\n" + template(["Acid", "Cold", "Fire", "Force", "Lightning", "Poison", "Psychic", "Thunder"].map((v, index) => {
            return [index + 1, v];
        }), "d8", "Damage Type") : "")
    };
}

function displayAvatar(request) {
    return {
        icon: 'home-1',
        color: '#FFFFFF',
        title: request.character.name || request.name,
        message: `![${request.name}](${request.character.avatar})`
    };
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
        updateHpBar(request.character.name, request.character.hp, request.character["max-hp"], request.character["temp-hp"]);
    } else if (request.action == "conditions-update") {
        if (settings["display-conditions"]) {
            const character_name = request.character.name;
            if (request.character.exhaustion == 0) {
                conditions = request.character.conditions;
            } else {
                conditions = request.character.conditions.concat([`Exhausted (Level ${request.character.exhaustion})`]);
            }

            let message = "";
            if (conditions.length == 0) {
                message = "No active condition";
            } else {
                message = conditions.join(", ");
            }
            postChatMessage({ characterName: request.character.name, message, icon: 'smiley-worry', color: '#F8E71C', title: 'Conditions', whisper: request.whisper == WhisperType.YES });
        }
    } else if (request.action == "roll") {
        
        let custom_roll_dice = "";
        if (request.character.type == "Character")
            custom_roll_dice = request.character.settings["custom-roll-dice"] || "";
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
            roll = displayAvatar(request);
        } else if (request.type == "chat-message") {
            roll = { 
                icon: 'roman-helmet', 
                color: '#FFFFFF',
                title: request.name,
                message: subRolls(request.message)
            };
        } else {            
            roll = {
                icon: 'home-1',
                color: '#FFFFFF',
                title: request.name,
                message: subRolls(request.roll)
            }
        }
        postChatMessage({ ...roll, characterName: request.character.name, whisper: request.whisper == WhisperType.YES });
    } else if (request.action == "rendered-roll") {
        console.warn("rendered-roll not supported in astral vtt");
    } else if (request.action === "update-combat") {
        console.warn("update-combat not supported in astral vtt");
    }
}

chrome.runtime.onMessage.addListener(handleMessage);
updateSettings();
chrome.runtime.sendMessage({ "action": "activate-icon" });
chrome.runtime.sendMessage({ "action": "register-astral-tab" });
injectPageScript(chrome.runtime.getURL('dist/astral_script.js'));
sendCustomEvent("disconnect");