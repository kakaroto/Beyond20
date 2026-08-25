// Standalone regression tests for DICE_REGEXP in src/common/utils.js.
// Run with: node test/dice_regex.test.js
//
// The regex is extracted from utils.js at runtime so this file stays in sync
// without needing the project's bundler. Exits 1 on any failure.

const fs = require('fs');
const path = require('path');

const utilsPath = path.join(__dirname, '..', 'src', 'common', 'utils.js');
const src = fs.readFileSync(utilsPath, 'utf8');

const m = src.match(/const DICE_REGEXP = (\/.+\/[gmiusy]+);/);
if (!m) {
    console.error('FAIL: Could not locate DICE_REGEXP declaration in src/common/utils.js');
    process.exit(2);
}
// eslint-disable-next-line no-eval
const DICE_REGEXP = eval(m[1]);

function matchDice(input) {
    const re = new RegExp(DICE_REGEXP.source, DICE_REGEXP.flags);
    const out = [];
    let res;
    while ((res = re.exec(input)) !== null) {
        // group 2 = dice token (e.g. "1d20"); group 3 = trailing modifiers/extra dice (e.g. "+3");
        // group 4 = pure +/- modifier-only match (e.g. "+5").
        if (res[2]) {
            const mods = (res[3] || '').replace(/\s+/g, '');
            out.push(res[2] + mods);
        } else if (res[4]) {
            out.push(res[4].replace(/\s+/g, ''));
        }
    }
    return out;
}

const cases = [
    // --- Bug fix: bare D0 / D1 must NOT match (issue #1126) ---
    { name: 'issue #1126 Vecna door label sentence',
      input: 'Characters can teleport to Vecna’s central chamber by touching the ruby gemstone on one of the following doors: A2, B1, C1, D1.',
      expect: [] },
    { name: 'bare uppercase D1 in label',
      input: 'door D1 is locked',
      expect: [] },
    { name: 'bare lowercase d1',
      input: 'unit d1 reports in',
      expect: [] },
    { name: 'bare uppercase D0',
      input: 'panel D0 is hidden',
      expect: [] },
    { name: 'bare lowercase d0',
      input: 'index d0 of the table',
      expect: [] },
    { name: 'map-label list with D1 at end',
      input: 'A1, B0, C1, D1',
      expect: [] },

    // --- Explicit-count forms preserve original behavior even for d0/d1 ---
    { name: 'explicit 1d1 still matches (unchanged behavior)',
      input: 'roll 1d1',
      expect: ['1d1'] },
    { name: 'explicit 2d0 still matches (unchanged behavior)',
      input: 'roll 2d0',
      expect: ['2d0'] },

    // --- Regression: standard dice rolls must still match ---
    { name: 'classic 1d20 attack',
      input: 'attack with 1d20',
      expect: ['1d20'] },
    { name: 'bare lowercase d20',
      input: 'roll d20',
      expect: ['d20'] },
    { name: 'bare uppercase D20',
      input: 'roll D20',
      expect: ['D20'] },
    { name: '2d6+3 damage expression',
      input: 'deal 2d6+3 damage',
      expect: ['2d6+3'] },
    { name: 'bare d8 damage',
      input: 'longsword d8 slashing',
      expect: ['d8'] },
    { name: 'bare d6 small die',
      input: 'shortbow d6 piercing',
      expect: ['d6'] },
    { name: 'd100 percentile',
      input: 'roll d100',
      expect: ['d100'] },
    { name: 'd10 ten-sided',
      input: 'roll d10',
      expect: ['d10'] },
    { name: 'bare d4 force damage',
      input: 'magic missile d4 force',
      expect: ['d4'] },
    { name: 'bare d2 (legitimate two-sided die)',
      input: 'flip d2 for tiebreaker',
      expect: ['d2'] },
    { name: 'mixed dice 1d8+1d6+3',
      input: 'crit damage 1d8+1d6+3',
      expect: ['1d8+1d6+3'] },
    { name: 'reroll modifier d20ro<3',
      input: 'use d20ro<3',
      expect: ['d20ro<3'] },
    { name: 'min modifier d6min2',
      input: 'use d6min2',
      expect: ['d6min2'] },
    { name: 'plain numeric modifier +5',
      input: 'attack +5 to hit',
      expect: ['+5'] },

    // --- Embedded d / D inside words must remain ignored ---
    { name: 'word "and" should not match',
      input: 'find and read',
      expect: [] },
    { name: 'word "doorway" should not match',
      input: 'walk through the doorway',
      expect: [] },
    { name: 'identifier "admin1" should not match',
      input: 'this is admin1 testing',
      expect: [] },
];

let pass = 0;
let fail = 0;
const failures = [];
for (const tc of cases) {
    const got = matchDice(tc.input);
    const ok = JSON.stringify(got) === JSON.stringify(tc.expect);
    if (ok) {
        pass++;
        console.log(`PASS  ${tc.name}`);
    } else {
        fail++;
        failures.push({ name: tc.name, input: tc.input, expect: tc.expect, got });
        console.log(`FAIL  ${tc.name}`);
        console.log(`      input:    ${JSON.stringify(tc.input)}`);
        console.log(`      expected: ${JSON.stringify(tc.expect)}`);
        console.log(`      got:      ${JSON.stringify(got)}`);
    }
}

console.log(`\n${pass}/${pass + fail} passed`);
process.exit(fail ? 1 : 0);
