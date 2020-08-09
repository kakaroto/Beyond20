async function postChatMessage({message, color, icon, title, whisper}) {
    const user = getUser().uid;
    const room = getRoom();
    const token = await getAccessToken();
    const character = getCharacter();
    
    fetch(location.origin + `/api/game/${room}/chat`, {
        method: "PUT",
        body: JSON.stringify({
            text: message,
            color, icon, hidden: false, user, character, title,
            hidden: whisper,
            ...(whisper ? {recipients: Object.fromEntries(getDungeonMasters().map(key => [key, true]))} : {})
        }),
        headers: {
            'x-authorization': `Bearer ${token}`, 'content-type': 'application/json'
        }
    });
}

async function updateHpBar(hp, maxHp, tempHp) {
    const room = getRoom();
    const token = await getAccessToken();
    const character = getCharacter();
    fetch(location.origin + `/api/game/${room}/character/${character}`, {
        method: "PATCH",
        body: JSON.stringify({
            character: {
                updateAt: Date.now(),
                attributeBarMax: maxHp + tempHp,
                attributeBarCurrent: hp + tempHp,

            }
        }),
        headers: {
            'x-authorization': `Bearer ${token}`, 'content-type': 'application/json'
        }
    });
}

function getName(request) {
    return request.name != "" ? request.name : request.character.name;
}

function subRolls(text, overrideCB = null) {
    let replaceCB = overrideCB;
    
    if (!overrideCB) {
        replaceCB = (dice, modifier) => {
            return dice == "" ? modifier : `!!(${dice}${modifier})`;
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

    if (!settings["subst-vtt"])
        return description;
        
    notes && (description = formatNotesInDescription(description));
    tables && (description = formatTableInDescription(description));
    bulletList ? (description = formatBulletListsInDescription(description)) : (description = formatSeparateParagraphsInDescription(description));
    bolded && (description = formatBoldedSectionInDescription(description));
    const replaceCB = (dice, modifier) => {
        return dice == "" ? modifier : `${dice}${modifier} (!!(${dice}${modifier}))`;
    }
    return subRolls(description, replaceCB);
}

function subDamageRolls(text) {
    return subRolls(text, (dice, modifier) => {
        const prefix = settings["auto-roll-damage"] ? "!(" : "!!(";
        modifier = settings['critical-homebrew'] == CriticalRules.HOMEBREW_DOUBLE ? `)${modifier}` : `${modifier})`;
        return dice == "" ? modifier : `${prefix}${dice}${modifier}`;
    });
}

function damagesToRolls(damages, damage_types, crits, crit_types) {
    return [
        ...damages.map((value, index) => [damage_types[index], subDamageRolls(value)]),
        ...(settings['critical-homebrew'] == CriticalRules.HOMEBREW_DOUBLE ? 
            [] : 
            crits.map((value, index) => ["Crit " + crit_types[index], subDamageRolls(value)])
        )
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

function formatTableInDescription(description) {
    const matchTable =  new RegExp(/(^\n\n([^\n\r]+)\n([^\n\r]+)\n\n\n\n$)(^\n([^\n\r]+)\n([^\n\r]+)\n\n$)+/gm);
    const matchHead =  new RegExp(/(^\n\n([^\n\r]+)\n([^\n\r]+)\n\n\n\n$)/gm);
    const matchRow =  new RegExp(/(^\n([^\n\r]+)\n([^\n\r]+)\n\n$)/gm);

    return description.replace(matchTable, (match) => {
        let [_1, _2, firstHead, secondHead] = match.matchAll(matchHead).next().value;
        
        // Skip first as it is matched by the matchHead too
        const [_, ...rows] = [...match.matchAll(matchRow)].map(([_1, _2, firstRow, secondRow]) => {
            return `| ${firstRow} | ${secondRow} |`
        });
        return `

| ${firstHead} | ${secondHead} |
| :--- | :--- |
${rows.join('\n')}

`;
    })
}

function formatNotesInDescription(description) {
    return description.replace(/Notes: [^\n]*/g, (match) => `_${match}_`);
}

function formatBoldedSectionInDescription(description) {
    return description.replace(/([^\n\.])*\.\&nbsp\;/g, match => `\n**${match}**`)
}

function formatBulletListsInDescription(description) {
    return description.replace(/^(?!\|)(([^\n\r]+)\n)+([^\n\r]+)/gm, match => {
        return match.split('\n').map(r => `* ${r}`).join('\n');
    })
}

function formatSeparateParagraphsInDescription(description) {
    return description.replace(/^(?!\|)(([^\n\r]+)\n)+([^\n\r]+)/gm, match => {
        return match.split('\n').join('\n\n');
    })
}



function advantageRoll(request, name, roll) {
    return {
        [RollType.NORMAL]: [[name, roll]],
        [RollType.DOUBLE]: [[name, roll], ["2nd time", roll]],
        [RollType.THRICE]: [[name, roll], ["2nd time", roll], ["3rd time", roll]],
        [RollType.ADVANTAGE]: [[name, roll], ["Advantage", roll]],
        [RollType.DISADVANTAGE]: [[name, roll], ["Disadvantage", roll]],
        [RollType.SUPER_ADVANTAGE]: [[name, roll], ["Advantage", roll], ["Super Advantage", roll]],
        [RollType.SUPER_DISADVANTAGE]: [[name, roll], ["Disadvantage", roll], ["Super Disadvantage", roll]],
    }[request.advantage] || [[name, roll]]
}

function rollSkill(request, custom_roll_dice = "") {
    let modifier = request.modifier;
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
        return {
            icon: "bunker-soldier-standing",
            color: "#7ED321",
            title: request.skill + " Skill Check",
            message: template([
                ...advantageRoll(request, "Skill Check", `!(${d20}${prof_val.length > 0 ? " + " + prof_val : ""}${custom_roll_dice.length > 0 ? " + " + custom_roll_dice : ""})`)
            ])
        }
        
    } else {
        let d20 = request.reliableTalent ? "1d20min10" : "1d20";
        if (request.silverTongue && (request.skill === "Deception" || request.skill === "Persuasion"))
            d20 = "1d20min10";

        
        return {
            icon: "bunker-soldier-standing",
            color: "#7ED321",
            title: request.skill + " Skill Check",
            message: template([
                ...advantageRoll(request, "Skill Check", `!(${d20}${modifier}${custom_roll_dice.length > 0 ? " + " + custom_roll_dice : ""})`)
            ])
        }
    }
}

function rollAbility(request, custom_roll_dice = "") {
    return {
        icon: "coin-star",
        color: "#4A90E2",
        title: request.ability + " Ability Check",
        message:  template([
            ...advantageRoll(request, "Ability Check", `!(1d20${request.modifier}${custom_roll_dice.length > 0 ? " + " + custom_roll_dice : ""})`)
        ])
    }
}

function rollSavingThrow(request, custom_roll_dice = "") {
    return {
        icon: "report-problem-triangle",
        color: "#F5A623",
        title: request.ability + " Saving Throw",
        message:  template([
            ...advantageRoll(request, "Saving Throw", `!(1d20${request.modifier}${custom_roll_dice.length > 0 ? " + " + custom_roll_dice : ""})`)
        ])
    }
}

function rollInitiative(request, custom_roll_dice = "") {
    return {
        icon: "arrow-down-9",
        color: "#7ED321",
        title: "Initiative",
        message:  template([
            ["Initiative", `i!(1d20${request.initiative}${custom_roll_dice.length > 0 ? " + " + custom_roll_dice : ""})`]
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
            ["Normal", `!(1d20${custom_roll_dice.length > 0 ? " + " + custom_roll_dice : ""})`]
        ])
    }
}

function rollItem(request, custom_roll_dice = "") {
    const source = request["item-type"].trim().toLowerCase();
    if ((source === "tool, common" || (source === "gear, common" && request.name.endsWith("Tools"))) && request.character.abilities && request.character.abilities.length > 0) {
        const ret = rollTrait(request);

        return {
            ...ret,
            message: ret.message + '\n' + template([
                ...advantageRoll(request, request.name, `!(1d20${custom_roll_dice.length > 0 ? " + " + custom_roll_dice : ""})`)
            ])
        }
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
        title: getName(request),
        message: `_**Source:** ${source}_

${ parseDescription(request, request.description)}
`
    }
}

function rollAttack(request, custom_roll_dice = "") {
    let rolls = [];
    if (request["to-hit"] !== undefined) {
        rolls = [
            ...rolls,
            ...advantageRoll(request, "To Hit", `!(1d20cr>=${request["critical-limit"] || 20}${request["to-hit"]}${custom_roll_dice.length > 0 ? " + " + custom_roll_dice : ""})`),
        ]
    }
    
    if (request["save-dc"] !== undefined) {
        rolls = [
            ...rolls,
            ["Save DC", `DC ${request["save-dc"]} ${request["save-ability"]}`],
        ]
    }

    if (request.range !== undefined)
        rolls = [
            ...rolls,
            ["Range", request.range],
        ]
        
    if (request.damages !== undefined) {
        const damages = request.damages;
        const damage_types = request["damage-types"];
        const crit_damages = request["critical-damages"] || [];
        const crit_damage_types = request["critical-damage-types"] || [];

        rolls = [
            ...rolls,
            ...damagesToRolls(damages, damage_types, crit_damages, crit_damage_types)
        ]
    }


    return {
        icon: "knife",
        color: "#D0021B",
        title: getName(request),
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
        ...(request.ritual ? [["Ritual", "Yes"]] : []),
        ...(request.concentration ? [["Concentration", "Yes"]] : []),
    ];

    let description = request.description;
    let higher = description.indexOf("At Higher Levels.");
    let higherDesc = null;
    if (higher > 0) {
        higherDesc = parseDescription(request, description.slice(higher + "At Higher Levels. ".length));
        description = parseDescription(request, description.slice(0, higher - 1), {bulletList: false});
    }

    return {
        icon: "torch",
        color: "#BD10E0",
        title: getName(request),
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
        ...(request.ritual ? [["Ritual", "Yes"]] : []),
        ...(request.concentration ? [["Concentration", "Yes"]] : []),
    ];

    if (request["save-dc"] !== undefined) {
        rolls = [
            ...rolls,
            ["Save DC", `DC ${request["save-dc"]} ${request["save-ability"]}`],
        ]
    }
      
    if (request["to-hit"] !== undefined) {
       rolls = [
            ...rolls,
            ...advantageRoll(request, "To Hit", `!(1d20cr>=${request["critical-limit"] || 20}${request["to-hit"]}${custom_roll_dice.length > 0 ? " + " + custom_roll_dice : ""})`),
        ]
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
            damages.splice(0, 0, chromatic_damage + "m2");
            damage_types.splice(0, 0, "Chromatic Damage");
            critical_damages.splice(0, 0, crit_damage);
            critical_damage_types.splice(0, 0, "Chromatic Damage");
            rolls = [
                ...rolls,
                ["Choose Damage", ["Acid", "Cold", "Fire", "Lightning", "Poison", "Thunder"].join(', ')],
            ]
        } else if (request.name === "Dragon's Breath") {
            let dragons_breath_damage = null;
            for (let dmgtype of ["Acid", "Cold", "Fire", "Lightning", "Poison"]) {
                let idx = damage_types.findIndex(t => t === dmgtype);
                dragons_breath_damage = damages.splice(idx, 1)[0];
                damage_types.splice(idx, 1);
            }
            damages.splice(0, 0, dragons_breath_damage);
            damage_types.splice(0, 0, "Breath Damage");
            rolls = [
                ...rolls,
                ["Choose Damage", ["Acid", "Cold", "Fire", "Lightning", "Poison"].join(', ')],
            ]
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
        
        rolls = [
            ...rolls,
            ...damagesToRolls(damages, damage_types, critical_damages, critical_damage_types)
        ]
    }

    return {
        icon: "torch",
        color: "#BD10E0",
        title: getName(request),
        message: template(rolls) + (request.name === "Chaos Bolt" ? "\n\n### Damage Type Table\n\n" + template(["Acid", "Cold", "Fire", "Force", "Lightning", "Poison", "Psychic", "Thunder"].map((v, index) => {
            return [index + 1, v];
        }), "d8", "Damage Type") : "")
    };
}

function displayAvatar(request) {
    return {
        icon: 'home-1',
        color: '#FFFFFF',
        title: request.character.name,
        message: `![${request.name}](${request.character.avatar})`
    };
}

function updateSettings(new_settings = null) {
    if (new_settings) {
        settings = new_settings;
        roll_renderer.setSettings(settings);
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
        updateHpBar(request.character.hp, request.character["max-hp"], request.character["temp-hp"]);
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
            let message = "";
            if (conditions.length == 0) {
                message = "I have no active condition";
            } else {
                message = "I am: " + conditions.join(", ");
            }
            postChatMessage({ message, icon: 'smiley-worry', color: '#F8E71C', title: 'Conditions', whisper: request.whisper == WhisperType.YES });
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
        } else {            
            roll = {
                icon: 'home-1',
                color: '#FFFFFF',
                title: getName(request),
                message: subRolls(request.roll)
            }
        }
        postChatMessage({ ...roll, whisper: request.whisper == WhisperType.YES });
    } else if (request.action == "rendered-roll") {
        console.warn("rendered-roll not supported in astral vtt");
    } else if (request.action === "update-combat") {
        console.warn("update-combat not supported in astral vtt");
    }
}

chrome.runtime.onMessage.addListener(handleMessage);
updateSettings();
chrome.runtime.sendMessage({ "action": "activate-icon" });
chrome.runtime.sendMessage({ "action": "register-avtt-tab" });
injectPageScript(chrome.runtime.getURL('dist/avtt_script.js'));
sendCustomEvent("disconnect");
