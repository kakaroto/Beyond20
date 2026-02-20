async function loadCharacterAttributes(character) {
    if (!character.attribs.backboneFirebase) {
        character.attribs.backboneFirebase = new BackboneFirebase(character.attribs);

        return character.attribs.backboneFirebase.reference.once('value');
    }
}

async function updateHP(name, current, total, temp) {
    console.log(`Updating HP for ${name} : (${current} + ${temp})/${total}`);
    name = name.toLowerCase().trim();

    const character = window.Campaign.characters.find((c) => c.attributes.name.toLowerCase().trim() === name);
    if (!character)
        return; // nothing to do when no matching character exists

    // Make sure character attributes are loaded before we try to find the HP attributes to sync it
    await loadCharacterAttributes(character);

    /* We currently support the following character sheets:
        Sheet Name                            | Short Name (internally used)
       ---------------------------------------+------------------------------
        D&D 5E By Roll20 - 2014 Sheet Version | ogl5e
        D&D 5E By Roll20 - 2024 Sheet Version | dnd2024byroll20
        D&D 5E 2014                           | ogl5e
        D&D 5e (New!) - 2024 / 2014           | dnd2024byroll20
        D&D 5E (Community Contributed)        | dnd5e
     */

    if (character.characterSheet?.shortName === "ogl5e" || character.characterSheet?.shortName === "dnd5e") { // 2014 sheet versions
        const hp = character.attribs.find((a) => a.attributes.name === "hp");
        if (hp) {
            //console.log("Found attribute : ", hp);
            hp.set("current", String(current));
            hp.set("max", String(total));
            hp.save();
            character.updateTokensByName("hp", hp.id);
        }
        const temp_hp = character.attribs.find((a) => a.attributes.name === "hp_temp");
        if (temp_hp) {
            //console.log("Found attribute : ", temp_hp);
            if (temp_hp.attributes.current != String(temp)) {
                const value = temp != 0 ? String(temp) : "";
                temp_hp.set("current", value);
                temp_hp.set("max", value);
                temp_hp.save();
                character.updateTokensByName("hp_temp", temp_hp.id);
            }
        }

    } else if (character.characterSheet?.shortName === "dnd2024byroll20") { // 2024 sheet versions
        const store = character.characterSheet.state.characters[character.id].attributes.store;

        if (!store) {
            // Usually, the character attributes are initialized by the front end and sent to the back end after creating a new character.
            // This occurs shortly after the the "Your Adventure Begins Here!" splash screen first opens (where one can also edit the character sheet).
            // However, if the users closes the character screen quickly enough, the attributes remain uninitialized.
            // As a workaround, we create the required HP entries manually.
            // (Alternatively, we could trigger the character screen with `character.view.showDialog()`, which would lead to character attribute initialisation.)

            console.warn(
                `Warning: character "${character.get("name")}" is not yet initialized. ` +
                "If HP sync does not work, please open the character dialog and wait for it to finish loading. " +
                "You can do this by clicking on the character's entry in the Journal view."
            );

            character.characterSheet.headlessRelay.postMessage({
                type: "change",
                character: {
                    id: character.id,
                    attributes: {
                        store: {
                            hitpoints: {
                                currentHP: current,
                                temp,
                            },
                            integrants: {
                                integrants: {
                                    [uuidv4()]: createHitpointIntegrantEntry(0, "Maximum", total),
                                    [uuidv4()]: createHitpointIntegrantEntry(1, "Temporary", temp),
                                },
                            },
                        },
                    },
                },
            });

            // using the property setter to (again) set the HP value leads to the internal state synchronizing to the character sheet state
            await character.characterSheet.headlessRelay.setComputed({
                characterId: character.id,
                property: "hp",
                args: [current],
            });
        } else {
            // To set max HP we have to manually change the integrants, as the max HP is a read-only property.
            // As the integrant is optional, we first have to check if it exists, and, in case it does not, create it.
            let maxHpIntegrantKey = Object.entries(store.integrants.integrants).find(([_, v]) => v.hitpointType === "Maximum")?.[0], updatePayload;

            if (maxHpIntegrantKey) { // integrant has already been created, simply update the value
                updatePayload = { valueFormula: { flatValue: total } };

            } else { // we have to create a new integrant entry
                maxHpIntegrantKey = uuidv4();

                // calculate the next free array position
                const newPosition = Math.max(...Object.values(store.integrants.integrants).map(v => v.arrayPosition)) + 1;

                updatePayload = createHitpointIntegrantEntry(newPosition, "Maximum", total);
            }

            character.characterSheet.headlessRelay.postMessage({
                type: "change",
                character: {
                    id: character.id,
                    attributes: { store: { integrants: { integrants: { [maxHpIntegrantKey]: updatePayload } } } },
                },
            });

            // set HP & temp HP using the property setter.
            await character.characterSheet.headlessRelay.setComputed({
                characterId: character.id,
                property: "hp",
                args: [current],
            });

            // If we wanted to auto-hide the bar when temp is zero, we'd have to manually edit the temporary HP integrant's value and set it to an empty string (ref. changing max HP).
            // The property setter that's used with setComputed automatically converts values to integers, so an empty string remains zero and the bar is still visible.
            // As this matches Roll20's default behaviour when using the 2024 templates, we keep it that way.
            await character.characterSheet.headlessRelay.setComputed({
                characterId: character.id,
                property: "hp_temp",
                args: [temp],
            });
        }
        // make sure all tokens resemble the new values
        character.updateTokensForAdvancedSheets();
    } else {
        console.warn(`Unsupported character sheet ${character.characterSheet?.longName} (${character.characterSheet?.shortName}) used. Beyond20 HP synchronization will not work.`);
    }
}

function createHitpointIntegrantEntry(arrayPosition, hitpointType, initialValue = 0) {
    let label, source, calculation;

    if (hitpointType === "Maximum") {
        label = "Other Bonus";
        source = "Custom";
        calculation = "Modify";
    } else if (hitpointType === "Temporary") {
        label = "";
        source = "";
        calculation = "Set Value";
    }
    else {
        throw `Invalid hitpoint type "${hitpointType}" provided. Only "Maximum" and "Temporary" are supported.`;
    }

    return {
        // attributes that differ based on hitpoint type
        _label: label,
        arrayPosition,
        calculation,
        hitpointType,
        source,

        // these attributes are the same for all hitpoint types
        _enabled: true,
        builderDisplayName: "",
        childIDs: "[]",
        createdTime: Date.now(),
        isFixed: false,
        isTemp: false,
        name: "",
        overwriteDisabled: false,
        parentDisabled: false,
        parentID: "",
        relations: {},
        shortID: crypto.getRandomValues(new Uint8Array(7)).toBase64().substr(0, 9).replace(/[^\w]/, '-'), // creates a random strings matching the pattern [0-9a-ZA-Z-]{9}
        type: "Hit Points",
        valueFormula: { flatValue: initialValue },
    };
}

function updateCombatTracker(combat, settings) {
    if (!is_gm) return;

    const index = combat.findIndex(x => x.turn);
    // Map combatants to tokens before splicing/re-ordering the array
    // so we can ensure the token mapping is consistent
    const mappedGraphics = [];
    const turnOrder = combat.map(combatant => {
        const name = combatant.name.toLowerCase().trim();
        const page = Campaign.activePage();
        let graphic = null;
        if (page && page.thegraphics) {
          graphic = page.thegraphics.models.find(g => g.attributes.name.toLowerCase().trim() === name);
          // Try to find token with the base name in case of multiple mooks
          if (!graphic && name.match(/ \([a-z]\)$/)) {
            const baseName = name.replace(/ \([a-z]\)$/, "");
            graphic = page.thegraphics.models.find(g => {
                if (mappedGraphics.includes(g.id)) return false;
                return g.attributes.name.toLowerCase().trim() === baseName;
            });

          }
          if (graphic) {
              mappedGraphics.push(graphic.id);
          }
        }
        let combatantName = combatant.name;
        if (!graphic && combatant.tags.includes("monster") && settings["combat-unknown-monster-name"]) {
            combatantName = settings["combat-unknown-monster-name"];
        }
        return {
            id: graphic ? graphic.id : "-1",
            pr: combatant.initiative,
            custom: combatantName,
            _pageid: graphic ? page.id : undefined // if an id is set, the page id must be set too
        }
    });
    // Roll20 needs the unit whose turn it is at the top of the array.
    if (index === -1) {
        console.warn("It's apparently nobody's turn :/");
    } else {
        const c = turnOrder.splice(index, turnOrder.length);
        turnOrder.splice(0, 0, ...c);
    }
    // Make sure the turn tracker window is open
    // This also forces roll20 to sync the initiative tracker state to other clients.
    $("#startrounds").click();
    Campaign.set("turnorder", JSON.stringify(turnOrder));
    Campaign.save();
}


function checkForOGL() {
    // Make sure at least one of these variables is set
    if (typeof(customcharsheet_data) === "undefined" &&
        typeof(customcharsheet_html) === "undefined" &&
        typeof(CHARSHEET_NAME) === "undefined")
        return setTimeout(checkForOGL, 1000)
    const oglTemplates = ["simple", "atk", "atkdmg", "dmg", "spell", "traits"];
    const templates = typeof(customcharsheet_data) !== "undefined" && customcharsheet_data.rolltemplates;
    let isOGL = false;
    if (templates) {
        isOGL = oglTemplates.every(template => !!templates[template]);
    } else if (typeof(CHARSHEET_NAME) !== "undefined") {
        isOGL = (CHARSHEET_NAME == "ogl5e");
    } else if (typeof(customcharsheet_html) !== "undefined") {
        const html = $(atob(customcharsheet_html));
        isOGL = oglTemplates.every(template => html.find(`rolltemplate.sheet-rolltemplate-${template}`).length !== 0);
    }
    $("#isOGL").remove();
    document.body.append($(`<input type="hidden" value="${isOGL ? 1 : 0}" name="isOGL" id="isOGL">`)[0]);
}

function disconnectAllEvents() {
    for (let event of registered_events)
        document.removeEventListener(...event);
}

var registered_events = [];
registered_events.push(addCustomEventListener("UpdateHP", updateHP));
registered_events.push(addCustomEventListener("CombatTracker", updateCombatTracker));
registered_events.push(addCustomEventListener("disconnect", disconnectAllEvents));

// Hack for VTT ES making every script load before Roll20 loads
if (window.$ !== undefined)
    setTimeout(checkForOGL, 1000)
else
    window.addEventListener("DOMContentLoaded", () => setTimeout(checkForOGL, 1000));
