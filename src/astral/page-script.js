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