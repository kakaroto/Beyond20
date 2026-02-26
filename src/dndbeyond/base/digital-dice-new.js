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

        // Prefer a result block that has both breakdown + notation (expanded entry)
        const resultBlock = entry.find('[class*="DiceResultContainer"]').filter((_, el) => {
            const $el = $(el);
            return $el.find('[class*="Line-Breakdown"]').length > 0 && $el.find('[class*="Line-Notation"]').length > 0;
        }).first();

        const scope = resultBlock.length ? resultBlock : entry;
        const breakdownLine = scope.find('[class*="Line-Breakdown"]').first();
        const notationLine = scope.find('[class*="Line-Notation"]').first();

        // IMPORTANT: read the actual numeric breakdown line, not any [title] (SVGs also have title="D20")
        const breakdown = (
            breakdownLine.find('[class*="Line-Number"]').first().attr("title") ||
            breakdownLine.find('[class*="Line-Number"]').first().text() ||
            breakdownLine.text() ||
            ""
        ).trim();

        const dicenotation = (
            notationLine.find("span").first().text() ||
            notationLine.text() ||
            ""
        ).trim();

        if (!dicenotation || !breakdown) {
            console.log("DigitalDice parseGameLogEntry: missing notation/breakdown", { dicenotation, breakdown });
            return false;
        }

        // Use native matchAll so we don't depend on reMatchAll helper behavior
        const diceMatches = [...dicenotation.matchAll(/([0-9]*)d([0-9]+)(kh1|kl1)?/gi)];
        if (!diceMatches.length) {
            console.log("DigitalDice parseGameLogEntry: no dice matches", { dicenotation, breakdown });
            return false;
        }

        // Remove possible AboveVTT outer parens and split "6 + 7" -> ["6","7"]
        const results = breakdown
            .replace(/^\(([^()]*)\)$/, "$1")
            .split(/\s*\+\s*/)
            .map(r => r.trim())
            .filter(Boolean);

        // Reset rolls before re-assigning
        this._dice.forEach(d => {
            d._rolls = [];
        });

        // Helper to find the next matching die bucket that still needs rolls
        const findTargetDie = (faces) => {
            for (const dice of this._dice) {
                if (Number(dice.faces) !== Number(faces)) continue;
                const currentLen = Array.isArray(dice._rolls) ? dice._rolls.length : 0;
                const amount = Number(dice.amount || 0);
                if (currentLen >= amount) continue;
                return dice;
            }
            return null;
        };

        for (const match of diceMatches) {
            const amount = parseInt(match[1] || "1", 10);
            const faces = parseInt(match[2], 10);
            const mod = match[3];

            for (let i = 0; i < amount; i++) {
                let parsedRolls = [];

                if (mod) {
                    const result = (results.shift() || "").trim();

                    // Handles kh1/kl1 entries like "(12, 4)" or "12, 4"
                    if (/(?:\([0-9,\s]+\)|[0-9,\s]+)/.test(result)) {
                        parsedRolls = result
                            .replace(/[()]/g, "")
                            .split(",")
                            .map(r => ({ roll: parseInt(r.trim(), 10) }))
                            .filter(r => Number.isFinite(r.roll));

                        // If we parsed multiple values for kh1/kl1, account for them
                        i += parsedRolls.length - 1;

                        if (mod === "kh1" && parsedRolls.length) {
                            let max = Math.max(...parsedRolls.map(r => r.roll));
                            if (parsedRolls.every(r => r.roll === max) && parsedRolls.length > 1) {
                                parsedRolls.forEach(r => r.discarded = true);
                                parsedRolls[0].discarded = false;
                            } else {
                                parsedRolls.forEach(r => r.discarded = (r.roll !== max));
                            }
                        } else if (mod === "kl1" && parsedRolls.length) {
                            let min = Math.min(...parsedRolls.map(r => r.roll));
                            if (parsedRolls.every(r => r.roll === min) && parsedRolls.length > 1) {
                                parsedRolls.forEach(r => r.discarded = true);
                                parsedRolls[0].discarded = false;
                            } else {
                                parsedRolls.forEach(r => r.discarded = (r.roll !== min));
                            }
                        }
                    } else {
                        const n = parseInt(result || "0", 10);
                        parsedRolls = [{ roll: Number.isFinite(n) ? n : 0 }];
                    }
                } else {
                    const raw = (results.shift() || "0").trim();
                    const n = parseInt(raw, 10);
                    parsedRolls = [{ roll: Number.isFinite(n) ? n : 0 }];
                }

                const targetDie = findTargetDie(faces);
                if (!targetDie) {
                    console.warn("DigitalDice parseGameLogEntry: no target die bucket found", {
                        faces,
                        parsedRolls,
                        diceState: this._dice.map(d => ({
                            faces: d.faces,
                            amount: d.amount,
                            rolls: (d._rolls || []).map(r => r.roll)
                        }))
                    });
                    continue;
                }

                if (!Array.isArray(targetDie._rolls)) targetDie._rolls = [];
                targetDie._rolls.push(...parsedRolls);
            }
        }

        // Recalculate dice + roll totals
        this._dice.forEach(dice => {
            if (typeof dice.calculateTotal === "function") dice.calculateTotal();
        });
        this._rolls.forEach(roll => {
            if (typeof roll.calculateTotal === "function") roll.calculateTotal();
        });

        console.log("DigitalDice parseGameLogEntry", {
            dicenotation,
            breakdown,
            parsedDice: this._dice.map(d => ({
                faces: d.faces,
                amount: d.amount,
                rolls: (d._rolls || []).map(r => r.roll),
                total: d.total
            })),
            rollTotals: this._rolls.map(r => ({
                formula: r.formula,
                total: r.total
            }))
        });

        if (passive) {
            this._dice.forEach(dice => dice.calculateTotal());
            this._rolls.forEach(roll => roll.calculateTotal());
        }

        return true;
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
        // If the popup isn't open yet, this is a no-op (the actual submit path ensures/reset asynchronously).
        const clearBtn = document.querySelector('button[data-testid="diceClearButton"]');
        if (clearBtn && !clearBtn.disabled) clearBtn.click();
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

    static _getPendingMeta(pending) {
        if (!pending) return null;
        if (!pending[3]) pending[3] = {};
        return pending[3];
    }

    static _clearPendingTimeout(pending) {
        const meta = this._getPendingMeta(pending);
        if (!meta) return;
        if (meta.timeoutId) {
            clearTimeout(meta.timeoutId);
            meta.timeoutId = null;
        }
    }

    static _startPendingTimeout(pending, ms = 15000) {
        const meta = this._getPendingMeta(pending);
        if (!meta) return;

        this._clearPendingTimeout(pending);

        meta.timeoutId = setTimeout(() => {
            const stillActive = this._pendingRolls.length > 0 && this._pendingRolls[0] === pending;
            if (!stillActive) return;

            console.warn("DigitalDiceManager: timed out waiting for MB fulfilled roll");
            this._finishPendingRoll(new Error("DigitalDiceManager: MB roll timeout"));
        }, ms);
    }

    static _handleDiceBrokerMessage(msg) {
        const pending = this._pendingRolls[0];
        if (!pending) return;

        const [roll] = pending;
        const meta = this._getPendingMeta(pending);

        // If we haven't started a roll click yet, ignore
        if (!meta || !meta.startedAtMs) return;

        const eventType = String(msg.eventType || "");

        // Optional: bind rollId on deferred if it matches dice + time
        if (eventType === "dice/roll/deferred" && !meta.rollId) {
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
        if (!ok) {
            console.warn("DigitalDiceManager: failed to open dice roller popup");
            return 0;
        }

        // Clicking too fast can race React state updates in the new roller UI.
        // Add a tiny delay between clicks to mimic a human pace and let state settle.
        // Re-query each click because React can re-render and replace button nodes.
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

    static async _makeRoll(roll) {
        // New DDB roller is popup-based. We set target first (Self/Everyone) and then click Roll.
        //
        // IMPORTANT:
        // We no longer parse toasts/game log. Results are captured via the Message Broker bridge.
        let opened = await DigitalDiceManager._ensureRollerOpenWithRetry();
        if (!opened) return false;

        // In the new UI, "whisper" maps to the "Self" privacy button (DDB may display "Rolling to DM")
        // depending on the user's role/context, but the control is still the "Self" button.
        await DigitalDiceManager._selectRollTargetWithRetry(roll.whisper);

        // Give React a short moment after target toggle before rolling
        await DigitalDiceManager._wait(80);

        // Roll normally
        const rolled = await DigitalDiceManager._clickRollButtonWithRetry();
        return rolled;
    }

    static _normalizeText(text) {
        return String(text || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
    }
    static _normalizeDiceNotation(n) {
        return String(n || "").toLowerCase().replace(/\s+/g, "");
    }

    // Canonicalize dice notation so ordering doesn't matter (DDB roller orders dice by its own UI/object-key order)
    // Example: "1d20+2d6+1d8" == "2d6+1d8+1d20"
    static _canonicalizeDiceNotation(n) {
        const raw = this._normalizeDiceNotation(n);
        if (!raw) return "";

        const matches = [...raw.matchAll(/([0-9]*)d([0-9]+)(kh1|kl1)?/g)];
        if (!matches.length) return raw;

        const groups = new Map(); // key: "d20" or "d20kh1" => total amount
        for (const m of matches) {
            const amount = parseInt(m[1] || "1", 10);
            const faces = parseInt(m[2], 10);
            const mod = m[3] || "";
            const key = `d${faces}${mod}`;
            groups.set(key, (groups.get(key) || 0) + amount);
        }

        const sorted = [...groups.entries()].sort((a, b) => {
            const parseKey = (k) => {
                const mm = k.match(/^d(\d+)(kh1|kl1)?$/);
                return {
                    faces: mm ? parseInt(mm[1], 10) : 9999,
                    mod: mm?.[2] || ""
                };
            };
            const A = parseKey(a[0]);
            const B = parseKey(b[0]);
            if (A.faces !== B.faces) return A.faces - B.faces;
            return A.mod.localeCompare(B.mod);
        });

        return sorted.map(([key, amount]) => `${amount}${key}`).join("+");
    }

    // Preserve intended order for logging/debugging.
    // (Comparison in game log parsing uses canonical form to survive DDB ordering.)
    static _extractDiceTermsFromParts(parts) {
        const terms = [];
        for (const part of (parts || [])) {
            if (!part || typeof part !== "object") continue;
            if (!Number.isFinite(part.faces)) continue;

            const amount = Number.isFinite(part.amount) ? part.amount : 1;
            const faces = Number(part.faces);
            const mods = String(part.modifiers || "").trim();
            terms.push(`${amount}d${faces}${mods}`);
        }
        return terms;
    }
    static _compactOrderedDiceTerms(terms) {
        const compacted = [];

        for (const term of (terms || [])) {
            const m = String(term || "").match(/^(\d+)d(\d+)(.*)$/i);
            if (!m) {
                compacted.push(String(term || ""));
                continue;
            }

            const amount = parseInt(m[1], 10);
            const faces = parseInt(m[2], 10);
            const mods = m[3] || "";
            const key = `${faces}|${mods}`;

            const prev = compacted[compacted.length - 1];
            if (prev) {
                const pm = String(prev).match(/^(\d+)d(\d+)(.*)$/i);
                if (pm) {
                    const pAmount = parseInt(pm[1], 10);
                    const pFaces = parseInt(pm[2], 10);
                    const pMods = pm[3] || "";
                    const pKey = `${pFaces}|${pMods}`;

                    if (pKey === key) {
                        compacted[compacted.length - 1] = `${pAmount + amount}d${faces}${mods}`;
                        continue;
                    }
                }
            }

            compacted.push(`${amount}d${faces}${mods}`);
        }

        return compacted;
    }
    static _getExpectedDiceNotationForRoll(roll) {
        const orderedTerms = [];

        // Preferred source: original Beyond20 rolls/parts (keeps exact sequence, and naturally skips flat-only rolls)
        const originalRolls = Array.isArray(roll?.rolls) ? roll.rolls : [];
        for (const r of originalRolls) {
            const parts = Array.isArray(r?.parts) ? r.parts : [];
            const diceTerms = this._extractDiceTermsFromParts(parts);
            if (diceTerms.length) {
                orderedTerms.push(...diceTerms);
            }
        }

        // Fallback: use DigitalDice flattened _dice list (still in constructor insertion order)
        if (!orderedTerms.length) {
            for (const dice of (roll?._dice || [])) {
                const amount = Number.isFinite(dice?.amount) ? dice.amount : 0;
                const faces = Number(dice?.faces);
                if (!amount || !faces) continue;
                const mods = String(dice?.modifiers || "").trim();
                orderedTerms.push(`${amount}d${faces}${mods}`);
            }
        }

        const compacted = this._compactOrderedDiceTerms(orderedTerms);
        return compacted.join("+");
    }

    static _getToastDebugInfo(limit = 5) {
        const $contents = $('span[class*="MessageContent"], div[class*="MessageContent"]');
        const texts = $contents.toArray().map(el => this._normalizeText($(el).text()));
        return {
            toastCount: $contents.length,
            toastRootCount: $('[class*="NotRoot"], [class*="MessageRoot"]').length,
            latestToasts: texts.slice(-limit)
        };
    }
    static _getGameLogDebugInfo(limit = 5) {
        const entries = this._getCharacterGameLogEntries();
        return {
            characterName: this._getCurrentCharacterName(),
            gameLogOpen: this._isGameLogOpen(),
            characterEntryCount: entries.length,
            latestEntries: entries.slice(0, limit).map(entryEl => {
                const $entry = $(entryEl);
                return {
                    sender: ($entry.find('[class*="Sender"]').first().text() || "").trim(),
                    action: this._getGameLogEntryAction(entryEl),
                    total: this._getGameLogEntryTotal(entryEl),
                    notation: this._getGameLogEntryNotation(entryEl),
                    datetime: ($entry.find("time").attr("datetime") || "").trim(),
                    hasBreakdown: $entry.find('[class*="Line-Breakdown"]').length > 0,
                    hasNotation: $entry.find('[class*="Line-Notation"]').length > 0
                };
            })
        };
    }

    static _getPopupDieQuantity(type) {
        const $btn = $(`button[data-testid="${type}"], button#${type}`).first();
        if (!$btn.length) return 0;
        const q = parseInt($btn.attr("data-quantity") || "0", 10);
        return Number.isFinite(q) ? q : 0;
    }

    static _getCurrentPopupDiceQuantities(types = ["d4","d6","d8","d10","d12","d20","d100"]) {
        const actual = {};
        for (const type of types) {
            const qty = this._getPopupDieQuantity(type);
            if (qty > 0) actual[type] = qty;
        }
        return actual;
    }

    static async _waitForDiceSelectionToSettle(expectedDice, retries = 200, delay = 50) {
        const startedAt = Date.now();
        const expectedTypes = Object.keys(expectedDice);

        // If nothing expected, there's nothing to verify
        if (!expectedTypes.length) return true;

        for (let i = 0; i <= retries; i++) {
            let matches = true;

            for (const type of expectedTypes) {
                const expectedQty = expectedDice[type] || 0;
                const actualQty = this._getPopupDieQuantity(type);
                if (actualQty !== expectedQty) {
                    matches = false;
                    break;
                }
            }

            // Also ensure no extra dice are selected
            if (matches) {
                const current = this._getCurrentPopupDiceQuantities();
                for (const type of Object.keys(current)) {
                    if ((expectedDice[type] || 0) !== current[type]) {
                        matches = false;
                        break;
                    }
                }
            }

            if (matches) return true;

            await this._wait(delay);
        }

        console.warn("DigitalDiceManager: dice selection did not settle before roll", {
            elapsedMs: Date.now() - startedAt,
            expectedDice,
            actualDice: this._getCurrentPopupDiceQuantities()
        });

        return false;
    }

    static _isRollTargetAlreadySelected(whisper) {
        // DDB shows a label like "Rolling to DM" or "Rolling to everyone".
        // Use that label if present so we don't toggle target state unnecessarily.
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

    // The new dice roller lives in a popup. We must click the floating dice button first,
    // then wait for the popup contents to mount.
    static async _ensureRollerOpenWithRetry(retries = 50, delay = 20) {
        for (let i = 0; i <= retries; i++) {
            const $rollBtn = $('button[data-testid="diceRollButton"]');
            if ($rollBtn.length) return true;

            const openBtn = document.querySelector(".dice-rolling-panel > button");
            if (openBtn) {
                openBtn.click();
            }

            await this._wait(delay);
        }

        console.warn("DigitalDiceManager: dice roller popup not found after retries");
        return false;
    }

    static async _resetDiceWithRetry(retries = 20, delay = 20) {
        for (let i = 0; i <= retries; i++) {
            const $clearButton = $('button[data-testid="diceClearButton"]');

            // If popup isn't mounted yet, try to open it and retry
            if (!$clearButton.length) {
                await this._ensureRollerOpenWithRetry();
                await this._wait(delay);
                continue;
            }

            // If reset is disabled, there is nothing to clear and we're done
            if ($clearButton.is(":disabled")) return true;

            const clearEl = $clearButton.get(0);
            if (clearEl) clearEl.click();

            // Reset updates React state; wait until it reflects in the UI (button disabled / no selected quantities)
            for (let j = 0; j < 50; j++) {
                const disabled = $('button[data-testid="diceClearButton"]').is(":disabled");
                const actualDice = this._getCurrentPopupDiceQuantities();
                if (disabled && Object.keys(actualDice).length === 0) return true;
                await this._wait(20);
            }

            return true;
        }

        console.warn("DigitalDiceManager: clear/reset button not found after retries");
        return false;
    }

    // The roll button appears inside the popup and can be disabled while no dice are selected.
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
            dicePanelCount: $(".dice-rolling-panel").length,
            actualDice: this._getCurrentPopupDiceQuantities()
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

                // Wait briefly for the "Rolling to ..." label to reflect the target
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

    static isEnabled() {
        const panel = $(".dice-rolling-panel");
        return panel.length > 0;
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
            await this._ensureRollerOpenWithRetry();
            await this._resetDiceWithRetry();

            const expectedDice = this._getExpectedDiceQuantitiesForRoll(roll);

            let diceRolled = 0;
            for (let dice of roll._dice) {
                diceRolled += await this.rollDice(dice.amount, `d${dice.faces}`);
            }

            if (diceRolled > 0) {
                // Wait for the popup UI to reflect the selected quantities before clicking Roll.
                // This avoids racing React state updates in the new custom roller.
                const settled = await this._waitForDiceSelectionToSettle(expectedDice);
                if (!settled) {
                    console.warn("DigitalDiceManager: continuing despite unsettled dice UI selection");
                }

                // One more short settle pause before the Roll button click
                await this._wait(100);

                const pending = this._pendingRolls[0];
                const meta = this._getPendingMeta(pending);
                if (meta) {
                    meta.startedAtMs = Date.now();
                    meta.expectedDice = expectedDice;
                    meta.rollId = null;
                }

                const rolled = await this._makeRoll(roll);

                if (!rolled) {
                    throw new Error("DigitalDiceManager: failed to click DDB roll button");
                }

                // Wait for the Message Broker "dice/roll/fulfilled" via the bridge listener.
                // Completion happens in _handleDiceBrokerMessage -> _finishPendingRoll().
                this._startPendingTimeout(pending, 15000);
                return;
            } else {
                await this._resetDiceWithRetry();
                this._finishPendingRoll()
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