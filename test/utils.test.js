"use strict";
// Unit tests for the pure helpers in src/common/utils.js.
// Run with: npm test   (or: node --test test/utils.test.js)
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadScripts } = require("./helpers/load.js");

const env = loadScripts(["src/common/utils.js"]);
const urlMatches = env.get("urlMatches");
const cleanRoll = env.get("cleanRoll");
const replaceRolls = env.get("replaceRolls");

test("urlMatches treats * as a wildcard", () => {
    assert.equal(urlMatches("https://www.dndbeyond.com/characters/1", "https://*.dndbeyond.com/*"), true);
    assert.equal(urlMatches("https://example.com/", "https://*.dndbeyond.com/*"), false);
});

test("urlMatches wildcards can span path segments", () => {
    assert.equal(urlMatches("https://example.com/a/b/c/edit", "https://example.com/*/edit"), true);
    assert.equal(urlMatches("https://example.com/a/b/c/view", "https://example.com/*/edit"), false);
});

test("urlMatches compares ports literally", () => {
    assert.equal(urlMatches("http://localhost:8787/a", "http://localhost:8787/*"), true);
    // A port-less pattern does not match a URL that has a port
    assert.equal(urlMatches("http://localhost:8787/", "http://localhost/*"), false);
});

test("cleanRoll merges adjacent operators", () => {
    assert.equal(cleanRoll("1d10 + + 2 + 3"), "1d10 + 2 + 3");
    assert.equal(cleanRoll("1d6 + - 2"), "1d6 - 2");
    assert.equal(cleanRoll("1d6 \u2212 2"), "1d6 - 2");
});

test("cleanRoll tolerates empty input", () => {
    assert.equal(cleanRoll(null), "");
    assert.equal(cleanRoll(undefined), "");
});

test("replaceRolls finds dice and their trailing modifiers", () => {
    const out = replaceRolls("Deals 2d6 + 3 fire damage and 1d4 cold", (dice, mods) => `[${dice}|${mods}]`);
    assert.equal(out, "Deals [2d6| + 3] fire damage and [1d4|] cold");
});

test("replaceRolls leaves text alone when the callback returns null", () => {
    const text = "Deals 2d6 fire damage";
    assert.equal(replaceRolls(text, () => null), text);
});

test("replaceRolls ignores bare D1/D0 labels (issue #1126)", () => {
    const text = "doors: A2, B1, C1, D1.";
    assert.equal(replaceRolls(text, () => "X"), text);
});
