

class Beyond20 {

    static _getDefaultTemplate(entityType, templateType) {
        const data = duplicate(game.system.template[entityType][templateType]);
        const templates = game.system.template[entityType][templateType].templates || [];
        templates.forEach(template => mergeObject(data, game.system.template[entityType].templates[template])) 
        delete data.templates;
        return data;
    }

    static async createActorData(request) {
        const type = request.character.type == "Character" ? "character" : "npc";
        // get default actor template
        const actorData = this._getDefaultTemplate('Actor', type);
        
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
        // Give at least 1 spell slot for all levels in case a spell is being cast
        for (const lvl of Object.keys(actorData.spells)) {
            actorData.spells[lvl].value = 1;
            actorData.spells[lvl].max = 1;
        }

        if (!this._srdClasses) {
            const compendium = game.packs.get("dnd5e.classes")
            this._srdClasses = compendium ? await compendium.getIndex() : []
        }
        const classes = [];
        for (const [cls, level] of Object.entries(request.character.classes)) {
            const itemIdx = this._srdClasses.find(c => c.name.toLowerCase() == cls.toLowerCase());
            let item = null;
            if (itemIdx) {
                const compendium = game.packs.get("dnd5e.classes")
                item = compendium && await compendium.getEntry(itemIdx._id);
            }
            if (!item) {
                item = {
                    data: this._getDefaultTemplate('Item', 'class'),
                    effects: [],
                    flags: {},
                    folder: null,
                    img: request.character.avatar,
                    name: cls,
                    sort: 0,
                    type: 'class'
                };
            }
            item.name = cls;
            item.data.levels = parseInt(level);
            classes.push(item);
        }
        
    
        return {name: request.character.name, type, flags: {}, img: request.character.avatar, data: actorData, items: [...classes]}
    }
    static createItemData(request) {
        let itemData = null;
        let type = "feat";
        switch (request.type) {
            default:
            case 'feature':
                type = 'feat';
                itemData = this._getDefaultTemplate('Item', type);
                itemData.requirements = `${request.source}: ${request['source-type']}`;
                break;
            case 'trait':
                type = 'feat';
                itemData = this._getDefaultTemplate('Item', type);
                break;
            case 'item':
                type = 'equipment';
                itemData = this._getDefaultTemplate('Item', type);
                itemData.rarity = request['item-type'];
                break;
            case 'action':
                type = 'feat';
                itemData = this._getDefaultTemplate('Item', type);
                break;
            case 'spell-card': 
                type = 'spell';
                itemData = this._getDefaultTemplate('Item', type);
                this._fillSpellData(request, itemData);
                break;
            case 'spell-attack':
                type = 'spell';
                itemData = this._getDefaultTemplate('Item', type);
                this._fillSpellData(request, itemData);
                break;
            case 'attack':
                type = 'weapon';
                itemData = this._getDefaultTemplate('Item', type);
                break;
        }
        if (!itemData) {
            itemData = this._getDefaultTemplate('Item', type);
        }
        itemData.source = "Beyond20";
        itemData.description.value = request.description.replace(/\n/g, "</br>");
        return {
            data: itemData,
            effects: [],
            flags: {},
            folder: null,
            img: request.preview || request.character.avatar,
            name: request.name,
            sort: 0,
            type: type
        };
    }

    static _fillSpellData(request, itemData) {
        const castingTime = request['casting-time'];
        const cost = parseInt(castingTime) || "";
        const activation = castingTime.slice(cost.toString().length).trim().toLowerCase();
        itemData.activation.cost = cost;
        itemData.activation.type = activation === "bonus action" ? "bonus" : activation;
        
        let components = request.components;
        while (components != "") {
            if (components[0] == "V") {
                itemData.components.vocal = true;
                components = components.slice(1);
            } else if (components[0] == "S") {
                itemData.components.somatic = true;
                components = components.slice(1);
            } else if (components[0] == "M") {
                itemData.components.material = true;
                itemData.materials.value = components.slice(2, -1);
                components = "";
            }
            if (components.startsWith(", ")) {
                components = components.slice(2);
            }
        }
        itemData.components.concentration = request.concentration;
        itemData.components.ritual = request.ritual;
        
        for (const [school, name] of Object.entries(CONFIG.DND5E.spellSchools)) {
            if (request['level-school'].includes(name)) {
                itemData.school = school;
                break;
            }
        }
        itemData.level = parseInt(request['cast-at'] || request['level-school']) || 0;
        itemData.duration.value = parseInt(request.duration) || "";
        itemData.duration.units = request.duration.slice(itemData.duration.value.toString().length).trim().toLowerCase();
        if (itemData.duration.units === "instantaneous") itemData.duration.units = "inst";
        const rangeMatch = request.range.match(/(?:^([^\/]+)\/(.+)$)|(?:(.*?) \((.*?)\))/)
        let range = request.range;
        let target = "";
        if (rangeMatch) {
            range = rangeMatch[1] || rangeMatch[3];
            target = rangeMatch[2] || rangeMatch[4];
        }
        switch (range) {
            case "Touch":
                itemData.range.units = "touch";
                break;
            case "Sight":
                itemData.range.units = "spec";
                break;
            case "Self":
                itemData.range.units = "self";
                break;
            case "Unlimited":
                itemData.range.units = "any";
                break;
            default:
                itemData.range.value = parseInt(range) || 0;
                itemData.range.units = range.includes("mile") ? "mi" : range.includes("ft") ? "ft" : "";
                break;
        }
        // TODO: Need aoe size from Beyond20 which isn't yet exported
        if (target) {
            itemData.target.value = parseInt(target) || 0;
            itemData.target.units = target.includes("mile") ? "mi" : target.includes("ft") ? "ft" : "";
            if (request.description.match(/\ssphere\s/i)) {
                itemData.target.type = "sphere"
            } else if (request.description.match(/\scone\s/i)) {
                itemData.target.type = "cone"
            } else if (request.description.match(/\scube\s/i)) {
                itemData.target.type = "cube"
            } else if (request.description.match(/\scylinder\s/i)) {
                itemData.target.type = "cylinder"
            } else if (request.description.match(/\sline\s/i)) {
                itemData.target.type = "line"
            } else if (request.description.match(/\square\s/i)) {
                itemData.target.type = "square"
            }
        }

        request.description = request.description.replace("At Higher Levels.", "<strong>At Higher Levels.</strong>");
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

    static async rollInitiative(request) {
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

    static async rollSkill(request) {
        const actorData = await this.createActorData(request);
        const token = this.findToken(request);
        
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
    }

    static async rollSavingThrow(request) {
        const actorData = await this.createActorData(request);
        const token = this.findToken(request);
        
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
    }
    
    static async rollAbility(request) {
        const actorData = await this.createActorData(request);
        const token = this.findToken(request);
        
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
    }

    static async rollItems(request) {
        const actorData = await this.createActorData(request);
        const token = this.findToken(request);

        const item = this.createItemData(request);
        actorData.items.push(item);
        const actor = new CONFIG.Actor.entityClass(actorData, {token});
        const actorItem = actor.items.entries.find(i => i.type === item.type && i.name === item.name);

        const template = game.dnd5e.canvas.AbilityTemplate.fromItem(actorItem);
        if ( template ) template.drawPreview();
        const rollMode = request.whisper === 0 ? "roll" : "gmroll";
        actorItem.displayCard({rollMode, createMessage: true});
    }

    static handleBeyond20Request(action, request) {
        if (action !== "roll") return;
        switch (request.type) {
            case "skill":
                this.rollSkill(request);
                return false;
            case "saving-throw":
                this.rollSavingThrow(request);
                return false;
            case "ability":
                this.rollAbility(request);
                return false;
            case "initiative":
                this.rollInitiative(request);
                return false;
            case 'feature':
            case 'trait':
            case 'item':
            case 'attack':
            case 'action':
            case 'spell-attack':
            case 'spell-card':
                this.rollItems(request);
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
