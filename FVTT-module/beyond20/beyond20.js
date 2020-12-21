

class Beyond20 {
    static createActorData(request) {
        const type = request.character.type == "Character" ? "character" : "npc";
        // get default actor template
        const actorData = duplicate(game.system.template.Actor[type]);
        const templates = game.system.template.Actor[type].templates || [];
        templates.forEach(template => mergeObject(actorData, game.system.template.Actor.templates[template])) 
        delete actorData.templates;
        
        for (let ability of request.character.abilities) {
            const [name, abbr, score, mod] = ability;
            actorData.abilities[abbr.toLowerCase()] = {value: parseInt(score), mod: parseInt(mod)}
        }
        actorData.attributes.ac.value = parseInt(request.character.ac);
        actorData.attributes.hp.value = parseInt(request.character.hp);
        actorData.attributes.hp.max = parseInt(request.character['max-hp']);
        actorData.attributes.hp.temp = parseInt(request.character['temp-hp']);
        if (type === "npc") {
            const cr = request.character.cr;
            const parseCR = (cr) => {
                const match = cr.match(/([0-9]+)\/([0-9]+)/);
                return (parseInt(match[1]) || 0) / (parseInt(match[2] || 1));
            }
            actorData.details.cr = parseFloat(cr.includes("/") ? parseCR(cr) : parseInt(cr));
            // Calculate Proficiency (Formula from D&D 5e system)
            actorData.attributes.prof = Math.floor((Math.max(actorData.details.cr, 1) + 7) / 4);
            actorData.attributes.hp.formula = request.character['hp-foruma'];
        } else {
            actorData.attributes.prof = parseInt(request.character.proficiency)
        }
        
    
        return {name: request.character.name, flags: {}, img: request.character.avatar, data: actorData, items: []}
    }
    static findToken(request) {
        const name = request.character.name.toLowerCase().trim();
        return canvas.tokens.placeables.find((t) => t.owner && t.name.toLowerCase().trim() == name);
    }
    static getRollOptions(request) {
        const d20 = request.d20 || "1d20";
        const rollMode = request.whisper === 0 ? "roll" : "gmroll";
        const reliableTalent = d20.includes("min10"); // Also applies to silver tongue
        const halflingLucky = d20.includes("ro<=1");
        let advantageSettings = {};
        switch (request.advantage) {
            default:
            case 0: // NORMAL
            case 1: // DOUBLE
            case 5: // THRICE
                advantageSettings = {fastForward: true };
                break;
            case 3: // ADVANTAGE
                advantageSettings = { fastForward: true, advantage: true };
                break;
            case 6: // SUPER ADVANTAGE
                advantageSettings = { fastForward: true, elvenAccuracy: true, advantage: true };
                break;
            case 4: // DISADVANTAGE
            case 7: // SUPER DISADVANTAGE
                advantageSettings = { fastForward: true, disadvantage: true };
                break;
            case 2: // QUERY
                break;
        }
        return { rollMode, reliableTalent, halflingLucky, ...advantageSettings }
    }

    static _advantageToD20(request) {
        switch (request.advantage) {
            default:
            case 0: // NORMAL
            case 1: // DOUBLE
            case 2: // QUERY
            case 5: // THRICE
                return "1d20";
            case 3: // ADVANTAGE
                return "2d20kh1";
            case 6: // SUPER ADVANTAGE
                return "3d20kh1";
            case 4: // DISADVANTAGE
                return "2d20kl1";
            case 7: // SUPER DISADVANTAGE
                return "3d20kl1";
        }
    }

    static async rollInitiative(request, tokens, combat) {
        if (!combat) {
            if (game.user.isGM) {
                combat = await game.combats.object.create({scene: canvas.scene._id, active: true});
            } else {
                return null;
            }
        }
        const mod = parseInt(request.initiative) || 0;
        let formula = request.d20 || "1d20";
        formula = formula.replace(/ro(=|<|<=|>|>=)([0-9]+)/g, "r$1$2");
        formula = formula.replace(/(^|\s)+([^\s]+)min([0-9]+)([^\s]*)/g, "$1{$2$4, $3}kh1");
        formula = formula.replace(/1d20/g, this._advantageToD20(request));
        formula += ` ${mod >= 0 ? '+' : ''} ${mod}`;

        const createData = tokens.reduce((arr, t) => {
        if ( t.inCombat ) return arr;
        arr.push({tokenId: t.id, hidden: t.data.hidden || request.whisper});
        return arr;
        }, []);
        if (createData.length) {
            await combat.createEmbeddedEntity("Combatant", createData);
        }
        const combatants = tokens.map(t => combat.getCombatantByToken(t.id));
        combat.rollInitiative(combatants.filter(c => !!c).map(c => c._id), {formula, messageOptions: this.getRollOptions(request)})
    }
    
    static handleBeyond20Request(action, request) {
        if (action !== "roll") return;
        const actorData = this.createActorData(request);
        const token = this.findToken(request);
        switch (request.type) {
            case "skill": {
                const SKILLS = {
                    "Acrobatics": "acr",
                    "Animal Handling": "ani",
                    "Arcana": "arc",
                    "Athletics": "ath",
                    "Deception": "dec",
                    "History": "his",
                    "Insight": "ins",
                    "Intimidation": "itm",
                    "Investigation": "inv",
                    "Medicine": "med",
                    "Nature": "nat",
                    "Perception": "prc",
                    "Performance": "prf",
                    "Persuasion": "per",
                    "Religion": "rel",
                    "Sleight of Hand": "slt",
                    "Stealth": "ste",
                    "Survival": "sur"
                };
                const skill = SKILLS[request.skill];
                if (!skill) return;
    
                switch (request.proficiency) {
                    case "Not Proficient": 
                    default:
                        break;
                    case "Half Proficiency":
                        actorData.data.skills[skill].value = 0.5;
                        break;
                    case "Proficiency": 
                        actorData.data.skills[skill].value = 1;
                        break;
                    case "Expertise": 
                        actorData.data.skills[skill].value = 2;
                        break;
                }
                const calculated = actorData.data.abilities[request.ability.toLowerCase()].mod + actorData.data.skills[skill].value * actorData.data.attributes.prof;
                const bonus = parseInt(request.modifier) - calculated;
                actorData.data.skills[skill].mod = calculated;
                actorData.data.bonuses.abilities.skill = bonus;
    
                const actor = new CONFIG.Actor.entityClass(actorData);
                
                // Compose roll parts and data
                const parts = ["@mod"];
                const data = {mod: calculated};

                // Skill check bonus
                if ( bonus ) {
                    data["skillBonus"] = bonus;
                    parts.push("@skillBonus");
                }
                // Roll and return
                const rollOptions = this.getRollOptions(request)
                mergeObject(rollOptions, {
                    parts: parts,
                    data: data,
                    title: game.i18n.format("DND5E.SkillPromptTitle", {skill: CONFIG.DND5E.skills[skill]}),
                    messageData: {"flags.dnd5e.roll": {type: "skill", skill }}
                });
                rollOptions.speaker = ChatMessage.getSpeaker({actor: actor, token: token});
                game.dnd5e.dice.d20Roll(rollOptions);
                return false;
            }
            case "saving-throw": {
                const abl = request.ability.toLowerCase();
                const mod = parseInt(request.modifier)
                const proficient = mod >= actorData.data.abilities[abl].mod + actorData.data.attributes.prof;
                const calculated = actorData.data.abilities[abl].mod + proficient * actorData.data.attributes.prof;
                const bonus = mod - calculated;
    
                actorData.data.abilities[abl].proficient = proficient;
                actorData.data.abilities[abl].save = calculated;
                actorData.data.bonuses.abilities.save = bonus;
                const actor = new CONFIG.Actor.entityClass(actorData);
                
                // Compose roll parts and data
                const parts = ["@mod"];
                const data = {mod: calculated};

                // Saving throw bonus
                if ( bonus ) {
                    data["saveBonus"] = bonus;
                    parts.push("@saveBonus");
                }
                // Roll and return
                const rollOptions = this.getRollOptions(request)
                mergeObject(rollOptions, {
                    parts: parts,
                    data: data,
                    title: game.i18n.format("DND5E.SavePromptTitle", {ability: CONFIG.DND5E.abilities[abl]}),
                    messageData: {"flags.dnd5e.roll": {type: "save", abl }}
                });
                rollOptions.speaker = ChatMessage.getSpeaker({actor: actor, token: token});
                game.dnd5e.dice.d20Roll(rollOptions);
                return false;
            }
            case "ability": {
                const abl = request.ability.toLowerCase();
                const mod = parseInt(request.modifier)
                const bonus = mod - actorData.data.abilities[abl].mod;
    
                actorData.data.bonuses.abilities.check = bonus;
                const actor = new CONFIG.Actor.entityClass(actorData);
                
                // Compose roll parts and data
                const parts = ["@mod"];
                const data = {mod: actorData.data.abilities[abl].mod};

                // Ability check bonus
                if ( bonus ) {
                    data["checkBonus"] = bonus;
                    parts.push("@checkBonus");
                }
                // Roll and return
                const rollOptions = this.getRollOptions(request)
                mergeObject(rollOptions, {
                    parts: parts,
                    data: data,
                    title: game.i18n.format("DND5E.AbilityPromptTitle", {ability: CONFIG.DND5E.abilities[abl]}),
                    messageData: {"flags.dnd5e.roll": {type: "ability", abl }}
                });
                rollOptions.speaker = ChatMessage.getSpeaker({actor: actor, token: token});
                game.dnd5e.dice.d20Roll(rollOptions);
                return false;
            }
            case "initiative": {
                const characterName = request.character.name.toLowerCase().trim();
                const characterTokens = canvas.tokens.placeables.filter((t) => t.owner && t.name.toLowerCase().trim() == characterName);
                const tokens = characterTokens.length > 0 ? characterTokens : canvas.tokens.controlled;
                if (tokens.length === 0) {
                    ui.notifications.warn("Beyond20: No tokens found to roll initiative for");
                    return;
                }
                                    
                let combat = game.combat;
                if ( !combat  && !game.user.isGM && !canvas.scene ) {
                    ui.notifications.warn(game.i18n.localize("COMBAT.NoneActive"));
                    return;
                }
                this.rollInitiative(request, tokens, combat);
                return false;
            }
            default:
                break;
        }
    }
}


Hooks.on('beyond20Request', (action, request) => Beyond20.handleBeyond20Request(action, request))

Hooks.on('ready', function () {
    game.settings.register("beyond20", "notifyAtLoad", {
        name: "Notify player to activate Beyond20",
        hint: "On Chrome, Beyond20 extension doesn't load automatically. The module can show a notification to remind the player to activate it for the current tab.",
        scope: "client",
        config: true,
        default: true,
        type: Boolean
    });
    if (typeof (chrome) !== "undefined" && typeof (browser) === "undefined" && game.settings.get("beyond20", "notifyAtLoad") && document.title.startsWith("Foundry Virtual Tabletop")) {
        dialog = new Dialog({
            title: `Beyond20`,
            content: "<p>Beyond20 does not load automatically for FVTT games on Chrome.</p>" +
                "<p>If you wish to use Beyond20, please activate it by clicking on the <img style='border: 0px; vertical-align: middle;' src='modules/beyond20/images/icons/icon20.png'/> icon in the Chrome toolbar.</p>" +
                "<div class='form-group'>" +
                "<label for='dontaskagain'>Don't remind me again.</label>" +
                "<input name='dontaskagain' type='checkbox' value='false' data-dtype='Boolean'></input>" +
                "</div>",
            buttons: {
                dismiss: {
                    icon: '<i class="fas fa-times"></i>',
                    label: "Dismiss",
                    callback: html => {
                        game.settings.set("beyond20", "notifyAtLoad", !html.find("input[name=dontaskagain]")[0].checked);
                        dialog = null;
                    }
                }
            },
            default: "dismiss"
        }, { width: 600 }).render(true);

        let cb = () => {
            if (!dialog) return;
            if (document.title.startsWith("Foundry Virtual Tabletop")) {
                setTimeout(cb, 500);
            } else  {
                dialog.close();
            }
        }
        setTimeout(cb, 500)
    } 
})
