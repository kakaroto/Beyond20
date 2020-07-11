const ability_abbreviations = {
    "Strength": "STR",
    "Dexterity": "DEX",
    "Constitution": "CON",
    "Intelligence": "INT",
    "Wisdom": "WIS",
    "Charisma": "CHA"
}

const skill_abilities = {
    "Acrobatics": "DEX",
    "Animal Handling": "WIS",
    "Arcana": "INT",
    "Athletics": "STR",
    "Deception": "CHA",
    "History": "INT",
    "Insight": "WIS",
    "Intimidation": "CHA",
    "Investigation": "INT",
    "Medicine": "WIS",
    "Nature": "INT",
    "Perception": "WIS",
    "Performance": "CHA",
    "Persuasion": "CHA",
    "Religion": "INT",
    "Sleight of Hand": "DEX",
    "Stealth": "DEX",
    "Survival": "WIS"
}

function skillToAbility(skill) {
    return skill_abilities[skill] || "";
}

function abbreviationToAbility(abbr) {
    for (let ability in ability_abbreviations) {
        if (ability_abbreviations[ability] == abbr)
            return ability;
    }
    return abbr;
}


function propertyListToDict(propList) {
    const properties = {}
    for (let i = 0; i < propList.length; i++) {
        const label = propList.eq(i).find(".ct-property-list__property-label,.ddbc-property-list__property-label").text().slice(0, -1);
        const value = propList.eq(i).find(".ct-property-list__property-content,.ddbc-property-list__property-content").text();
        properties[label] = value;
    }
    return properties;
}

function descriptionToString(selector) {
    // strip tags : https://www.sitepoint.com/jquery-strip-html-tags-div/;
    return ($(selector).html() || "").replace(/<\/?[^>]+>/gi, '')
        .replace("&nbsp;", " ")
        .replace("&amp;", "&")
        .replace("&quot;", "\"")
        .replace("&apos;", "\'")
        .replace("&lt;", "<")
        .replace("&gt;", ">");
}

function findToHit(name_to_match, items_selector, name_selector, tohit_selector) {
    const items = $(items_selector);
    for (let i = 0; i < items.length; i++) {
        if (items.eq(i).find(name_selector).text() == name_to_match) {
            const to_hit = items.eq(i).find(tohit_selector);
            if (to_hit.length > 0) {
                const value = to_hit.text();
                return value === "--" ? null : value;
            }
            break;
        }
    }
    return null;
}

function damagesToCrits(character, damages) {
    const crits = [];
    const rule = parseInt(character.getGlobalSetting("critical-homebrew", CriticalRules.PHB));
    if (rule == CriticalRules.HOMEBREW_REROLL || rule == CriticalRules.HOMEBREW_MOD)
        return damages.slice();
    for (let damage of damages) {
        const damage_matches = reMatchAll(/([0-9]*)d([0-9]+)(?:ro<=[0-9]+)?(?:min[0-9]+)?/, damage) || [];
        const damage_parts = damage_matches.map(match => {
            if (rule == CriticalRules.HOMEBREW_MAX) {
                dice = parseInt(match[1] || 1);
                faces = parseInt(match[2]);
                return String(dice * faces);
            } else {
                return match[0];
            }
        });
        console.log("Damage to crits : ", damage, damage_parts);
        crits.push(damage_parts.join(" + "));
    }
    return crits;
}

function buildAttackRoll(character, attack_source, name, description, properties, damages = [], damage_types = [], to_hit = null, brutal = 0) {
    const roll_properties = {
        "name": name,
        "attack-source": attack_source,
        "description": description
    }
    if (to_hit !== null)
        roll_properties["to-hit"] = to_hit;

    if (properties["Reach"] !== undefined) {
        roll_properties["reach"] = properties["Reach"];
        roll_properties["attack-type"] = "Melee";
    } else if (properties["Range"] !== undefined) {
        roll_properties["range"] = properties["Range"];
        roll_properties["attack-type"] = "Ranged";
    } else {
        const range_area = properties["Range/Area"] || "";
        if (range_area.includes("Reach")) {
            roll_properties["attack-type"] = "Melee";
            roll_properties["reach"] = range_area.replace(" Reach", "");
        } else {
            roll_properties["attack-type"] = "Ranged";
            roll_properties["range"] = range_area;
        }
    }
    if (properties["Attack Type"] !== undefined)
        roll_properties["attack-type"] = properties["Attack Type"];

    if (properties["Attack/Save"] !== undefined) {
        const [save_ability, save_dc] = properties["Attack/Save"].split(" ");
        roll_properties["save-ability"] = abbreviationToAbility(save_ability);
        roll_properties["save-dc"] = save_dc;
    }

    if (properties["Properties"] !== undefined)
        roll_properties["properties"] = properties["Properties"].split(", ");

    if (damages.length > 0) {
        roll_properties["damages"] = damages;
        roll_properties["damage-types"] = damage_types;
        if (to_hit) {
            const crits = damagesToCrits(character, damages, damage_types);
            const crit_damages = [];
            const crit_damage_types = [];
            for (let [i, dmg] of crits.entries()) {
                if (dmg != "") {
                    crit_damages.push(dmg);
                    crit_damage_types.push(damage_types[i]);
                }
            }
            if (brutal > 0) {
                const rule = parseInt(character.getGlobalSetting("critical-homebrew", CriticalRules.PHB));
                let highest_dice = 0;
                let homebrew_max_damage = 0;
                if (rule == CriticalRules.HOMEBREW_MAX) {
                    let highest_damage = 0;
                    for (let dmg of crit_damages) {
                        if (dmg > highest_damage){
                            highest_damage = dmg;
                        }
                    }
                    homebrew_max_damage = brutal * highest_damage;
                } else {
                    for (let dmg of crit_damages) {
                        const match = dmg.match(/[0-9]*d([0-9]+)/);
                        if (match) {
                            const sides = parseInt(match[1]);
                            if (sides > highest_dice)
                                highest_dice = sides;
                        }
                    }
                }
                const isBrutal = character.hasClassFeature("Brutal Critical");
                const isSavage = character.hasRacialTrait("Savage Attacks");
                if (highest_dice != 0) {
                    crit_damages.push(`${brutal}d${highest_dice}`);
                    crit_damage_types.push(isBrutal && isSavage ? "Savage Attacks & Brutal" : (isBrutal ? "Brutal" : "Savage Attacks"));
                } else if (rule == CriticalRules.HOMEBREW_MAX) {
                    crit_damages.push(`${homebrew_max_damage}`);
                    crit_damage_types.push(isBrutal && isSavage ? "Savage Attacks & Brutal" : (isBrutal ? "Brutal" : "Savage Attacks"));
                }

            }
            roll_properties["critical-damages"] = crit_damages;
            roll_properties["critical-damage-types"] = crit_damage_types;
        }
    }

    return roll_properties;
}

async function sendRoll(character, rollType, fallback, args) {
    let whisper = parseInt(character.getGlobalSetting("whisper-type", WhisperType.NO));
    const whisper_monster = parseInt(character.getGlobalSetting("whisper-type-monsters", WhisperType.YES));
    let is_monster = character.type() == "Monster" || character.type() == "Vehicle";
    if (is_monster && whisper_monster != WhisperType.NO)
        whisper = whisper_monster;
    if (whisper === WhisperType.QUERY)
        whisper = await dndbeyondDiceRoller.queryWhisper(args.name || rollType, is_monster);
    advantage = parseInt(character.getGlobalSetting("roll-type", RollType.NORMAL));
    if (args["advantage"] == RollType.OVERRIDE_ADVANTAGE)
        args["advantage"] = advantage == RollType.SUPER_ADVANTAGE ? RollType.SUPER_ADVANTAGE : RollType.ADVANTAGE;
    if (args["advantage"] == RollType.OVERRIDE_DISADVANTAGE)
        args["advantage"] = advantage == RollType.SUPER_DISADVANTAGE ? RollType.SUPER_DISADVANTAGE : RollType.DISADVANTAGE;

    // Default advantage/whisper would get overriden if (they are part of provided args;
    req = {
        action: "roll",
        character: character.getDict(),
        type: rollType,
        roll: cleanRoll(fallback),
        advantage: advantage,
        whisper: whisper
    }
    if (character.getGlobalSetting("weapon-force-critical", false))
        req["critical-limit"] = 1;
    for (let key in args)
        req[key] = args[key];
    if (key_modifiers.shift)
        req["advantage"] = RollType.ADVANTAGE;
    else if (key_modifiers.ctrl)
        req["advantage"] = RollType.DISADVANTAGE;
    else if (key_modifiers.alt)
        req["advantage"] = RollType.NORMAL;

    if (character.getGlobalSetting("use-digital-dice", false) && DigitalDice.isEnabled()) {
        if (!character.getGlobalSetting("auto-roll-damage", true))
            mergeSettings({ "auto-roll-damage": true }, (settings) => {
                chrome.runtime.sendMessage({ "action": "settings", "type": "general", "settings": settings })
            });
        req.sendMessage = true;
        dndbeyondDiceRoller.handleRollRequest(req);
    } else {
        console.log("Sending message: ", req);
        chrome.runtime.sendMessage(req, (resp) => beyond20SendMessageFailure(character, resp));
    }
}

function isRollButtonAdded() {
    return $(".ct-beyond20-roll,.ct-beyond20-roll-display").length > 0;
}

function isCustomRollIconsAdded() {
    return $(".ct-beyond20-custom-roll, .ct-beyond20-custom-roll-button").length > 0;
}

function isHitDieButtonAdded() {
    return $(".ct-beyond20-roll-hitdie").length > 0;
}

function getRollTypeButtonClass(character) {
    let advantage = RollType.NORMAL;
    if (character)
        advantage = parseInt(character.getGlobalSetting("roll-type", RollType.NORMAL));
    if (key_modifiers.shift)
        advantage = RollType.ADVANTAGE;
    else if (key_modifiers.ctrl)
        advantage = RollType.DISADVANTAGE;
    else if (key_modifiers.alt)
        advantage = RollType.NORMAL;

    if (advantage == RollType.DOUBLE)
        return "beyond20-roll-type-double";
    if (advantage == RollType.QUERY)
        return "beyond20-roll-type-query";
    if (advantage == RollType.THRICE)
        return "beyond20-roll-type-thrice";
    if (advantage == RollType.ADVANTAGE)
        return "beyond20-roll-type-advantage";
    if (advantage == RollType.DISADVANTAGE)
        return "beyond20-roll-type-disadvantage";
    if (advantage == RollType.SUPER_ADVANTAGE)
        return "beyond20-roll-type-super-advantage";
    if (advantage == RollType.SUPER_DISADVANTAGE)
        return "beyond20-roll-type-super-disadvantage";
    return "";
}

function getBadgeIconFromClass(rolltype_class, size="20") {
    const type = rolltype_class.replace("beyond20-roll-type-", "") || "normal";
    return chrome.extension.getURL(`images/icons/badges/${type}${size}.png`);
}

var last_character_used = null;
function updateRollTypeButtonClasses(character) {
    const button_roll_type_classes = "beyond20-roll-type-double beyond20-roll-type-query beyond20-roll-type-thrice beyond20-roll-type-advantage beyond20-roll-type-disadvantage beyond20-roll-type-super-advantage beyond20-roll-type-super-disadvantage";
    const rolltype_class = getRollTypeButtonClass(character || last_character_used);
    $(".ct-beyond20-roll .ct-beyond20-roll-button,.beyond20-quick-roll-tooltip").removeClass(button_roll_type_classes).addClass(rolltype_class);
    const icon20 = getBadgeIconFromClass(rolltype_class, "20");
    const icon32 = getBadgeIconFromClass(rolltype_class, "32");
    $(".ct-beyond20-roll .ct-beyond20-icon").attr("src", icon20);
    $(".beyond20-quick-roll-tooltip .beyond20-quick-roll-icon").attr("src", icon32);
}


const button_class = "ct-theme-button ct-theme-button--filled ct-theme-button--interactive ct-button character-button";
const button_class_small = button_class + " character-button-small";
function addRollButton(character, callback, where, { small = false, append = false, prepend = false, before = false, image = true, text = "Beyond 20" } = {}) {
    last_character_used = character;

    const id = "beyond20-roll-" + Math.random().toString().slice(2);

    const rolltype_class = getRollTypeButtonClass(character);
    const icon = getBadgeIconFromClass(rolltype_class);

    const button = E.div({ class: "ct-beyond20-roll", id },
        E.button({ class: "ct-beyond20-roll-button " + (small ? button_class_small : button_class) + " " + rolltype_class },
            E.img({ class: "ct-beyond20-icon", src: image ? icon : "", style: image ? "margin-right: 6px;" : "" }),
            E.span({ class: "ct-button__content" }, text)
        )
    )

    if (append)
        $(where).append(button);
    else if (prepend)
        $(where).prepend(button);
    else if (before)
        $(where).before(button);
    else
        $(where).after(button);

    $(`#${id}`).css({
        "float": "right",
        "display": "block",
        "text-align": "center"
    });
    $(`#${id} button`).on('click', (event) => callback());
    return id;
}

function addDisplayButton(callback, where, { text = "Display in VTT", append = true, small = true } = {}) {
    const button = E.div({ class: "ct-beyond20-roll-display" },
        E.button({ class: "ct-beyond20-display-button " + (small ? button_class_small : button_class).replace("filled", "outline") },
            E.span({ class: "ct-button__content" }, text)
        )
    );
    if (append)
        $(where).append(button);
    else
        $(where).after(button);

    $(".ct-beyond20-roll-button").css({
        "margin-left": "auto",
        "margin-right": "auto"
    });
    $(".ct-beyond20-roll-display").css("margin-top", "2px");
    $(".ct-beyond20-roll-display").on('click', (event) => callback());
}

function addHitDieButtons(rollCallback) {
    const icon = chrome.extension.getURL("images/icons/badges/custom20.png");
    const button = E.div({ class: "ct-beyond20-roll-hitdie", style: "float: right;" },
        E.img({ class: "ct-beyond20-icon", src: icon, style: "margin-right: 6px;" }),
        E.button({ class: "ct-beyond20-roll-button " + button_class_small },
            E.span({ class: "ct-button__content" }, "Roll Hit Die")
        )
    );
    //console.log("Adding Hit Dice buttons");

    $(".ct-reset-pane__hitdie-heading").append(button);
    const hitdice = $(".ct-reset-pane__hitdie");
    const multiclass = hitdice.length > 1;
    for (let i = 0; i < hitdice.length; i++) {
        $(".ct-beyond20-roll-hitdie").eq(i).on('click', (event) => rollCallback(multiclass, i));
    }
}

function addIconButton(character, callback, where, { append = false, prepend = false, custom = false } = {}) {
    const rolltype_class = getRollTypeButtonClass(character);
    const icon = custom ? chrome.extension.getURL("images/icons/badges/custom20.png") :
                        getBadgeIconFromClass(rolltype_class);
    const id = "beyond20-roll-" + (custom ? "custom-" : "") + Math.random().toString().slice(2);
    const button = E.span({ class: "ct-beyond20-" + (custom ? "custom-roll-button" : "roll"), id, style: "margin-right:3px; margin-left: 3px;" },
        E.img({ class: "ct-beyond20-" + (custom ? "custom-icon" : "icon"), src: icon })
    );

    if (append)
        $(where).append(button);
    else if (prepend)
        $(where).prepend(button);
    else
        $(where).after(button);
    $(`#${id}`).on('click', (event) => callback());
    return button;
}

function removeRollButtons() {
    $(".ct-beyond20-roll").remove();
    $(".ct-beyond20-roll-hitdie").remove();
    $(".ct-beyond20-roll-display").remove();
    $(".ct-beyond20-custom-icon").remove();
    const custom_rolls = $("u.ct-beyond20-custom-roll");
    for (let i = 0; i < custom_rolls.length; i++)
        custom_rolls.eq(i).replaceWith(custom_rolls.eq(i).text());
}


function recursiveDiceReplace(node, cb) {
    if (node.hasChildNodes()) {
        // We need to copy the list since its size could change as we modify it;
        const children = [].concat(...node.childNodes);
        for (let child of children) {
            // don't replace anything inside of a roll button itthis;
            if ($(child).hasClass("ct-beyond20-roll"))
                continue;
            recursiveDiceReplace(child, cb);
        }
    } else if (node.nodeName == "#text") {
        const text = replaceRolls(node.textContent, cb);
        // Only replace if (we changed it, otherwise we might break existing html code bindings;
        if (text != node.textContent)
            $(node).replaceWith($.parseHTML(text));
    }
}

function injectDiceToRolls(selector, character, name = "") {
    const icon = chrome.extension.getURL("images/icons/badges/custom20.png");
    const replaceCB = (dice, modifier) => {
        dice_formula = (dice == "" ? "1d20" : dice) + modifier;
        return '<u class="ct-beyond20-custom-roll"><strong>' + dice + modifier + '</strong>' +
            '<img class="ct-beyond20-custom-icon" x-beyond20-name="' + name +
            '" x-beyond20-roll="' + dice_formula + '"></img></u>';
    }

    const items = $(selector);
    for (let item of items.toArray())
        recursiveDiceReplace(item, replaceCB);

    $(".ct-beyond20-custom-icon").css("margin-right", "3px");
    $(".ct-beyond20-custom-icon").css("margin-left", "3px");
    $(".ct-beyond20-custom-icon").attr("src", icon);
    $(".ct-beyond20-custom-roll").off('click');
    $(".ct-beyond20-custom-roll").on('click', (event) => {
        const name = $(event.currentTarget).find("img").attr("x-beyond20-name");
        const roll = $(event.currentTarget).find("img").attr("x-beyond20-roll");
        sendRoll(character, "custom", roll, { "name": name });
    }
    );
}

function beyond20SendMessageFailure(character, response) {
    if (!response || (response.request && response.request.action === "update-combat"))
        return;
    console.log("Received response : ", response);
    if (["roll", "rendered-roll"].includes(response.request.action)  && (response.vtt == "dndbeyond" || response.error)) {
        dndbeyondDiceRoller.handleRollError(response.request, response.error);
    } else if (response.error) {
        alertify.error("<strong>Beyond 20 : </strong>" + response.error);
    }
}

