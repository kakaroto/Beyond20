
const key_modifiers = {
    advantage: false,
    disadvantage: false,
    super_advantage: false,
    super_disadvantage: false,
    normal_roll: false
};

const handleKeyModifierEvent = (event) => {
    handleKeyModifier(event.type, event.key, event.code, event.originalEvent.repeat);
}

function handleKeyModifier(etype, key, code, repeat) {
    if (repeat) return;

    const oldValue = key_modifiers.advantage << 0 | key_modifiers.disadvantage << 1 |
                     key_modifiers.normal_roll << 2 | key_modifiers.super_advantage << 3 |
                     key_modifiers.super_disadvantage << 4;
    const modifier = (key_bindings || {})[code] || (key_bindings || {})[key];
    if (modifier) {
        if (settings['sticky-hotkeys']) {
            if (etype !== "keydown") return;
            // Save value before we reset all to false
            const new_value = !key_modifiers[modifier];
            // Need to reset roll adv/dis modifiers if another is toggled.
            const roll_types = ["advantage", "disadvantage", "normal_roll", "super_advantage", "super_disadvantage"];
            if (roll_types.includes(modifier)) {
                roll_types.forEach(type => key_modifiers[type] = false);
            }
            key_modifiers[modifier] = new_value;
        } else {
            key_modifiers[modifier] = etype === "keydown";
        }
        updateHotkeysList();
    }
    const newValue = key_modifiers.advantage << 0 | key_modifiers.disadvantage << 1 |
                        key_modifiers.normal_roll << 2 | key_modifiers.super_advantage << 3 |
                        key_modifiers.super_disadvantage << 4;;

    if (oldValue !== newValue)
        updateRollTypeButtonClasses();
}

const resetKeyModifiers = (event) => {
    const needsUpdate = key_modifiers.advantage << 0 | key_modifiers.disadvantage << 1 |
                        key_modifiers.normal_roll << 2 | key_modifiers.super_advantage << 3 |
                        key_modifiers.super_disadvantage << 4;
    for (const key in key_modifiers)
        key_modifiers[key] = false;
    if (needsUpdate)
        updateRollTypeButtonClasses();
    updateHotkeysList();
}


function updateHotkeysList(popup) {
    // Ensure it runs only on pages with the hotkeys popup
    popup = popup || $(".beyond20-hotkeys-list");
    if (!popup) return;
    let hotkeys_enabled = false;
    const bindings = settings['hotkeys-bindings'];
    const roll_types = {"disadvantage": "", "normal_roll": "", "advantage": ""};
    // for adv/dis/norm, set up a special way to display them.
    const roll_types_span = [];
    const hotkeys_list = [];
    for (const key in bindings){
        const binding = bindings[key];
        if (!binding) continue;
        if (key_modifiers[binding])
            hotkeys_enabled = true;
        if (roll_types[binding] !== undefined) {
            roll_types[binding] = key;
        } else {
            let binding_name = BINDING_NAMES[binding] || binding;
            if (binding_name.startsWith("option-") && character_settings[binding_name.slice("option-".length)]) {
                binding_name = character_settings[binding_name.slice("option-".length)].title;
            }
            // Limit the text to 32 characters
            if (binding_name.length > 32)
                binding_name = binding_name.substring(0, 31) + "…";
            hotkeys_list.push(E.li({class: 'beyond20-hotkey-toggle', "data-key": key, "data-modifier": binding},
                binding_name,
                E.span({class: 'beyond20-hotkey-checkmark'}, key_modifiers[binding] && "✔" || "")));
        }
    }
    if (roll_types['disadvantage']) {
        roll_types_span.push(E.span({
            class: "beyond20-hotkey-toggle " + (key_modifiers['disadvantage'] ? "beyond20-hotkey-enabled" : ""),
            "data-key": roll_types['disadvantage'],
            "data-modifier": 'disadvantage',
            style: "float: left;"
        }, "Disadvantage"));
    }
    if (roll_types['normal_roll']) {
        roll_types_span.push(E.span({
            class: "beyond20-hotkey-toggle " + (key_modifiers['normal_roll'] ? "beyond20-hotkey-enabled" : ""),
            "data-key": roll_types['normal_roll'],
            "data-modifier": 'normal_roll'
        }, "Normal"));
    } else {
        // This prevents <hr/> from breaking due to adv/disadv being floats
        roll_types_span.push($('<span>&nbsp;</span>')[0]);
    }
    if (roll_types['advantage']) {
        roll_types_span.push(E.span({
            class: "beyond20-hotkey-toggle " + (key_modifiers['advantage'] ? "beyond20-hotkey-enabled" : ""),
            "data-key": roll_types['advantage'],
            "data-modifier": 'advantage',
            style: "float: right;"
        }, "Advantage"))
    }
    const manage_button = E.a({href: "#"}, E.span({class: "ddbc-manage-icon__icon beyond20-manage-hotkeys"}))
    roll_types_span.push(manage_button);

    if (hotkeys_enabled){
        $('.ct-beyond20-settings-button').addClass('beyond20-button-has-hotkeys');
    } else {
        $('.ct-beyond20-settings-button').removeClass('beyond20-button-has-hotkeys');
    }
    popup.html(E.div({}, E.div({class: "beyond20-hotkeys-roll-types"}, ...roll_types_span), E.hr({}), E.ul({}, ...hotkeys_list)));
    popup.off('click', '.beyond20-hotkey-toggle'); //this removes all instances of this listener
    popup.on('click', '.beyond20-hotkey-toggle', function () {
        const key = this.dataset.key;
        // Set the event to be keydown or keyup based on whether we have sticky or not and if the hotkey is pressed
        const keydown = settings['sticky-hotkeys'] || !key_modifiers[this.dataset.modifier];
        handleKeyModifier(keydown ? 'keydown' : 'keyup', key, false);
    });
    $(manage_button).click(async ev => {
        ev.preventDefault();
        ev.stopPropagation();
        const new_bindings = await promptHotkeyManager();
        mergeSettings({"hotkeys-bindings": new_bindings}, (newSettings) => {
            settings = newSettings;
            chrome.runtime.sendMessage({ "action": "settings", "type": "general", "settings": settings });
        });
        updateHotkeysList(popup);
    });
}

$(window).keydown(handleKeyModifierEvent).keyup(handleKeyModifierEvent).blur(resetKeyModifiers);
