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
        // Sending MBPendingRoll here breaks the new DDB digital dice flow when roll-to-game-log is enabled.
        // We no longer dispatch MBPendingRoll during the roll.
        // If you need roll-to-game-log, let it happen after the digital dice + game log parsing finishes
        // (e.g. via MBFulfilledRoll from the roller pipeline).
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
    static _wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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
    static _getExpectedDiceQuantitiesForRoll(roll) {
        const expected = {};
        for (const dice of roll._dice || []) {
            const key = `d${dice.faces}`;
            expected[key] = (expected[key] || 0) + (dice.amount || 0);
        }
        return expected;
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
    static _getGameLogButtonElement() {
        // Important: in campaigns there is also a "Launch Game" button next to Game Log
        // and they share some button-group classes. Only target the actual Game Log control.
        let el = document.querySelector('[role="button"][aria-roledescription="Game Log"]');
        if (el) return el;

        // Fallback through the tooltip wrapper text/title if DDB shuffles class names.
        el = document.querySelector('[data-original-title="Game Log"] [role="button"]');
        if (el) return el;

        // Last fallback: the notification wrapper that hosts the Game Log button.
        el = document.querySelector('.tss-1r5d1qn-Notification [role="button"]');
        if (el && (el.getAttribute("aria-roledescription") || "").toLowerCase() === "game log") return el;

        return null;
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
    static _isGameLogOpen() {
        return $('[data-testid="gamelog-pane"], .glc-game-log').length > 0;
    }
    static async _openGameLogWithRetry(retries = 50, delay = 20) {
        for (let i = 0; i <= retries; i++) {
            if (this._isGameLogOpen()) return true;

            const gameLogBtn = this._getGameLogButtonElement();
            if (gameLogBtn) {
                gameLogBtn.click();
            }

            await this._wait(delay);
        }

        console.warn("DigitalDiceManager: game log pane not found after retries", {
            foundGameLogButton: !!this._getGameLogButtonElement()
        });
        return false;
    }
    static async _closeGameLogWithRetry(retries = 50, delay = 20) {
        for (let i = 0; i <= retries; i++) {
            if (!this._isGameLogOpen()) return true;

            // Try toggling the Game Log button first (least invasive)
            const gameLogBtn = this._getGameLogButtonElement();
            if (gameLogBtn) gameLogBtn.click();

            await this._wait(delay);
            if (!this._isGameLogOpen()) return true;

            // Fallbacks for different sidebar states
            const collapseEl = $(".ct-sidebar__control--collapse, .sidebar__control:has(.sidebar__control--collaspe)").first().get(0);
            if (collapseEl) collapseEl.click();

            await this._wait(delay);
            if (!this._isGameLogOpen()) return true;

            const maskEl = $('.ct-sidebar__portal [class*="mask"]').first().get(0);
            if (maskEl) maskEl.click();

            await this._wait(delay);
            if (!this._isGameLogOpen()) return true;
        }

        console.warn("DigitalDiceManager: could not close game log pane after retries");
        return false;
    }
    static _getCurrentCharacterName() {
        // Prefer explicit character object when available
        if (typeof character !== "undefined" && character?.name) {
            return String(character.name).trim();
        }
        if (typeof window !== "undefined" && window.character?.name) {
            return String(window.character.name).trim();
        }

        // Fallback to character sheet heading
        const fromHeader = $(".ddbc-character-tidbits__heading h1").first().text().trim();
        if (fromHeader) return fromHeader;

        return "";
    }
    static _getGameLogEntries() {
        return $('.glc-game-log ol li').toArray().filter(li => {
            const $li = $(li);
            return $li.find('[class*="Sender"]').length > 0 && $li.find('[class*="DiceResultContainer"]').length > 0;
        });
    }
    static _getCharacterGameLogEntries() {
        const characterName = this._getCurrentCharacterName().toLowerCase();
        const entries = this._getGameLogEntries();

        if (!characterName) return entries;

        return entries.filter(li => {
            const sender = ($(li).find('[class*="Sender"]').first().text() || "").trim().toLowerCase();
            return sender === characterName;
        });
    }
    static _getGameLogEntriesBottomUp() {
        // User observed newest entries are typically appended at the bottom; scan bottom-up.
        return this._getGameLogEntries().slice().reverse();
    }
    static _getCharacterGameLogEntriesBottomUp() {
        const characterName = this._getCurrentCharacterName().toLowerCase();
        const entries = this._getGameLogEntriesBottomUp();

        if (!characterName) return entries;

        return entries.filter(li => {
            const sender = ($(li).find('[class*="Sender"]').first().text() || "").trim().toLowerCase();
            return sender === characterName;
        });
    }
    static _getGameLogEntryTotal(entryEl) {
        const txt = ($(entryEl).find('[class*="Total"] span').last().text() || "").trim();
        const n = parseInt(txt, 10);
        return Number.isFinite(n) ? n : null;
    }
    static _getGameLogEntryAction(entryEl) {
        return (($(entryEl).find('[class*="Action"]').first().text()) || "").trim().toLowerCase();
    }
    static _getGameLogEntryNotation(entryEl) {
        const entry = $(entryEl);

        // Prefer a notation that is inside a block with breakdown (expanded result)
        const scoped = entry.find('[class*="DiceResultContainer"]').filter((_, el) => {
            const $el = $(el);
            return $el.find('[class*="Line-Breakdown"]').length > 0 && $el.find('[class*="Line-Notation"]').length > 0;
        }).first();

        const text = (
            (scoped.length ? scoped : entry).find('[class*="Line-Notation"] span').first().text() ||
            (scoped.length ? scoped : entry).find('[class*="Line-Notation"]').first().text() ||
            ""
        ).trim();

        return this._normalizeDiceNotation(text);
    }
    static _getGameLogEntryTimeMs(entryEl) {
        const dt = ($(entryEl).find("time").attr("datetime") || "").trim();
        if (!dt) return null;
        const ms = Date.parse(dt);
        return Number.isFinite(ms) ? ms : null;
    }
    static async _expandGameLogEntryIfNeeded(entryEl, retries = 10, delay = 20) {
        const entry = $(entryEl);

        const hasBreakdown = () =>
            entry.find('[class*="Line-Breakdown"]').length > 0 &&
            entry.find('[class*="Line-Notation"]').length > 0;

        if (hasBreakdown()) return true;

        const clickable =
            entry.find('[class*="Message-Collapsed"]').first().length
                ? entry.find('[class*="Message-Collapsed"]').first()
                : entry.find('[class*="DiceResultContainer"]').first().length
                    ? entry.find('[class*="DiceResultContainer"]').first()
                    : entry;

        const clickableEl = clickable.get(0);
        if (clickableEl) clickableEl.click();

        for (let i = 0; i <= retries; i++) {
            if (hasBreakdown()) return true;
            await this._wait(delay);
        }

        return false;
    }
    static _findRollToast() {
        const charName = this._getCurrentCharacterName().toLowerCase();

        // DDB toast DOM has changed across builds, so check span/div MessageContent
        const $contents = $('span[class*="MessageContent"], div[class*="MessageContent"]');
        const candidates = $contents.toArray().reverse(); // newest DOM first

        for (const el of candidates) {
            const $content = $(el);
            const text = this._normalizeText($content.text());

            if (!/ rolled /i.test(text)) continue;

            const m = text.match(/^(.*?)\s+rolled\b/i);
            const sender = this._normalizeText(m ? m[1] : "");
            if (charName && sender.toLowerCase() !== charName) continue;

            const action = this._normalizeText($content.find('span[class*="RollAction"]').first().text()).toLowerCase();
            const totalText = this._normalizeText($content.find('span[class*="MessageTotal"]').first().text());
            const total = parseInt(totalText, 10);

            return {
                sender,
                action,
                total: Number.isFinite(total) ? total : null,
                text
            };
        }

        return null;
    }
    static async _waitForRollToast(retries = 200, delay = 50) {
        const startedAt = Date.now();

        for (let i = 0; i <= retries; i++) {
            const toast = this._findRollToast();
            if (toast) return toast;
            await this._wait(delay);
        }

        console.warn(
            "DigitalDiceManager: roll toast not detected → timeout too short (or selector issue)",
            {
                elapsedMs: Date.now() - startedAt,
                ...this._getToastDebugInfo()
            }
        );
        return null;
    }
    static _getCandidateGameLogEntriesForRoll({toast, startedAtMs}) {
        // Scan bottom-up as requested.
        let candidates = this._getCharacterGameLogEntriesBottomUp();

        if (!candidates.length) return [];

        const threshold = startedAtMs ? startedAtMs - 30000 : null;

        if (threshold != null) {
            const recent = candidates.filter(entryEl => {
                const t = this._getGameLogEntryTimeMs(entryEl);
                // If no datetime is present, keep it in; otherwise require it to be recent
                return t == null || t >= threshold;
            });
            if (recent.length) candidates = recent;
        }

        if (toast) {
            const action = (toast.action || "").toLowerCase();
            const total = toast.total;

            const byActionAndTotal = candidates.filter(entryEl => {
                const entryAction = this._getGameLogEntryAction(entryEl);
                const entryTotal = this._getGameLogEntryTotal(entryEl);
                const actionMatch = !action || !entryAction || entryAction === action;
                const totalMatch = total == null || entryTotal === total;
                return actionMatch && totalMatch;
            });
            if (byActionAndTotal.length) return byActionAndTotal;

            const byTotal = candidates.filter(entryEl => {
                const entryTotal = this._getGameLogEntryTotal(entryEl);
                return total == null || entryTotal === total;
            });
            if (byTotal.length) return byTotal;

            const byAction = candidates.filter(entryEl => {
                const entryAction = this._getGameLogEntryAction(entryEl);
                return !action || !entryAction || entryAction === action;
            });
            if (byAction.length) return byAction;
        }

        return candidates;
    }
    static async _waitForGameLogResultAndParse(roll, {toast=null, startedAtMs=null}={}, retries = 200, delay = 50) {
        const opened = await this._openGameLogWithRetry();
        if (!opened) return false;

        const startedAt = Date.now();

        const expectedNotationRaw = this._getExpectedDiceNotationForRoll(roll);
        const expectedNotation = this._canonicalizeDiceNotation(expectedNotationRaw);

        console.log("DigitalDiceManager: waiting for game log parse", {
            expectedNotation,
            expectedNotationRaw,
            incomingFormulas: (roll?.rolls || []).map(r => r?.formula),
            toast,
            startedAtMs
        });

        for (let i = 0; i <= retries; i++) {
            const candidates = this._getCandidateGameLogEntriesForRoll({toast, startedAtMs});

            for (const candidate of candidates) {
                const beforeExpandNotation = this._getGameLogEntryNotation(candidate);

                // Expand if needed so notation/breakdown is present
                await this._expandGameLogEntryIfNeeded(candidate);

                const candidateNotationRaw = this._getGameLogEntryNotation(candidate);
                const candidateNotation = this._canonicalizeDiceNotation(candidateNotationRaw);
                const candidateAction = this._getGameLogEntryAction(candidate);
                const candidateTotal = this._getGameLogEntryTotal(candidate);
                const candidateTime = ($(candidate).find("time").attr("datetime") || "").trim();

                if (expectedNotation && candidateNotation && candidateNotation !== expectedNotation) {
                    console.log("DigitalDiceManager: skipping game log candidate (notation mismatch)", {
                        expectedNotation,
                        expectedNotationRaw,
                        candidateNotation,
                        candidateNotationRaw,
                        candidateAction,
                        candidateTotal,
                        candidateTime,
                        beforeExpandNotation
                    });
                    continue;
                }

                const parsed = roll.parseGameLogEntry(candidate);
                if (parsed) {
                    console.log("DigitalDiceManager: parsed game log entry", {
                        expectedNotation,
                        expectedNotationRaw,
                        candidateNotation,
                        candidateNotationRaw,
                        candidateAction,
                        candidateTotal,
                        candidateTime
                    });
                    return true;
                }

                console.log("DigitalDiceManager: candidate found but parseGameLogEntry returned false", {
                    expectedNotation,
                    expectedNotationRaw,
                    candidateNotation,
                    candidateNotationRaw,
                    candidateAction,
                    candidateTotal,
                    candidateTime
                });
            }

            await this._wait(delay);
        }

        console.warn(
            "DigitalDiceManager: game log result not parsed → likely opened too early, stale toast, or parse timing issue",
            {
                elapsedMs: Date.now() - startedAt,
                expectedNotation,
                expectedNotationRaw,
                toast,
                startedAtMs,
                ...this._getGameLogDebugInfo()
            }
        );
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
        // Results are now read from the Game Log.
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
        let resolver = null;
        let rejecter = null;
        const promise = new Promise((resolve, reject) => {
            resolver = resolve;
            rejecter = reject;
        });
        this._pendingRolls.push([roll, resolver, rejecter]);
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

                const startedAtMs = Date.now();
                const rolled = await this._makeRoll(roll);

                if (!rolled) {
                    throw new Error("DigitalDiceManager: failed to click DDB roll button");
                }

                // Do not open the game log prematurely. Wait for the toast first, then open/parse/close.
                const toast = await this._waitForRollToast();

                if (!toast) {
                    throw new Error("DigitalDiceManager: roll toast not detected");
                }

                const wasOpen = this._isGameLogOpen();
                try {
                    const parsed = await this._waitForGameLogResultAndParse(roll, {toast, startedAtMs});
                    if (!parsed) {
                        throw new Error("DigitalDiceManager: game log result not parsed");
                    }
                } finally {
                    // Close only if we opened it as part of this parsing flow
                    if (!wasOpen) {
                        await this._closeGameLogWithRetry();
                    }
                }

                this._finishPendingRoll();
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