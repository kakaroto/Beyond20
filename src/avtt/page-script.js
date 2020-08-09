function createMetaTagForUserData() {
    const meta = document.createElement("meta");
    meta.innerText = window.__ASTRAL_USER;
    meta.id = "BEYOND20_ASTRAL_USER"
    document.head.append(meta);
}


createMetaTagForUserData();