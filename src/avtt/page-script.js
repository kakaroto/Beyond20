function createMetaTagForUserData() {
    const meta = document.createElement("meta");
    meta.innerText = window.__ASTRAL_USER;
    meta.id = "BEYOND20_ASTRAL_USER"
    document.head.append(meta);

    
    const meta2 = document.createElement("meta");
    meta2.innerText = JSON.stringify(__NEXT_DATA__);
    meta2.id = "BEYOND20_NEXT_DATA"
    document.head.append(meta2);
}

createMetaTagForUserData();