"use strict";
// Unit tests for the dice roller in src/common/dice.js.
// Run with: npm test   (or: node --test test/dice.test.js)
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadScripts, forceDice } = require("./helpers/load.js");

const env = loadScripts(["src/common/dice.js"]);
const DNDBRoll = env.get("DNDBRoll");
const DNDBDice = env.get("DNDBDice");

// Objects created inside the vm context have a different Object prototype, so compare plain JSON copies
const plain = (value) => JSON.parse(JSON.stringify(value));

/** Rolls `formula` with the dice forced to `values`, returns the roll. */
async function rollWith(formula, values) {
    forceDice(env, values);
    const roll = new DNDBRoll(formula);
    await roll.roll();
    return roll;
}

test("totals dice plus a flat modifier", async () => {
    const roll = await rollWith("2d6 + 3", [4, 5]);
    assert.equal(roll.total, 12);
    assert.equal(roll.formula, "2d6 + 3");
});

test("handles subtraction, including subtracted dice", async () => {
    assert.equal((await rollWith("1d20 + 5 - 2", [10])).total, 13);
    assert.equal((await rollWith("1d8 - 1d4", [8, 3])).total, 5);
});

test("supports decimal modifiers", async () => {
    assert.equal((await rollWith("1d6+1.5", [2])).total, 3.5);
});

test("a formula with no dice is a constant", async () => {
    const roll = new DNDBRoll("12 + 4 + 3");
    await roll.roll();
    assert.equal(roll.total, 19);
    assert.equal(roll.dice.length, 0);
});

test("cleans up doubled and unicode operators", () => {
    assert.equal(new DNDBRoll("1d6 + + 2").formula, "1d6 + 2");
    assert.equal(new DNDBRoll("1d6 \u2212 2").formula, "1d6 - 2");
    assert.equal(new DNDBRoll("1d6 - - 2").formula, "1d6 + 2");
});

test("keep highest / keep lowest / drop lowest", async () => {
    const kh = await rollWith("4d6kh3", [1, 6, 5, 4]);
    assert.equal(kh.total, 15);
    assert.deepEqual(plain(kh.dice[0].rolls.map(r => !!r.discarded)), [true, false, false, false]);

    assert.equal((await rollWith("4d6dl1", [1, 6, 5, 4])).total, 15);
    assert.equal((await rollWith("2d20kl1", [17, 5])).total, 5);
});

test("reroll modifier discards the old die and rolls a replacement", async () => {
    const roll = await rollWith("1d6ro<=2", [1, 5]);
    assert.equal(roll.total, 5);
    assert.deepEqual(plain(roll.dice[0].rolls), [{ roll: 1, discarded: true }, { roll: 5 }]);
});

test("min modifier raises a low total", async () => {
    assert.equal((await rollWith("1d6min3", [1])).total, 3);
    assert.equal((await rollWith("1d6min3", [5])).total, 5);
});

test("detects critical hits and failures on the natural die", async () => {
    let roll = await rollWith("1d20", [20]);
    assert.equal(roll.isCriticalHit(), true);
    assert.equal(roll.isCriticalFail(), false);

    roll = await rollWith("1d20", [1]);
    assert.equal(roll.isCriticalHit(), false);
    assert.equal(roll.isCriticalFail(), true);
});

test("honors a custom critical limit", async () => {
    forceDice(env, [19]);
    const roll = new DNDBRoll("1d20");
    roll.setCriticalLimit(19);
    await roll.roll();
    assert.equal(roll.isCriticalHit(), true);
});

test("real dice stay in range and cover every face", () => {
    // Fresh context: the other tests patch rollSingleDie on the shared one
    const fresh = loadScripts(["src/common/dice.js"]);
    const die = new (fresh.get("DNDBDice"))(1, 4);
    const seen = new Set();
    for (let i = 0; i < 2000; i++) {
        const value = die.rollSingleDie();
        assert.ok(Number.isInteger(value) && value >= 1 && value <= 4, `out of range: ${value}`);
        seen.add(value);
    }
    assert.deepEqual([...seen].sort(), [1, 2, 3, 4]);
});
