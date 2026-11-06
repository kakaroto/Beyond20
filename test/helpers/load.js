"use strict";
// Beyond20's source files are plain browser scripts (no modules/exports), so the tests load
// them into an isolated vm context and read the top-level declarations back out of it.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..", "..");

/**
 * Runs the given source files (paths relative to the repo root) in a fresh context.
 * Returns `get(name)` to read a top-level class/function/const declared by them.
 */
function loadScripts(files, globals = {}) {
    const context = vm.createContext({ console, ...globals });
    for (const file of files) {
        const code = fs.readFileSync(path.join(ROOT, file), "utf8");
        vm.runInContext(code, context, { filename: file });
    }
    return {
        context,
        // class/const/let declarations are not properties of the context, so evaluate the name
        get: (name) => vm.runInContext(name, context),
        run: (code) => vm.runInContext(code, context),
    };
}

/** Makes every die roll the next value from `values` (cycling), so tests are deterministic. */
function forceDice(env, values) {
    env.context.__forced = values.slice();
    env.context.__forced_index = 0;
    env.run(`DNDBDice.prototype.rollSingleDie = function () {
        const v = __forced[__forced_index % __forced.length];
        __forced_index++;
        return v;
    }`);
}

module.exports = { loadScripts, forceDice };
