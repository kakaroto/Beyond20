let chatIframe;

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
  const textarea = chatIframe.find("textarea")
  const button = textarea.closest("form").find("button[type=submit]");
  setReactElementValue(textarea[0], value)
  button.click();
}

async function speakAs(characterName) {
    return new Promise((resolve, reject) => {
        const charListButton = chatIframe.find("form .big-image-character");
        charListButton.click();

        requestAnimationFrame(() => {
            try {
                const charItems = Array.from(chatIframe.find("form [role='menuitem']"));
                const charItem = charItems.find(item => item.firstChild.firstChild.innerText == characterName);
                if (charItem) {
                    charItem.click();
                } else {
                    charListButton.click();
                }
                resolve(); 
            } catch { reject(); } 
        })
    });
}

async function hookRollDamages(rollDamages, request) {
    const originalRequest = request.request;
    let a = null;
    let timeout = 50;

    // couldn't use a similar approach to roll20 due to React recreating the `a` elements, as such resorted to jQuery
    chatIframe.on('click', `a[href='#${rollDamages}']`, (ev) => {
        ev.preventDefault();
        originalRequest.rollAttack = false;
        originalRequest.rollDamage = true;
        originalRequest.rollCritical = request.attack_rolls.some(r => !r.discarded && r["critical-success"])
        roll_renderer.handleRollRequest(originalRequest);
    })
}


function convertRollToText(roll, standout=false) {
    if (typeof (roll) === "string")
        return roll;
    const total = String(roll.total || 0);
    const prefix = (standout && !roll.discarded) ? '`' : '';
    const suffix = (standout && !roll.discarded) ? '`' : '';
    let critfail = `1d0cr=${roll['critical-success'] ? '0' : '1'}fr=${roll['critical-failure'] ? '0' : '1'}`;
    let result = `${prefix}!(${critfail}${formatPlusMod(total)})${suffix}`;
    return result;
};


async function handleRenderedRoll(request) {
    const rolls = [];
    if (request.source)
        rolls.push(["Source", request.source]);
    if (Object.keys(request.attributes).length) {
        rolls.push(...Object.entries(request.attributes));
    }
    if (request.open)
        rolls.push(["Description", parseDescription(request.description)]);

    rolls.push(...request.roll_info);

    let title = request.title;
    if (request.attack_rolls.length > 0) {
        rolls.push([request.title, request.attack_rolls.map(roll => convertRollToText(roll, true)).join(" ")]);
    }
    
    rolls.push(...request.damage_rolls.map(([roll_name, roll]) => [roll_name, convertRollToText(roll)]))

    if (Object.keys(request.total_damages).length > 0)
        rolls.push(["Totals", ""]);

    rolls.push(...Object.entries(request.total_damages).map(([key, roll]) => ["Total " + key, convertRollToText(roll)]));

    let rollDamages = null;
    const originalRequest = request.request;
    if (originalRequest.rollAttack && !originalRequest.rollDamage) {
        rollDamages = `beyond20-rendered-roll-button-${Math.random()}`;
        rolls.push(["Roll Damages", `[\`Click\`](#${rollDamages})`]);
    }
    if (originalRequest.type === "initiative" && settings["initiative-tracker"]) {
        const initiative = request.attack_rolls.find((roll) => !roll.discarded);
        if (initiative)
           rolls.push(["Initiative", `i!(d0cr=1fr=1 + ${initiative.total})`]);
    }
    let message = template(rolls);
    await postChatMessage({characterName: request.character, message, ...getDecoration(request.request.type), title, whisper: request.whisper == WhisperType.YES });
    if (rollDamages) {
        await hookRollDamages(rollDamages, request);
    }
}

async function postChatMessage({characterName, message, color, icon, title, whisper}) {
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
    } catch (e) {
        console.error(e);
        try {
            message = `**${title}**\n\n` + message;

            if (message.length > 2048) {
                message = message.slice(0, 2045) + '...';
            }
            
            await speakAs(characterName);
            sendChatText(message);
        } catch (e) {
            console.error(e);
        }
    }
}

async function updateHpBar({characterName, hp, maxHp, tempHp}) {
    try {
        const room = getRoom();
        const token = await getAccessToken();
        const character = await getCharacter(characterName);
        if (!character) {
            console.warn(`No character found with name ${characterName}`)
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
    } catch (e) {
        console.error(e);
    }
}

async function openCombatTab() {
    return new Promise((resolve, reject) => {
        const combatTabButton = $('li[data-tab="combat"] > a > span');
        if (!combatTabButton.hasClass("is-active")) combatTabButton.click();
        resolve();
    })
}

async function getCombatTab() {
    return new Promise((resolve, reject) => {
        const findIframe = () => {
            if ($("div[data-id=combat] iframe").length > 0) {
                resolve($("div[data-id=combat] iframe").contents());
            } else {
                requestAnimationFrame(findIframe);
            }
        }
        findIframe();
    })
}

async function resetCombat() {
    return new Promise((resolve, reject) => {
        const findResetButton = async () => {
            const combatTab = await getCombatTab();
            const resetCombatButton = combatTab.find('button[data-id="reset-combat"]');

            if (resetCombatButton.length > 0) {
                resetCombatButton.click();
                requestAnimationFrame(() => {
                    resetCombatButton.click();
                    const isCombatActorsEmpty = () => {
                        const children = combatTab.find('.combat-actors').children();
                        if (children.length == 1 && children.hasClass('empty')) {
                            resolve()
                        } else {
                            requestAnimationFrame(isCombatActorsEmpty);
                        }
                    }
                    requestAnimationFrame(isCombatActorsEmpty);
                });
            } else {
                requestAnimationFrame(findResetButton);
            }
        }
        findResetButton();        
    });
}

async function startCombat() {
    const room = getRoom();
    const token = await getAccessToken();
    return fetch(location.origin + `/api/game/${room}/combat`, {
        method: "POST",
        headers: {
            'x-authorization': `Bearer ${token}`, 'content-type': 'application/json'
        }
    });
}

async function addCharacterToCombat({name, initiative}, weight) {
    let character = await getCharacter(name);
    if (!character) {
        character = `custom-${Math.random().toString(36).substr(2, 6)}`
    }

    return fetch(location.origin + `/api/game/${getRoom()}/combat/actor/${character}`, {
        method: "PUT",
        body: JSON.stringify({
            displayName: name, 
            id: character,
            visible: true, 
            initiative,
            weight
        }),
        headers: {
            'x-authorization': `Bearer ${await getAccessToken()}`, 'content-type': 'application/json'
        }
    })
}

async function nextTurn() {
    return fetch(location.origin + `/api/game/${getRoom()}/combat/turn`, {
        method: "DELETE",
        headers: {
            'x-authorization': `Bearer ${await getAccessToken()}`, 'content-type': 'application/json'
        }
    })
}

async function updateCombat(request) {
    await openCombatTab();
    await resetCombat();
    await startCombat();
    await refreshCharacters();
    _skipRefreshCache = true;
    await Promise.all(request.combat.map((actor, i) => addCharacterToCombat(actor, request.combat.length - i)));
    _skipRefreshCache = false;
    await nextTurn();
    for (let actor of request.combat) {
        if (actor.turn) break;
        await nextTurn();
    }

}

function disconnectAllEvents() {
    for (let event of registered_events)
        document.removeEventListener(...event);
}

var registered_events = [];
registered_events.push(addCustomEventListener("AstralUpdateHPBar", updateHpBar));
registered_events.push(addCustomEventListener("AstralChatMessage", postChatMessage));
registered_events.push(addCustomEventListener("AstralRenderedRoll", handleRenderedRoll));
registered_events.push(addCustomEventListener("AstralUpdateSettings", updateSettings));
registered_events.push(addCustomEventListener("AstralUpdateCombat", updateCombat));
registered_events.push(addCustomEventListener("disconnect", disconnectAllEvents));

function trySetDOMListeners() {
    if (window.$ && $("div[data-id=chat] iframe").length > 0) {
        chatIframe = $("div[data-id=chat] iframe").contents();
        
        // Added this since previews links will not work and they open a new tab
        chatIframe.on('click', `a[href*='#beyond20-rendered-roll-button-']`, (ev) => {
            ev.preventDefault();
        })
    } else {
        setTimeout(trySetDOMListeners, 1000);
    }
}

trySetDOMListeners();