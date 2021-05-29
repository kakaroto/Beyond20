class DNDBDisplayer {
    constructor() {
        this._error = null;
    }

    postHTML(request, title, html, character, whisper, play_sound, source, attributes, description, attack_rolls, roll_info, damage_rolls, total_damages, open) {
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
        element.find(".beyond20-button-roll-damages").on('click', (event) => {
            request.rollAttack = false;
            request.rollDamage = true;
            request.rollCritical = attack_rolls.some(r => !r.discarded && r["critical-success"])
            dndbeyondDiceRoller.handleRollRequest(request);
        });
    }

    async sendMessage(request, title, html, character, whisper, play_sound, source, attributes, description, attack_rolls, roll_info, damage_rolls, total_damages, open) {
        const req = {
            action: "rendered-roll",
            request,
            title,
            html,
            character,
            whisper,
            play_sound,
            source,
            attributes,
            description,
            attack_rolls,
            roll_info,
            damage_rolls,
            total_damages,
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
        if (dndbeyondDiceRoller._settings['use-digital-dice'] && DigitalDiceManager.isEnabled()) {
            const digital = new DigitalDice(name, rolls);
            return digital.roll();
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
        // If it was a custom digital dice roll, then don't show it would be redundant
        if (request.request.type === "digital-dice") return;
        return dndbeyondDiceRoller._displayer.postHTML(request.request, request.title,
            request.html, request.character, request.whisper,
            request.play_sound, request.source, request.attributes, 
            request.description, request.attack_rolls, request.roll_info, 
            request.damage_rolls, request.total_damages, request.open);
    }
    request['original-whisper'] = request.whisper;
    request.whisper = WhisperType.NO;
    delete request.sendMessage;
    return dndbeyondDiceRoller.handleRollRequest(request);
}
