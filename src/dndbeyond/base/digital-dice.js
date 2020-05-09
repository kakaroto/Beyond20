class DigitalDice {
    constructor(name, dice) {
        this._name = name;
        this._dice = dice;
        for (let dice of this._dice) {
            dice.rerollDice = async function (amount) {
                const fake = new this.constructor(amount, this.faces, "");
                const digital = new DigitalDice(name, [fake])
                await digital.roll();
                this._rolls.push(...fake._rolls);
            }
        }
        this._notificationIds = this._getNotificationIds();
    }

    clear() {
        $(".dice-toolbar__dropdown-die").click()
    }
    clearResults() {
        $(".dice_notification_controls__clear").click()
    }
    rollDice(amount, type) {
        const dice = $(`.dice-die-button[data-dice="${type}"]`)
        for (let i = 0; i < amount; i++)
            dice.click()
        return amount || 0;
    }
    _makeRoll() {
        this._notificationIds = this._getNotificationIds();
        $(".dice-toolbar__roll").click();
    }
    static isEnabled() {
        const toolbar = $(".dice-toolbar");
        return toolbar.length > 0;
    }
    async roll() {
        this.clear();
        let diceRolled = 0;
        for (let dice of this._dice)
            diceRolled += this.rollDice(dice.amount, `d${dice.faces}`);
        if (diceRolled > 0) {
            this._makeRoll();
            return this.result()
        }
    }
    _getNotificationIds() {
        const notifications = $(".noty_bar").toArray();
        return notifications.map(n => n.id);
    }
    lookForResult() {
        const notifications = this._getNotificationIds();
        const myId = notifications.find(n => !this._notificationIds.includes(n))
        console.log("Found my results : ", myId)
        if (!myId) return false;

        const result = $(`#${myId} .dice_result`);
        result.find(".dice_result__info__title .dice_result__info__rolldetail").text("Beyond 20: ")
        result.find(".dice_result__info__title .dice_result__rolltype").text(this._name);
        result.find(".dice_result__total").text("").append(E.img({ src: chrome.extension.getURL("images/icons/icon32.png") }));
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

        this._notificationIds = notifications;
        return true;
    }
    async result() {
        while (!this.lookForResult())
            await new Promise(r => setTimeout(r, 500));
        for (let dice of this._dice)
            await dice.handleModifiers();
    }
}