function createMetaTagForUserData() {
    if (__NEXT_DATA__ && __NEXT_DATA__.props) {
        const meta2 = document.createElement("meta");
        meta2.innerText = JSON.stringify(__NEXT_DATA__);
        meta2.id = "BEYOND20_NEXT_DATA"
        document.head.append(meta2);
    } else {
        setTimeout(() => {
            createMetaTagForUserData();
        }, 1000)
    }

    
}

createMetaTagForUserData();