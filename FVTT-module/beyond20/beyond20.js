

class Beyond20 {
    static getMyActor() {
        return game.actors.find(a => a.isOwner && a.getFlag("beyond20", "user") === game.userId);
    }
    static async getUpdatedActor(request, items=[]) {
        const actorData = await this.createActorData(request);
        const existing = this.getMyActor();
        actorData.items.push(...items);
        if (existing) {
            await existing.update(actorData, {diff: false, recursive: false});
            return existing;
        } else {
            const actor = await Actor.create(actorData);
            return actor;
        }
    }

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
        const baseAttributes = {
            name: request.character.name || request.name,
            type,
            flags: {
                beyond20: {
                    user: game.user.id
                }
            },
            permission: {
                [game.userId]: CONST.ENTITY_PERMISSIONS.OWNER
            }
        };
        if (!["Character", "Monster", "Creature"].includes(request.character.type)) {
            return {...baseAttributes, img: "icons/svg/mystery-man.svg", data: actorData, items: []}
        }
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

        // Override spell slots so there's always one of each level 
        for (let i = 1; i <= 9; i++) {
            actorData.spells[`spell${i}`].override = 1;
            actorData.spells[`spell${i}`].value = 1;
            actorData.spells[`spell${i}`].max = 1;
        }
        // Create a spell level of `true` because of https://gitlab.com/foundrynet/dnd5e/-/issues/1025
        actorData.spells[true] = {value: 1, max: 1, override: 1};

        // Cache SRD classes compendium
        if (!this._srdClasses) {
            const compendium = game.packs.get("dnd5e.classes")
            this._srdClasses = compendium ? await compendium.getIndex() : []
        }
        const classes = [];
        for (const [cls, level] of Object.entries(request.character.classes || {})) {
            const itemIdx = this._srdClasses.find(c => c.name.toLowerCase() == cls.toLowerCase());
            let item = null;
            if (itemIdx) {
                const compendium = game.packs.get("dnd5e.classes")
                const document = compendium && await compendium.getDocument(itemIdx._id);
                if (document) {
                    item = duplicate(document.data);
                    delete item._id;
                }
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
        
    
        return {...baseAttributes, img: request.character.avatar, data: actorData, items: [...classes]}
    }
    static findToken(request) {
        let token = null;
        if (request.character.name) {
            const name = request.character.name.toLowerCase().trim();
            token = canvas.tokens.placeables.find((t) => t.owner && t.name.toLowerCase().trim() == name);
        }
        return token || canvas.tokens.controlled[0];
    }
    static async callOnToken(actor, token, callback) {
        if (!token) return callback();

        const originalActor = token._actor;
        try {
            token._actor = actor;
            await callback();
        } finally {
            token._actor = originalActor;
        }
    }
    static createActor(request, data) {
        const token = this.findToken(request);
        const actor = new CONFIG.Actor.entityClass(data, {token});
        // Need to override the update method because a spell will try to consume a slot automatically and will fail because the actor is
        // temporary
        actor.update = function (d) {
            mergeObject(this._data, d, {diff: true});

            // Trigger follow-up actions and return
            this._onUpdate(d, {diff: true}, game.user.id);
        }
        return actor;
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
                this._buildAttackData(request, itemData);
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
        const range = request.range;
        const target = request.aoe;
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
        if (target) {
            itemData.target.value = parseInt(target) || 0;
            itemData.target.units = target.includes("mile") ? "mi" : target.includes("ft") ? "ft" : "";
            itemData.target.type = request['aoe-shape'].toLowerCase();
        }

        this._buildAttackData(request, itemData);

        request.description = request.description.replace("At Higher Levels.", "<strong>At Higher Levels.</strong>");
    }

    static _buildAttackData(request, itemData) {
        if (request["save-dc"] !== undefined) {
            const ability = (request["save-ability"] || "").toLowerCase();
            itemData.actionType = "save";
            itemData.save = {
                ability: ability.slice(0, 3),
                scaling: "flat",
                dc: request["save-dc"],
                value: request["save-dc"]
            };
        }
        if (request['to-hit'] !== undefined) {
            if (request['attack-source'] === "spell") {
                itemData.actionType = request['attack-type'] === "Melee" ? "msak" : "rsak";
            } else {
                itemData.actionType = request['attack-type'] === "Melee" ? "mwak" : "rwak";
            }
            // TODO: set the correct ability and magical bonus to match the to-hit value
        }
        if (request.damages) {
            const damages = [];
            for (let i = 0; i < request.damages.length; i++) {
                let damage = request.damages[i];
                let type = (request['damage-types'][i] || "").trim();
                // Add damage type in the flavor text for each damage
                if (/^[0-9]+d[0-9]+$/.test(damage.trim())) {
                    damage = `${damage}[${type}]`;
                } else {
                    damage = `{${damage}}[${type}]`;
                }
                if (CONFIG.DND5E.damageTypes[type.toLowerCase()]) {
                    type = type.toLowerCase();
                } else {
                    type = "";
                }
                damages.push([damage, type]);
            }
            itemData.damage.parts = damages;
        }
        // Weapon properties
        if (request.properties) {
            for (const prop in game.dnd5e.config.weaponProperties) {
                itemData.properties[prop] = !!request.properties.find(p => p.toLowerCase().trim() === game.dnd5e.config.weaponProperties[prop].toLowerCase());
            }
        }
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
        //await token.actor.rollInitiative({createCombatants: true, rerollInitiative: true})
        return true;
    }

    static async rollSkill(request) {
        const actor = await this.getUpdatedActor(request);
        const actorData = actor.data;
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
        this.callOnToken(actor, token, () => {
            game.dnd5e.dice.d20Roll(rollOptions);
        });
        return true;
    }

    static async rollSavingThrow(request) {
        const actor = await this.getUpdatedActor(request);
        const actorData = actor.data;
        const token = this.findToken(request);
        
        const abl = request.ability.toLowerCase();
        const mod = parseInt(request.modifier)
        const proficient = mod >= actorData.data.abilities[abl].mod + actorData.data.attributes.prof;
        const calculated = actorData.data.abilities[abl].mod + proficient * actorData.data.attributes.prof;
        const bonus = mod - calculated;

        actorData.data.abilities[abl].proficient = proficient;
        actorData.data.abilities[abl].save = calculated;
        actorData.data.bonuses.abilities.save = bonus;
        
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
        this.callOnToken(actor, token, () => {
            game.dnd5e.dice.d20Roll(rollOptions);
        });
        return true;
    }
    
    static async rollAbility(request) {
        const actor = await this.getUpdatedActor(request);
        const token = this.findToken(request);
        
        const abl = request.ability.toLowerCase();
        const mod = parseInt(request.modifier)
        const bonus = mod - actor.data.data.abilities[abl].mod;

        actor.data.data.bonuses.abilities.check = bonus;
        
        // Compose roll parts and data
        const parts = ["@mod"];
        const data = {mod: actor.data.data.abilities[abl].mod};

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
        this.callOnToken(actor, token, () => {
            game.dnd5e.dice.d20Roll(rollOptions);
        });
        return true;
    }

    static async rollItems(request) {
        const item = this.createItemData(request);
        const actor = await this.getUpdatedActor(request, [item]);
        const actorItem = actor.items.find(i => i.type === item.type && i.name === item.name);

        const template = game.dnd5e.canvas.AbilityTemplate.fromItem(actorItem);
        if ( template ) template.drawPreview();
        const rollMode = request.whisper === 0 ? "roll" : "gmroll";
        
        const roll = ['attack', 'spell-attack'].includes(request.type);
        actorItem[roll ? 'roll' : 'displayCard']({configureDialog: false, rollMode, createMessage: true});
        return true;
    }

    static handleBeyond20Request(action, request) {
        if (action !== "roll") return;
        if (!game.settings.get("beyond20", "nativeRolls")) return;
        // return false to interrupt the beyond20 
        switch (request.type) {
            case "skill":
                return !this.rollSkill(request);
            case "saving-throw":
                return !this.rollSavingThrow(request);
            case "ability":
                return !this.rollAbility(request);
            case "initiative":
                return !this.rollInitiative(request);
            case 'feature':
            case 'trait':
            case 'item':
            case 'attack':
            case 'action':
            case 'spell-attack':
            case 'spell-card':
                return !this.rollItems(request);
            default:
                break;
        }
    }
    /**
     * Add Chat Damage buttons to Beyond20 chat messages;
     */
    static handleChatMessage(message, html, data) {
        if (!game.settings.get("beyond20", "damageButtons")) return;
        const damages = html.find(".beyond20-message .beyond20-roll-damage, .beyond20-message .beyond20-total-damage");
        if (damages.length === 0) return;
        for (let i = 0; i < damages.length; i++) {
            this._addChatDamageButtons(damages.eq(i));
        }
    }
    static _addChatDamageButtons(roll) {
        let valueSpan = roll.find(".beyond20-roll-value");
        if (valueSpan.length === 0) {
            // Fall back for old chat message
            valueSpan = roll.find(".beyond20-tooltip > span:first-child");
            if (valueSpan.length === 0) return;
        }
        const damage = parseInt(valueSpan.text());
        if (isNaN(damage)) return;
        //const isTotal = roll.hasClass("beyond20-total-damage");
        //const isCritical = roll.hasClass("beyond20-critical-damage");
        //const isHealing = roll.hasClass("beyond20-healing");
        const container = $(`
        <span class="beyond20-chat-damage-buttons-container">
          <i class="fas fa-long-arrow-alt-left"></i>
          <span class="beyond20-chat-damage-buttons"></span>
        </span>`)
        const buttonContainer = container.find(".beyond20-chat-damage-buttons");
        const buttons = [
            {
                multiplier: 1,
                icon: "user-minus",
                label: "Apply Damage",
                color: "Crimson",
                visible: true
            },
            {
                multiplier: 0.5,
                icon: "user-shield",
                label: "Apply Half Damage",
                color: "LightCoral",
                visible: true
            },
            {
                multiplier: 2,
                icon: "user-plus",
                label: "Apply Double Damage",
                color: "Red",
                visible: true
            },
            {
                multiplier: -1,
                icon: "first-aid",
                label: "Apply Healing",
                color: "LightGreen",
                visible: true
            },
        ];
        for (const data of buttons) {
            if (!data.visible) continue;
            const button = $(`<button title="${data.label}" style="background-color: ${data.color};"><i class="fas fa-${data.icon}"></i></button>`);
            button.on('click', async () => {
                for (const token of canvas.tokens.controlled) {
                    await token.actor?.applyDamage(damage, data.multiplier);
                };
            })
            buttonContainer.append(button);
        }
        roll.append(container);
    }
}

class Beyond20CreateNativeActorsApplication extends FormApplication {
    async render() {
        if (!game.user.isGM) {
            return ui.notifications.error("Only the GM can create actors for Beyond20.");
        }
        let folder = game.folders.find(f => f.name === "Beyond20" && f.type === "Actor");
        if (!folder) {
            folder = await Folder.create({name: "Beyond20", type: "Actor"});
        }
        for (const user of game.users.contents) {
            const actor = game.actors.find(a => a.getFlag("beyond20", "user") === user.id);
            if (!actor) {
                await Actor.create({
                    name: user.name,
                    type: "character",
                    img: "modules/beyond20/images/icons/icon256.png",
                    folder: folder.id,
                    flags: {
                        beyond20: {
                            user: user.id
                        }
                    },
                    permission: {
                        [user.id]: CONST.ENTITY_PERMISSIONS.OWNER
                    }
                });
                ui.notifications.info(`Created Beyond20 Actor for user ${user.name}`);
            }
        }
        ui.notifications.info("Beyond20 Actors creation completed.");
    }
}

Hooks.on('beyond20Request', (action, request) => Beyond20.handleBeyond20Request(action, request))
Hooks.on("renderChatMessage", (message, html, data) => Beyond20.handleChatMessage(message, html, data));

Hooks.on('init', function () {
    game.settings.register("beyond20", "notifyAtLoad", {
        name: "Notify player to activate Beyond20",
        hint: "Beyond20 extension doesn't load automatically for Foundry unless permission is granted. The module can show a notification to remind the player to activate it for the current tab.",
        scope: "client",
        config: true,
        default: true,
        type: Boolean
    });
    /**
     * Inspired by chatdamagebuttons-beyond20 module by Victor Ling: https://gitlab.com/Ionshard/foundry-vtt-chatdamagebuttons-beyond20/
     */
    game.settings.register("beyond20", "damageButtons", {
        name: "Add chat damage buttons",
        hint: "Adds chat damage buttons to rolls to more easily apply damage or healing to tokens",
        scope: "client",
        config: true,
        default: true,
        type: Boolean
    });
    game.settings.register("beyond20", "nativeRolls", {
        name: "Use Foundry native rolls (EXPERIMENTAL)",
        hint: "If enabled, will use Foundry native rolls instead of the Beyond20 roll renderer. Cannot work when D&D Beyond Digital Dice are enabled. All Beyond20 features may not be supported.",
        scope: "client",
        config: true,
        default: false,
        type: Boolean,
        onChange: async (v) => {
            if (!v) return;
            if (!isNewerVersion(game.data.version || game.version, "0.8.8")) {
                ui.notifications.warn(`Cannot enable Beyond20 native rolls on Foundry VTT v${game.data.version}. Please upgrade to version 0.8.9 or newer.`);
                return game.settings.set("beyond20", "nativeRolls", false);
            }
            if (Actor.canUserCreate(game.user)) return true;
            if (!Beyond20.getMyActor()) {
                ui.notifications.warn(`Cannot enable Beyond20 native rolls because native actor doesn't exist. Please ask your GM to create the actors from the Beyond20 module settings.`, {permanent: true});
                return game.settings.set("beyond20", "nativeRolls", false);
            }
        }
    });
    game.settings.registerMenu("beyond20", "createNativeActors", {
        name: "Create native rolls Actors",
        label: "Create Actors",      // The text label used in the button
        hint: "Creates a Beyond20 native rolls actor for each user (if one doesn't exist), allowing them to use the native rolls feature.",
        icon: "fas fa-users",
        type: Beyond20CreateNativeActorsApplication,   // A FormApplication subclass which should be created
        restricted: true
    });
});

Hooks.on('ready', function () {
    if (game.settings.get("beyond20", "nativeRolls")  && !Actor.canUserCreate(game.user)) {
        if (!Beyond20.getMyActor()) {
            ui.notifications.warn(`Cannot enable Beyond20 native rolls because native actor doesn't exist. Please ask your GM to create the actors from the Beyond20 module settings.`, {permanent: true});
            game.settings.set("beyond20", "nativeRolls", false);
        }
    }
    if (game.settings.get("beyond20", "notifyAtLoad") && !game.beyond20) {
        dialog = new Dialog({
            title: `Beyond20`,
            content: "<p>Beyond20 does not load automatically for FVTT games on custom domains.</p>" +
                "<p>If you wish to use Beyond20, please activate it by clicking on the <img style='border: 0px; vertical-align: middle;' src='modules/beyond20/images/icons/icon20.png'/> icon in your browser's toolbar.</p>" +
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
