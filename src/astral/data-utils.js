const tokenCache = {
    access: null,
    apiKey: null,
    refresh: null,
    expires: null
};

const _getTokenFromDb = () => new Promise((resolve, reject) => {
    const req = indexedDB.open("firebaseLocalStorageDb", 1);

    req.onsuccess = (event) => {
        const db = req.result;
        const trans = db.transaction("firebaseLocalStorage", IDBTransaction.READ)
        const objStore = trans.objectStore("firebaseLocalStorage");

        const cursorReq = objStore.openCursor();

        cursorReq.onsuccess = (event) => {
            while (!cursorReq.result.key.startsWith("firebase:authUser")) {
                cursorReq.result.continue();
            }
            if (cursorReq.result.value && cursorReq.result.value.value && cursorReq.result.value.value.stsTokenManager) {
                resolve(cursorReq.result.value.value.stsTokenManager);
            }
            reject(new Error("Unable to aquire authentication token from DB"));
        };

        cursorReq.onerror = () => reject(new Error("Unable to aquire authentication token from DB"));
    }

    req.onerror = () => reject(new Error("Unable to aquire authentication token from DB"));
});

const jwtDecode = (token) => JSON.parse(atob(token.split(".")[1]));

const getAccessToken = async () => {
    if (!tokenCache.expires) {
        const tokenData = await _getTokenFromDb();

        tokenCache.access = tokenData.accessToken;
        tokenCache.apiKey = tokenData.apiKey;
        tokenCache.expires = tokenData.expirationTime;
        tokenCache.refresh = tokenData.refreshToken;
    } else if (tokenCache.expires - 60 * 1000 < Date.now()) {
        const tokenData = await (await fetch('https://securetoken.googleapis.com/v1/token?key=' + tokenCache.apiKey, {
            method: 'POST',
            headers: {'content-type': 'application/x-www-form-urlencoded'},
            body: 'grant_type=refresh_token&refresh_token=' + tokenCache.refresh,
        })).json();
        
        tokenCache.access = tokenData.access_token;
        tokenCache.refresh = tokenData.refresh_token;
        const tokenInfo = jwtDecode(tokenCache.access);

        // Multipling by 1000 for miliseconds
        tokenData.expires = tokenInfo.exp * 1000; 
    }

    return tokenCache.access;
}

const getHeaders = async () => ({ 
    'x-authorization': `Bearer ${await getAccessToken()}`, 
    'content-type': 'application/json'
});

// Added check to fix beta issues
const getRoom = () => location.pathname.startsWith('/play/game') ? new URLSearchParams(location.search).get('id') : location.pathname.split('/')[2];

const getRoomData = async () => await (await fetch(
    `${location.origin}/api/game/${getRoom()}/`, 
    {
        method: "GET", 
        headers: await getHeaders()
    }
)).json();

let characterCache = [];
let _skipRefreshCache = false;

const refreshCharacters = async () => {
    characterCache = (await getRoomData()).characters || [];
    return characterCache;
};

const getCharacter = async (name) => {
    let characters = characterCache;
    let char = characters.find(c => c.displayName === name);
    if (char) return char.id;

    if (_skipRefreshCache) return null;

    characters = await refreshCharacters();
    char = characters.find(c => c.displayName === name);
    return char ? char.id : undefined;
}

const getCharacterData = async (id) => await (await fetch(
    `${location.origin}/api/game/${getRoom()}/character/${id}`, 
    {
        method: "GET", 
        headers: await getHeaders()
    }
)).json();

const updateCustomAttribute = async (characterData, attrbiuteName, value) => {
    if (!characterData.customAttributes)  characterData.customAttributes = [];
    let attr = characterData.customAttributes.find(attr => attr.name == attrbiuteName);
    if (!attr) {
        attr = {
            name: attrbiuteName,
            value: value.toString()
        }
        characterData.customAttributes.push(attr);
        return;
    }
    attr.value = value.toString();
}

const updateResourceBar = async (characterData, barName, value, maxValue, color = null, actualValue = null, actualMaxValue = null, display = true) => {
    let bar = characterData.resourceBars.find(attr => attr.label == barName);
    if (!bar) {
        bar = {
            label: barName,
            system: false,
            color: color ? Number.parseInt(color, 16) : Math.floor(Math.random()*16777215)
        }
        characterData.resourceBars.push(bar);
    }
    const extraData = {};
    if (actualValue != null) {
        extraData.leftValue = actualValue;
    }
    if (actualMaxValue != null) {
        extraData.rightValue = actualMaxValue;
    }
    if (color && !bar.color) {
        extraData.color = color;
    }
    Object.assign(bar, {
        leftEquation: value.toString(),
        rightEquation: maxValue.toString(),
        display,
        ...extraData
    })
}

const getReactData = () => __NEXT_DATA__;

const getUser = () => getReactData().props.pageProps.user;

const getDungeonMasters = () => getReactData().props.pageProps.data.game.gameMasters;

const isGM = () => getDungeonMasters().includes(getUser());