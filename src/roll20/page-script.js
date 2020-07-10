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
    const index = combat.findIndex(x => x[2]);
    if (index === -1) {
        console.warn("It's apparently nobody's turn :/");
    } else {
        const c = combat.splice(index, combat.length);
        combat.splice(0, 0, ...c);
    }
    const turnOrder = combat.map(x => ({
        id: "-1",
        pr: x[1],
        custom: x[0],
    }));
    Campaign.set("turnorder", JSON.stringify(turnOrder));
}


function checkForOGL() {
    const isOGL = atob(customcharsheet_html).includes(`<rolltemplate class="sheet-rolltemplate-simple">`);
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
    checkForOGL();
else
    window.addEventListener("DOMContentLoaded", checkForOGL);
