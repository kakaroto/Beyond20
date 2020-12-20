

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
    static getRollOptions(request) {
        const rollMode = request.whisper === 0 ? "roll" : "gmroll";
        switch (request.advantage) {
            default:
            case 0: // NORMAL
            case 1: // DOUBLE
            case 5: // THRICE
                return { fastForward: true, rollMode };
            case 3: // ADVANTAGE
                return { fastForward: true, advantage: true, rollMode };
            case 6: // SUPER ADVANTAGE
            return { fastForward: true, elvenAccuracy: true, advantage: true, rollMode };
            case 4: // DISADVANTAGE
            case 7: // SUPER DISADVANTAGE
                return { fastForward: true, disadvantage: true, rollMode };
            case 2: // QUERY
                return {rollMode};
        }
    }
    
    static handleBeyond20Request(action, request) {
        if (action !== "roll") return;
        const actorData = this.createActorData(request);
        switch (request.type) {
            case "skill":
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
                    case "Half Proficient":
                        actorData.data.skills[skill].value = 0.5;
                        break;
                    case "Proficient": 
                        actorData.data.skills[skill].value = 1;
                        break;
                    case "Expertise": 
                        actorData.data.skills[skill].value = 2;
                        break;
                }
                const calculated = actorData.data.abilities[request.ability.toLowerCase()].mod + actorData.data.skills[skill].value * actorData.data.attributes.prof;
                actorData.data.skills[skill].mod = calculated;
                actorData.data.bonuses.abilities.skill = parseInt(request.modifier) - calculated;
    
                const actor = new CONFIG.Actor.entityClass(actorData);
                actor.rollSkill(skill, this.getRollOptions(request));
                return false;
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
