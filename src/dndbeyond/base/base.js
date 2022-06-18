class CharacterBase {
    constructor(_type, global_settings) {
        this._name = "";
        this._type = _type;
        this._settings = null;
        this._url = window.location.href;
        this.setGlobalSettings(global_settings);
    }

    type() {
        return this._type;
    }

    getSetting(key, default_value = "", settings = null) {
        if (settings === null)
            settings = this._settings;
        const value = (settings && settings[key] !== undefined) ? settings[key] : default_value;
        return key_modifiers[`option-${key}`] ? !value : value;
    }

    getGlobalSetting(key, default_value = "") {
        return this.getSetting(key, default_value, this._global_settings);
    }

    setGlobalSettings(new_settings) {
        this._global_settings = new_settings;
        dndbeyondDiceRoller.setSettings(new_settings);
        updateRollTypeButtonClasses(this);
    }

    getDict() {
        return { "name": this._name, "type": this._type, "url": this._url }
    }
}

/**
 * Load alertify from all D&D Beyond pages, through the base file
 */
if (window.document.body.id !== "tinymce") {
    chrome.runtime.sendMessage({ "action": "load-alertify" }, initializeAlertify);
}