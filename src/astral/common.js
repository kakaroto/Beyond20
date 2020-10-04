const decorations = {
    "skill": ["#7ED321", "bunker-soldier-standing"],
    "ability": ["#4A90E2", "coin-star"],
    "saving-throw": [ "#F5A623",  "report-problem-triangle"],
    "initiative": ["#7ED321", "arrow-down-9"],
    "hit-dice": ["#D0021B", "heart-beat"],
    "death-save": ["#FFFFFF", "skull-2"],
    "attack": ["#D0021B", "knife"],
    "spell-card": ["#BD10E0", "torch"],
    "spell-attack": ["#BD10E0", "torch"],
    "feature": ["#50E3C2", "pyramid-eye"],
    "trait": ["#50E3C2", "pyramid-eye"], 
    "action": ["#50E3C2", "pyramid-eye"],
    "item": ["#50E3C2", "pyramid-eye"],
    
}

var settings = getDefaultSettings();

function updateSettings(new_settings = null) {
    if (new_settings) {
        settings = new_settings;
        roll_renderer.setSettings(settings);
    } else {
        getStoredSettings((saved_settings) => {
            settings = saved_settings;
        });
    }
}

const transformDecoration = (decoration) => ({
    icon: decoration[1],
    color: decoration[0]
});

const getDecoration = (type) => type in decorations ? transformDecoration(decorations[type]) : {
    color: '#FFFFFF', icon: "home-1"
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

function template(rolls) {
    return `| | |
| :--- | :--- |
${rolls.map(([key, value]) => {
    return `| ${capitalizeFirstLetter(key)} | ${value} |`
}).join('\n')}    

`;
}

const matchTable = new RegExp(/(^\n\n([^\n\r]+)\n([^\n\r]+)\n\n\n\n$)(^\n([^\n\r]+)\n([^\n\r]+)\n\n$)+/m);
const matchHead = new RegExp(/(^\n\n([^\n\r]+)\n([^\n\r]+)\n\n\n\n$)/m);
const matchRow = new RegExp(/(^\n([^\n\r]+)\n([^\n\r]+)\n\n$)/m);
function formatTableInDescription(description) {
    return description.replace(matchTable, (match) => {
        let [_1, _2, firstHead, secondHead] = reMatchAll(matchHead, match)[0];
        
        const allMatches = reMatchAll(match, matchRow);
        // Skip first as it is matched by the matchHead too
        const rows = allMatches.map(match => `| ${match[2]} | ${match[3]} |`).slice(1);
        return `

| ${firstHead} | ${secondHead} |
| :--- | :--- |
${rows.join('\n')}

`;
    })
}

const notesRegex = /Notes: [^\n]*/g;
function formatNotesInDescription(description) {
    return description.replace(notesRegex, (match) => `_${match}_`);
}

// Regex doesn't apply anymore, no way to detect bolded section without arbitrary length check.
// const boldedSectionRegex = /([^\n\.])*\.\&nbsp\;/g;
// function formatBoldedSectionInDescription(description) {
//     return description.replace(boldedSectionRegex, match => `\n**${match}**`)
// }

const bulletListRegex = /^(?!\|)(([^\n\r]+)\n)+([^\n\r]+)/gm;
function formatBulletListsInDescription(description) {
    // Short-circuit in case the description has no whitespace formatting so it doesn't become only a bullet list.
    if (description.match(bulletListRegex) == description) return formatSeparateParagraphsInDescription(description);

    return description.replace(bulletListRegex, match => {
        // Short-circuit in case the match is at the start of the description, this isually fixes formatting for feats and magic items.
        if (description.indexOf(match) == 0) {
            return formatSeparateParagraphsInDescription(match);
        }
        return match.split('\n').map(r => `* ${r}`).join('\n');
    })
}

const separateParagraphsRegex = /^(?!\|)(([^\n\r]+)\n)+([^\n\r]+)/gm;
function formatSeparateParagraphsInDescription(description) {
    return description.replace(separateParagraphsRegex, match => {
        return match.split('\n').join('\n\n');
    })
}

function formatPlusMod(custom_roll_dice) {
    const prefix = custom_roll_dice && !["+", "-", "?", ""].includes(custom_roll_dice.trim()[0]) ? " + " : "";
    return prefix + (custom_roll_dice || "").replace(/([0-9]*d[0-9]+)/, "$1cs0cf0");;
}

function subRolls(text, overrideCB = null) {
    let replaceCB = overrideCB;
    
    if (!overrideCB) {
        replaceCB = (dice, modifier) => {
            return dice == "" ? modifier : `!!(${dice}${formatPlusMod(modifier)})`;
        }
    }

    const result = replaceRolls(text, replaceCB);
    return result.replace(/\]\](\s*\+\s*)\[\[/g, '$1')
}

function parseDescription(request, description, {
    bulletList = true,
    notes = true,
    tables = true,
    bolded = true
} = {}) {
    // Trim lines
    description = description.split('\n').map(s => s.trim()).join('\n');
    // Trim leading empty lines
    description = description.replace(/$[\n]*/m, match => "");

    if (!settings["subst-vtt"])
        return description;
        
    if (notes) description = formatNotesInDescription(description);
    if (tables) description = formatTableInDescription(description);
    if (bulletList) {
        description = formatBulletListsInDescription(description);
    } else {
        description = formatSeparateParagraphsInDescription(description);
    }
    // if (bolded) description = formatBoldedSectionInDescription(description);
    const replaceCB = (dice, modifier) => {
        return dice == "" ? modifier : `${dice}${modifier} (!!(${dice}${modifier}))`;
    }
    return subRolls(description, replaceCB);
}
