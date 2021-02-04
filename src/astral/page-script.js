let chatIframe;

$.fn.watch = function(property, callback) {
    return $(this).each(function() {
        var self = this;
        var old_property_val = this[property];
        var timer;
 
        function watch() {
           if($(self).data(property + '-watch-abort') == true) {
              timer = clearInterval(timer);
              $(self).data(property + '-watch-abort', null);
              return;
           }
 
           if(self[property] != old_property_val) {
              old_property_val = self[property];
              callback.call(self);
           }
        }
        timer = setInterval(watch, 700);
    });
 };
 
 $.fn.unwatch = function(property) {
    return $(this).each(function() {
        $(this).data(property + '-watch-abort', true);
    });
 };

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
            } catch { reject(new Error("Unable to set `speak as` character.")); } 
        })
    });
}

function convertRollToText(roll, standout=false) {
    if (typeof (roll) === "string")
        return roll;
    const total = String(roll.total || 0);
    const prefix = (standout && !roll.discarded) ? '`' : '';
    const suffix = (standout && !roll.discarded) ? '`' : '';
    let critfail = `1d[${total}]cr=${roll['critical-success'] ? '1' : '0'}fr=${roll['critical-failure'] ? '1' : '0'}`;
    let result = `${prefix}!(${critfail})${suffix}`;
    return result;
};

function stripRequestForAttackRoll(request) {
    request.character = {
        name: request.character.name,
        type: request.character.type,
        settings: request.character.settings
    };
    request.description = "";
    request.properties = undefined;
    request['item-type'] = undefined;
    request.range = undefined;
    request.preview = undefined;
}


async function handleRenderedRoll(request) {
    const originalRequest = request.request;
    let rolls = [];
    if (!originalRequest.rollDamage && request.source)
        rolls.push(["Source", request.source]);
    if (!originalRequest.rollDamage && Object.keys(request.attributes).length) {
        rolls.push(...Object.entries(request.attributes));
    }
    if (!originalRequest.rollDamage && request.roll_info){
        // the split is needed to remove some dupicate entries some which are 'Components' and 'Components: '
        rolls.push(...request.roll_info.filter(([name, info]) => !request.attributes[name.split(": ")[0]]));
    }

    let title = request.title;
    if (request.attack_rolls.length > 0) {
        rolls.push([request.title, request.attack_rolls.map(roll => convertRollToText(roll, true)).join(" ")]);
    }
    
    rolls.push(...request.damage_rolls.map(([roll_name, roll]) => [roll_name, convertRollToText(roll)]))

    if (Object.keys(request.total_damages).length > 0)
        rolls.push(["Totals", ""]);

    rolls.push(...Object.entries(request.total_damages).map(([key, roll]) => ["Total " + key, convertRollToText(roll)]));

    let rollDamages = null;
    if (originalRequest.rollAttack && !originalRequest.rollDamage) {
        originalRequest.rollAttack = false;
        originalRequest.rollDamage = true;
        originalRequest.rollCritical = request.attack_rolls.some(r => !r.discarded && r["critical-success"]);
        // Stripping out unrelated data for the roll
        stripRequestForAttackRoll(originalRequest);
        // Compressing and stripping the request to reduce the encoded version as much as possible to not exceed 2048 chars
        rollDamages = `b20-rr-${LZString.compressToEncodedURIComponent(JSON.stringify(originalRequest))}`;
        rolls.push(["Roll Damage", `[\`Click\`](#${rollDamages})`]);
    }
    if (originalRequest.type === "initiative" && settings["initiative-tracker"]) {
        const initiative = request.attack_rolls.find((roll) => !roll.discarded);
        if (initiative)
            rolls = [["Initiative", `i!(d0cr=1fr=1 + ${initiative.total})`]]
    }
    let message = template(rolls);

    
    if (!originalRequest.rollDamage && request.open && request.description) {
        message = `${message}


${parseDescription(request, request.description)}`
    }

    await postChatMessage({characterName: request.character, message, ...getDecoration(request.request.type), title, whisper: request.whisper == WhisperType.YES });
}

async function postChatMessage({characterName, message, color, icon, title, whisper}) {
    try {
        const user = getUser().uid;
        const room = getRoom();
        const token = await getAccessToken();
        const character = await getCharacter(characterName);

        const recipients = whisper ? Object.fromEntries(getDungeonMasters().map(key => [key, true])) : undefined;
        if (message.length > 2048) {
            console.warn(`Trimming message due to length exceeding 2048 characters. Initial message length is: ${message.length}.`)
            message = message.slice(0, 2045) + '...';
        }
        
        return await fetch(location.origin + `/api/game/${room}/chat`, {
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
        console.warn("Failed to send chat message for the following reason: ", e);
        console.warn("Reverting to sending chat message using the chat input.")

        try {
            message = `**${title}**\n\n` + message;

            if (message.length > 2048) {
                message = message.slice(0, 2045) + '...';
            }

            try { await speakAs(characterName); } catch (e) {}

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
            console.warn(`Couldn't update the character hp due to the following reason: No character found with name ${characterName}`)
            return
        }
        const characterData = await getCharacterData(character);
        updateCustomAttribute(characterData, "HP_Max", maxHp);
        updateCustomAttribute(characterData, "HP_Current", hp);
        updateCustomAttribute(characterData, "HP_Temp", tempHp);
        // 48bb78 and 48b3bb represent the hex codes for the colors for the bars
        updateResourceBar(characterData, "hp", "HP_Current", "HP_Max", "48bb78", hp, maxHp, true);
        updateResourceBar(characterData, "temphp", "HP_Temp", "HP_Temp", "48b3bb", tempHp, tempHp, tempHp != 0);

        return fetch(location.origin + `/api/game/${room}/character/${character}`, {
            method: "PATCH",
            headers: {
                'x-authorization': `Bearer ${token}`, 'content-type': 'application/json'
            },
            body: JSON.stringify({
                character: {
                    updateAt: Date.now(),
                    customAttributes: characterData.customAttributes,
                    resourceBars: characterData.resourceBars
                }
            }),
           
        });
    } catch (e) {
        console.error(`Couldn't update the character hp due to the following reason: `, e);
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
    try {
        const room = getRoom();
        const token = await getAccessToken();
        return fetch(location.origin + `/api/game/${room}/combat`, {
            method: "POST",
            headers: {
                'x-authorization': `Bearer ${token}`, 'content-type': 'application/json'
            }
        });
    } catch (e) {
        console.error("Couldn't start combat due to the following reason: ", e);
    }
}

async function addCharacterToCombat({name, initiative}, weight) {
    try {
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
    } catch (e) {
        console.error("Couldn't add character to combat due to the following reason: ", e);
    }
}

async function nextTurn() {
    try {
        return fetch(location.origin + `/api/game/${getRoom()}/combat/turn`, {
            method: "DELETE",
            headers: {
                'x-authorization': `Bearer ${await getAccessToken()}`, 'content-type': 'application/json'
            }
        })
    } catch (e) {
        console.error("Couldn't switch to next turn due to the following reason: ", e);
    }
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


function addRollHook() {
    chatIframe.on('click', `a[href*='#b20-rr-']`, (ev) => {
        ev.preventDefault();
        roll_renderer.handleRollRequest(JSON.parse(LZString.decompressFromEncodedURIComponent(ev.currentTarget.hash.split('#b20-rr-')[1])));
    })
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
        addRollHook();
        $("div[data-id=chat] iframe").watch('contentDocument', function() {
            console.log(this);
            chatIframe = $(this).contents();
            addRollHook();
        })
       
        
    } else {
        setTimeout(trySetDOMListeners, 1000);
    }
}

trySetDOMListeners();