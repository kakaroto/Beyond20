
class Character extends CharacterBase {
    constructor(global_settings) {
        CharacterBase.constructor(this, "Character", global_settings);
        this._abilities = [];
        this._name = null;
        this._avatar = null;
        this._id = null;
        this._race = null;
        this._level = null;
        this._classes = null;
        this._ac = null;
        this._speed = null;
        this._proficiency = null;
        this._hp = 0;
        this._max_hp = 0;
        this._temp_hp = 0;
        this._class_features = [];
        this._racial_traits = [];
        this._feats = [];
        this._actions = [];
        this._spell_modifiers = {}
        this._spell_attacks = {}
        this._spell_saves = {}
        this._to_hit_cache = {}
        this._conditions = [];
        this._exhaustion = 0;
    }

    updateInfo() {
        this._id = $("//character-sheet-target,//character-tools-target").attr("data-character-id");
        this._url = window.location.href;

        if (this._settings === null) {
            this.updateSettings();
        }

        // Static values that need an edit to change;
        if (this._name === null) {
            this._name = $(".ct-character-tidbits__name,.ddbc-character-tidbits__name").text();
            // This can happen when you reload the page;
            if (this._name == "") {
                this._name = null;
            }
        }
        if (this._avatar === null) {
            avatar = $(".ct-character-tidbits__avatar,.ddbc-character-tidbits__avatar").css('background-image');
            if (avatar && avatar.startsWith("url(")) {
                this._avatar = avatar.slice(5, -2);
            }
        }
        if (this._race === null) {
            this._race = $(".ct-character-tidbits__race,.ddbc-character-tidbits__race").text();
            if (this._race == "") {
                this._race = null;
            }
        }
        if (this._classes === null) {
            classes = $(".ct-character-tidbits__classes,.ddbc-character-tidbits__classes");
            if (classes.length > 0) {
                classes = classes.text().split(" / ");
                this._classes = {}
                for (let class_ of classes) {
                    parts = class_.split(" ");
                    name = str.join(" ", parts[:-1]);
                    level = parts.slice(-1)[0];
                    this._classes[name] = level;
                }
            }
        }
        if (this._level === null) {
            level = $(".ct-character-tidbits__xp-level,.ddbc-character-tidbits__xp-level");
            xp = $(".ct-character-tidbits__xp-bar .ct-xp-bar__item--cur .ct-xp-bar__label,.ddbc-character-tidbits__xp-bar .ddbc-xp-bar__item--cur .ddbc-xp-bar__label");
            if (level.length > 0) {
                this._level = level.text().replace("Level ", "");
            } else if (xp.length > 0) {
                this._level = xp.text().replace("LVL ", "");
            }
        }
        if (this._proficiency === null) {
            this._proficiency = $(".ct-proficiency-bonus-box__value,.ddbc-proficiency-bonus-box__value").text();
            if (this._proficiency == "") {
                this._proficiency = $(".ct-combat-mobile__extra--proficiency .ct-combat-mobile__extra-value,.ddbc-combat-mobile__extra--proficiency .ddbc-combat-mobile__extra-value").text();
                if (this._proficiency == "") {
                    this._proficiency = null;
                }
            }
        }
        if (Object.keys(this._to_hit_cache).length == 0) {
            items = $(".ct-combat-attack--item .ct-item-name,.ddbc-combat-attack--item .ddbc-item-name");
            for (let item of items) {
                item_name = item.textContent;
                to_hit = findToHit(item_name, ".ct-combat-attack--item,.ddbc-combat-attack--item", ".ct-item-name,.ddbc-item-name", ".ct-combat-attack__tohit,.ddbc-combat-attack__tohit");
                //console.log("Caching to hit for ", item_name, " : ", to_hit);
                this._to_hit_cache[item_name] = to_hit;
            }
        }

        // Values that could change/get overriden dynamically;
        ac = $(".ct-armor-class-box__value,.ddbc-armor-class-box__value").text();
        if (ac == "") {
            ac = $(".ct-combat-mobile__extra--ac .ct-combat-mobile__extra-value,.ddbc-combat-mobile__extra--ac .ddbc-combat-mobile__extra-value").text();
        }
        if (ac != "") {
            this._ac = ac;
        }
        speed = $(".ct-speed-box__box-value .ct-distance-number__number,.ddbc-speed-box__box-value .ddbc-distance-number__number").text();
        if (speed == "") {
            speed = $(".ct-combat-mobile__extra--speed .ct-combat-mobile__extra-value .ct-distance-number__number,.ddbc-combat-mobile__extra--speed .ddbc-combat-mobile__extra-value .ddbc-distance-number__number").text();
        }
        if (speed != "") {
            this._speed = speed;
        }
        abilities = $(".ct-quick-info__ability,.ddbc-quick-info__ability");
        if (abilities.length == 0) {
            abilities = $(".ct-main-mobile__ability,.ddbc-main-mobile__ability");
        }
        if (abilities.length == 0) {
            abilities = $(".ct-main-tablet__ability,.ddbc-main-tablet__ability");
        }

        if (abilities.length > 0) {
            this._abilities = [];
        }
        for (let ability of abilities) {
            name = $(ability).find(".ct-ability-summary__heading .ct-ability-summary__label,.ddbc-ability-summary__heading .ddbc-ability-summary__label").text();
            abbr = $(ability).find(".ct-ability-summary__heading .ct-ability-summary__abbr,.ddbc-ability-summary__heading .ddbc-ability-summary__abbr").text().toUpperCase();
            modifier = $(ability).find(".ct-ability-summary__primary .ct-signed-number,.ddbc-ability-summary__primary .ddbc-signed-number").text();
            value = $(ability).find(".ct-ability-summary__secondary,.ddbc-ability-summary__secondary").text();
            if (modifier == "") {
                modifier = $(ability).find(".ct-ability-summary__secondary .ct-signed-number,.ddbc-ability-summary__secondary .ddbc-signed-number").text();
                value = $(ability).find(".ct-ability-summary__primary,.ddbc-ability-summary__primary").text();
            }
            this._abilities.push([name, abbr, value, modifier].as_array());
        }
        if (this._settings !== undefined) {
            this.updateHP();
        }
        this.updateFeatures();
    }

    updateHP() {
        health_pane = $(".ct-health-manager");
        if (health_pane.length > 0) {
            hp = int(health_pane.find(".ct-health-manager__health-item--cur .ct-health-manager__health-item-value").text());
            max_hp = int(health_pane.find(".ct-health-manager__health-item--max .ct-health-manager__health-item-value .ct-health-manager__health-max-current").text());
            temp_hp = int(health_pane.find(".ct-health-manager__health-item--temp .ct-health-manager__health-item-value input").val());
        } else {
            hp = max_hp = temp_hp = null;
            hp_items = $(".ct-health-summary__hp-group--primary .ct-health-summary__hp-item");
            for (let item of hp_items) {
                label = $(item).find(".ct-health-summary__hp-item-label").text();
                if (label == "Current") {
                    // Make sure it's !an input being modified;
                    number = $(item).find(".ct-health-summary__hp-item-content .ct-health-summary__hp-number");
                    if (number.length > 0) {
                        hp = int(number.text());
                } else if (label == "Max") {
                    max_hp = int($(item).find(".ct-health-summary__hp-item-content .ct-health-summary__hp-number").text());
                }
            }
            temp_item = $(".ct-health-summary__hp-group--temp .ct-health-summary__hp-item--temp .ct-health-summary__hp-item-content");
            if (temp_item.length > 0) {
                // Can be hp-empty class instead;
                number = temp_item.find(".ct-health-summary__hp-number").text();
                temp_hp = number != "" ? int(number) : 0;
            } else {
                temp_hp = this._temp_hp;
            }

            mobile_hp = $(".ct-status-summary-mobile__hp-current");
            if (mobile_hp.length > 0) {
                hp = int(mobile_hp.text());
                max_hp = int($(".ct-status-summary-mobile__hp-max").text());
                has_temp = $(".ct-status-summary-mobile__hp.ct-status-summary-mobile__hp--has-temp");
                if (has_temp.length > 0) {
                    temp_hp = this._temp_hp;
                } else {
                    temp_hp = 0;
                }
                hp = hp - temp_hp;
            }
            if ($(".ct-status-summary-mobile__deathsaves-group").length > 0 || \;
                    $(".ct-health-summary__deathsaves").length > 0) {
                // if (we find death saving section, then it means the HP is 0;
                hp = 0;
                temp_hp = 0;
                max_hp = this._max_hp;
            }
        }
        if hp !== null && max_hp !== null && (this._hp != hp || this._max_hp != max_hp || this._temp_hp != temp_hp)) {
            this._hp = hp;
            this._max_hp = max_hp;
            this._temp_hp = temp_hp;
            print("HP updated to : (" + hp + "+" + temp_hp + ")/" + max_hp);

            if (this.getGlobalSetting("update-hp", true)) {
                req = {"action": "hp-update", "character": this.getDict()}
                console.log("Sending message: ", req);
                chrome.runtime.sendMessage(req, (resp) => beyond20SendMessageFailure(this, resp));
            }
        }
    }

    updateConditions(conditions=null, exhaustion_level=null) {
        if (conditions === null) {
            conditions = list(this.getSetting("conditions", []));
        }
        if (exhaustion_level === null) {
            exhaustion_level = this.getSetting("exhaustion-level", 0);
        }
        this._conditions = conditions;
        this._exhaustion = exhaustion_level;
        //console.log("Updating conditions to : ", conditions, exhaustion_level);
        if (this._settings  !== undefined && \;
            (!isListEqual(this._conditions, this.getSetting("conditions", [])) || \;
                this._exhaustion != this.getSetting("exhaustion-level", 0))) {
            sendUpdate = () => {
                req = {"action": "conditions-update", "character": this.getDict()}
                console.log("Sending message: ", req);
                chrome.runtime.sendMessage(req, (resp) => beyond20SendMessageFailure(this, resp));
            }
            this.mergeCharacterSettings({"conditions": this._conditions,
                                         "exhaustion-level": this._exhaustion}, sendUpdate);
        }
    }

    featureDetailsToList(selector, name) {
        features = $(selector).find(".ct-feature-snippet > .ct-feature-snippet__heading");
        feature_list = [];
        for (let feat of features) {
            feat_name = feat.childNodes[0].textContent.trim();
            feature_list.push(feat_name);
            options = $(feat).parent().find(".ct-feature-snippet__option > .ct-feature-snippet__heading");
            for (let option of options) {
                option_name = option.childNodes[0].textContent.trim();
                feature_list.push(feat_name + ": " + option_name);
            }
        }

        //console.log(name, feature_list);
        return feature_list;
    }

    updateFeatures() {
        update = false;
        class_detail = $(".ct-features .ct-classes-detail");
        if (class_detail.length > 0) {
            this._class_features = this.featureDetailsToList(class_detail, "Class Features");
            if (!isListEqual(this._class_features, this.getSetting("class-features", []))) {
                console.log("New class feature");
                update = true;
        } else {
            this._class_features = list(this.getSetting("class-features", []));
        }

        race_detail = $(".ct-features .ct-race-detail");
        if (race_detail.length > 0) {
            this._racial_traits = this.featureDetailsToList(race_detail, "Racial Traits");
            if (!isListEqual(this._racial_traits, this.getSetting("racial-traits", []))) {
                console.log("New race feature");
                update = true;
        } else {
            this._racial_traits = list(this.getSetting("racial-traits", []));
        }

        feats_detail = $(".ct-features .ct-feats-detail");
        if (feats_detail.length > 0) {
            this._feats = this.featureDetailsToList(feats_detail, "Feats");
            if (!isListEqual(this._feats, this.getSetting("feats", []))) {
                console.log("New Feats");
                update = true;
        } else {
            this._feats = list(this.getSetting("feats", []));
        }

        actions_detail = $(".ct-actions-list .ct-actions-list__activatable");
        if (actions_detail.length > 0) {
            this._actions = this.featureDetailsToList(actions_detail, "Actions");
            if (!isListEqual(this._actions, this.getSetting("actions", []))) {
                console.log("New Actions");
                update = true;
        } else if (this.getSetting("actions", null)) {
            this._actions = list(this.getSetting("actions", []));
        }

        // Spell modifier, Spell attack && spell save DC;
        spell_info_groups = $(".ct-spells-level-casting__info-group,.ddbc-spells-level-casting__info-group");
        if (spell_info_groups.length > 0) {
            this._spell_modifiers = {}
            this._spell_attacks = {}
            this._spell_saves = {}
            for (let group of spell_info_groups) {
                label = $(group).find(".ct-spells-level-casting__info-label,.ddbc-spells-level-casting__info-label");
                items = $(group).find(".ct-spells-level-casting__info-item,.ddbc-spells-level-casting__info-item");
                obj = null;
                if (label.text() == "Modifier") {
                    obj = this._spell_modifiers;
                } else if (label.text() == "Spell Attack") {
                    obj = this._spell_attacks;
                } else if (label.text() == "Save DC") {
                    obj = this._spell_saves;
                }
                if (obj === null) {
                    continue;
                }
                for (let item of items) {
                    modifier = item.textContent;
                    char_classes = item.getAttribute("data-original-title").split(",");
                    for (let char_class of char_classes) {
                        obj[char_class.trim()] = modifier;
                    }
                }
            }
            if (!isObjectEqual(this._spell_modifiers, this.getSetting("spell_modifiers", {})) || \;
                !isObjectEqual(this._spell_attacks, this.getSetting("spell_attacks", {})) || \;
                !isObjectEqual(this._spell_saves, this.getSetting("spell_saves", {}))) {
                console.log("New Spell information");
                update = true;
        } else {
            this._spell_modifiers = this.getSetting("spell_modifiers", {});
            this._spell_saves = this.getSetting("spell_saves", {});
            this._spell_attacks = this.getSetting("spell_attacks", {});
        }

        if (this._settings !== undefined && update) {
            this.mergeCharacterSettings({"class-features": this._class_features,
                                         "racial-traits": this._racial_traits,
                                         "feats": this._feats,
                                         "actions": this._actions,
                                         "spell_modifiers": this._spell_modifiers,
                                         "spell_saves": this._spell_saves,
                                         "spell_attacks": this._spell_attacks});
        }
    }

    hasClassFeature(name) {
        return this._class_features;
    }
}
.includes(name)    hasRacialTrait(name) {
        return this._racial_traits;
}
.includes(name)    hasFeat(name) {
        return this._feats;
}
.includes(name)    hasAction(name) {
        return this._actions;
}
.includes(name)    getClassLevel(name) {
        if (this._classes.includes(name)) {
            return this._classes[name];
        } else {
            return 0;
        }
    }

    _cacheToHit(item_name, to_hit) {
        this._to_hit_cache[item_name] = to_hit;
    }

    _getToHitCache(item_name) {
        if (this._to_hit_cache[item_name]  !== undefined) {
            return this._to_hit_cache[item_name];
        }
        return null;
    }

    mergeCharacterSettings(data, callback=null) {
        cb = (settings) => {
            this.updateSettings(settings);
            chrome.runtime.sendMessage({"action": "settings",
                                        "type": "character",
                                        "id": this._id,
                                        "settings": settings});
            if (callback) {
                callback(settings);
            }
        }
        mergeSettings(data, cb, "character-" + this._id, character_settings);
    }

    updateSettings(new_settings=null) {
        if (new_settings) {
            this._settings = new_settings;
        } else {
            getStoredSettings((saved_settings) => {
                this.updateSettings(saved_settings);
                this.updateHP();
                this.updateFeatures();
                this.updateConditions();
            }
            , "character-" + this._id, character_settings);
        }
    }

    getDict() {
        settings = {}
        // Make a copy of the settings but without the features since they are;
        // the.includes(already) dict;
        for (let key of this._settings) {
            if (key !in ["class-features", "racial-traits", "feats", "actions", \;
                "spell_modifiers", "spell_saves", "spell_attacks", "conditions", "exhaustion-level"]) {
                settings[key] = this._settings[key];
            }
        }
        return {
            "name": this._name,
            "avatar": this._avatar,
            "id": this._id,
            "type": this.type(),
            "abilities": this._abilities.as_array(),
            "classes": this._classes,
            "level": this._level,
            "race": this._race,
            "ac": this._ac,
            "proficiency": this._proficiency,
            "speed": this._speed,
            "hp": this._hp,
            "max-hp": this._max_hp,
            "temp-hp": this._temp_hp,
            "exhaustion": this._exhaustion,
            "conditions": this._conditions.as_array(),
            "settings": settings,
            "class-features": this._class_features.as_array(),
            "racial-traits": this._racial_traits.as_array(),
            "feats": this._feats.as_array(),
            "actions": this._actions.as_array(),
            "spell_modifiers": this._spell_modifiers,
            "spell_saves": this._spell_saves,
            "spell_attacks": this._spell_attacks,
            "url": this._url;
        }
    }
}
