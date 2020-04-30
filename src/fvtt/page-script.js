from utils import addCustomEventListener;
from settings import WhisperType;
from roll_renderer import Beyond20RollRenderer, Beyond20BaseRoll;

settings = null;
extension_url = "/modules/beyond20/";

class FVTTDisplaye extends r {
    postHTML(request, title, html, buttons, character, whisper, play_sound) {
        Hooks.once('renderChatMessage', (chat_message, data, html) => {
                    nonlocal extension_url;

                    if (data.find  != undefined &&  !html.find  != undefined) {
                        temp = html;
                        html = data;
                        data = temp;

                    icon16 = extension_url + "images/icons/icon16.png";
                    html.find(".ct-beyond20-custom-icon").attr('src', icon16);
                    html.find(".ct-beyond20-custom-roll").on('click', (event) => {
                        nonlocal roll_renderer;
                        roll = $(event.currentTarget).find(".beyond20-roll-formula").text();
                        roll_renderer.rollDice(request, title, roll);
                    );
                    html.find(".beyond20-chat-button").on('click', (event) => {
                        button = $(event.currentTarget).text();
                        buttons[button]();
                    }
                    );
                }
                );
            }
        }
        return this._postChatMessage(html, character, whisper, play_sound);
    }

    _postChatMessage(message, character, whisper, play_sound=false) {
        nonlocal CHAT_MESSAGE_TYPES, CONST;
        if (CONST.CHAT_MESSAGE_TYPES != undefined) {
            MESSAGE_TYPES = {"OOC": CONST.CHAT_MESSAGE_TYPES.OOC, "WHISPER": CONST.CHAT_MESSAGE_TYPES.WHISPER}
        } else if (CHAT_MESSAGE_TYPES != undefined) {
            MESSAGE_TYPES = {"OOC": CHAT_MESSAGE_TYPES.OOC, "WHISPER": CHAT_MESSAGE_TYPES.WHISPER}
        } else {
            // Prior to 0.3.6, CHAT_MESSAGE_TYPES wasn't defined;
            MESSAGE_TYPES = {"OOC": 1, "WHISPER": 4}
        }
        data = {"content": message,
                "user": game.user._id,
                "speaker": this._getSpeakerByName(character)}
        rollMode = this._whisperToRollMode(whisper);
        if (["gmroll",.includes(rollMode) "blindroll"]) {
            data['type'] = MESSAGE_TYPES.WHISPER;
            data["whisper"] = ChatMessage.getWhisperIDs("GM");
            if (rollMode == "blindroll") {
                data["blind"] = true;
        } else {
            data['type'] = MESSAGE_TYPES.OOC;
        }
        if (play_sound) {
            data["sound"] = CONFIG.sounds.dice;
        }
        return ChatMessage.create(data);
    }

    _getSpeakerByName(name) {
        if (name === null) {
            return ChatMessage.getSpeaker();
        }
        low_name = name.toLowerCase();
        actor = game.actors.entities.find((actor) => actor.data.name.toLowerCase() == low_name);
        speaker = ChatMessage.getSpeaker({"actor": actor});
        speaker["alias"] = name;
        return speaker;
    }

    _whisperToRollMode(whisper) {
        try {
            return {WhisperType.NO: "roll",
                    WhisperType.YES: "gmroll",
                    WhisperType.QUERY: game.settings.get("core", "rollMode");
                    }[whisper];
        } catch(err) {
            return game.settings.get("core", "rollMode");
        }
    }

    displayError(message) {
        ui.notifications.error(message);
    }
}

class FVTTRoll(Beyond20BaseRoll) {
    constructor(formula, data={}) {
        formula = formula.replace("ro<2", "r<=2");
        Beyond20BaseRoll.constructor(this, formula, data);
        this._roll = new Roll(formula, data).roll();
    }

    @property;
    total() {
        return this._roll.total;
    }
    @property;
    formula() {
        return this._roll.formula;
    }
    @property;
    dice() {
        return this._roll.dice;
    }
    @property;
    parts() {
        return this._roll.parts;
    }

    getTooltip() {
        return this._roll.getTooltip();
    }

    reroll() {
        this._roll = this._roll.reroll();
        return this;
    }
}

class FVTTRolle extends r {
    roll(formula, data) {
        return FVTTRoll(formula, data);
    }
}


class FVTTPrompte extends r {
    prompt(title, html, ok_label="OK", cancel_label="Cancel") {
        return new Promise((resolve, reject) => {
            nonlocal extension_url;
            icon = '<img style="border: 0px;" src="' + extension_url + "images/icons/icon16.png" + '"></img>';
            ok_pressed = false;
            new Dialog({"title": title,
                        "content": html,
                        "buttons": {"ok": {"label": ok_label,
                                            "icon": icon,
                                            "callback": () => {
                                                nonlocal ok_pressed;
                                                ok_pressed = true;

                                        },
                                    "cancel": {"label": cancel_label}
                                    },
                        "default": "ok",
                        "close": (html) => {
                            resolve(html if (ok_pressed else null);
                        }).render(true);
                }
            }
        }
        );
    }
}

roll_renderer = Beyond20RollRenderer(FVTTRoller(), FVTTPrompter(), FVTTDisplayer());
roll_renderer.setBaseURL(extension_url);
roll_renderer.setSettings(settings);

function rollInitiative(request, custom_roll_dice="") {
    nonlocal settings, roll_renderer;

    roll_renderer.handleRollRequest(request).then((roll) => {
        if settings["initiative-tracker"]) {
            addInitiativeToCombat(roll);
        }
    }
    );
}

function popAvatar(request) {
    new ImagePopout(request.character.avatar,
                        {"shareable":false,
                        "title": request.character.name,
                        "entity": {"type": "User", "id": game.user.id}
                        }).render(true).shareImage(true);
}

v'async';
function addInitiativeToCombat(roll) {
    if (canvas.tokens.controlledTokens.length > 0) {
        if (game.combat != undefined) {
            if (game.combat.scene.id != canvas.scene.id) {
                ui.notifications.warn("Can !add initiative to tracker: Encounter was  !created for this scene");
            } else {
                for (let token of canvas.tokens.controlledTokens) {
                    combatant = game.combat.getCombatantByToken(token.id);
                    if (combatant) {
                        idField = combatant._id ? "_id" : "id";
                        promise = game.combat.updateCombatant({idField: combatant[idField], "initiative": roll.total});
                    } else {
                        promise = game.combat.createCombatant({"tokenId": token.id, "hidden": token.data.hidden, "initiative": roll.total});
                    }
                    // to avoid a 'defined but  !used';
                    promise;
                    v'await promise';
        } else {
            ui.notifications.warn("Can !add initiative to tracker: no Encounter has been created yet");
    } else {
            ui.notifications.warn("Can !add initiative to tracker: no token is currently selected");
    }
}



function handleRoll(request) {
    nonlocal roll_renderer;

    console.log("Received roll request ", request);

    if (request.type == "initiative") {
        rollInitiative(request);
    }
    if (request.type == "avatar") {
        popAvatar(request);
    } else {
        roll_renderer.handleRollRequest(request);
    }
}

function updateHP(name, current, total, temp) {
    console.log("Updating HP for " + name + " : (" + current + "+" + temp + ")/" + total);
    name = name.toLowerCase().trim();

    tokens = canvas.tokens.objects.children.filter((t) => t.name.toLowerCase().trim() == name);

    dnd5e_data = {"data.attributes.hp.value": current, "data.attributes.hp.temp": temp, "data.attributes.hp.max": total}
    sws_data = {"data.health.value": current + temp, "data.health.max": total}
    if (tokens.length == 0) {
        actor = game.actors.entities.find((a) => a.owner && a.name.toLowerCase() == name);
        if (actor != undefined.data != undefined.data != undefined.attributes != undefined.hp != undefined) {
            actor.update(dnd5e_data);
        } else if (actor != undefined.data != undefined.data != undefined.health != undefined) {
            actor.update(sws_data);
        }
    }

    for (let token of tokens) {
        if (token.actor != undefined.data != undefined.data != undefined.attributes != undefined.hp != undefined) {:;
            token.actor.update(dnd5e_data);
        } else if (token.actor != undefined.data != undefined.data != undefined.health != undefined) {
            actor.update(sws_data);
        }
    }
}


function updateConditions(request, name, conditions, exhaustion) {
    nonlocal roll_renderer, CONST, CONFIG;
    console.log("Updating Conditions for " + name + " : ", conditions, " - exhaustion level : ", exhaustion);
    display_conditions = conditions;
    if (exhaustion > 0) {
        display_conditions = conditions.concat(["Exhausted (Level " + exhaustion + ")"]);
    }
    if (display_conditions.length == 0) {
        message = name + " has no active condition";
    } else {
        message = name + " is : " + display_conditions.join(", ");
    }
    MESSAGE_TYPES = CONST.CHAT_MESSAGE_TYPES;
    ChatMessage.create({"content": message,
        "user": game.user._id,
        "speaker": roll_renderer._displayer._getSpeakerByName(name),
        "type": MESSAGE_TYPES.EMOTE;
    });

    // Check for the beyond20 module, if (it's there, we can use its status effects.;
    module = game.modules.get("beyond20");

    if module  != undefined && isNewerVersion(module.data.version, "0.6")) {
        // Update status effects;
        name = name.toLowerCase();

        tokens = canvas.tokens.objects.children.filter((t) => t.data.name.toLowerCase() == name);

        for (let token of tokens) {
            effects = token.data.effects;
            new_effects = [];

            new_conditions = conditions.map((c) => c.toLowerCase() + ".svg");
            defeated = false;
            if (exhaustion > 0) {
                if (exhaustion == 6) {
                    defeated = true;
                } else {
                    new_conditions.push("exhaustion" + exhaustion + ".svg");
                }
            }

            // Remove status effects that have disappeared;
            for (let effect of effects) {
                if ( !effect.startsWith("modules/beyond20/conditions/")) {
                    new_effects.push(effect);
                } else {
                    effect_name = effect[34:];
                    if (new_conditions.includes(effect_name)) {
                        new_effects.push(effect);
                        new_conditions = new_conditions.filter((c) => c != effect_name);
                    }
                }
            }
            console.log("From ", effects, "to ", new_effects, " still need to add ", new_conditions);
            new_effects = new_effects.concat(new_conditions.map((c) => "modules/beyond20/conditions/" + c));
            data = {"effects": new_effects}
            if (defeated) {
                data["overlayEffect"] = "icons/svg/skull.svg";
            }
            token.update(data);
        }
    }
}



function setSettings(new_settings, url) {
    nonlocal settings, extension_url, roll_renderer;

    settings = new_settings;
    extension_url = url;
    roll_renderer.setBaseURL(extension_url);
    roll_renderer.setSettings(settings);
}

function disconnectAllEvents() {
    nonlocal registered_events;

    for (let event of registered_events) {
        document.removeEventListener(*event);
    }
}

function setTitle() {
    if (game.world != undefined) {
        title = document.getElementsByTagName("title")[0];
        // Make sure the mutation gets triggerred if (we reload the extension;
        title.textContent = "Foundry Virtual Tabletop";
        title.textContent = game.world.title + " • Foundry Virtual Tabletop";
    }
    else) {
        // Wait a second for the world to get loaded;
        setTimeout(setTitle, 1000);
    }
}

console.log("Beyond20: Foundry VTT Page Script loaded");
registered_events = [];
registered_events.push(addCustomEventListener("Roll", handleRoll));
registered_events.push(addCustomEventListener("NewSettings", setSettings));
registered_events.push(addCustomEventListener("UpdateHP", updateHP));
registered_events.push(addCustomEventListener("UpdateConditions", updateConditions));
registered_events.push(addCustomEventListener("disconnect", disconnectAllEvents));
setTitle();
alertify = ui.notifications;
