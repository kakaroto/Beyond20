console.log("Beyond20: D&D Beyond Encounter module loaded.");

var settings = getDefaultSettings();
var last_monster_name = null;
var last_combat = null;
var character = null;

function documentModified(mutations, observer) {
    if (isExtensionDisconnected()) {
        console.log("This extension is DOWN!");
        observer.disconnect();
        return;
    }

    injectCustomRollButton();

    const monster = $(".encounter-details-monster-summary-info-panel,.encounter-details__content-section--monster-stat-block,.combat-tracker-page__content-section--monster-stat-block,.monster-details-modal__body");
    const monster_name = monster.find(".mon-stat-block__name").text();
    if (settings["sync-combat-tracker"]) {
        updateCombatTracker();
    }
    console.log("Doc modified, new mon : ", monster_name, " !=? ", last_monster_name);
    if (monster_name !== last_monster_name) {
        last_monster_name = monster_name;
        removeRollButtons();
        character = new Monster("Monster", null, settings);
        character.parseStatBlock(monster);
    }
    const customRoll = DigitalDiceManager.updateNotifications();
    if (customRoll && settings['use-digital-dice']) {
        dndbeyondDiceRoller.sendCustomDigitalDice(character, customRoll);
    }
}

function updateCombatTracker() {
    if (!$(".turn-controls__next-turn-button").length) return;
    const combat = Array.from($(".combatant-card.in-combat")).map(combatant => {
        const $combatant = $(combatant);
        const initiative = $combatant.find(".combatant-card__initiative-value").text() || $combatant.find(".combatant-card__initiative-input").val()
        const tags = Array.from(combatant.classList)
            .filter(c => c.startsWith("combatant-card--"))
            .map(c => c.slice("combatant-card--".length))
        return {
            name: $combatant.find(".combatant-summary__name").text(),
            initiative: initiative,
            turn: $combatant.hasClass("is-turn"),
            tags
        };
    });
    const json = JSON.stringify(combat);
    if (last_combat === json) return;
    last_combat = json;

    const req = {
        action: "update-combat",
        combat,
    };
    console.log("Sending combat update", combat);
    chrome.runtime.sendMessage(req, resp => beyond20SendMessageFailure(character, resp));
    sendRollRequestToDOM(req);
}


function updateSettings(new_settings = null) {
    if (new_settings) {
        settings = new_settings;
        if (character !== null)
            character.setGlobalSettings(settings);
        key_bindings = getKeyBindings(settings);
        sendCustomEvent("NewSettings", [settings, chrome.runtime.getURL("")]);
    } else {
        getStoredSettings((saved_settings) => {
            sendCustomEvent("Loaded", [saved_settings]);
            updateSettings(saved_settings);
            documentModified();
        });
    }
}

function handleMessage(request, sender, sendResponse) {
    console.log("Received message:", request);
    if (request.action == "settings") {
        if (request.type == "general")
            updateSettings(request.settings);
    } else if (request.action == "open-options") {
        alertFullSettings();
    }
}

let previousButton = null;
function injectCustomRollButton() {
    let rollButton = document.querySelector(".dice-toolbar .dice-toolbar__target button:not(.dice-toolbar__target-menu-button)");

    // We have to wait until dice menu is completely initialized.
    if (!rollButton)
        return;

    const currentlyInjected = previousButton !== null && rollButton.dataset.b20roll !== undefined;
    if (!settings["use-digital-dice"]) { // inject or update button
        if (!currentlyInjected) {
            // store a reference to the previous button so we can revert our changes if the user switches the setting off again
            previousButton = rollButton;

            // remove existing click event by replacing element with itself
            rollButton.replaceWith(rollButton.cloneNode(true));

            // refresh reference which still points to the old element
            rollButton = document.querySelector(".dice-toolbar .dice-toolbar__target button:not(.dice-toolbar__target-menu-button)");

            // add our custom handler
            rollButton.addEventListener("click", async () => {
                let selectedDice = [];

                for (const dieCountElement of document.querySelectorAll(".dice-toolbar .dice-die-button__count")) {
                    const $dieTypeElement = $(dieCountElement).parents("[data-dice]");
                    if (!$dieTypeElement.length)
                        continue;

                    selectedDice.push(dieCountElement.textContent + $dieTypeElement[0].dataset.dice);
                }

                if (!selectedDice.length) {
                    // This should not happen unless DDB page changes as button is hidden when no dice are selected
                    console.warn("Roll button clicked but no dice were selected. Ignoring.");
                    return;
                }

                await sendRoll(character ?? new CharacterBase("Character", settings), "custom", selectedDice.join(" + "), { name: "custom: roll" });
                $(".dice-toolbar__dropdown-die").click();
            });

            // set a flag so we can later determine whether we have already injected our custom event handler
            rollButton.dataset.b20roll = "1";

            // hide the roll menu button if it exists. We've got our own settings for whispering rolls
            menuButton && (menuButton.style.display = "none");
        }

        // update label
        const labelElement = document.querySelector(".dice-toolbar .dice-toolbar__target-user");
        if (labelElement) {
            let label = "To: Everyone";
            if (key_modifiers.whisper || settings["whisper-type"] === WhisperType.YES.toString())
                label = "To: GM";
            else if (settings["whisper-type"] === WhisperType.QUERY.toString())
                label = "To: (ask)";

            if (labelElement.textContent !== label)
                labelElement.textContent = label;
        }

    } else if (currentlyInjected) { // revert custom button we injected previously
        rollButton.replaceWith(previousButton);
        previousButton = null;
        menuButton && (menuButton.style.display = "");
    }
}

updateSettings();
injectCSS(BUTTON_STYLE_CSS);
chrome.runtime.onMessage.addListener(handleMessage);
const observer = new window.MutationObserver(documentModified);
observer.observe(document, { "subtree": true, "childList": true, attributes: true, });
chrome.runtime.sendMessage({ "action": "activate-icon" });
sendCustomEvent("disconnect");
injectPageScript(chrome.runtime.getURL('dist/dndbeyond_mb.js'));
addCustomEventListener("SendMessage", _sendCustomMessageToBeyond20);
