/*
from roll_renderer import Beyond20RollRenderer, Beyond20BaseRoll;
from settings import getDefaultSettings, WhisperType;
import re;
*/

class DNDBDisplayer {
    constructor() {
        this._error = null;
    }

    postHTML(request, title, html, buttons, character, whisper, play_sound, attack_rolls, damage_rolls) {
        let content = "<div class='beyond20-dice-roller'>";
        if (this._error) {
            content += "<div class='beyond20-roller-error'>" +
                "<span class='beyond20-tooltip'>Virtual Table Top Not Found" +
                "<span class='beyond20-tooltip-content'>" + this._error + "</span>" +
                "</span>" +
                "</div>";
        }
        content += "<div class='beyond20-dice-roller-content'>" + html + "</div>" +
            "</div>";
        const dlg = alertify.Beyond20Roll(title, content);
        dlg.set('onclose', () => {
            dlg.set('onclose', null);
            dlg.destroy();
        });
        const element = $(dlg.elements.content.firstElementChild);
        const icon = chrome.runtime.getURL("images/icons/badges/custom20.png");
        element.find(".ct-beyond20-custom-icon").attr('src', icon);
        element.find(".ct-beyond20-custom-roll").on('click', (event) => {
            const roll = $(event.currentTarget).find(".beyond20-roll-formula").text();
            dndbeyondDiceRoller.rollDice(request, title, roll);
        });
        element.find(".beyond20-chat-button").on('click', (event) => {
            const button = $(event.currentTarget).text();
            buttons[button]();
        });
    }

    async sendMessage(request, title, html, buttons, character, whisper, play_sound, source, attributes, description, attack_rolls, roll_info, damage_rolls, total_damages, open) {
        const req = {
            action: "rendered-roll",
            request,
            title,
            html,
            buttons,
            character,
            whisper,
            play_sound,
            source,
            attributes,
            description,
            attack_rolls: attack_rolls.map(r => r.toJSON ? r.toJSON() : r),
            roll_info,
            damage_rolls: damage_rolls.map(([l, r, f]) => r.toJSON() ? [l, r.toJSON(), f] : [l, r, f]),
            total_damages: Object.fromEntries(Object.entries(total_damages).map(([k, v]) => [k, v.toJSON ? v.toJSON() : v])),
            open
        }
        console.log("Sending message: ", req);
        chrome.runtime.sendMessage(req, (resp) => beyond20SendMessageFailure(character, resp));
    }
    displayError(message) {
        alertify.error(message);
    }

    setError(error) {
        this._error = error;
    }
}

class DNDBRoller {
    roll(formula, data) {
        return new DNDBRoll(formula, data);
    }
    async resolveRolls(name, rolls) {
        if (dndbeyondDiceRoller._settings['use-digital-dice'] && DigitalDice.isEnabled()) {
            const dice = [];
            for (let roll of rolls) {
                dice.push(...roll.dice);
            }
            const digital = new DigitalDice(name, dice);
            await digital.roll();
            rolls.forEach(roll => roll.calculateTotal());
        } else {
            return Promise.all(rolls.map(roll => roll.roll()))
        }
    }
}

class DNDBPrompter {
    async prompt(title, html, ok_label = "OK", cancel_label = "Cancel") {
        return new Promise((resolve, reject) => {
            alertify.Beyond20Prompt(title, html, ok_label, cancel_label, resolve);
        });
    }
}

const dndbeyondDiceRoller = new Beyond20RollRenderer(new DNDBRoller(), new DNDBPrompter(), new DNDBDisplayer());
dndbeyondDiceRoller.setBaseURL(chrome.runtime.getURL(""));
dndbeyondDiceRoller.setSettings(getDefaultSettings());
dndbeyondDiceRoller.handleRollError = (request, error) => {
    dndbeyondDiceRoller._displayer.setError(error);
    if (request.action === "rendered-roll") {
        return dndbeyondDiceRoller._displayer.postHTML(request.request, request.title,
            request.html, request.buttons, request.character, request.whisper,
            request.play_sound);
    }
    request['original-whisper'] = request.whisper;
    request.whisper = WhisperType.NO;
    delete request.sendMessage;
    return dndbeyondDiceRoller.handleRollRequest(request);
}
