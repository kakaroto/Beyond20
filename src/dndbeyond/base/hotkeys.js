
const key_modifiers = {"alt": false, "ctrl": false, "shift": false}
checkKeyModifiers = (event) => {
    if (event.originalEvent.repeat) return;
    needsUpdate = Object.values(key_modifiers).some((v) => v);
    key_modifiers.ctrl = event.ctrlKey || event.metaKey;
    key_modifiers.shift = event.shiftKey;
    key_modifiers.alt = event.altKey;
    needsUpdate = needsUpdate || Object.values(key_modifiers).some((v) => v);
    if (needsUpdate)
        updateRollTypeButtonClasses();
}
resetKeyModifiers = (event) => {
    needsUpdate = Object.values(key_modifiers).some((v) => v);
    key_modifiers.ctrl = false;
    key_modifiers.shift = false;
    key_modifiers.alt = false;
    if (needsUpdate)
        updateRollTypeButtonClasses();
}
$(window).keydown(checkKeyModifiers).keyup(checkKeyModifiers).blur(resetKeyModifiers);
