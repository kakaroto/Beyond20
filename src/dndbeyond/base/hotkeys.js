
const key_modifiers = {
    advantage: false,
    disadvantage: false,
    normal_roll: false
};
const checkKeyModifiers = (event) => {
    keyModifiers(event.type, event.key, event.originalEvent.repeat);
}

function keyModifiers(etype, key, repeat) {
    if (repeat) return;
    const hotkeyClick = settings['hotkey-click']; //true for clicking a key, false for holding a key
    if (hotkeyClick && etype != "keyup") return;

    const oldValue = key_modifiers.advantage << 0 | key_modifiers.disadvantage << 1 | key_modifiers.normal_roll << 2;
    const modifier = (key_bindings || {})[key];
    if (modifier) {
        if (hotkeyClick){
            const newVal = !key_modifiers[modifier]; //key click modifies value
            const adn = ["advantage","disadvantage","normal_roll"]; //need to reset roll adv/dis modifiers if another is toggled.
            if (adn.includes(modifier)){
                key_modifiers.advantage = false;
                key_modifiers.disadvantage = false;
                key_modifiers.normal_roll = false;
            }
            key_modifiers[modifier] = newVal;
            updateToggles();
        } else {
            key_modifiers[modifier] = etype === "keydown";
        }
    }
    const newValue = key_modifiers.advantage << 0 | key_modifiers.disadvantage << 1 | key_modifiers.normal_roll << 2;
    if (oldValue !== newValue)
        updateRollTypeButtonClasses();
}

const resetKeyModifiers = (event) => {
    const needsUpdate = key_modifiers.advantage || key_modifiers.disadvantage || key_modifiers.normal_roll;
    for (const key in key_modifiers)
        key_modifiers[key] = false;
    if (needsUpdate)
        updateRollTypeButtonClasses();
}
$(window).keydown(checkKeyModifiers).keyup(checkKeyModifiers).blur(resetKeyModifiers);
