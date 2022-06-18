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
    if (character) {
        //console.log("Found character : ", character);
        // Make sure character attributes are loaded before we try to find the HP attributes to sync it
        await loadCharacterAttributes(character);

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
    }
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
