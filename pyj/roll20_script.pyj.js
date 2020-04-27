from utils import addCustomEventListener;

function updateHP(name, current, total, temp) {
    console.log("Updating HP for " + name + " : (" + current + "+" + temp + ")/" + total);
    name = name.toLowerCase().trim();

    character = window.Campaign.characters.find((c) => c.attributes.name.toLowerCase().trim() == name);
    if (character != undefined) {
        console.log("Found character : ", character);

        hp = character.attribs.find((a) => a.attributes.name == "hp");
        if (hp != undefined) {
            console.log("Found attribute : ", hp);
            hp.set("current", String(current));
            hp.set("max", String(total));
            hp.save();
            character.updateTokensByName("hp", hp.id);
        }
        temp_hp = character.attribs.find((a) => a.attributes.name == "hp_temp");
        if (temp_hp != undefined) {
            console.log("Found attribute : ", temp_hp);
            if (temp_hp.attributes.current != String(temp)) {
                value = temp != 0 ? String(temp) : "";
                temp_hp.set("current", value);
                temp_hp.set("max", value);
                temp_hp.save();
                character.updateTokensByName("hp_temp", temp_hp.id);

}
}
}
}
function disconnectAllEvents() {
    nonlocal registered_events;

    for (let event of registered_events) {
        document.removeEventListener(*event);

}
}
registered_events = [];
registered_events.push(addCustomEventListener("UpdateHP", updateHP));
registered_events.push(addCustomEventListener("disconnect", disconnectAllEvents));
