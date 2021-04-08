function updateHP(name, current, total, temp) {
    console.log(`Updating HP for ${name} : (${current} + ${temp})/${total}`);
    name = name.toLowerCase().trim();

    character = window.Campaign.characters.find((c) => c.attributes.name.toLowerCase().trim() === name);
    if (character) {
        //console.log("Found character : ", character);

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

function updateCombatTracker(combat) {
    if (!is_gm) return;

    const index = combat.findIndex(x => x.turn);
    if (index === -1) {
        console.warn("It's apparently nobody's turn :/");
    } else {
        // Roll20 needs the unit whose turn it is at the top of the array.
        const c = combat.splice(index, combat.length);
        combat.splice(0, 0, ...c);
    }
    const turnOrder = combat.map(combatant => {
        const name = combatant.name.toLowerCase().trim();
        const page = Campaign.activePage();
        const graphic = page && page.thegraphics ? page.thegraphics.models.find(g => g.attributes.name.toLowerCase().trim() === name) : null;
        return {
            id: graphic ? graphic.id : "-1",
            pr: combatant.initiative,
            custom: combatant.name,
        }
    });
    Campaign.set("turnorder", JSON.stringify(turnOrder));
    // Make sure the turn tracker window is open
    // This also forces roll20 to sync the initiative tracker state to other clients.
    $("#startrounds").click();
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
