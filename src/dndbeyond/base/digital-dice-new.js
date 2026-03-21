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
     * Notification parsing was removed because D&D Beyond no longer uses the old noty flow.
     * Intentionally left as a no-op until a new result pipeline is implemented.
     * 
     * @param {String} myId
     * @param {Boolean} passive
     */
    parseNotification(myId, passive=false) {
        return;
    }

    /**
     * Parse a D&D Beyond Message Broker "dice/roll/fulfilled" payload and map its dice results
     * back into Beyond20 dice objects.
     *
     * This replaces the old noty parsing and avoids game log parsing entirely.
     *
     * @param {Object} brokerData  msg.data from the bridged MB message
     * @param {Boolean} passive    If set, calculate totals right away (manager will still call handleCompletedRoll)
     */
    parseMessageBrokerRoll(brokerData, passive=false) {
        try {
            const byFaces = new Map(); // faces -> [values...]
            const mbRolls = (brokerData && brokerData.rolls) ? brokerData.rolls : [];

            for (const mbRoll of mbRolls) {
                const sets = mbRoll?.diceNotation?.set || [];
                for (const s of sets) {
                    const dieType = (s && s.dieType) ? String(s.dieType) : "";
                    const faces = parseInt(dieType.replace(/^d/i, ""), 10);
                    if (!Number.isFinite(faces)) continue;

                    const diceArr = Array.isArray(s.dice) ? s.dice : [];
                    const values = [];
                    for (const d of diceArr) {
                        const v = (d && typeof d.dieValue !== "undefined") ? parseInt(d.dieValue, 10) : NaN;
                        if (Number.isFinite(v)) values.push(v);
                    }

                    if (!byFaces.has(faces)) byFaces.set(faces, []);
                    byFaces.get(faces).push(...values);
                }
            }

            // Reset rolls before re-assigning
            this._dice.forEach(d => {
                d._rolls = [];
            });

            // Fill Beyond20 dice objects in insertion order (this._dice already preserves original roll order)
            for (const dice of this._dice) {
                const faces = Number(dice.faces);
                const amount = Number(dice.amount || 0);

                if (!Array.isArray(dice._rolls)) dice._rolls = [];
                dice._rolls.length = 0;

                const pool = byFaces.get(faces) || [];
                for (let i = 0; i < amount; i++) {
                    const value = pool.length ? pool.shift() : 0;
                    dice._rolls.push({ roll: value });
                }
                byFaces.set(faces, pool);
            }

            // Optional debug: leftover values (usually should be 0 if matching worked)
            const leftovers = [];
            for (const [faces, vals] of byFaces.entries()) {
                if (vals && vals.length) leftovers.push({ faces, remaining: vals.slice() });
            }
            if (leftovers.length) {
                console.warn("DigitalDice parseMessageBrokerRoll: leftover dice values after assignment", leftovers);
            }

            if (passive) {
                this._dice.forEach(dice => dice.calculateTotal());
                this._rolls.forEach(roll => roll.calculateTotal());
            }

            return true;
        } catch (err) {
            console.warn("DigitalDice parseMessageBrokerRoll: failed to parse broker payload", err, brokerData);
            return false;
        }
    }

    /**
     * Parse a new D&D Beyond Game Log entry and map its dice results back into Beyond20 dice objects.
     * 
     * @param {HTMLElement|jQuery} entryEl   Game log <li> entry element
     * @param {Boolean} passive              If set, do not modify UI and calculate totals right away
     */
    parseGameLogEntry(entryEl, passive=false) {
        const entry = $(entryEl);
        // kept for compatibility / debugging
        return false;
    }

    async handleCompletedRoll() {
        for (let dice of this._dice)
            await dice.handleModifiers();
        this._rolls.forEach(roll => roll.calculateTotal());
        
        // Old notification DOM customization removed (new DDB flow uses toasts + Game Log)
        // Keep this method to finalize totals/modifiers for Beyond20 roll objects.
    }
}

class DigitalDiceManager {
    static clear() {
        // Best-effort clear for the new popup roller.
        const clearBtn = document.querySelector('button[data-testid="diceClearButton"]');
        if (clearBtn && !clearBtn.disabled) clearBtn.click();

        // Old toolbar dice (encounters) support
        const oldClear = $(".dice-toolbar__dropdown-die");
        if (oldClear.length) oldClear.click();
    }
    static clearResults() {
        // No notification UI anymore (old .noty_bar flow is gone)
    }

    static _wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Bridge listener: the page-context broker forwards dice/roll/* as window.postMessage
    static _ensureDiceBrokerBridgeListenerInstalled() {
        if (this._diceBridgeInstalled) return;
        this._diceBridgeInstalled = true;

        window.addEventListener("message", (ev) => {
            try {
                if (ev.source !== window) return;
                const data = ev.data;
                if (!data || data.__b20_ddb_dice_mb_bridge__ !== true) return;

                const msg = data.message;
                if (!msg || typeof msg.eventType !== "string") return;
                if (!msg.eventType.startsWith("dice/roll/")) return;

                this._handleDiceBrokerMessage(msg);
            } catch (e) {
                // ignore
            }
        });
    }

    static _normalizeDiceKey(k) {
        return String(k || "").toLowerCase();
    }

    static _extractDiceQuantitiesFromBrokerData(brokerData) {
        const actual = {};
        const mbRolls = brokerData?.rolls || [];
        for (const mbRoll of mbRolls) {
            const sets = mbRoll?.diceNotation?.set || [];
            for (const s of sets) {
                const dieType = this._normalizeDiceKey(s?.dieType);
                if (!dieType) continue;

                // Prefer dice array length (it reflects actual rolled values)
                const diceArr = Array.isArray(s?.dice) ? s.dice : [];
                const count = diceArr.length;

                actual[dieType] = (actual[dieType] || 0) + (count || 0);
            }
        }
        return actual;
    }

    static _diceQuantitiesEqual(expected, actual) {
        const keys = new Set([...Object.keys(expected || {}), ...Object.keys(actual || {})]);
        for (const k of keys) {
            const e = Number((expected && expected[k]) || 0);
            const a = Number((actual && actual[k]) || 0);
            if (e !== a) return false;
        }
        return true;
    }

    static _getExpectedDiceQuantitiesForRoll(roll) {
        const expected = {};
        for (const dice of roll._dice || []) {
            const key = this._normalizeDiceKey(`d${dice.faces}`);
            expected[key] = (expected[key] || 0) + (dice.amount || 0);
        }
        return expected;
    }

    static _getMeta(pending) {
        if (pending && !pending[3]) pending[3] = {};
        return pending?.[3];
    }

    static _clearPendingTimeout(pending) {
        clearTimeout(this._getMeta(pending)?.timeoutId);
        if (this._getMeta(pending)) this._getMeta(pending).timeoutId = null;
    }

    static _startPendingTimeout(pending, ms = 15000) {
        const meta = this._getMeta(pending);
        if (!meta) return;

        this._clearPendingTimeout(pending);
        meta.timeoutId = setTimeout(() => {
            if (this._pendingRolls[0] === pending) {
                console.warn("DigitalDiceManager: timed out waiting for MB fulfilled roll");
                this._finishPendingRoll(new Error("DigitalDiceManager: MB roll timeout"));
            }
        }, ms);
    }

    static _handleDiceBrokerMessage(msg) {
        const pending = this._pendingRolls[0];
        if (!pending) return;

        const [roll] = pending;
        const meta = this._getMeta(pending);

        // If we haven't started a roll click yet, ignore
        if (!meta || !meta.startedAtMs) return;

        const eventType = String(msg.eventType || "");

        // Optional: bind rollId on deferred if it matches dice + time
        if ((eventType === "dice/roll/deferred" || eventType === "dice/roll/pending") && !meta.rollId) {
            const msgTime = parseInt(msg?.dateTime, 10);
            const timeOk = !Number.isFinite(msgTime) || msgTime >= (meta.startedAtMs - 1000);

            const expectedDice = meta.expectedDice || this._getExpectedDiceQuantitiesForRoll(roll);
            const actualDice = this._extractDiceQuantitiesFromBrokerData(msg.data);

            if (timeOk && this._diceQuantitiesEqual(expectedDice, actualDice) && msg?.data?.rollId) {
                meta.rollId = msg.data.rollId;
            }
            return;
        }

        if (eventType !== "dice/roll/fulfilled") return;

        // If we bound rollId, require it
        if (meta.rollId && msg?.data?.rollId && meta.rollId !== msg.data.rollId) return;

        const msgTime = parseInt(msg?.dateTime, 10);
        if (Number.isFinite(msgTime) && msgTime < (meta.startedAtMs - 1000)) return;

        const expectedDice = meta.expectedDice || this._getExpectedDiceQuantitiesForRoll(roll);
        const actualDice = this._extractDiceQuantitiesFromBrokerData(msg.data);

        if (!this._diceQuantitiesEqual(expectedDice, actualDice)) {
            return;
        }

        const parsed = roll.parseMessageBrokerRoll(msg.data, true);
        if (!parsed) {
            return this._finishPendingRoll(new Error("DigitalDiceManager: failed to parse MB fulfilled roll"));
        }

        this._finishPendingRoll();
    }

    static async rollDice(amount, type) {
        if (!amount) return 0;

        const ok = await this._ensureRollerOpenWithRetry();
        if (ok) {
            for (let i = 0; i < amount; i++) {
                const dieEl = document.querySelector(`button[data-testid="${type}"], button#${type}`);
                if (!dieEl) {
                    console.warn(`DigitalDiceManager: die button not found for ${type} on click ${i + 1}/${amount}`);
                    return i;
                }
                dieEl.click();
                await this._wait(60);
            }
            return amount || 0;
        }

        // Old toolbar dice (encounters) fallback
        const dice = $(`.dice-die-button[data-dice="${type}"]`);
        if (dice.length) {
            for (let i = 0; i < amount; i++) dice.click();
            return amount || 0;
        }

        console.warn("DigitalDiceManager: failed to find popup or toolbar die button", { type });
        return 0;
    }

    static async _makeRoll(roll) {
        // New DDB roller is popup-based. We set target first (Self/Everyone) and then click Roll.
        //
        // IMPORTANT:
        // Re-enable MBPendingRoll ONLY as a signal so message-broker.js can patch the next DDB fulfilled
        // (it no longer interferes with the DDB roll chain).
        if (dndbeyondDiceRoller?._settings?.["roll-to-game-log"]) {
            sendCustomEvent("MBPendingRoll", [roll.toJSON()]);
        } else {
            sendCustomEvent("MBPendingRoll", null);
        }

        let opened = await DigitalDiceManager._ensureRollerOpenWithRetry();
        if (opened) {
            await DigitalDiceManager._selectRollTargetWithRetry(roll.whisper);
            await DigitalDiceManager._wait(80);
            return await DigitalDiceManager._clickRollButtonWithRetry();
        }

        // Old toolbar roll fallback (encounters)
        return await DigitalDiceManager._clickOldToolbarRollWithRetry(roll.whisper);
    }

    static _normalizeText(text) {
        return String(text || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
    }

    static _isRollTargetAlreadySelected(whisper) {
        const labelText = this._normalizeText(
            $('[class*="rollToLabel"], span:contains("Rolling to")').filter((_, el) => {
                return /rolling to/i.test($(el).text() || "");
            }).first().text()
        );

        if (!labelText) return false;

        if (whisper) {
            return /rolling to (dm|self)/i.test(labelText);
        }
        return /rolling to everyone/i.test(labelText);
    }

    static async _ensureRollerOpenWithRetry(retries = 50, delay = 20) {
        for (let i = 0; i <= retries; i++) {
            const $rollBtn = $('button[data-testid="diceRollButton"]');
            if ($rollBtn.length) return true;

            const openBtn = document.querySelector(".dice-rolling-panel > button");
            if (openBtn) {
                openBtn.click();
                await this._wait(delay);
                continue;
            }

            // no popup present
            return false;
        }

        console.warn("DigitalDiceManager: dice roller popup not found after retries");
        return false;
    }

    static async _resetDiceWithRetry(retries = 20, delay = 20) {
        for (let i = 0; i <= retries; i++) {
            const $clearButton = $('button[data-testid="diceClearButton"]');

            if (!$clearButton.length) {
                const opened = await this._ensureRollerOpenWithRetry();
                if (!opened) return false;
                await this._wait(delay);
                continue;
            }

            if ($clearButton.is(":disabled")) return true;

            const clearEl = $clearButton.get(0);
            if (clearEl) clearEl.click();

            for (let j = 0; j < 50; j++) {
                const disabled = $('button[data-testid="diceClearButton"]').is(":disabled");
                if (disabled) return true;
                await this._wait(20);
            }

            return true;
        }

        console.warn("DigitalDiceManager: clear/reset button not found after retries");
        return false;
    }

    static async _clickRollButtonWithRetry(retries = 200, delay = 50) {
        const startedAt = Date.now();

        for (let i = 0; i <= retries; i++) {
            const rollEl = document.querySelector('button[data-testid="diceRollButton"]:not([disabled])');

            if (rollEl) {
                rollEl.click();
                return true;
            }

            await this._wait(delay);
        }

        const debug = {
            elapsedMs: Date.now() - startedAt,
            popupOpen: $('button[data-testid="diceRollButton"]').length > 0,
            rollButtonCount: $('button[data-testid="diceRollButton"]').length,
            enabledRollButtonCount: $('button[data-testid="diceRollButton"]:not([disabled])').length,
            rollerPopupCount: $('section:has(button[data-testid="diceRollButton"])').length,
            dicePanelCount: $(".dice-rolling-panel").length
        };

        console.warn("DigitalDiceManager: failed to click DDB roll button → popup/selector race", debug);
        return false;
    }

    static async _selectRollTargetWithRetry(whisper, retries = 50, delay = 20) {
        const targetTestId = whisper ? "diceRollToSelfButton" : "diceRollToEveryoneButton";

        if (this._isRollTargetAlreadySelected(whisper)) {
            return true;
        }

        for (let i = 0; i <= retries; i++) {
            const targetEl = document.querySelector(`button[data-testid="${targetTestId}"]`);

            if (targetEl) {
                targetEl.click();

                for (let j = 0; j < 20; j++) {
                    if (this._isRollTargetAlreadySelected(whisper)) return true;
                    await this._wait(20);
                }

                return true;
            }

            await this._wait(delay);
        }

        console.warn(`DigitalDiceManager: target button not found (${targetTestId})`);
        return false;
    }

    // Old toolbar roll support (encounters page)
    static async _clickOldToolbarRollWithRetry(whisper, retries = 50, delay = 10) {
        // If whisper, try to select target in old toolbar menu
        if (whisper) {
            await this._selectWhisperTargetWithRetry();
        }
        for (let i = 0; i <= retries; i++) {
            const $rollButton = $(".dice-toolbar.rollable .dice-toolbar__target button:not(.dice-toolbar__target-menu-button)").first();
            if ($rollButton.length) {
                $rollButton.click();
                return true;
            }
            await this._wait(delay);
        }
        console.warn("DigitalDiceManager: old toolbar roll button not found after retries");
        return false;
    }

    static async _selectWhisperTargetWithRetry(retries = 50, delay = 10) {
        return new Promise((resolve) => {
            const menuButton = document.querySelector(".dice-toolbar.rollable button.dice-toolbar__target-menu-button");
            if (!menuButton) {
                return resolve(false);
            }

            menuButton.click();

            const trySelect = (remaining, _delay) => {
                const $options = $("#options-menu ul ul > div");

                if ($options.length > 0) {
                    const texts = $options.toArray().map(d => d.textContent.trim());
                    const toDM   = texts.findIndex(t => t === "Dungeon Master");
                    const toSelf = texts.findIndex(t => t === "Self");

                    if (toDM >= 0) {
                        $options.eq(toDM).click();
                        return resolve(true);
                    } else if (toSelf >= 0) {
                        $options.eq(toSelf).click();
                        return resolve(true);
                    }

                    return resolve(false);
                }

                if (remaining > 0) {
                    setTimeout(() => trySelect(remaining - 1, _delay), _delay);
                } else {
                    resolve(false);
                }
            };

            trySelect(retries, delay);
        });
    }

    static isEnabled() {
        const panel = $(".dice-rolling-panel");
        const toolbar = $(".dice-toolbar");
        return panel.length > 0 || toolbar.length > 0;
    }

    static _getNotificationIds() {
        // Old noty notifications were removed; keep method for compatibility.
        return [];
    }

    static updateNotifications() {
        // Notification flow removed in the new DDB roller.
        // Results are captured via the Message Broker bridge.
        return;
    }

    static _handleNewNotification(notification) {
        // Notification flow removed in the new DDB roller.
        return;
    }

    static _finishPendingRoll(error=null) {
        const pending = this._pendingRolls.shift();
        if (!pending) return;

        const [roll, resolver, rejecter] = pending;

        this._clearPendingTimeout(pending);

        if (error) {
            rejecter(error);
        } else {
            roll.handleCompletedRoll().then(resolver).catch(rejecter);
        }

        if (this._pendingRolls.length > 0) {
            const nextRoll = this._pendingRolls[0][0];
            this._submitRoll(nextRoll);
        }
    }

    static async rollDigitalDice(roll) {
        this._ensureDiceBrokerBridgeListenerInstalled();

        let resolver = null;
        let rejecter = null;
        const promise = new Promise((resolve, reject) => {
            resolver = resolve;
            rejecter = reject;
        });

        const meta = {
            startedAtMs: 0,
            expectedDice: null,
            rollId: null,
            timeoutId: null
        };

        this._pendingRolls.push([roll, resolver, rejecter, meta]);
        if (this._pendingRolls.length === 1) {
            this._submitRoll(roll);
        }
        return promise;
    }

    static async _submitRoll(roll) {
        try {
            const opened = await this._ensureRollerOpenWithRetry();
            if (opened) await this._resetDiceWithRetry();

            let diceRolled = 0;
            for (const dice of roll._dice) {
                diceRolled += await this.rollDice(dice.amount, `d${dice.faces}`);
            }

            if (diceRolled > 0) {
                if (opened) await this._wait(100);

                const pending = this._pendingRolls[0];
                const meta = this._getMeta(pending);
                if (meta) {
                    meta.startedAtMs = Date.now();
                    meta.expectedDice = this._getExpectedDiceQuantitiesForRoll(roll);
                }

                const rolled = await this._makeRoll(roll);
                if (!rolled) throw new Error("DigitalDiceManager: failed to click DDB roll button");
                this._startPendingTimeout(pending, 15000);
            } else {
                if (opened) await this._resetDiceWithRetry();
                this._finishPendingRoll();
            }
        } catch (err) {
            console.warn("DigitalDiceManager: digital roll failed, rejecting for native fallback", err);
            this._finishPendingRoll(err);
        }
    }

    static _parseCustomRoll(notification) {
        // Custom roll parsing via notification is no longer available in the new roller.
        return;
    }
}

DigitalDiceManager._pendingRolls = [];
DigitalDiceManager._notificationIds = DigitalDiceManager._getNotificationIds();
DigitalDiceManager._diceBridgeInstalled = false;