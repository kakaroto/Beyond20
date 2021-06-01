console.log("Beyond20: D&D Beyond Source Book module loaded.");

class SourceBookCharacter extends CharacterBase {
    constructor(global_settings) {
        super("source", global_settings);
    }
}

var settings = getDefaultSettings();
var character = null;

class RollTable {
    constructor(name, formula, table) {
        this.name = name;
        this.formula = formula;
        this.table = table;
        this.total = null;
    }
    get results() {
        const results = {};
        for (const row of Object.keys(this.table)) {
            for (const [range, description] of Object.entries(this.table[row])) {
                const match = range.match(/([0-9]+)(?:[–-]([0-9]+))?/);
                if (!match) continue;
                let min = parseInt(match[1]);
                let max = parseInt(match[2] || min);
                // A d100 table will use '00' for the 100 result
                if (min === 0) min = 100;
                if (max === 0) max = 100;
                if (this.total >= min && this.total <= max) {
                    results[row] = description;
                    break;
                }
            }
        }
        return results;
    }

    async roll() {
        const roll = new DNDBRoll(this.formula);
        await roll.roll();
        this.total = roll.total;
    }

    async send() {
        await this.roll();
        
        sendRoll(character, "roll-table", this.formula, {
            "name": this.name,
            "formula": this.formula,
            "table": this.table,
            "total": this.total,
            "results": this.results
        });
    }
}

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

function handleRollTable(table, name) {
    const dice_columns = [];
    const columns = {};
    const headers = table.find("thead tr th");
    for (let index = 0; index < headers.length; index++) {
        const header = headers.eq(index).text();
        if (!header) break;
        // If header is a dice formula, then this is a roll table
        const replaced = replaceRolls(header, () => "").trim();
        if (dice_columns.length === 0) {
            if (replaced) break;
            dice_columns.push(index);
            continue;
        } else {
            // Look for other columns that are part of this roll table
            // (some tables are split horizontally, having multiple columns for the same data)
            // see https://www.dndbeyond.com/sources/dmg/adventure-environments#BuildingaDungeon
            if (replaced) {
                columns[header] = {};
                continue;
            }
            const firstColumn = headers.eq(dice_columns[0]).text();
            if (header === firstColumn) {
                dice_columns.push(index);
            }
        }
    }
    if (dice_columns.length === 0) return;

    const rows = table.find("tbody tr");
    for (const row of rows.toArray()) {
        const cells = $(row).find("td");
        let last_range = null;
        for (let index = 0; index < headers.length; index++) {
            if (dice_columns.includes(index)) {
                last_range = cells.eq(index).text();
            } else if (last_range === null) {
                break;
            } else {
                const header = headers.eq(index).text();
                const description = cells.eq(index).text();
                if (columns[header] === undefined) continue;
                columns[header][last_range] = description;
            }
        }
    }

    return new RollTable(name, headers.eq(dice_columns[0]).text().trim(), columns);
}


function addRollTableButton(where, table) {
    const icon = chrome.extension.getURL("images/icons/badges/normal32.png");
    const button = E.a({ class: "ct-beyond20-roll button-alt", href: "#" },
        E.span({ class: "label" },
            E.img({ class: "ct-beyond20-roll-table-icon", src: icon, style: "margin-right: 10px;" }),
            "Roll Table to VTT"
        )
    );
    $(where).before(button);
    $(button).css({
        "float": "left",
        "display": "inline-block"
    });
    $(button).on('click', (event) => {
        event.stopPropagation();
        event.preventDefault();
        table.send()
    });
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
                const roll_table = handleRollTable($(table), nearestHeading(table, source_name));
                if (roll_table) {
                    addRollTableButton(table, roll_table);
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
