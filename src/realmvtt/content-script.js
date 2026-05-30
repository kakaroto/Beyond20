/*
 * Beyond20 → Realm VTT: content-script handler.
 *
 * Injected on play.realmvtt.com. Registers as a generic VTT tab so the Beyond20
 * background script forwards roll / hp / conditions / combat messages here, then
 * maps each one onto a Realm backend call via RealmVTT.transport. We do NOT
 * render Beyond20's own cards — rolls go through campaign-channel.roll so Realm
 * rolls its native 3D dice and posts its own chat card.
 */
console.log("Beyond20: Realm VTT module loaded:", window.location.hostname);

const T = RealmVTT.transport;
const M = RealmVTT.mapping;

var settings = typeof getDefaultSettings === "function" ? getDefaultSettings() : {};

function rvLog() {
    const args = [].slice.call(arguments);
    console.log.apply(console, ["Beyond20→Realm:"].concat(args));
}
function rvError(e) {
    const msg = (e && (e.message || e.error || e.name)) || e;
    console.error("Beyond20→Realm error:", msg, e);
}

function updateSettings(new_settings) {
    if (new_settings) {
        settings = new_settings;
        if (typeof sendCustomEvent === "function")
            sendCustomEvent("NewSettings", [settings, chrome.runtime.getURL("")]);
    } else if (typeof getStoredSettings === "function") {
        getStoredSettings((saved) => {
            if (typeof sendCustomEvent === "function") sendCustomEvent("Loaded", [saved]);
            updateSettings(saved);
        });
    }
}

// Resolve the Realm CHARACTER for a Beyond20 character name, scoped to the
// current campaign and cached per name. The character is the anchor for
// everything: HP and conditions are written to the character record and Realm
// syncs the token on the backend.
const characterCache = new Map();
async function resolveCharacter(name) {
    if (!name) return null;
    if (characterCache.has(name)) return characterCache.get(name);
    const character = await T.findCharacterByName(name); // filtered to campaignId
    if (character) characterCache.set(name, character);
    else rvLog("no Realm character named", JSON.stringify(name), "in this campaign");
    return character;
}

// Token identity for a roll: image/name/scale come straight off the character
// record (character.token.imageUrl / scaleX), so the roll shows the right token
// avatar. tokenId (the scene token instance) is resolved once per character and
// cached. All best-effort — a missing token just omits that field.
const tokenIdCache = new Map();
async function tokenInfoFor(character, fallbackName) {
    if (!character) return fallbackName ? { tokenName: fallbackName } : {};
    const cfg = character.token || {};
    const info = { tokenName: character.name };
    if (cfg.imageUrl) info.tokenUrl = cfg.imageUrl;
    const scale = cfg.scaleX || cfg.scaleY;
    if (scale) info.tokenScale = scale;
    let tokenId = tokenIdCache.get(character._id);
    if (tokenId === undefined) {
        const token = await T.findTokenForRecord(character._id);
        tokenId = token ? token._id : null;
        tokenIdCache.set(character._id, tokenId);
    }
    if (tokenId) info.tokenId = tokenId;
    return info;
}

const ABILITY_FULL_NAME = {
    str: "Strength",
    dex: "Dexterity",
    con: "Constitution",
    int: "Intelligence",
    wis: "Wisdom",
    cha: "Charisma"
};

// The ruleset rollhandlers title the card from metadata.rollName, but Beyond20
// puts that name in different fields per roll type: `name` (ability check, save,
// attack, spell, item), `skill` (skill check → "Athletics"), or only the
// `ability` abbreviation. Fall through them so the card always has a label.
function rollNameFor(request) {
    if (!request) return undefined;
    if (request.name) return request.name;
    if (request.skill) return request.skill;
    if (request.ability) {
        const a = String(request.ability).toLowerCase().slice(0, 3);
        return ABILITY_FULL_NAME[a] || request.ability;
    }
    return undefined;
}

// Roll types whose ruleset handler we want to run (proper card + context).
// HP/effect application in these handlers is macro-based (manual "Apply"
// buttons), so attribution does NOT auto-apply anything — Beyond20's separate
// hp-update / conditions-update stay authoritative for the roller's own state.
const ATTRIBUTABLE_TYPES = [
    "initiative",
    "attribute",
    "ability",
    "save",
    "concentration",
    "attack",
    "damage"
];

function buildRollMeta(realmRollType, request, character, tokenInfo) {
    const meta = Object.assign({ source: "beyond20" }, tokenInfo);
    const rollName = rollNameFor(request);
    if (rollName) meta.rollName = rollName;
    const dc = request && (request["save-dc"] || request.dc);
    if (dc) meta.dc = String(dc);
    if (character && ATTRIBUTABLE_TYPES.includes(realmRollType)) {
        meta.recordId = character._id;
        meta.recordType = "characters";
    }
    return meta;
}

// ---- Action handlers ------------------------------------------------------

// Beyond20 marks an attack Melee/Ranged via "attack-type" (and range/reach).
function isRangedAttack(request) {
    const at = request["attack-type"] || request.attackType;
    if (at) return /ranged/i.test(String(at));
    if (request.range && !request.reach) return true;
    return false;
}

// Roll-card icon: spells get the wand, ranged the bow, else a sword.
function attackIcon(request) {
    if (M.isSpellRequest(request)) return "IconWand";
    return isRangedAttack(request) ? "IconBow" : "IconSword";
}

// Post a spell card to chat (description + save/damage buttons + tags), mirroring
// the 5e ruleset's cast output, rather than rolling anything directly.
async function sendSpellCard(request, character, tokenInfo, audience, damageStr) {
    const text = M.spellCardText(request, damageStr);
    const tags = M.spellTags(request);
    await T.sendMessage({ text, tags });
}

// True when this is D&D Beyond's *Damage* button specifically (rollAttack false /
// rollDamage true), as opposed to a Cast. We rely on the explicit flags — NOT a
// "no to-hit" heuristic, because a save-spell Cast also has damage and no to-hit
// but should post a card, not roll damage.
function isDamageButtonClick(request) {
    if (request.rollAttack === false) return true;
    if (request.rollDamage === true && request.rollAttack !== true) return true;
    return false;
}

// One Realm "damage" roll (typed string), honouring providedResults.
async function sendDamageRoll(request, character, tokenInfo, audience, damageStr, providedResults) {
    const metadata = buildRollMeta("damage", request, character, tokenInfo);
    if (request.name) metadata.attack = request.name;
    metadata.icon = attackIcon(request);
    return T.sendRoll(
        Object.assign(
            { rollString: damageStr, rollType: "damage", audience, metadata },
            tokenInfo
        ),
        providedResults
    );
}

// Route an attack-type request. attackResults/damageResults are D&D Beyond's
// digital-dice values for the to-hit and the damage respectively (empty when
// Realm rolls its own). The Damage button → a "damage" roll; a combined attack
// is sent as TWO rolls (to-hit + damage) when D&D Beyond already rolled the
// damage, otherwise as one attack roll carrying metadata.damage for its button.
async function sendAttackOrDamage(request, character, tokenInfo, audience, attackResults, damageResults) {
    const damageStr = M.beyond20DamageString(request);
    const hasToHit =
        request["to-hit"] !== undefined && request["to-hit"] !== null;
    const hasSave = !!(request["save-dc"] && request["save-ability"]);
    const dmgDice = (damageResults && damageResults.length ? damageResults : attackResults) || [];

    // The Damage button (Cast already happened) → just roll the damage.
    if (damageStr && isDamageButtonClick(request)) {
        return sendDamageRoll(request, character, tokenInfo, audience, damageStr, dmgDice);
    }

    // Spell CAST → post the card (attack/save/damage/concentrate buttons) instead
    // of rolling. Cast requests both the attack AND damage (rollAttack &&
    // rollDamage); the explicit Attack button is attack-only and rolls below.
    // (Save spells with no to-hit are always a card too.)
    if (
        M.isSpellRequest(request) &&
        ((request.rollAttack === true && request.rollDamage === true) ||
            (hasSave && !hasToHit))
    ) {
        return sendSpellCard(request, character, tokenInfo, audience, damageStr);
    }

    // Attack with a to-hit (weapon or attack spell): the Hit/DC roll. If D&D
    // Beyond also rolled damage (digital dice), emit it as a second Realm roll and
    // drop the attack's Damage button to avoid a re-roll.
    if (hasToHit) {
        const autoDamage = !!(damageStr && damageResults && damageResults.length);
        await sendAttack(request, character, tokenInfo, audience, attackResults, !autoDamage);
        if (autoDamage)
            await sendDamageRoll(request, character, tokenInfo, audience, damageStr, damageResults);
        return;
    }

    // No to-hit and no save, but has damage (e.g. Magic Missile, auto-hit) → roll
    // the damage directly.
    if (damageStr) {
        return sendDamageRoll(request, character, tokenInfo, audience, damageStr, dmgDice);
    }

    // Nothing rollable — fall back to a (degenerate) attack roll.
    return sendAttack(request, character, tokenInfo, audience, attackResults, true);
}

// One Realm "attack" roll (the Hit/DC button). The to-hit lives in
// request["to-hit"] — NOT request.roll, which for an attack is the *damage*
// formula. metadata.attack is the card title; metadata.damage is the
// type-embedded damage the card's Damage button rolls as rollType "damage".
async function sendAttack(request, character, tokenInfo, audience, providedResults, withDamageButton) {
    const modifier =
        request["to-hit"] !== undefined ? request["to-hit"] : request.modifier;
    const damageStr = M.beyond20DamageString(request);
    const metadata = buildRollMeta("attack", request, character, tokenInfo);
    metadata.attack = request.name;
    if (damageStr && withDamageButton !== false) metadata.damage = damageStr;
    metadata.icon = attackIcon(request);
    return T.sendRoll(
        Object.assign(
            {
                rollString: M.d20RollString(request.advantage, modifier),
                rollType: "attack",
                audience,
                metadata
            },
            tokenInfo
        ),
        providedResults
    );
}

// The shared router for a roll request (the flat `roll` action AND the unwrapped
// `request` of a `rendered-roll`). attackResults/damageResults carry D&D Beyond's
// digital-dice values (for the to-hit/d20 and the damage respectively) so Realm's
// dice land on them; both are [] for normal (Realm-rolled) requests.
async function routeRoll(request, attackResults, damageResults) {
    const realmRollType = M.rollTypeFor(request);
    const name = request.character && request.character.name;
    const character = await resolveCharacter(name);
    const tokenInfo = await tokenInfoFor(character, name);
    const audience = M.audienceFor(request.whisper);

    if (request.type === "spell-card")
        return sendSpellCard(
            request,
            character,
            tokenInfo,
            audience,
            M.beyond20DamageString(request)
        );

    if (realmRollType === "attack")
        return sendAttackOrDamage(
            request,
            character,
            tokenInfo,
            audience,
            attackResults,
            damageResults
        );

    // Any other dice roll (check/save/init/hit-die/death-save/…): Beyond20's
    // request.roll is already the full d20/dice formula, so honour advantage and
    // send it as-is. The d20 dice arrive in attackResults. Only treat it as a roll
    // when there's an actual dice term — a display (item/feature) sends roll "0".
    if (request.roll && /d\d/i.test(`${request.roll}`)) {
        const dice = [].concat(attackResults || [], damageResults || []);
        return T.sendRoll(
            Object.assign(
                {
                    rollString: M.applyAdvantage(request.roll, request.advantage),
                    rollType: realmRollType,
                    audience,
                    metadata: buildRollMeta(realmRollType, request, character, tokenInfo)
                },
                tokenInfo
            ),
            dice
        );
    }

    // No dice (item/feature/trait/background "Display in VTT") → a name + desc card.
    const text = M.displayCardText(request);
    if (text) await T.sendMessage({ text });
}

// Flat `roll` action: Realm rolls its own dice (no provided results).
async function handleRoll(request) {
    return routeRoll(request, [], []);
}

// Pull D&D Beyond's per-die results out of serialized rolls' `parts` into Realm's
// providedResults shape: [{ die: <faces>, value: <face> }, …]. Discarded dice
// (advantage/disadvantage) are included — Realm reproduces the drop itself.
// `rolls` may be plain roll objects (attack_rolls) or [type, roll] pairs
// (damage_rolls).
function collectDiceResults(rolls) {
    const out = [];
    const addRoll = (roll) => {
        const parts = roll && roll.parts;
        if (!Array.isArray(parts)) return;
        for (const part of parts) {
            if (part && typeof part === "object" && part.faces && Array.isArray(part.rolls)) {
                for (const r of part.rolls)
                    if (typeof r.roll === "number")
                        out.push({ die: part.faces, value: r.roll });
            }
        }
    };
    (rolls || []).forEach((d) => addRoll(Array.isArray(d) ? d[1] : d));
    return out;
}

// `rendered-roll` message: nested as { request, attack_rolls, damage_rolls, … }.
// This is what D&D Beyond's digital-dice mode forwards — the actual roll is under
// .request and the rolled dice are in attack_rolls/damage_rolls. Honour those
// exact values via providedResults (to-hit and damage kept separate so a combined
// attack becomes two separate Realm rolls).
async function handleRenderedRoll(message) {
    const request = message.request || message;
    const attackResults = collectDiceResults(message.attack_rolls);
    const damageResults = collectDiceResults(message.damage_rolls);
    return routeRoll(request, attackResults, damageResults);
}

// HP sync: { character: { name, hp, "max-hp", "temp-hp" } }
// Patch the CHARACTER record; Realm propagates HP to the token on the backend.
async function handleHpUpdate(request) {
    const c = request.character || {};
    const character = await resolveCharacter(c.name);
    if (!character) return rvLog("HP update: no matching character for", c.name);

    const set = {};
    if (c.hp !== undefined && c.hp !== null) set[M.FIELDS.curHp] = Number(c.hp);
    if (c["max-hp"] !== undefined && c["max-hp"] !== null)
        set[M.FIELDS.maxHp] = Number(c["max-hp"]);
    if (c["temp-hp"] !== undefined && c["temp-hp"] !== null)
        set[M.FIELDS.tempHp] = Number(c["temp-hp"]);
    if (!Object.keys(set).length) return;

    await T.patch("characters", character._id, { $set: set });
    rvLog("HP set on", character.name, set);
}

// Conditions sync: { character: { name, conditions: [..], exhaustion: n } }
// Patch the CHARACTER's effectIds (Realm syncs the token). Re-fetch first so we
// merge against current effects, not a stale cached copy.
async function handleConditionsUpdate(request) {
    const c = request.character || {};
    const cached = await resolveCharacter(c.name);
    if (!cached) return rvLog("Conditions update: no matching character for", c.name);
    const character = (await T.get("characters", cached._id)) || cached;

    const desiredNames = (c.conditions || []).map((x) => M.realmEffectName(x));
    if (c.exhaustion) desiredNames.push(M.realmEffectName("Exhaustion"));

    const effectIds = new Set(character.effectIds || []);
    for (const name of desiredNames) {
        const tmpl = await T.findEffectByName(name);
        if (!tmpl) {
            rvLog("Conditions update: no effect template named", name);
            continue;
        }
        effectIds.add(tmpl._id);
    }
    await T.patch("characters", character._id, {
        $set: { effectIds: Array.from(effectIds) }
    });
}

// Combat tracker sync: { combat: [{ name, initiative, turn, tags }] }
// Combat entries need the token (tracker holds tokenIds), so resolve the
// character then its token on the scene.
async function handleUpdateCombat(request) {
    for (const entry of request.combat || []) {
        const character = await resolveCharacter(entry.name);
        const token = character ? await T.findTokenForRecord(character._id) : null;
        if (!token) {
            rvLog("Combat update: no matching token for", entry.name);
            continue;
        }
        const init = parseInt(entry.initiative, 10);
        await T.addToCombat(token._id, isNaN(init) ? null : init);
    }
}

// ---- Message dispatch -----------------------------------------------------

const HANDLERS = {
    roll: handleRoll,
    "rendered-roll": handleRenderedRoll,
    "hp-update": handleHpUpdate,
    "conditions-update": handleConditionsUpdate,
    "update-combat": handleUpdateCombat
};

// Beyond20 fans every roll out to ALL registered play.realmvtt.com views.
// Guards:
//   1. A view not on a /campaign/<code> URL ignores forwarded messages.
//   2. Active-view election: among campaign views (tabs AND windows), the
//      most-recently-focused one handles the message — so the roll lands in the
//      Realm view you were just using, not a stale background window/tab.
//   3. A short shared-localStorage lock dedupes the first-message race and any
//      Beyond20 double-send, so each message is handled exactly once.
const CLAIM_WINDOW_MS = 1500;
const ACTIVE_VIEW_KEY = "beyondrealm:activeCampaignView";
const MY_VIEW_ID =
    Math.random().toString(36).slice(2) + "-" + Date.now().toString(36);

function inCampaign() {
    return !!T.inviteCodeFromUrl();
}

// Claim "active view" whenever this campaign view is focused/visible.
function markActiveView() {
    if (!inCampaign() || document.hidden) return;
    try {
        window.localStorage.setItem(
            ACTIVE_VIEW_KEY,
            JSON.stringify({ id: MY_VIEW_ID, ts: Date.now() })
        );
    } catch (e) {}
}

// This view handles messages if it's the most-recently-active campaign view
// (or none has been recorded yet).
function isDesignatedView() {
    try {
        const active = JSON.parse(
            window.localStorage.getItem(ACTIVE_VIEW_KEY) || "null"
        );
        return !active || !active.id || active.id === MY_VIEW_ID;
    } catch (e) {
        return true;
    }
}

function hashString(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = (h << 5) - h + str.charCodeAt(i);
        h |= 0;
    }
    return h.toString(36);
}

// Dedupe: first view to write the key within the window handles the message.
function claimMessage(request) {
    try {
        const key = "beyondrealm:claim:" + hashString(JSON.stringify(request));
        const now = Date.now();
        const prev = Number(window.localStorage.getItem(key) || 0);
        if (now - prev < CLAIM_WINDOW_MS) return false;
        window.localStorage.setItem(key, String(now));
        return true;
    } catch (e) {
        return true;
    }
}

window.addEventListener("focus", markActiveView);
document.addEventListener("visibilitychange", () => {
    if (!document.hidden) markActiveView();
});
window.addEventListener("pagehide", () => {
    try {
        const a = JSON.parse(window.localStorage.getItem(ACTIVE_VIEW_KEY) || "null");
        if (a && a.id === MY_VIEW_ID) window.localStorage.removeItem(ACTIVE_VIEW_KEY);
    } catch (e) {}
});

function handleMessage(request, sender, sendResponse) {
    rvLog("received", request && request.action, "| inCampaign:", inCampaign());
    if (request.action === "settings") {
        if (request.type === "general") updateSettings(request.settings);
        return;
    }
    if (request.action === "open-options") {
        if (typeof alertFullSettings === "function") alertFullSettings();
        return;
    }
    if (!HANDLERS[request.action]) return;
    if (!inCampaign()) return rvLog("skip (not in a campaign)");
    if (!isDesignatedView()) return rvLog("skip (another Realm view is active)");
    if (!claimMessage(request)) return rvLog("skip (duplicate — already handled)");
    Promise.resolve(HANDLERS[request.action](request))
        .then(() => rvLog("handled", request.action, "✓"))
        .catch(rvError);
}

chrome.runtime.onMessage.addListener(handleMessage);

if (typeof initializeAlertify === "function") initializeAlertify();
updateSettings();
chrome.runtime.sendMessage({ action: "register-generic-tab" });
markActiveView();
rvLog("loaded & registered | inCampaign:", inCampaign(), "| url:", window.location.href);
