var settings = getDefaultSettings();
var extension_url = "/modules/beyond20/";
var fvttVersion = game.version || game.data?.version;
//isNewerVersion is deprecated in Foundry 12
const fvtt_isNewer = window.foundry && foundry.utils && foundry.utils.isNewerVersion ? (v1, v0) => foundry.utils.isNewerVersion(v1, v0) : isNewerVersion;
// getProperty is deprecated in Foundry 13
const fvtt_getProperty = window.foundry && foundry.utils && foundry.utils.getProperty ? (obj, path) => foundry.utils.getProperty(obj, path) : getProperty;
// Die and PoolTerm moved under foundry.dice.terms in Foundry 13
const fvtt_Die = window.foundry && foundry.dice?.terms?.Die ? foundry.dice.terms.Die : Die;
const fvtt_PoolTerm = window.foundry && foundry.dice?.terms?.PoolTerm ? foundry.dice.terms.PoolTerm : PoolTerm;
// v10 uses .document for Placeables (tokens), or the Base object itself, instead of .data field
// We use the new fields to avoid spamming the log with deprecation warnings
const docData = (doc) => fvtt_isNewer(fvttVersion, "10") ? doc.document || doc : doc.data;
// Determine ownership of a Foundry document without triggering deprecated getters
const docIsOwner = (doc) => {
    if (doc && 'isOwner' in doc) return doc.isOwner;
    return doc?.owner;
};

class FVTTDisplayer {
    postHTML(request, title, html, character, whisper, play_sound, source, attributes, description, attack_rolls, roll_info, damage_rolls, total_damages, open) {
        const hookName = fvtt_isNewer(fvttVersion, "13") ? 'renderChatMessageHTML' : 'renderChatMessage';
        Hooks.once(hookName, (chat_message, html, data) => {
            if (!(html instanceof jQuery)) html = $(html);
            const icon = extension_url + "images/icons/badges/custom20.png";
            html.find(".ct-beyond20-custom-icon").attr('src', icon);
            html.find(".ct-beyond20-custom-roll").on('click', (event) => {
                const roll = $(event.currentTarget).find(".beyond20-roll-formula").text();
                roll_renderer.rollDice(request, title, roll);
            });
            html.find(".beyond20-button-roll-damages").on('click', (event) => {
                request.rollAttack = false;
                request.rollDamage = true;
                request.rollCritical = attack_rolls.some(r => !r.discarded && r["critical-success"])
                roll_renderer.handleRollRequest(request)
            });
        });
        return this._postChatMessage(html, character, whisper, play_sound, attack_rolls, damage_rolls);
    }

    _postChatMessage(message, character, whisper, play_sound = false, attack_rolls, damage_rolls) {
        const MESSAGE_STYLES = CONST.CHAT_MESSAGE_STYLES || CONST.CHAT_MESSAGE_TYPES || CHAT_MESSAGE_STYLES || CHAT_MESSAGE_TYPES;
        const styleProp = fvtt_isNewer(fvttVersion, "13") ? "style" : "type";
        const data = {
            "content": message,
            "user": game.user?.id || game.user?._id,
            "speaker": this._getSpeakerByName(character)
        }
        const rollMode = this._whisperToRollMode(whisper);
        if (["gmroll", "blindroll"].includes(rollMode)) {
            data["whisper"] = (ChatMessage.getWhisperRecipients || ChatMessage.getWhisperIDs).call(ChatMessage, "GM");
            data[styleProp] = MESSAGE_STYLES.WHISPER;
            if (rollMode == "blindroll")
                data["blind"] = true;
        } else {
            data[styleProp] = MESSAGE_STYLES.OOC;
        }
        if (play_sound)
            data["sound"] = CONFIG.sounds.dice;
        // If there are attack roll(s) or damage_roll(s)
        // Build a dicePool, attach it to a Roll, then attach it to the ChatMessage
        // Then set ChatMessage type to "ROLL"
        if (attack_rolls.length > 0 || damage_rolls.length > 0) {
            const rolls = [...attack_rolls, ...damage_rolls.map(d => d[1]).filter(r => !!r && typeof(r) !== "string")];
            // Transforms DNDBRolls -> FVTTRolls
            const fvttRolls = rolls.map(r => {
                if (r instanceof FVTTRoll) { return r._roll; }
                const dice = [];
                const result = []
                const parts = [];
                r.class = "Roll";
                if (fvtt_isNewer(fvttVersion, "0.8")) {
                    // Foundry 0.8.x API
                    r.parts.forEach(p => {
                        let term;
                        if (p.formula) {
                            term = {
                                class: "Die",
                                evaluated: true,
                                expression: p.formula,
                                options: {},
                                number: p.amount,
                                faces: p.faces,
                                modifiers: [],
                                results: p.rolls.map(roll => ({active: !roll.discarded, result: roll.roll}))
                            };
                        } else {
                            const numeric = parseFloat(p);
                            term = {
                                class: isNaN(numeric) ? "OperatorTerm" : "NumericTerm",
                                evaluated: true,
                                expression: isNaN(numeric) ? p : numeric,
                                operator: isNaN(numeric) ? p : undefined,
                                number: isNaN(numeric) ? undefined : numeric,
                                options: {}
                            };
                        }
                        if (term.class !== "OperatorTerm" &&
                            parts.length > 0 && parts[parts.length - 1].class !== "OperatorTerm") {
                            parts.push({
                                class: "OperatorTerm",
                                evaluated: true,
                                expression: "+",
                                operator: "+",
                                options: {}
                            });
                        }
                        parts.push(term);
                    });
                    r.parts = undefined;
                    r.terms = parts;
                } else if (fvtt_isNewer(fvttVersion, "0.7")) {
                    r.parts.forEach(p => {
                        if (parts.length > 0 && !["+", "-"].includes(parts[parts.length - 1])) parts.push("+");
                        if (p.formula) {
                            result.push(p.total)
                            parts.push({
                                class: "Die",
                                options: {},
                                number: p.amount,
                                faces: p.faces,
                                modifiers: [],
                                results: p.rolls.map(roll => ({active: !roll.discarded, result: roll.roll}))
                            });
                        } else {
                            parts.push(p)
                            result.push(p)
                        }
                    })
                    r.dice = [];
                    r.terms = parts;
                    r.parts = undefined;
                    r.result = result.join(" + ")
                } else {
                    r.parts.forEach(p => {
                        if (parts.length > 0) parts.push("+");
                        if (p.formula) {
                            const idx = dice.length;
                            p.class = "Die";
                            dice.push(p)
                            result.push(p.total)
                            parts.push(`_d${idx}`);
                        } else {
                            parts.push(p)
                            result.push(p)
                        }
                    })
                    r.dice = dice;
                    r.parts = parts;
                    r.result = result.join(" + ")
                }
                return Roll.fromData(r)
            });
            if (fvtt_isNewer(fvttVersion, "10")) {
                data.rolls = fvttRolls;
            } else if (fvtt_isNewer(fvttVersion, "0.8")) {
                // Foundry 0.8.x API
                // This will accept backware compatible fvttRolls format
                const pool = fvtt_PoolTerm.fromRolls(fvttRolls);
                data.roll = Roll.fromTerms([pool]);
            } else if (fvtt_isNewer(fvttVersion, "0.7")) {
                // Foundry 0.7.x API
                // This will accept backware compatible fvttRolls format
                const pool = new DicePool({rolls: fvttRolls}).evaluate();
                const pool_roll = Roll.create(pool.formula);
                pool_roll.terms = [pool];
                pool_roll.results = [pool.total];
                pool_roll._total = pool.total;
                pool_roll._rolled = true;
                data.roll = pool_roll;
            } else {
                // Foundry 0.6.x API
                const pool = new DicePool(fvttRolls).roll();
                const formulas = pool.dice.map(d => d.formula);
                const pool_roll = new Roll(`{${formulas.join(",")}}`);
                pool_roll._result = [pool.total];
                pool_roll._total = pool.total;
                pool_roll._dice = pool.dice;
                pool_roll.parts = [pool];
                pool_roll._rolled = true;
                data.roll = pool_roll;
            }
            if (!fvtt_isNewer(fvttVersion, "13")) {
                data[styleProp] = MESSAGE_STYLES.ROLL;
            }
        }
        return ChatMessage.create(data, {rollMode});
    }

    _getSpeakerByName(name) {
        if (name === null)
            return ChatMessage.getSpeaker();
        const actors = game.actors?.contents || game.actors?.entities || game.actors; // v13 compatibility
        const actor = actors.find((actor) => docData(actor).name.toLowerCase() == name.toLowerCase());
        const speaker = ChatMessage.getSpeaker({ actor });
        speaker.alias = name;
        return speaker;
    }

    _whisperToRollMode(whisper) {
        try {
            return {
                [WhisperType.NO]: "roll",
                [WhisperType.HIDE_NAMES]: "roll",
                [WhisperType.YES]: "gmroll",
                [WhisperType.QUERY]: game.settings.get("core", "rollMode")
            }[whisper];
        } catch (err) {
            return game.settings.get("core", "rollMode");
        }
    }

    displayError(message) {
        ui.notifications.error(message);
    }
}

class FVTTRoll extends Beyond20BaseRoll {
    constructor(formula, data = {}) {
        super(formula, data);
        this._roll = new Roll(this._formula, data)
    }

    get total() {
        return this._roll.total;
    }

    get formula() {
        return this.cleanupFormula(this._roll.formula);
    }

    get dice() {
        // 0.7.x Dice Roll API is different
        if (fvtt_isNewer(fvttVersion, "0.7")) {
            return this._roll.dice.map(d => {
                return {
                    amount: d.amount || d.number,
                    faces: d.faces,
                    formula: d.formula,
                    total: d.total,
                    rolls: d.results.map(r => ({discarded: r.discarded || r.rerolled, roll: r.result}))
                }
            });
        } else {
            return this._roll.dice;
        }
    }

    get parts() {
        // 0.7.x Dice Roll API is different
        if (fvtt_isNewer(fvttVersion, "0.8")) {
            return this._roll.terms.map(t => {
                if (t instanceof fvtt_Die) {
                    return {
                        amount: t.amount || t.number,
                        faces: t.faces,
                        formula: t.formula,
                        total: t.total,
                        rolls: t.results.map(r => ({discarded: r.discarded || r.rerolled, roll: r.result}))
                    }
                } else if (t instanceof fvtt_PoolTerm) {
                    const dice = t.rolls[0]?.dice[0];
                    // A DicePool means a "minX", so don't include it in the roll results
                    const results = t.results.slice(0, t.results.length - 1);
                    return {
                        amount: dice ? dice.amount || dice.number : 0,
                        faces: dice ? dice.faces : 0,
                        formula: t.formula,
                        total: t.total,
                        rolls: results.map(r => ({discarded: r.discarded || r.rerolled, roll: r.result})),
                        modifiers: t.modifiers.join("")
                    }
                } else {
                    return t.expression;
                }
            });
        } else if (fvtt_isNewer(fvttVersion, "0.7")) {
            return this._roll.terms.map(t => {
                if (t instanceof fvtt_Die) {
                    return {
                        amount: t.amount || t.number,
                        faces: t.faces,
                        formula: t.formula,
                        total: t.total,
                        rolls: t.results.map(r => ({discarded: r.discarded || r.rerolled, roll: r.result}))
                    }
                } else if (t instanceof DicePool) {
                    const dice = t.rolls[0]?.dice[0];
                    // A DicePool means a "minX", so don't include it in the roll results
                    const results = t.results.slice(0, t.results.length - 1);
                    return {
                        amount: dice ? dice.amount || dice.number : 0,
                        faces: dice ? dice.faces : 0,
                        formula: t.formula,
                        total: t.total,
                        rolls: results.map(r => ({discarded: r.discarded || r.rerolled, roll: r.result})),
                        modifiers: t.modifiers.join("")
                    }
                } else {
                    return String(t);
                }
            });
        } else {
            return this._roll.parts;
        }
    }

    cleanupFormula(formula) {
        formula = formula.replace(/ro(=|<|<=|>|>=)([0-9]+)/g, "r$1$2");
        formula = formula.replace(/(^|\s)+(\d+d\d+)min(\d+)([^\s\+\-]*)/g, "$1{$2$4, $3}kh1");
        return super.cleanupFormula(formula);
    }


    async getTooltip() {
        const tooltip = await this._roll.getTooltip();
        // Automatically expand the roll details in the tooltip
        return tooltip.replace(/<div class="dice-tooltip">/g, `<div class="dice-tooltip" style="display: block;">`)
    }

    async roll() {
        if (typeof this._roll.evaluate === "function") {
            await this._roll.evaluate();
        } else {
            await this._roll.roll();
        }
        return this;
    }

    async reroll() {
        if (typeof this._roll.reroll === "function") {
            this._roll = await this._roll.reroll();
        } else if (typeof this._roll.evaluate === "function") {
            await this._roll.evaluate();
        }
        return this;
    }
}

class FVTTRoller {
    roll(formula, data) {
        return new FVTTRoll(formula, data);
    }
    async resolveRolls(name, rolls) {
        return Promise.all(rolls.map(roll => roll.roll()))
    }
}


class FVTTPrompter {
    prompt(title, html, ok_label = "OK", cancel_label = "Cancel") {
        return new Promise((resolve, reject) => {
            const icon = `<img style="border: 0px;" src="${extension_url}images/icons/icon20.png"></img>`;
            let ok_pressed = false;
            new Dialog({
                "title": title,
                "content": html,
                "buttons": {
                    "ok": {
                        "label": ok_label,
                        "icon": icon,
                        "callback": () => ok_pressed = true
                    },
                    "cancel": { "label": cancel_label }
                },
                "default": "ok",
                "close": (html) => resolve(ok_pressed ? html : null)
            }).render(true);
        });
    }
}

var roll_renderer = new Beyond20RollRenderer(new FVTTRoller(), new FVTTPrompter(), new FVTTDisplayer());
roll_renderer.setBaseURL(extension_url);
roll_renderer.setSettings(settings);

function rollInitiative(request, custom_roll_dice = "") {
    roll_renderer.handleRollRequest(request).then((roll) => {
        if (roll && settings["initiative-tracker"])
            addInitiativeToCombat(roll);
    });
}

function popAvatar(request, sendToDiscord=true) {
    const popout = fvtt_isNewer(fvttVersion, "13") ? 
        new foundry.applications.apps.ImagePopout({
            "src": request.character.avatar,
            "shareable": false,
            "window": {"title": (request.whisper !== WhisperType.NO) ? settings["hidden-monster-replacement"] : request.character.name},
            "entity": { "type": "User", "id": game.user.id }
        }) :
        new ImagePopout(request.character.avatar, {
            "shareable": false,
            "title": (request.whisper !== WhisperType.NO) ? settings["hidden-monster-replacement"] : request.character.name,
            "entity": { "type": "User", "id": game.user.id }
        });
    popout.render(true)
    popout.shareImage(true);
    if (sendToDiscord) {
        roll_renderer.displayAvatarToDiscord(request);
    }
}

async function addInitiativeToCombat(roll) {
    if (canvas.tokens.controlled.length > 0) {
        if (game.combat) {
            // Known Issue game.combat.scene are not longer set so you can add combatants from other scenes by mistake
            if (!fvtt_isNewer(fvttVersion, "13") && (game.combat.scene?.id != canvas.scene.id)) {
                ui.notifications.warn("Cannot add initiative to tracker: Encounter was not created for this scene");
            } else {
                for (let token of canvas.tokens.controlled) {
                    combatant = game.combat.getCombatantByToken(token.id);
                    if (fvtt_isNewer(fvttVersion, "9")) {
                        if (combatant) {
                            await game.combat.updateEmbeddedDocuments("Combatant", [{ "_id": docData(combatant)._id, "initiative": roll.total }]);
                        } else {
                            await game.combat.createEmbeddedDocuments("Combatant", [{ "tokenId": token.id, "hidden": docData(token).hidden, "initiative": roll.total }]);
                        }
                    } else {
                        if (combatant) {
                            idField = combatant._id ? "_id" : "id";
                            await game.combat.updateCombatant({ [idField]: combatant[idField], "initiative": roll.total });
                        } else {
                            await game.combat.createCombatant({ "tokenId": token.id, "hidden": docData(token).hidden, "initiative": roll.total });
                        }
                    }
                }
            }
        } else {
            ui.notifications.warn("Cannot add initiative to tracker: no Encounter has been created yet");
        }
    } else {
        ui.notifications.warn("Cannot add initiative to tracker: no token is currently selected");
    }
}


function handleRoll(request) {
    console.log("Received roll request ", request);

    // The hook would return "false" to stop propagation, meaning that it was handled
    const handledNatively = Hooks.call("beyond20Request", request.action, request);
    if (handledNatively === false) return;

    if (request.type == "initiative")
        rollInitiative(request);
    else if (request.type == "avatar")
        popAvatar(request);
    else
        roll_renderer.handleRollRequest(request);
}
function handleRenderedRoll(request) {
    console.log("Received rendered roll request ", request);
    // The hook would return "false" to stop propagation, meaning that it was handled
    const handledNatively = Hooks.call("beyond20Request", request.action, request);
    if (handledNatively === false) return;
    if (request.request.type == "avatar") {
        return popAvatar(request.request, false);
    }

    roll_renderer._displayer.postHTML(request.request, request.title,
        request.html, request.character, request.whisper,
        request.play_sound, request.source, request.attributes,
        request.description, request.attack_rolls, request.roll_info,
        request.damage_rolls, request.total_damages, request.open);
    if (request.request.type === "initiative" && settings["initiative-tracker"]) {
        const initiative = request.attack_rolls.find((roll) => !roll.discarded);
        if (initiative)
            addInitiativeToCombat(initiative);
    }
}

function updateHP(name, current, total, temp) {
    console.log(`Updating HP for ${name} : (${current} + ${temp})/${total}`);
    name = name.toLowerCase().trim();

    const tokens = canvas.tokens.placeables.filter((t) => docIsOwner(t) && t.name.toLowerCase().trim() == name);

    const prefix = fvtt_isNewer(fvttVersion, "10") ? "system": "data";
    const dnd5e_data = {
        [`${prefix}.attributes.hp.value`]: current,
        [`${prefix}.attributes.hp.temp`]: temp,
        [`${prefix}.attributes.hp.max`]: total
    }
    const sws_data = {
        [`${prefix}.health.value`]: current + temp,
        [`${prefix}.health.max`]: total
    }
    if (tokens.length == 0) {
        const actors = game.actors?.contents || game.actors?.entities || game.actors; // v13 compatibility
        const actor = actors.find((a) => docIsOwner(a) && a.name.toLowerCase().trim() == name);
        const systemData = fvtt_isNewer(fvttVersion, "10") ? actor?.system : actor?.data?.data;
        if (actor && fvtt_getProperty(systemData, "attributes.hp") !== undefined) {
            actor.update(dnd5e_data);
        } else if (actor && fvtt_getProperty(systemData, "health") !== undefined) {
            actor.update(sws_data);
        }
    }

    for (let token of tokens) {
        const systemData = fvtt_isNewer(fvttVersion, "10") ? token.actor?.system : token.actor?.data?.data;
        if (token.actor && fvtt_getProperty(systemData, "attributes.hp") !== undefined) {
            token.actor.update(dnd5e_data);
        } else if (token.actor && fvtt_getProperty(systemData, "health") !== undefined) {
            token.actor.update(sws_data);
        }
    }
}


function updateConditions(request, name, conditions, exhaustion) {
    console.log("Updating Conditions for " + name + " : ", conditions, " - exhaustion level : ", exhaustion);
    let display_conditions = conditions;
    if (exhaustion > 0)
        display_conditions = conditions.concat(["Exhausted (Level " + exhaustion + ")"]);
    const message = name + (display_conditions.length == 0 ? " has no active condition" : " is : " + display_conditions.join(", "));
    const MESSAGE_STYLES = CONST.CHAT_MESSAGE_STYLES || CONST.CHAT_MESSAGE_TYPES || CHAT_MESSAGE_STYLES || CHAT_MESSAGE_TYPES;
    const styleProp = fvtt_isNewer(fvttVersion, "13") ? "style" : "type";
    ChatMessage.create({
        "content": message,
        "user": game.user?.id || game.user?._id,
        "speaker": roll_renderer._displayer._getSpeakerByName(name),
        [styleProp]: MESSAGE_STYLES.EMOTE
    });

    // Check for the beyond20 module, if (it's there, we can use its status effects.;
    const module = game.modules.get("beyond20");
    if (module && fvtt_isNewer(module.version || module.data.version, "0.6")) {
        // Update status effects;
        name = name.toLowerCase().trim();

        const tokens = canvas.tokens.placeables.filter((t) => docData(t).name.toLowerCase().trim() === name);
        // look for an actor with the character name and search for a linked token to that actor
        const actors = game.actors?.contents || game.actors?.entities || game.actors; // v13 compatibility
        const actor = actors.find((a) => docIsOwner(a) && a.name.toLowerCase().trim() === name);
        if (actor) {
            const linkedTokens = canvas.tokens.placeables.filter((t) => t.actor && t.actor.id === actor.id);
            // Only add linked tokens that do not name match to avoid duplicate operations
            tokens.push(...linkedTokens.filter((t) => docData(t).name.toLowerCase().trim() !== name));
        }

        const updates = [];
        for (let token of tokens) {
            const effects = docData(token).effects;
            let new_effects = [];

            let new_conditions = conditions.map((c) => c.toLowerCase() + ".svg");
            let defeated = false;
            if (exhaustion > 0) {
                if (exhaustion == 6) {
                    defeated = true;
                } else {
                    new_conditions.push("exhaustion" + exhaustion + ".svg");
                }
            }

            // Remove status effects that have disappeared;
            for (let effect of effects) {
                if (!effect.startsWith("modules/beyond20/conditions/")) {
                    new_effects.push(effect);
                } else {
                    const effect_name = effect.slice(34);
                    if (new_conditions.includes(effect_name)) {
                        new_effects.push(effect);
                        new_conditions = new_conditions.filter((c) => c != effect_name);
                    }
                }
            }
            console.log("From ", effects, "to ", new_effects, " still need to add ", new_conditions);
            new_effects = new_effects.concat(new_conditions.map((c) => "modules/beyond20/conditions/" + c));
            const data = { "_id": docData(token)._id, "effects": new_effects };
            if (defeated) {
                data["overlayEffect"] = "icons/svg/skull.svg";
            }
            updates.push(data);
        }
        if (updates.length > 0) {
            canvas.scene.updateEmbeddedDocuments("Token", updates);
        }
    }
}



function setSettings(new_settings, url) {
    settings = new_settings;
    extension_url = url;
    roll_renderer.setBaseURL(extension_url);
    roll_renderer.setSettings(settings);
}

function disconnectAllEvents() {
    for (let event of registered_events)
        document.removeEventListener(...event);
}

function setTitle() {
    // Look for the chat-controls (pre-v13) or chat-message (v13+) container
    const chatControls = $("#chat-controls, #chat-message");
    if (chatControls.length) {
        const title = document.getElementsByTagName("title")[0];
        const worldTitle = game.world?.title || game.world?.data?.title || "";
        // Make sure the mutation gets triggerred if we reload the extension
        title.textContent = "Foundry Virtual Tabletop";
        title.textContent = `${worldTitle} • Foundry Virtual Tabletop`;
    } else {
        // Wait for the world and UI to be loaded;
        Hooks.once("renderChatLog", setTitle);
    }
    // Mark Beyond20 as loaded as soon as game is defined
    if (game) game.beyond20 = {loaded: true};
    // Re-set the game version on ready in case the game data wasn't initialized on Beyond20 load
    Hooks.on("ready", () => {
        fvttVersion = game.version || game.data?.version;
        game.beyond20 = {loaded: true};
    });
  }

console.log("Beyond20: Foundry VTT Page Script loaded");
const registered_events = [];
registered_events.push(addCustomEventListener("Roll", handleRoll));
registered_events.push(addCustomEventListener("RenderedRoll", handleRenderedRoll));
registered_events.push(addCustomEventListener("NewSettings", setSettings));
registered_events.push(addCustomEventListener("UpdateHP", updateHP));
registered_events.push(addCustomEventListener("UpdateConditions", updateConditions));
registered_events.push(addCustomEventListener("disconnect", disconnectAllEvents));
//const alertify = ui.notifications;
setTitle();
initializeAlertify();
