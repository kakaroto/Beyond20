function replaceRollsCallback(match, replaceCB) {
    let dice = match[2];
    let modifiers = match[3];
    if (dice === undefined) {
        dice = "";
        modifiers = match[4];
    }

    let result = match[1];
    result += replaceCB(dice, modifiers);
    result += match[5];
    return result;
}

function replaceRolls(text, replaceCB) {
    // TODO: Cache the value so we don't recompile the regexp every time
    const dice_regexp = new RegExp(/(^|[^\w])(?:(?:(?:(\d*d\d+(?:ro(?:=|<|<=|>|>=)[0-9]+)?(?:min[0-9]+)?)((?:\s*[-+]\s*\d+)*))|((?:[-+]\s*\d+)+)))($|[^\w])/, "gm");
    return text.replace(dice_regexp, (...match) => replaceRollsCallback(match, replaceCB));
}

// Used to clean various dice.includes(imperfections) roll strings;
function cleanRoll(rollText) {
    //clean adjacent '+'s (Roll20 treats it as a d20);
    //eg: (1d10 + + 2 + 3) -> (1d10 + 2 + 3);
    rollText = (rollText || "").toString();
    rollText = rollText.replace(/\+ \+/g, '+').replace(/\+ \-/g, '-');
    return rollText;
}

// Taken from https://stackoverflow.com/questions/45985198/the-best-practice-to-detect-whether-a-browser-extension-is-running-on-chrome-or;
function getBrowser() {
    if (typeof (chrome) !== "undefined") {
        if (typeof (browser) !== "undefined") {
            return "Firefox";
        } else {
            return "Chrome";
        }
    } else {
        return "Edge";

    }
}

function isExtensionDisconnected() {
    try {
        chrome.extension.getURL("");
        return false;
    } catch (err) {
        return true;
    }
}

// Taken from https://stackoverflow.com/questions/9515704/insert-code-into-the-page-context-using-a-content-script;
function injectPageScript(url) {
    const s = document.createElement('script');
    s.src = url;
    s.charset = "UTF-8";
    // s.onload = () => s.remove();
    (document.head || document.documentElement).appendChild(s);
}

function injectCSS(css) {
    const s = document.createElement('style');
    s.textContent = css;
    (document.head || document.documentElement).appendChild(s);
}

function sendCustomEvent(name, data=[]) {
    if (getBrowser() === "Firefox")
        data = cloneInto(data, window);
    const event = new CustomEvent("Beyond20_" + name, { "detail": data });
    document.dispatchEvent(event);
}

function addCustomEventListener(name, callback) {
    const event = ["Beyond20_" + name, (evt) => {
        const detail = evt.detail || [];
        callback(...detail)
    }, false];
    document.addEventListener(...event);
    return event;
}

function roll20Title(title) {
    return title.replace(" | Roll20", "");
}

function isFVTT(title) {
    return title.includes("Foundry Virtual Tabletop");
}

function isAstral(title) {
    return title.includes("Astral TableTop");
}

function fvttTitle(title) {
    return title.replace(" • Foundry Virtual Tabletop", "");
}

function astralTitle(title) {
    return title.replace(" | Astral TableTop", "");
}

function urlMatches(url, matching) {
    return url.match(matching.replace(/\*/g, "[^]*")) !== null;
}

function alertSettings(url, title) {
    if (alertify.Beyond20Settings === undefined)
        alertify.dialog('Beyond20Settings', function () { return {}; }, false, "alert");

    const popup = chrome.extension.getURL(url);
    const img = E.img({src: chrome.extension.getURL("images/icons/icon32.png"), style: "margin-right: 3px;"})
    const iframe = E.iframe({src: popup, style: "width: 100%; height: 100%;", frameborder: "0", scrolling: "yes"});
    const dialog = alertify.Beyond20Settings(img.outerHTML + title, iframe);
    dialog.set('padding', false).set('resizable', true).set('overflow', false).resizeTo("80%", "80%");

}
function alertQuickSettings() {
    alertSettings("popup.html", "Beyond 20 Quick Settings");
}
function alertFullSettings() {
    alertSettings("options.html", "Beyond 20 Settings");

}
function isListEqual(list1, list2) {
    const list1_str = list1.join(",");
    const list2_str = list2.join(",");
    return list1_str == list2_str;

}
function isObjectEqual(obj1, obj2) {
    const obj1_str = Object.entries(obj1).join(",");
    const obj2_str = Object.entries(obj2).join(",");
    return obj1_str == obj2_str;
}

// replaces matchAll, requires a non global regexp
function reMatchAll(regexp, string) {
    const matches = string.match(new RegExp(regexp, "gm"));
    if ( matches) {
        let start = 0;
        return matches.map(group0 => {
            const match = group0.match(regexp);
            match.index = string.indexOf(group0, start);
            start = match.index;
            return match;
        });
    }
    return matches;
}

E = new Proxy({}, {
    get: function (obj, name) {
        return new Proxy(function () {}, {
            apply: (target, thisArg, argumentsList) => {
                const attributes = argumentsList[0] || {};
                const children = argumentsList.slice(1);
                const e = document.createElement(name);
                for (const [name, value] of Object.entries(attributes))
                    e.setAttribute(name, value);
                for (const child of children)
                    e.append(child);
                return e;
            }
        });
    }
});
const tokenCache = {
    access: null,
    apiKey: null,
    refresh: null,
    expires: null
};

const _getTokenFromDb = () => new Promise((resolve, reject) => {
    const req = indexedDB.open("firebaseLocalStorageDb", 1);
    console.log("Created db req", req)
    req.onsuccess = (event) => {
        const db = req.result;
        const trans = db.transaction("firebaseLocalStorage", IDBTransaction.READ)
        const objStore = trans.objectStore("firebaseLocalStorage");

        const cursorReq = objStore.openCursor();

        cursorReq.onsuccess = (event) => {
            console.log("Create cursor req", cursorReq.result)
            resolve(cursorReq.result.value.value.stsTokenManager);
        };
    }

    req.onerror = reject;
});

const getAccessToken = async () => {
    if (!tokenCache.expires) {
        const tokenData = await _getTokenFromDb();

        tokenCache.access = tokenData.accessToken;
        tokenCache.apiKey = tokenData.apiKey;
        tokenCache.expires = tokenData.expirationTime;
        tokenCache.refresh = tokenData.refreshToken;
    } else if (tokenCache.expires < Date.now()) {
        const tokenData = await (await fetch('https://securetoken.googleapis.com/v1/token?key=' + tokenCache.apiKey, {
            method: 'POST',
            headers: {'content-type': 'application/x-www-form-urlencoded'},
            body: 'grant_type=refresh_token&refresh_token=' + tokenCache.refresh,
        })).json();
        
        tokenCache.access = tokenData.access_token;
        tokenCache.refresh = tokenData.refresh_token;
        const tokenInfo = jwt_decode(tokenCache.access);

        // Multipling by 1000 for miliseconds
        tokenData.expires = tokenInfo.exp * 1000; 
    }

    return tokenCache.access;
}

const getHeaders = async () => ({ 
    'x-authorization': `Bearer ${await getAccessToken()}`, 
    'content-type': 'application/json'
});

const getRoom = () => location.pathname.split('/')[2];

const getRoomData = async () => await (await fetch(
    `${location.origin}/api/game/${getRoom()}/`, 
    {
        method: "GET", 
        headers: await getHeaders()
    }
)).json();

const characterCache = [];

const getCharacters = async () => (await getRoomData()).characters;

const getCharacter = async (name) => {
    let characters = characterCache;
    let char = characters.find(c => c.displayName === name);
    if (char) return char.id;
    characters = await getCharacters();
    char = characters.find(c => c.displayName === name);
    return char ? char.id : undefined;
}

const getReactData = () => __NEXT_DATA__;

const getUser = () => getReactData().props.pageProps.user;

const getDungeonMasters = () => getReactData().props.pageProps.data.game.gameMasters;


function setReactElementValue(element, value) {
    const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
  
    if (valueSetter && valueSetter !== prototypeValueSetter) {
      prototypeValueSetter.call(element, value);
    } else {
      valueSetter.call(element, value);
    }
    element.dispatchEvent(new Event('input', { bubbles: true }));
}

function sendChatText(value) {
  const chatIframe = document.querySelector("div[data-id=chat] iframe");
  const textarea = chatIframe.contentDocument.querySelector("textarea")
  const button = textarea.closest("form").querySelector("button[type=submit]");
  setReactElementValue(textarea, value)
  button.click();
}

async function speakAs(characterName) {
    return new Promise((resolve, reject) => {
        const chatIframe = document.querySelector("div[data-id=chat] iframe");
        const charListButton = chatIframe.contentDocument.querySelector("form .big-image-character");
        charListButton.click();

        requestAnimationFrame(() => {
            const charItems = Array.from(chatIframe.contentDocument.querySelectorAll("form [role='menuitem']"));
            const charItem = charItems.find(item => item.firstChild.firstChild.innerText == characterName);
            if (charItem) {
                charItem.click();
            } else {
                charListButton.click();
            }
            resolve();
        })
    });
}
  

async function postChatMessage(characterName, message, color, icon, title, whisper) {
    try {
        const user = getUser().uid;
        const room = getRoom();
        const token = await getAccessToken();
        const character = await getCharacter(characterName);

        const recipients = whisper ? Object.fromEntries(getDungeonMasters().map(key => [key, true])) : undefined;
        if (message.length > 2048) {
            message = message.slice(0, 2045) + '...';
        }
        
        return fetch(location.origin + `/api/game/${room}/chat`, {
            method: "PUT",
            body: JSON.stringify({
                text: message,
                color, 
                icon, 
                user, 
                character, 
                title: character || !characterName ? title : `${title} (${characterName})`,
                hidden: whisper,
                recipients
            }),
            headers: {
                'x-authorization': `Bearer ${token}`, 'content-type': 'application/json'
            }
        });
    } catch {
        message = `**${title}**\n\n` + message;

        if (message.length > 2048) {
            message = message.slice(0, 2045) + '...';
        }
        
        await speakAs(characterName);
        sendChatText(message);
    }
}

async function updateHpBar(characterName, hp, maxHp, tempHp) {
    const room = getRoom();
    const token = await getAccessToken();
    const character = await getCharacter(characterName);
    if (!character) {
        console.error(`No character found with name ${characterName}`)
        return
    }
    return fetch(location.origin + `/api/game/${room}/character/${character}`, {
        method: "PATCH",
        body: JSON.stringify({
            character: {
                updateAt: Date.now(),
                attributeBarMax: maxHp + tempHp,
                attributeBarCurrent: hp + tempHp,

            }
        }),
        headers: {
            'x-authorization': `Bearer ${token}`, 'content-type': 'application/json'
        }
    });
}

function disconnectAllEvents() {
    for (let event of registered_events)
        document.removeEventListener(...event);
}

var registered_events = [];
registered_events.push(addCustomEventListener("AstralUpdateHPBar", updateHpBar));
registered_events.push(addCustomEventListener("AstralChatMessage", postChatMessage));
registered_events.push(addCustomEventListener("disconnect", disconnectAllEvents));