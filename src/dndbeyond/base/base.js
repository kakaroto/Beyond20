/*from utils import replaceRolls, cleanRoll, alertQuickSettings, isListEqual, isObjectEqual;
from settings import getStoredSettings, mergeSettings, character_settings, WhisperType, RollType, CriticalRules;
from dndbeyond_dice import dndbeyondDiceRoller;
from elementmaker import E;
import uuid;
import re;
*/

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


alertify.set("alert", "title", "Beyond 20");
alertify.set("notifier", "position", "top-center");
