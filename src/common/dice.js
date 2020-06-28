
class Beyond20BaseRoll {
    constructor(formula, data = {}) {
        this._formula = formula;
        this._data = data;
        this._fail_limit = null;
        this._critical_limit = null;
        this._discarded = false;
        this._total = 0;
    }

    get formula() {
        return this._formula;
    }

    get total() {
        throw new Error("NotImplemented");
    }

    get dice() {
        throw new Error("NotImplemented");
    }

    get parts() {
        throw new Error("NotImplemented");
    }

    getTooltip() {
        throw new Error("NotImplemented");
    }

    async roll() {
        throw new Error("NotImplemented");
    }

    async reroll() {
        throw new Error("NotImplemented");
    }

    setDiscarded(discarded) {
        this._discarded = discarded;
    }
    isDiscarded() {
        return this._discarded;
    }

    setCriticalLimit(limit) {
        this._critical_limit = limit;
    }
    setFailLimit(limit) {
        this._fail_limit = limit;
    }
    checkRollForCrits(cb) {
        for (let die of this.dice) {
            for (let r of die.rolls) {
                if (r.discarded === undefined || !r.discarded) {
                    if (cb(die.faces, r.roll)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    isCriticalHit() {
        return this.checkRollForCrits((faces, value) => {
            const limit = this._critical_limit === null ? faces : this._critical_limit;
            return value >= limit;
        }
        );
    }

    isCriticalFail() {
        return this.checkRollForCrits((faces, value) => {
            const limit = this._fail_limit === null ? 1 : this._fail_limit;
            return value <= limit;
        }
        );
    }
    toJSON() {
        return {
            "formula": this.formula,
            "parts": this.parts.map(p => p.toJSON ? p.toJSON() : p),
            "fail-limit": this._fail_limit,
            "critical-limit": this._critical_limit,
            "critical-failure": this.isCriticalFail(),
            "critical-success": this.isCriticalHit(),
            "discarded": this.isDiscarded(),
            "total": this.total
        }
    }
}


class DNDBDice {
    constructor(amount, faces, modifiers = "") {
        this.amount = parseInt(amount) || 1;
        this.faces = parseInt(faces) || 0;
        this._modifiers = modifiers || "";
        this._reroll = { "active": false, "value": 0, "operator": "=" }
        this._dk = { "drop": false, "keep": false, "high": false, "amount": 0 }
        this._min = 0;
        if (modifiers != "") {
            const match_ro = modifiers.match(/r(=|<|<=|>|>=)([0-9]+)/);
            if (match_ro) {
                this._reroll.active = true;
                this._reroll.operator = match_ro[1];
                this._reroll.value = parseInt(match_ro[2]);
            }
            const match_dk = modifiers.match(/(dl|dh|kl|kh)([0-9]*)/);
            if (match_dk) {
                const dk = match_dk[1];
                this._dk.amount = parseInt(match_dk[2] || 1);
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
            const match_min = modifiers.match(/min([0-9]*)/);
            if (match_min)
                this._min = parseInt(match_min[1]);

        }
        this._rolls = [];
    }
    rollSingleDie () {
        // Borrowed from https://pthree.org/2018/06/13/why-the-multiply-and-floor-rng-method-is-biased/
        const max = Math.floor(2 ** 32 / this.faces) * this.faces; // make "max" a multiple of "faces"
        let x;
        do {
            x = Math.floor(Math.random() * 2 ** 32); // pick a number of [0, 2^32).
        } while (x >= max); // try again if x is too big
        return (x % this.faces) + 1; // uniformly picked in [1, faces] (inclusively)
    }
    async rollDice() {
        this._rolls = [];
        for (let i = 0; i < this.amount; i++) {
            this._rolls.push({ "roll": this.rollSingleDie() });
        }
    }
    async rerollDice(amount) {
        for (let i = 0; i < amount; i++) {
            this._rolls.push({ "roll": this.rollSingleDie() });
        }
    }
    async roll() {
        await this.rollDice();
        await this.handleModifiers();
        return this.total;
    }
    async handleModifiers() {
        if (this._reroll.active) {
            let rerolls = 0;
            for (let roll of this._rolls) {
                // Check for reroll modifier && discard old value && reroll it if necessary
                const die = roll.roll;
                if ((this._reroll.operator == "=" && die == this._reroll.value) ||
                    (this._reroll.operator == "<=" && die <= this._reroll.value) ||
                    (this._reroll.operator == "<" && die < this._reroll.value) ||
                    (this._reroll.operator == ">=" && die >= this._reroll.value) ||
                    (this._reroll.operator == ">" && die > this._reroll.value)) {
                    roll.discarded = true;
                    rerolls++;
                }
            }
            if (rerolls)
                await this.rerollDice(rerolls);
        }
        // Look for drops && keeps;
        const dk_amount = this._dk.amount;
        while ((this._dk.drop || this._dk.keep) && this._dk.amount > 0) {
            const non_discarded = this._rolls.filter(r => !r.discarded && !r.keep);
            if (non_discarded.length == 0)
                break;
            let to_dk = 0;
            if (this._dk.high)
                to_dk = Math.max(...non_discarded.map((r) => r.roll));
            else
                to_dk = Math.min(...non_discarded.map((r) => r.roll));
            if (this._dk.drop) {
                this._rolls = this._rolls.map((r) => {
                    if (to_dk > 0 && !r.discarded && !r.keep && r.roll == to_dk) {
                        r.discarded = true;
                        to_dk = 0;

                    }
                    return r;
                });
            } else if (this._dk.keep) {
                this._rolls = this._rolls.map((r) => {
                    if (to_dk > 0 && !r.discarded && !r.keep && r.roll == to_dk) {
                        r.keep = true;
                        to_dk = 0;
                    }
                    return r;
                });
            }
            this._dk.amount -= 1;
        }
        if (this._dk.keep) {
            this._rolls = this._rolls.map((r) => {
                if (!r.keep)
                    r.discarded = true;
                delete r.keep;
                return r;
            });
        }
        // Restore drop/keep case.includes(amount) of rerolls;
        this._dk.amount = dk_amount;

        // Accumulate total based on non discarded rolls;
        this._total = this._rolls.reduce((acc, roll) => {
            return acc + (roll.discarded ? 0 : roll.roll);
        }, 0);
        if (this._min && this._total < this._min)
            this._total = this._min;
        return this._total;
    }

    get total() {
        return this._total;
    }

    get formula() {
        return this.amount + "d" + this.faces + this._modifiers;
    }

    get rolls() {
        return this._rolls || [];
    }

    toJSON() {
        return {
            "total": this.total,
            "formula": this.formula,
            "rolls": this.rolls,
            "faces": this.faces
        }
    }
}

class DNDBRoll extends Beyond20BaseRoll {
    constructor(formula, data = {}) {
        formula = formula.replace(/ro(=|<|<=|>|>=)([0-9]+)/g, "r$1$2");
        super(formula, data);
        this._parts = [];
        for (let key in data)
            formula = formula.replace('@' + key, data[key]);
        const parts = formula.split(/(?=[+-])/);
        for (let part of parts) {
            part = part.trim();
            let match = part.match(/([0-9]*)d([0-9]+)(.*)/);
            if (match) {
                const part = new DNDBDice(...match.slice(1, 4));
                this._parts.push(part);
            } else {
                match = part.match(/([+-])?\s*([0-9\.]+)/);
                if (match) {
                    try {
                        const sign = match[1] || "";
                        const part = parseFloat(sign + match[2]);
                        this._parts.push(part);
                    } catch (err) { }
                }
            }
        }
    }

    get total() {
        return this._total;
    }

    get formula() {
        let formula = "";
        let first = true;
        for (let part of this._parts) {
            if (!first)
                formula += " + ";
            first = false;
            if (part instanceof DNDBDice)
                formula += part.formula;
            else
                formula += part;
        }
        return formula;
    }
    get dice() {
        const dice = [];
        for (let part of this._parts) {
            if (part instanceof DNDBDice) {
                dice.push(part);
            }
        }
        return dice;
    }

    get parts() {
        return this._parts;
    }

    async roll() {
        for (let part of this._parts) {
            if (part instanceof DNDBDice)
                await part.roll();
        }
        this.calculateTotal();
    }
    calculateTotal() {
        this._total = 0;
        for (let part of this._parts) {
            if (part instanceof DNDBDice) {
                this._total += part.total;
            } else {
                this._total += part;
            }
        }
        this._total = Math.round(this._total * 100) / 100;
    }

    getTooltip() {
        let tooltip = "<div class='beyond20-roll-tooltip'>";
        for (let part of this._parts) {
            if (part instanceof DNDBDice) {
                tooltip += "<div class='beyond20-roll-dice'>";
                tooltip += "<div class='beyond20-roll-dice-formula'>" + part.formula + "</div>";
                tooltip += "<div class='beyond20-roll-dice-rolls'>";
                for (let die of part.rolls) {
                    let result_class = 'beyond20-roll-detail-';
                    result_class += die.roll == part.faces ? 'crit' : (die.roll == 1 ? 'fail' : 'normal');
                    if (die.discarded)
                        result_class += ' beyond20-roll-detail-discarded';
                    tooltip += "<span class='beyond20-roll-die-result " + result_class + "'>" + die.roll + "</span>";
                }
                tooltip += "</div></div>";
            }
        }
        tooltip += "</div>";
        return tooltip;
    }

    async reroll() {
        await this.roll();
        return this;
    }
}