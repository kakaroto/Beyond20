/*
 * Beyond20 → Realm VTT: backend transport.
 *
 * A tiny Feathers v5 client implemented directly on top of socket.io-client,
 * so we don't need the full Feathers UMD bundle. The wire format (from
 * @feathersjs/transport-commons) is:
 *
 *     socket.emit(method, path, ...args, ack)   // ack = (error, data)
 *
 *   find   -> emit("find",   path, query, ack)
 *   get    -> emit("get",    path, id, query, ack)
 *   create -> emit("create", path, data, query, ack)
 *   patch  -> emit("patch",  path, id, data, query, ack)
 *   custom -> emit(<method>, path, data, query, ack)   // e.g. "roll"
 *
 * We talk to server.realmvtt.com (NOT utilities.realmvtt.com): the backend's
 * "use utilities" guard explicitly exempts /socket.io/, and the live campaign
 * broadcast ("rolled" etc.) only happens on the main server. Because this runs
 * as a content script inside the play.realmvtt.com page, the socket handshake
 * carries Origin: https://play.realmvtt.com, which the server already allows.
 */
var RealmVTT = (typeof window !== "undefined" && window.RealmVTT) || {};
if (typeof window !== "undefined") window.RealmVTT = RealmVTT;

RealmVTT.transport = (function () {
    function backendUrlFor(hostname) {
        if (hostname === "play.realmvtt.com") return "https://server.realmvtt.com";
        // Self-hosted: best-effort (matches realm15-client getDynamicBackendUrl).
        return `${window.location.protocol}//${hostname}:29999`;
    }

    // Realm's auth JWT. Primary source is the (non-HttpOnly) realmvtt_user
    // cookie shared across *.realmvtt.com; localStorage is the legacy fallback.
    function readJwt() {
        const m = document.cookie.match(/(?:^|;\s*)realmvtt_user=([^;]+)/);
        if (m) {
            try {
                const payload = JSON.parse(decodeURIComponent(m[1]));
                if (payload && payload.accessToken) return payload.accessToken;
            } catch (e) {
                /* fall through to localStorage */
            }
        }
        try {
            return window.localStorage.getItem("feathers-jwt");
        } catch (e) {
            return null;
        }
    }

    // The Realm client mirrors its per-tab dice window id onto the DOM (see
    // handleRolls.js setWindowId). Stamping it on the roll lets the SPA's
    // onRoll treat our external roll as "from this window", so it renders the
    // dice AND runs the chat/ruleset result handler — exactly once.
    function realmWindowId() {
        try {
            const el = document.documentElement;
            return (
                (el && el.getAttribute("data-realmvtt-window-id")) ||
                (document.body &&
                    document.body.getAttribute("data-realmvtt-window-id")) ||
                null
            );
        } catch (e) {
            return null;
        }
    }

    function inviteCodeFromUrl() {
        // BrowserRouter route is /campaign/:inviteCode. Match against the full
        // href so we also cope with query strings / hash variants.
        const m = window.location.href.match(/\/campaign\/([^/?#]+)/);
        return m ? decodeURIComponent(m[1]) : null;
    }

    function noCampaignError() {
        return new Error(
            "Beyond20→Realm: open a campaign first — current URL is " +
                window.location.href
        );
    }

    let socket = null;
    let readyPromise = null;
    let _user = null; // the authenticated Realm user (for dice color/text color)

    function ackEmit() {
        const args = Array.prototype.slice.call(arguments);
        return new Promise((resolve, reject) => {
            args.push((error, data) => (error ? reject(error) : resolve(data)));
            socket.emit.apply(socket, args);
        });
    }

    function connect() {
        if (readyPromise) return readyPromise;
        readyPromise = new Promise((resolve, reject) => {
            if (typeof io === "undefined") {
                reject(new Error("Beyond20→Realm: socket.io client not loaded"));
                return;
            }
            socket = io(backendUrlFor(window.location.hostname), {
                transports: ["websocket"],
                forceNew: true
            });
            socket.on("connect_error", (err) => reject(err));
            socket.on("connect", async () => {
                try {
                    const token = readJwt();
                    if (!token)
                        throw new Error(
                            "Beyond20→Realm: sign in to Realm VTT first (no auth token found)"
                        );
                    const authed = await ackEmit(
                        "create",
                        "authentication",
                        { strategy: "jwt", accessToken: token },
                        {}
                    );
                    _user = (authed && authed.user) || null;
                    resolve(socket);
                } catch (e) {
                    reject(e);
                }
            });
        });
        // Let a later message retry if this attempt failed.
        readyPromise.catch(() => {
            readyPromise = null;
        });
        return readyPromise;
    }

    function firstResult(res) {
        const arr = Array.isArray(res) ? res : (res && res.data) || [];
        return arr[0] || null;
    }

    // ---- Generic Feathers v5 service calls ----
    async function find(path, query) {
        await connect();
        return ackEmit("find", path, query || {});
    }
    async function get(path, id) {
        await connect();
        return ackEmit("get", path, id, {});
    }
    async function create(path, data) {
        await connect();
        return ackEmit("create", path, data, {});
    }
    async function patch(path, id, data) {
        await connect();
        return ackEmit("patch", path, id, data, {});
    }
    async function customMethod(method, path, data) {
        await connect();
        return ackEmit(method, path, data, {});
    }

    // ---- Realm-specific helpers ----
    let _campaign = null;
    async function campaign() {
        if (_campaign) return _campaign;
        const inviteCode = inviteCodeFromUrl();
        if (!inviteCode) throw noCampaignError();
        _campaign = firstResult(await find("campaigns", { inviteCode }));
        if (!_campaign)
            throw new Error(
                "Beyond20→Realm: no campaign found for invite code " + inviteCode
            );
        return _campaign;
    }

    // The roller's dice colors, so a roll with no skin renders in the user's
    // chosen colors instead of the default white/black. Matches realm15-client's
    // fallback chain (user.diceColor -> user.color, text -> "#000000").
    function userDiceColors() {
        const u = _user || {};
        const s = u.settings || {};
        return {
            diceColor: u.diceColor || s.diceColor || u.color || undefined,
            textColor: u.diceTextColor || s.diceTextColor || undefined
        };
    }

    async function sendRoll(roll, providedResults) {
        await connect(); // ensure we have the authenticated user (colors)
        const inviteCode = inviteCodeFromUrl();
        if (!inviteCode) throw noCampaignError();
        const windowId = realmWindowId();
        const colors = userDiceColors();
        // Defaults first, then the roll's own values win, then windowId.
        const fullRoll = Object.assign(
            {},
            colors.diceColor ? { diceColor: colors.diceColor } : {},
            colors.textColor ? { textColor: colors.textColor } : {},
            roll,
            windowId ? { windowId } : {}
        );
        return customMethod("roll", "campaign-channel", {
            roll: fullRoll,
            inviteCode,
            providedResults: providedResults || []
        });
    }

    async function sendMessage(data) {
        const camp = await campaign();
        return create("messages", Object.assign({ campaignId: camp._id }, data));
    }

    async function findCharacterByName(name) {
        const camp = await campaign();
        return firstResult(
            await find("characters", { campaignId: camp._id, name })
        );
    }

    async function findTokenForRecord(recordId) {
        const camp = await campaign();
        return firstResult(
            await find("tokens", { campaignId: camp._id, recordId })
        );
    }

    async function findEffectByName(name) {
        const camp = await campaign();
        return firstResult(await find("effects", { campaignId: camp._id, name }));
    }

    async function patchToken(tokenId, set) {
        return patch("tokens", tokenId, { $set: set });
    }

    async function getOrCreateCombatTracker() {
        const camp = await campaign();
        let tracker = firstResult(
            await find("combat-tracker", { campaignId: camp._id })
        );
        if (!tracker)
            tracker = await create("combat-tracker", {
                campaignId: camp._id,
                tokenIds: [],
                round: 0,
                initiative: 0,
                slot: {}
            });
        return tracker;
    }

    async function addToCombat(tokenId, initiative) {
        const tracker = await getOrCreateCombatTracker();
        const tokenIds = (tracker.tokenIds || []).slice();
        if (!tokenIds.includes(tokenId)) tokenIds.push(tokenId);
        const slot = Object.assign({}, tracker.slot || {});
        if (initiative !== undefined && initiative !== null && `${initiative}` !== "")
            slot[String(initiative)] = tokenId;
        return patch("combat-tracker", tracker._id, { $set: { tokenIds, slot } });
    }

    return {
        connect,
        readJwt,
        inviteCodeFromUrl,
        find,
        get,
        create,
        patch,
        customMethod,
        campaign,
        sendRoll,
        sendMessage,
        findCharacterByName,
        findTokenForRecord,
        findEffectByName,
        patchToken,
        getOrCreateCombatTracker,
        addToCombat
    };
})();
