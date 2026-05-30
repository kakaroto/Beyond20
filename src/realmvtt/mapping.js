/*
 * Beyond20 → Realm VTT: pure mapping helpers.
 *
 * No DOM and no network here, so this logic can be exercised standalone.
 * Translates Beyond20 roll requests / enums into the shapes Realm expects.
 *
 * Beyond20 enums (see src/common/settings.js):
 *   WhisperType: NO=0, YES=1, QUERY=2, HIDE_NAMES=3
 *   RollType:    NORMAL=0, DOUBLE=1, QUERY=2, ADVANTAGE=3, DISADVANTAGE=4,
 *                THRICE=5, SUPER_ADVANTAGE=6, SUPER_DISADVANTAGE=7,
 *                OVERRIDE_ADVANTAGE=8, OVERRIDE_DISADVANTAGE=9
 */
var RealmVTT = (typeof window !== "undefined" && window.RealmVTT) || {};
if (typeof window !== "undefined") window.RealmVTT = RealmVTT;

RealmVTT.mapping = (function () {
    // d20 base for a check/save/attack, honouring Beyond20 advantage.
    function d20For(advantage) {
        switch (Number(advantage)) {
            case 3: // ADVANTAGE
            case 8: // OVERRIDE_ADVANTAGE
                return "2d20dl1";
            case 6: // SUPER_ADVANTAGE
                return "3d20dl2";
            case 4: // DISADVANTAGE
            case 9: // OVERRIDE_DISADVANTAGE
                return "2d20dh1";
            case 7: // SUPER_DISADVANTAGE
                return "3d20dh2";
            case 1: // DOUBLE  (roll twice, keep both)
                return "2d20";
            case 5: // THRICE
                return "3d20";
            default: // NORMAL (0) / QUERY (2)
                return "1d20";
        }
    }

    // WhisperType.NO (0) is public; everything else is whispered to the GM.
    function audienceFor(whisper) {
        return Number(whisper) !== 0 ? "gm" : "public";
    }

    // Append a flat modifier (e.g. "+5", "-1", "3") to a dice string.
    function withModifier(diceString, modifier) {
        if (modifier === undefined || modifier === null) return diceString;
        const m = `${modifier}`.trim();
        if (!m || m === "0" || m === "+0") return diceString;
        return diceString + (/^[+-]/.test(m) ? m : `+${m}`);
    }

    // Full d20 roll string for a check/save/attack with a to-hit modifier.
    function d20RollString(advantage, modifier) {
        return withModifier(d20For(advantage), modifier);
    }

    // Build a Realm damage roll string from Beyond20's parallel `damages` /
    // `damage-types` arrays, typing every term:
    //   ["1d8+3","1d6"] + ["Slashing","Fire"]
    //     -> "1d8 slashing + 3 slashing + 1d6 fire".
    // Realm's damage handler parses the damage type back out of the string, so
    // this is what we pass both as a damage rollString and as an attack's
    // metadata.damage (which the card's Damage button rolls as rollType "damage").
    function beyond20DamageString(request) {
        if (!request) return "";
        const damages = request.damages || [];
        const types = request["damage-types"] || request.damageTypes || [];
        const parts = [];
        for (let i = 0; i < damages.length; i++) {
            const d = damages[i];
            const formula =
                typeof d === "string" ? d : d && (d.damage || d.formula);
            if (!formula) continue;
            const rawType =
                types[i] != null
                    ? types[i]
                    : typeof d === "object" && d
                      ? d["damage-type"] || d.damageType
                      : "";
            const type = rawType ? String(rawType).toLowerCase().trim() : "";
            parts.push(type ? withDamageType(formula, type) : `${formula}`);
        }
        return parts.join(" + ");
    }

    // Append the damage type to EVERY term so each die and modifier is typed,
    // matching Realm's own convention ("1d6 piercing + 1 piercing"):
    //   "1d4+3" + "piercing" -> "1d4 piercing + 3 piercing"
    // This is the least error-prone form — no term can inherit the wrong type.
    function withDamageType(formula, type) {
        if (!type) return `${formula}`;
        const terms = `${formula}`.match(/[+-]?[^+-]+/g) || [`${formula}`];
        return terms
            .map((t) => t.trim())
            .filter(Boolean)
            .map((t, i) => {
                const sign = /^[+-]/.test(t) ? t[0] : "";
                const body = t.replace(/^[+-]/, "").trim();
                const typed = `${body} ${type}`;
                return i === 0 ? typed : `${sign} ${typed}`;
            })
            .join(" ");
    }

    // Rewrite the leading d20 of an existing formula to honour advantage, e.g.
    // "1d20+5" + ADVANTAGE → "2d20dl1+5". Used for the raw `roll` action where
    // Beyond20's fallback formula is always a flat 1d20.
    function applyAdvantage(rollString, advantage) {
        const dice = d20For(advantage);
        if (dice === "1d20" || !rollString) return rollString;
        return rollString.replace(/\b1?d20\b/i, dice);
    }

    // Standard 5e/A5E conditions. Realm stores effect templates with these
    // capitalised names (see ruleset rollhandlers: api.addEffect("Poisoned", ...)).
    const CONDITION_NAMES = [
        "Blinded", "Charmed", "Deafened", "Frightened", "Grappled",
        "Incapacitated", "Invisible", "Paralyzed", "Petrified", "Poisoned",
        "Prone", "Restrained", "Stunned", "Unconscious", "Exhaustion"
    ];

    // Map a D&D Beyond condition name → Realm effect name.
    // ruleset: "a5e" swaps Exhaustion → Fatigue (Level Up naming).
    function realmEffectName(ddbCondition, ruleset) {
        const name = `${ddbCondition || ""}`.trim();
        if (!name) return name;
        const match = CONDITION_NAMES.find(
            (c) => c.toLowerCase() === name.toLowerCase()
        );
        let resolved = match || name[0].toUpperCase() + name.slice(1);
        if (resolved === "Exhaustion" && ruleset === "a5e") resolved = "Fatigue";
        return resolved;
    }

    // Realm roll types (see realmvtt-5e/rollhandlers/*.js filenames).
    // d20-based types roll a d20+modifier; the rest carry their own formula.
    const D20_TYPES = [
        "initiative",
        "attack",
        "attribute",
        "ability",
        "save",
        "concentration",
        "deathsave"
    ];

    // Map a Beyond20 request → a Realm roll type. Unknown/display-only types
    // fall back to "chat" (shown in chat, no dice).
    function rollTypeFor(request) {
        const type = request && request.type;
        switch (type) {
            case "initiative":
                return "initiative";
            case "attack":
            case "spell-attack":
                return "attack";
            case "ability": // ability score check
            case "skill": // skill check — Realm's "ability" handler covers both
                return "ability";
            case "saving-throw":
                return /concentration/i.test((request && request.name) || "")
                    ? "concentration"
                    : "save";
            case "hit-dice":
                return "hitdie";
            case "death-save":
                return "deathsave";
            default:
                return "chat"; // spell-card / item / trait / chat-message / roll-table / custom
        }
    }

    // ---- Spell cards --------------------------------------------------------

    // A request is spell-related if its type mentions "spell" or it carries the
    // spell statblock fields Beyond20 only attaches to spells.
    function isSpellRequest(request) {
        const t = request && request.type;
        if (typeof t === "string" && t.indexOf("spell") !== -1) return true;
        return !!(request && (request["level-school"] || request["spell-level"]));
    }

    const ABILITY_SAVE_STEM = {
        str: "strength", strength: "strength",
        dex: "dexterity", dexterity: "dexterity",
        con: "constitution", constitution: "constitution",
        int: "intelligence", intelligence: "intelligence",
        wis: "wisdom", wisdom: "wisdom",
        cha: "charisma", charisma: "charisma"
    };
    function saveStem(ability) {
        return ABILITY_SAVE_STEM[String(ability || "").trim().toLowerCase()] || null;
    }
    function cap(s) {
        return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
    }

    // A clickable saving-throw button, mirroring realmvtt-5e spell-list.html. The
    // fenced ```Roll_<Ability>_Save block runs in the ruleset sandbox on click and
    // prompts a save for the selected/dropped tokens at the spell's DC.
    function saveButtonMacro(ability, dc) {
        const stem = saveStem(ability);
        if (!stem) return "";
        const Cap = cap(stem);
        const label = Cap + " Save";
        return [
            "```Roll_" + Cap + "_Save",
            "  const tokens = api.getSelectedOrDroppedToken();",
            "  tokens.forEach(token => {",
            "    let mods = [{ name: '" + label + "', value: (token && token.data && token.data['" + stem + "Save']) || 0, active: true }];",
            "    if (typeof getEffectsAndModifiersForToken === 'function') {",
            "      [].concat(getEffectsAndModifiersForToken(token, ['saveBonus','savePenalty'], '" + stem + "'),",
            "               getEffectsAndModifiersForToken(token, ['saveBonus','savePenalty'], 'spell')).forEach(m => mods.push(m));",
            "    }",
            "    api.promptRollForToken(token, '" + label + "', '1d20', mods, { rollName: '" + label + "', tooltip: '" + label + "', dc: " + Number(dc) + " }, 'save');",
            "  });",
            "  ```"
        ].join("\n");
    }

    // A clickable spell-attack button that rolls the spell's to-hit as a Realm
    // "attack" roll (carrying the damage so its own card gets a Damage button).
    function attackButtonMacro(name, toHit, damageStr) {
        const n = String(name || "Spell").replace(/'/g, "\\'");
        const formula =
            toHit !== undefined && toHit !== null && `${toHit}` !== ""
                ? withModifier("1d20", toHit)
                : "1d20";
        const d = damageStr ? String(damageStr).replace(/'/g, "\\'") : "";
        const meta =
            "{ rollName: '" + n + "', attack: '" + n + "', icon: 'IconWand'" +
            (d ? ", damage: '" + d + "'" : "") + " }";
        return [
            "```Roll_Attack",
            "  api.promptRoll('" + n + "', '" + formula + "', [], " + meta + ", 'attack');",
            "  ```"
        ].join("\n");
    }

    // A clickable button that applies the Concentration effect to the caster's
    // token (with the spell name as the effect value), via the ruleset's own
    // api.addEffect so its drop-prior-concentration handling runs.
    function concentrateButtonMacro(spellName) {
        const n = String(spellName || "this spell").replace(/'/g, "\\'");
        return [
            "```Concentrate",
            "  const token = api.getToken();",
            "  if (token) api.addEffect('Concentration', token, undefined, '" + n + "');",
            "  ```"
        ].join("\n");
    }

    // A clickable damage button that rolls the spell's damage as rollType "damage".
    function damageButtonMacro(name, damageStr) {
        if (!damageStr) return "";
        const n = String(name || "Spell").replace(/'/g, "\\'");
        const d = String(damageStr).replace(/'/g, "\\'");
        return [
            "```Roll_Damage",
            "  api.promptRoll('" + n + " Damage', '" + d + "', [], { rollName: '" + n + " Damage' }, 'damage');",
            "  ```"
        ].join("\n");
    }

    // Beyond20's description is newline-separated plain text; Realm's markdown
    // collapses single newlines, so promote each line to its own paragraph and
    // bold the D&D "Xxx." lead-in sub-headers.
    function descriptionToMarkdown(text) {
        if (!text) return "";
        const HEAD =
            /^(Using a Higher-Level Spell Slot|At Higher Levels|Cantrip Upgrade|This spell can be cast)\b\.?/i;
        // Tolerate stray HTML (some sources don't pre-strip): turn block tags into
        // newlines, drop the rest.
        const plain = String(text)
            .replace(/<\s*br\s*\/?>/gi, "\n")
            .replace(/<\s*li[^>]*>/gi, "\n- ")
            .replace(/<\/\s*(p|div|li|h[1-6]|tr|ul|ol)\s*>/gi, "\n")
            .replace(/<\/?[^>]+>/gi, "");
        return plain
            .split(/\n+/)
            .map((s) => s.trim())
            .filter(Boolean)
            .map((line) => {
                const m = line.match(HEAD);
                if (m) return "**" + m[0] + "**" + line.slice(m[0].length);
                return line;
            })
            .join("\n\n");
    }

    // Markdown body for a spell card: icon + name header, description, then the
    // save and damage buttons (whichever apply).
    function spellCardText(request, damageStr) {
        const name = (request && request.name) || "Spell";
        const lines = ["#### :IconWand: " + name, "", "---"];
        const desc = request && descriptionToMarkdown(request.description);
        if (desc) {
            lines.push(desc, "", "---");
        }
        const toHit = request && request["to-hit"];
        if (toHit !== undefined && toHit !== null && `${toHit}` !== "")
            lines.push(attackButtonMacro(name, toHit, damageStr));
        const dc = request && request["save-dc"];
        const ability = request && request["save-ability"];
        const saveBtn = dc && ability ? saveButtonMacro(ability, dc) : "";
        if (saveBtn) lines.push(saveBtn);
        const dmgBtn = damageButtonMacro(name, damageStr);
        if (dmgBtn) lines.push(dmgBtn);
        if (request && request.concentration)
            lines.push(concentrateButtonMacro(name));
        return lines.join("\n");
    }

    // A generic "Display in VTT" card for non-spell things (items, features,
    // traits, backgrounds…): just a name header and the description. No macros.
    function displayCardText(request) {
        const name = (request && request.name) || "";
        const lines = [];
        if (name) lines.push("#### " + name, "", "---");
        const desc = descriptionToMarkdown(
            request && (request.description || request.content)
        );
        if (desc) lines.push(desc);
        return lines.join("\n").trim();
    }

    // Chat tag chips for a spell card ({name, tooltip} per messages.schema).
    function spellTags(request) {
        const tags = [{ name: "Spell", tooltip: "Cast a Spell" }];
        const push = (name, tooltip) => {
            if (name) tags.push({ name: String(name), tooltip });
        };
        push(request && request["level-school"], "Level / School");
        if (request && request.concentration)
            push("Concentration", "Requires Concentration");
        if (request && request.ritual) push("Ritual", "Can be cast as a Ritual");
        push(request && request["casting-time"], "Casting Time");
        push(request && request.range, "Range");
        push(request && request.duration, "Duration");
        return tags;
    }

    // Realm 5e/A5E data field paths (identical across both rulesets).
    const FIELDS = {
        curHp: "data.curhp",
        maxHp: "data.hitpoints",
        tempHp: "data.tempHp",
        initiative: "data.initiative"
    };

    return {
        d20For,
        audienceFor,
        withModifier,
        d20RollString,
        applyAdvantage,
        beyond20DamageString,
        rollTypeFor,
        D20_TYPES,
        realmEffectName,
        CONDITION_NAMES,
        isSpellRequest,
        saveButtonMacro,
        damageButtonMacro,
        attackButtonMacro,
        spellCardText,
        displayCardText,
        spellTags,
        FIELDS
    };
})();

// Allow standalone (Node) exercising of the pure logic during development.
if (typeof module !== "undefined" && module.exports) {
    module.exports = RealmVTT.mapping;
}
