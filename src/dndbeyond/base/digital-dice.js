class DigitalDice {
    constructor(name, rolls) {
        this._name = name;
        this._rolls = rolls;
        this._dice = [];
        for (let roll of rolls) {
            this._dice.push(...roll.dice);
        }
        for (let dice of this._dice) {
            // Need access to the roll Class used to create the fake Roll on reroll
            const rollClass = this._rolls[0].constructor;
            dice.rerollDice = async function (amount) {
                const fakeDice = new this.constructor(amount, this.faces, "");
                const fakeRoll = new rollClass(fakeDice.formula);
                const digital = new DigitalDice(name, [fakeRoll])
                await digital.roll();
                this._rolls.push(...fakeRoll.dice[0]._rolls);
            }
        }
        this._notificationId = null;
    }
    async roll() {
        return DigitalDiceManager.rollDigitalDice(this);
    }
    async parseNotification(myId) {
        this._notificationId = myId;

        const result = $(`#${myId} .dice_result`);
        this._myId = myId;
        this._myResult = result;
        
        result.find(".dice_result__info__title .dice_result__info__rolldetail").text("Beyond 20: ")
        result.find(".dice_result__info__title .dice_result__rolltype").text(this._name);
        const breakdown = result.find(".dice_result__info__results .dice_result__info__breakdown").text();
        const dicenotation = result.find(".dice_result__info__dicenotation").text();

        const diceMatches = reMatchAll(/([0-9]*)d([0-9]+)/, dicenotation) || [];
        const results = breakdown.split("+");
        this._dice.forEach(d => d._rolls = []);
        for (let match of diceMatches) {
            const amount = parseInt(match[1]);
            const faces = parseInt(match[2]);
            for (let i = 0; i < amount; i++) {
                const result = parseInt(results.shift());
                for (let dice of this._dice) {
                    if (dice.faces != faces) continue;
                    if (dice._rolls.length == dice.amount) continue;
                    dice._rolls.push({ "roll": result });
                    break;
                }
            }
        }

        for (let dice of this._dice)
            await dice.handleModifiers();
        this._rolls.forEach(roll => roll.calculateTotal());
        
        this._myResult.find(".dice_result__total-result").text(this._rolls[0].total);
        this._myResult.find(".dice_result__info__results .dice_result__info__breakdown").text(this._rolls[0].formula)
        this._myResult.find(".dice_result__info__dicenotation").text(`${this._rolls.length} roll${this._rolls.length > 1 ? 's' : ''} sent to VTT`)
            .prepend(E.img({ src: chrome.extension.getURL("images/icons/icon32.png") }))
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
    static _makeRoll() {
        $(".dice-toolbar__roll").click();
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
        if (!newNotification) return;
        this._handleNewNotification(newNotification);
    }
    static _handleNewNotification(notification) {
        const pendingRoll = this._pendingRolls.shift();
        if (!pendingRoll) return; // TODO
        const [roll, resolver] = pendingRoll;
        roll.parseNotification(notification).then(resolver);
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
        for (let dice of roll._dice)
            diceRolled += this.rollDice(dice.amount, `d${dice.faces}`);
        if (diceRolled > 0) {
            this._makeRoll();
        }
    }
}
DigitalDiceManager._pendingRolls = [];
DigitalDiceManager._notificationIds = DigitalDiceManager._getNotificationIds()