const getCharacter = () => Object.keys(localStorage).filter(key => key.startsWith("game_characters"))[0].split('/')[2];

const getRoom = () => getUser().lastPlayedGame.id || Object.keys(localStorage).filter(key => key.startsWith("game_characters"))[0].split('/')[1];

const getUser = () => JSON.parse(document.querySelector("#BEYOND20_ASTRAL_USER").innerText).user;

const getAccessToken = () => new Promise((resolve, reject) => {
    const req = indexedDB.open("firebaseLocalStorageDb", 1);
    console.log("Created db req", req)
    req.onsuccess = (event) => {
        const db = req.result;
        const trans = db.transaction("firebaseLocalStorage", IDBTransaction.READ)
        const objStore = trans.objectStore("firebaseLocalStorage");

        const cursorReq = objStore.openCursor();

        cursorReq.onsuccess = (event) => {
            console.log("Create cursor req", cursorReq.result)
            resolve(cursorReq.result.value.value.stsTokenManager.accessToken);
        };
    }

    req.onerror = reject;
});