class DigitalDice {
    constructor(name, rolls, {whisper=false}={}) {
        this._name = name;
        this._rolls = rolls;
        this._whisper = whisper;
        this._dice = [];
        this._diceRollPromises = [];
        for (let roll of rolls) {
            for (const dice of roll.dice) {
                // If the dice faces aren't supported by the digital dice, then do a native roll instead
                if ([4, 6, 8, 10, 12, 20, 100].includes(dice.faces)) {
                    this._dice.push(dice);
                } else {
                    // It's an async method so we need to store the promise to make sure it doesn't
                    // get garbage collected before it's done calculating the total
                    this._diceRollPromises.push(dice.roll());
                }
            }
        }
        for (let dice of this._dice) {
            // Need access to the roll Class used to create the fake Roll on reroll
            const rollClass = this._rolls[0].constructor;
            dice.rerollDice = async function (amount) {
                const fakeDice = new this.constructor(amount, this.faces, "");
                const fakeRoll = new rollClass(fakeDice.formula);
                const digital = new DigitalDice(name, [fakeRoll], {whisper: this.whisper})
                await digital.roll();
                this._rolls.push(...fakeRoll.dice[0]._rolls);
            }
        }
        this._notificationId = null;
    }
    get name() {
        return this._name;
    }
    get rolls() {
        return this._rolls;
    }
    get whisper() {
        return this._whisper;
    }
    toJSON() {
        return {
            name: this.name,
            rolls: this.rolls.map(r => r.toJSON())
        }
    }
    async roll() {
        await Promise.all(this._diceRollPromises);
        return DigitalDiceManager.rollDigitalDice(this);
    }
    /**
     * 
     * @param {String} myId        Notification ID for parsing the results of this roll
     * @param {Boolean} passive    If set, do not modify the notification and calculate the total right away
     */
    parseNotification(myId, passive=false) {
        this._notificationId = myId;

        const result = $(`#${myId} .dice_result`);
        this._myId = myId;
        this._myResult = result;
        
        const breakdown = result.find(".dice_result__info__results .dice_result__info__breakdown").text();
        const dicenotation = result.find(".dice_result__info__dicenotation").text();

        const diceMatches = reMatchAll(/([0-9]*)d([0-9]+)(kh1|kl1)?/, dicenotation) || [];
        const results = breakdown.split("+");
        this._dice.forEach(d => d._rolls = []);
        for (let match of diceMatches) {
            const amount = parseInt(match[1]);
            const faces = parseInt(match[2]);
            const mod = match[3];
            for (let i = 0; i < amount; i++) {
                let rolls = [];
                if (mod) {
                    const result = results.shift();
                    if (result.match(/\([0-9,]+\)/)) {
                        rolls = result.slice(1, -1).split(",").map(r => ({roll: parseInt(r)}));
                        if (mod === "kh1") {
                            let max = 0;
                            for (let r of rolls) {
                                if (r.roll > max) max = r.roll;
                            }
                            rolls.forEach(r => r.discarded = r.roll !== max);
                        } else if (mod === "kl1") {
                            let min = faces;
                            for (let r of rolls) {
                                if (r.roll < min) min = r.roll;
                            }
                            rolls.forEach(r => r.discarded = r.roll !== min);
                        }
                    } else {
                        rolls = [{roll: parseInt(result || 0)}];
                    }
                } else {
                    rolls = [{roll: parseInt(results.shift())}];
                }
                for (let dice of this._dice) {
                    if (dice.faces != faces) continue;
                    if (dice._rolls.length == dice.amount) continue;
                    dice._rolls.push(...rolls);
                    break;
                }
            }
        }
        if (passive) {
            this._dice.forEach(dice => dice.calculateTotal());
            this._rolls.forEach(roll => roll.calculateTotal());
        } else {
            const rolldetails = result.find(".dice_result__info__title .dice_result__info__rolldetail");
            // the target also appears with the same class, so only replace the roll type
            for (const detail of rolldetails.toArray()) {
                const rolltype = $(detail.nextElementSibling);
                if (!rolltype.hasClass("dice_result__rolltype")) continue;
                $(detail).text("Beyond 20: ")
                rolltype.text(this._name);
            }
        }
    }
    async handleCompletedRoll() {
        for (let dice of this._dice)
            await dice.handleModifiers();
        this._rolls.forEach(roll => roll.calculateTotal());
        
        if (this._myResult) {
            const roll = this._rolls.find(roll => !roll.isDiscarded()) || this._rolls[0];
            this._myResult.find(".dice_result__info__results .dice_result__info__breakdown").text(roll.formula)
            this._myResult.find(".dice_result__info__dicenotation").text(`${this._rolls.length} roll${this._rolls.length > 1 ? 's' : ''} sent to VTT`)
                .prepend(E.img({ src: chrome.runtime.getURL("images/icons/icon32.png") }))
            const resultEl = this._myResult.find(".dice_result__total-result");
            resultEl.text(roll.total);
            // On advantage/disadvantage, the discarded flag doesn't get set until after
            // this method resolves. Let's set the total value to non discarded rolls when they get set
            for (const r of this._rolls) {
                r.onDiscardedChanged = () => {
                    const roll = this._rolls.find(roll => !roll.isDiscarded()) || this._rolls[0];
                    resultEl.text(roll.total);
                };
            }
        }
    }

}

class DigitalDiceManager {
    static clear() {
        $(".dice-toolbar__dropdown-die").click()
    }
    static clearResults() {
        $(".dice_notification_controls__clear").click()
    }
    static rollDice(amount, type) {
        const dice = $(`.dice-die-button[data-dice="${type}"]`)
        for (let i = 0; i < amount; i++)
            dice.click()
        return amount || 0;
    }
    static _makeRoll(roll) {
        // New DDB roll button has 2 buttons, one to roll, one to select target, so pick the first one only.
        if (dndbeyondDiceRoller._settings["roll-to-game-log"]) {
            sendCustomEvent("MBPendingRoll", [roll.toJSON()]);
        } else {
            // Stop the pending roll and fulfilled result from being posted
            sendCustomEvent("MBPendingRoll", null);
        }
        let rolled = false;
        if (roll.whisper) {
            $(".dice-toolbar__roll, .dice-toolbar.rollable button.dice-toolbar__target-menu-button").click();
            const options = $("#options-menu ul ul > div");
            const texts = options.toArray().map(d => d.textContent);
            const toDM = texts.findIndex(t => t === "Dungeon Master");
            const toSelf = texts.findIndex(t => t === "Self");
            if (toDM >= 0) {
                options.eq(toDM).click();
                rolled = true;
            } else if (toSelf >= 0) {
                options.eq(toSelf).click();
                rolled = true;
            }
        }
        // Roll normally (to everyone) or fallback if we can't find the whisper option
        if (!rolled) {
            $(".dice-toolbar__roll, .dice-toolbar.rollable button:not(.dice-toolbar__target-menu-button)").click();
        }
    }
    static isEnabled() {
        const toolbar = $(".dice-toolbar");
        return toolbar.length > 0;
    }
    static _getNotificationIds() {
        const notifications = $(".noty_bar").toArray();
        return notifications.map(n => n.id);
    }
    static updateNotifications() {
        const notifications = this._getNotificationIds();
        const newNotification = notifications.find(n => !this._notificationIds.includes(n))
        this._notificationIds = notifications;
        if (!newNotification) {
            // Check if we have a pending roll and the game log is open
            // game log will cause the notifications not to appear, so we need to prevent it
            if (this._pendingRolls.length > 0 && $(".ct-game-log-pane, .sidebar__pane-content .glc-game-log").length > 0) {
                const collapse = $(".ct-sidebar__control--collapse, .sidebar__control:has(.sidebar__control--collaspe)");
                // Collapse the side bar, or if it's locked, fake a click on the character name to change the sidepanel
                if (collapse.length > 0) collapse.click();
                else $(".ddbc-character-tidbits__heading h1").click();
            }
            return;
        }
        return this._handleNewNotification(newNotification);
    }
    static _handleNewNotification(notification) {
        const pendingRoll = this._pendingRolls[0];
        if (!pendingRoll) {
            return this._parseCustomRoll(notification);
        }
        const [roll, resolver] = pendingRoll;
        roll.parseNotification(notification)
        this._finishPendingRoll();
    }
    static _finishPendingRoll() {
        const [roll, resolver] = this._pendingRolls.shift()
        roll.handleCompletedRoll().then(resolver);
        if (this._pendingRolls.length > 0) {
            const nextRoll = this._pendingRolls[0][0];
            this._submitRoll(nextRoll);
        }
    }
    static async rollDigitalDice(roll) {
        let resolver = null;
        const promise = new Promise(r => resolver = r);
        this._pendingRolls.push([roll, resolver]);
        if (this._pendingRolls.length === 1) {
            this._submitRoll(roll);
        }
        return promise;
    }
    static _submitRoll(roll) {
        this.clear();
        let diceRolled = 0;
        for (let dice of roll._dice) {
            diceRolled += this.rollDice(dice.amount, `d${dice.faces}`);
        }
        if (diceRolled > 0) {
            this._makeRoll(roll);
        } else {
            this.clear();
            this._finishPendingRoll()
        }
    }
    static _parseCustomRoll(notification) {
        const name = $(`#${notification} .dice_result .dice_result__info__title`).text();
        const formula = $(`#${notification} .dice_result .dice_result__info__dicenotation`).text();
        const roll = new DNDBRoll(formula)
        const digitalRoll = new DigitalDice(name, [roll])
        digitalRoll.parseNotification(notification, true);
        return digitalRoll;
    }
}
DigitalDiceManager._pendingRolls = [];
DigitalDiceManager._notificationIds = DigitalDiceManager._getNotificationIds()