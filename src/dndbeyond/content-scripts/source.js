console.log("Beyond20: D&D Beyond Source Book module loaded.");

class SourceBookCharacter extends CharacterBase {
    constructor(global_settings) {
        super("source", global_settings);
    }
}

var settings = getDefaultSettings();
var character = null;


// Find the nearest heading in the text
// Taken from : https://stackoverflow.com/questions/35340275/selecting-nearest-heading-element
function nearestHeading(node, default_name="") {
    const header = $(node)
        .parentsUntil("*:has('h1, h2, h3, h4, h5, h6')")  // element's ancestors until one which has children headings 
        .last()  // the ancestor that has sibling headings
        .prevUntil('h1, h2, h3, h4, h5, h6')   // previous siblings until the nearest heading
        .addBack()  // in case the prevUntil() returns nothing
        .first()    // the first element after the heading
        .prev();    // the heading!
    return header.text() || default_name;
}


function documentLoaded(settings) {
    character = new SourceBookCharacter(settings);
    if (isRollButtonAdded() || isCustomRollIconsAdded()) {
        chrome.runtime.sendMessage({ "action": "reload-me" });
    } else {
        const source_name = $(".page-title").text().trim();
        if (settings['subst-dndbeyond']) {
            const tables = $("table");
            for (const table of tables.toArray()) {
                const roll_table = RollTable.parseTable($(table), nearestHeading(table, source_name));
                if (roll_table) {
                    addRollTableButton(character, table, roll_table);
                }
            }

            injectDiceToRolls(".primary-content", character, (node) => {
                return nearestHeading(node, source_name);
            });
        }
    }
}

function updateSettings(new_settings = null) {
    if (new_settings) {
        settings = new_settings;
        if (character)
            character.setGlobalSettings(new_settings);
        if (settings['hotkeys-bindings'])
            key_bindings = settings['hotkeys-bindings'];
    } else {
        getStoredSettings((saved_settings) => {
            documentLoaded(saved_settings);
            updateSettings(saved_settings);
        });
    }
}

function handleMessage(request, sender, sendResponse) {
    if (request.action == "settings") {
        if (request.type == "general")
            updateSettings(request.settings);
    } else if (request.action == "open-options") {
        alertFullSettings();
    }
}

chrome.runtime.onMessage.addListener(handleMessage);
chrome.runtime.sendMessage({ "action": "activate-icon" });
updateSettings();
