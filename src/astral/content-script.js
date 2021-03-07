async function postChatMessage({characterName, message, color, icon, title, whisper}) {
    sendCustomEvent("AstralChatMessage", [{characterName, message, color, icon, title, whisper}]);
}

async function updateHpBar(characterName, hp, maxHp, tempHp) {
    sendCustomEvent("AstralUpdateHPBar", [{characterName, hp, maxHp, tempHp}]);
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
    return {
        title: request.skill + " Skill Check",
        message: template([advantageRoll(request, "Skill Check", generateRoll(request.d20 || "1d20", [request.modifier, custom_roll_dice]))])
    }
}

function rollAbility(request, custom_roll_dice = "") {
    return {
        title: request.ability + " Ability Check",
        message:  template([advantageRoll(request, "Ability Check",  generateRoll(request.d20 || "1d20", [request.modifier, custom_roll_dice]))])
    }
}

function rollSavingThrow(request, custom_roll_dice = "") {
    return {
        title: request.ability + " Saving Throw",
        message:  template([advantageRoll(request, "Saving Throw",  generateRoll(request.d20 || "1d20", [request.modifier, custom_roll_dice]))])
    }
}

function rollInitiative(request, custom_roll_dice = "") {
    return {
        title: "Initiative",
        message:  template([
            ["Initiative",  generateRoll(request.d20 || "1d20", [request.initiative, custom_roll_dice], 'i')]
        ])
    }
}

function rollHitDice(request) {
    return {
        title: "Hit Dice" + (request.multiclass ? `(${request.class})` : ""),
        message:  template([
            ["Hit Points", `!(${request["hit-dice"]})`]
        ])
    }
}

function rollDeathSave(request, custom_roll_dice = "") {
    return {
        title: "Death Saving Throw",
        message:  template([
            ["Normal", generateRoll(request.d20 || "1d20", [custom_roll_dice])]
        ])
    }
}

function rollItem(request) {
    return rollTrait(request);
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
        title: request.name,
        message: `_**Source:** ${source}_

${ parseDescription(request, request.description)}
`
    }
}

function rollAttack(request, custom_roll_dice = "") {
    let rolls = [];
    if (request["to-hit"] !== undefined) {
        rolls.push(advantageRoll(request, "To Hit", generateRoll(`${request.d20 || "1d20"}cr>=${request["critical-limit"] || 20}`, [request["to-hit"], custom_roll_dice])))
    }
    
    if (request["save-dc"] !== undefined) {
        rolls.push(["Save DC", `DC ${request["save-dc"]} ${request["save-ability"]}`]);
    }

    if (request.range !== undefined) {
        rolls.push(["Range", request.range]);
        if (request.aoe)
            roll_info.push(["Area of Effect", request.aoe]);
        if (request["aoe-shape"])
            roll_info.push(["AoE Shape", request["aoe-shape"]]);
    }
        
    if (request.damages !== undefined) {
        const damages = request.damages;
        const damage_types = request["damage-types"];
        const crit_damages = request["critical-damages"] || [];
        const crit_damage_types = request["critical-damage-types"] || [];

        rolls.push(...damagesToRolls(damages, damage_types, crit_damages, crit_damage_types))
    }

    return {
        title: request.name,
        message: template(rolls)
    }
}

function rollSpellCard(request) {
    let rolls = [
        ["Level", request["cast-at"] !== undefined ? `${request["level-school"]} (Cast at ${request["cast-at"]} Level)` :  request["level-school"]],
        ["Components", request.components],
        ["Casting Time", request["casting-time"]],
        ["Duration", request.duration],
        ["Range", request.range],
    ];
    if (request.aoe) rolls.push(["Area of Effect", request.aoe]);
    if (request["aoe-shape"]) rolls.push(["AoE Shape", request["aoe-shape"]]);

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
        ["Casting Time", request["casting-time"]],
        ["Duration", request.duration],
        ["Range", request.range],
    ];

    if (request.aoe) rolls.push(["Area of Effect", request.aoe]);
    if (request["aoe-shape"]) rolls.push(["AoE Shape", request["aoe-shape"]]);
    if (request.ritual) rolls.push(["Ritual", "Yes"]);
    if (request.concentration) rolls.push(["Concentration", "Yes"])

    if (request["save-dc"] !== undefined) {
        rolls.push(["Save DC", `DC ${request["save-dc"]} ${request["save-ability"]}`]);
    }
      
    if (request["to-hit"] !== undefined) {
        rolls.push(advantageRoll(request, "To Hit", generateRoll(`${request.d20 || "1d20"}cr>=${request["critical-limit"] || 20}`, [request["to-hit"], custom_roll_dice])))
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
        } else if (request.name.includes("Chaos Bolt")) {
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
        title: request.name,
        message: template(rolls) + (request.name.includes("Chaos Bolt") ? "\n\n### Damage Type Table\n\n" + template(["Acid", "Cold", "Fire", "Force", "Lightning", "Poison", "Psychic", "Thunder"].map((v, index) => {
            return [index + 1, v];
        }), "d8", "Damage Type") : "")
    };
}

function displayAvatar(request) {
    return {
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
            sendCustomEvent("AstralUpdateSettings", [request.settings]);
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
            roll = rollItem(request);
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
                title: request.name,
                message: subRolls(request.message)
            };
        } else {            
            roll = {
                title: request.name,
                message: subRolls(request.roll)
            }
        }
        postChatMessage({ ...roll, ...getDecoration(request.type), characterName: request.character.name, whisper: request.whisper == WhisperType.YES });
    } else if (request.action == "rendered-roll") {
        if (request.attack_rolls.length == 0 && request.damage_rolls.length == 0 ) {
            handleMessage(request.request, sender, sendResponse);
        } else {
            sendCustomEvent("AstralRenderedRoll", [request]);
        }
    } else if (request.action === "update-combat") {
        sendCustomEvent("AstralUpdateCombat", [request]);
    }
}

chrome.runtime.onMessage.addListener(handleMessage);
updateSettings();
chrome.runtime.sendMessage({ "action": "activate-icon" });
chrome.runtime.sendMessage({ "action": "register-astral-tab" });
injectPageScript(chrome.runtime.getURL("libs/alertify.min.js"));
injectPageScript(chrome.runtime.getURL("libs/jquery-3.4.1.min.js"));
injectPageScript(chrome.runtime.getURL("libs/lz-string.min.js"));
injectPageScript(chrome.runtime.getURL('dist/astral_script.js'));
sendCustomEvent("disconnect");