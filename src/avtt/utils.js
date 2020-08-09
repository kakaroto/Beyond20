const getCharacter = () => getReactData().props.pageProps.data.selectedActor;

const getRoom = () => location.pathname.split('/')[2];

const getUser = () => JSON.parse(document.querySelector("#BEYOND20_ASTRAL_USER").innerText);

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

const getReactData = () => JSON.parse(document.querySelector("#BEYOND20_NEXT_DATA").innerText);

const getDungeonMasters = () => getReactData().props.pageProps.data.game.gameMasters;