
const key_modifiers = {
    advantage: false,
    disadvantage: false,
    normal_roll: false
};
const checkKeyModifiers = (event) => {
    if (event.originalEvent.repeat) return;
    const oldValue = key_modifiers.advantage << 0 | key_modifiers.disadvantage << 1 | key_modifiers.normal_roll << 2;
    const modifier = (key_bindings || {})[event.key];
    if (modifier)
        key_modifiers[modifier] = event.type === "keydown";
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
