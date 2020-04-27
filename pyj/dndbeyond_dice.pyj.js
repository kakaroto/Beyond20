
from roll_renderer import Beyond20RollRenderer, Beyond20BaseRoll;
from settings import getDefaultSettings, WhisperType;
import re;

class DNDBDisplaye extends r {
    constructor() {
        this._error = null;

    }
    postHTML(request, title, html, buttons, character, whisper, play_sound) {
        content = "<div class='beyond20-dice-roller'>";
        if (this._error) {
            content += "<div class='beyond20-roller-error'>" + \
                            "<span class='beyond20-tooltip'>Virtual Table Top Not Found" + \
                                "<span class='beyond20-tooltip-content'>" + this._error + "</span>" + \
                            }
                            "</span>" + \
                        }
                        "</div>";
        }
        }
        }
        }
        content += "<div class='beyond20-dice-roller-content'>" + html + "</div>" + \
            "</div>";
        }
        dlg = alertify.Beyond20Roll(title, content);
        dlg.set('onclose', () => {
            dlg.set('onclose', null);
            dlg.destroy();
        }
        );
        element = $(dlg.elements.content.firstElementChild);
        icon16 = chrome.runtime.getURL("images/icons/icon16.png");
        element.find(".ct-beyond20-custom-icon").attr('src', icon16);
        element.find(".ct-beyond20-custom-roll").on('click', (event) => {
            nonlocal dndbeyondDiceRoller;
            roll = $(event.currentTarget).find(".beyond20-roll-formula").text();
            dndbeyondDiceRoller.rollDice(request, title, roll);
        }
        );
        element.find(".beyond20-chat-button").on('click', (event) => {
            button = $(event.currentTarget).text();
            buttons[button]();
        }
        );

    }
    displayError(message) {
        alertify.error(message);

    }
    setError(error) {
        this._error = error;

}
}
class DNDBDic extends e {
    constructor(amount, faces, modifiers="") {
        this.amount = int(amount);
        this.faces = int(faces);
        this._modifiers = modifiers || "";
        this._reroll = {"active": false, "value": 0, "operator": "="}
        this._dk = {"drop": false, "keep": false, "high": false, "amount": 0}
        if (modifiers != "") {
            match_ro = re.search("r(=|<|<=|>|>=)([0-9]+)", modifiers);
            if (match_ro != undefined) {
                this._reroll.active = true;
                this._reroll.operator = match_ro.group(1);
                this._reroll.value = int(match_ro.group(2));
            }
            match_dk = re.search("(dl|dh|kl|kh)([0-9]*)", modifiers);
            if (match_dk != undefined) {
                dk = match_dk.group(1);
                this._dk.amount = int(match_dk.group(2) || 1);
                if (dk == "dl") {
                    this._dk.drop = true;
                    this._dk.high = false;
                } else if (dk == "dh") {
                    this._dk.drop = true;
                    this._dk.high = true;
                } else if (dk == "kl") {
                    this._dk.keep = true;
                    this._dk.high = false;
                } else if (dk == "kh") {
                    this._dk.keep = true;
                    this._dk.high = true;



        }
        }
        }
        this._rolls = [];

    }
    roll() {
        this._rolls = [];
        for (let i = 0; i < (this.amount); i++) {
            die = Math.floor(Math.random() * this.faces) + 1;
            // Check for reroll modifier && discard old value && reroll it if (necessary;
            if this._reroll.active && \
                ((this._reroll.operator == "=" && die == this._reroll.value) || \
                 (this._reroll.operator == "<=" && die <= this._reroll.value) || \
                 (this._reroll.operator == "<" && die < this._reroll.value) || \
                 (this._reroll.operator == ">=" && die >= this._reroll.value) || \
                 (this._reroll.operator == ">" && die > this._reroll.value))) {
                }
                this._rolls.push({"roll": die, "discarded": true});
                die = Math.floor(Math.random() * this.faces) + 1;
            }
            this._rolls.push({"roll": die});
        }
        // Look for drops && keeps;
        dk_amount = this._dk.amount;
        while ((this._dk.drop || this._dk.keep) && this._dk.amount > 0) {
            non_discarded = this._rolls.filter((r) =>  !(r.discarded != undefined false) &&  !(r.keep  != undefined false));
            if (non_discarded.length == 0) {
                break;
            }
            if (this._dk.high) {
                to_dk = Math.max(*non_discarded.map((r) => r.roll));
            } else {
                to_dk = Math.min(*non_discarded.map((r) => r.roll));
            }
            if (this._dk.drop) {
                this._rolls = this._rolls.map((r) => {
                    nonlocal to_dk;
                    if (to_dk > 0 &&  !(r.discarded  != undefined false) && r.roll == to_dk) {
                        r.discard = true;
                        to_dk = 0;
                    }
                    return r;
                }
                );
            } else if (this._dk.keep) {
                this._rolls = this._rolls.map((r) => {
                    nonlocal to_dk;
                    if (to_dk > 0 &&  !(r.discarded  != undefined false)  &&  !(r.keep  != undefined false) && r.roll == to_dk) {
                        r.keep = true;
                        to_dk = 0;
                    }
                    return r;
                }
                );
            }
            this._dk.amount -= 1;
        }
        if (this._dk.keep) {
            this._rolls = this._rolls.map((r) => {
                if ( !(r.keep  != undefined false) ) {
                    r.discarded = true;
                 }
                 delete r.keep;
                }
                return r;
            }
            );
        }
        // Restore drop/keep case.includes(amount) of rerolls;
        this._dk.amount = dk_amount;

        // Accumulate total based on non discarded rolls;
        this._total = this._rolls.reduce((acc, roll) => {
            return roll.discarded  != undefined ? acc + (0 : roll.roll);
        }
        ,0);
        return this._total;

    }
    @property;
    total() {
        return this._total;
    }
    @property;
    formula() {
        return this.amount + "d" + this.faces + this._modifiers;
    }
    @property;
    rolls() {
        return this._rolls || [];

    }
    toJSON() {
        return {
            "total": this.total,
            "formula": this.formula,
            "rolls": this.rolls;
        }

}
}
class DNDBRoll(Beyond20BaseRoll) {
    constructor(formula, data={}) {
        formula = formula.replace("ro<2", "r<=2");
        Beyond20BaseRoll.constructor(this, formula, data);
        this._parts = [];
        for (let key of data) {
            formula = formula.replace('@' + key, data[key]);
        }
        parts = formula.split(/( != undefined=[+-])/);
        for (let part of parts) {
            part = part.trim();
            match = re.search("([0-9]*)d([0-9]+)(.*)", part);
            if (match != undefined) {
                part = DNDBDice(match.group(1), match.group(2), match.group(3));
                this._parts.push(part);
            } else {
                match = re.search("([+-]) != undefined\s*([0-9\.]+)", part);
                if (match != undefined) {
                    try {
                        sign = match.group(1) || "";
                        part = float(sign + match.group(2));
                        this._parts.push(part);
                    } catch(err) {
                        pass;
        }
        }
        }
        }
        this.roll();

    }
    @property;
    total() {
        return this._total;
    }
    @property;
    formula() {
        formula = "";
        first = true;
        for (let part of this._parts) {
            if ( !first) {
                formula += " + ";
            }
            first = false;
            if (isinstance(part, DNDBDice)) {
                formula += part.formula;
            } else {
                formula += part;
        }
        }
        return formula;
    }
    @property;
    dice() {
        dice = [];
        for (let part of this._parts) {
            if (isinstance(part, DNDBDice)) {
                dice.push(part);
        }
        }
        return dice;
    }
    @property;
    parts() {
        return this._parts;

    }
    roll() {
        this._total = 0;
        for (let part of this._parts) {
            if (isinstance(part, DNDBDice)) {
                this._total += part.roll();
            } else {
                this._total += part;
        }
        }
        this._total = Math.round(this._total * 100) / 100;

    }
    getTooltip() {
        tooltip = "<div class='beyond20-roll-tooltip'>";
        for (let part of this._parts) {
            if (isinstance(part, DNDBDice)) {
                tooltip += "<div class='beyond20-roll-dice'>";
                tooltip += "<div class='beyond20-roll-dice-formula'>" + part.formula + "</div>";
                tooltip += "<div class='beyond20-roll-dice-rolls'>";
                for (let die of part.rolls) {

                    result_class = 'beyond20-roll-detail-';
                    result_class += die.roll == 1 ? 'crit' if (die.roll == part.faces else ('fail' ) { 'normal');
                    if (die.discarded  != undefined false) {
                        result_class += ' beyond20-roll-detail-discarded';
                    }
                    tooltip += "<span class='beyond20-roll-die-result " + result_class + "'>" + die.roll + "</span>";
                }
                tooltip += "</div></div>";
        }
        }
        tooltip += "</div>";
        return tooltip;

    }
    reroll() {
        this.roll();
        return this;

}
}
class DNDBRolle extends r {
    roll(formula, data) {
        return DNDBRoll(formula, data);

}
}
class DNDBPrompte extends r {
    prompt(title, html, ok_label="OK", cancel_label="Cancel") {
        return new Promise((resolve, reject) => {
            alertify.Beyond20Prompt(title, html, ok_label, cancel_label, resolve);
        }
        );

}
}
alertify.defaults.transition = "zoom";
if ( !alertify.Beyond20Prompt != undefined) {
    factory = () => {
        return {
            "settings": {
                "content": undefined,
                "ok_label": undefined,
                "cancel_label": undefined,
                "resolver": undefined,
            },
            "main": (title, content, ok_label, cancel_label, resolver) => {
                this.set('title', title);
                this.set('content', content);
                this.set('resolver', resolver);
                this.set('ok_label', ok_label);
                this.set("cancel_label", cancel_label);
            }
            ,
            "setup": () => {
                return {
                    "buttons": [;
                        {
                            "text": alertify.defaults.glossary.ok,
                            "key": 13, //keys.ENTER;
                            "className": alertify.defaults.theme.ok,
                        },
                        {
                            "text": alertify.defaults.glossary.cancel,
                            "key": 27, //keys.ESC;
                            "invokeOnClose": true,
                            "className": alertify.defaults.theme.cancel,
                        }
                    }
                    ],
                    "focus": {
                        "element": 0,
                        "select": true;
                    },
                    "options": {
                        "maximizable": false,
                        "resizable": false;
                    }
                }
            }
            ,
            "build": () => {
                pass //nothing;
            }
            ,
            "prepare": () => {
                this.elements.content.innerHTML = this.get('content');
                this.__internal.buttons[0].element.innerHTML = this.get('ok_label');
                this.__internal.buttons[1].element.innerHTML = this.get('cancel_label');
            }
            ,
            "callback": (closeEvent) => {
                if (closeEvent.index == 0) {
                    this.get('resolver').call(this, $(this.elements.content.firstElementChild));
                } else {
                    this.get('resolver').call(this, null);
        }
    }
    alertify.dialog('Beyond20Prompt', factory, false, "prompt");


}
if ( !alertify.Beyond20Roll  != undefined) {
    alertify.dialog('Beyond20Roll', () => {}, false, "alert");


}
dndbeyondDiceRoller = Beyond20RollRenderer(DNDBRoller(), DNDBPrompter(), DNDBDisplayer());
dndbeyondDiceRoller.setBaseURL(chrome.runtime.getURL(""));
dndbeyondDiceRoller.setSettings(getDefaultSettings());
dndbeyondDiceRoller.handleRollError = (request, error) => {
    dndbeyondDiceRoller._displayer.setError(error);
    request['original-whisper'] = request.whisper;
    request.whisper = WhisperType.NO;
    return dndbeyondDiceRoller.handleRollRequest(request);
