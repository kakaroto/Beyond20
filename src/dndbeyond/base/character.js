
class Character extends CharacterBase {
    constructor(global_settings) {
        super("Character", global_settings);
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
        this._id = $("#character-sheet-target,#character-tools-target").attr("data-character-id");
        this._url = window.location.href;

        if (this._settings === null)
            this.updateSettings();

        // Static values that need an edit to change;
        if (this._name === null) {
            this._name = $(".ddbc-character-name").text();
            // This can happen when you reload the page;
            if (this._name == "")
                this._name = null;
        }
        if (this._avatar === null) {
            const avatar = $(".ddbc-character-avatar__portrait").css('background-image');
            if (avatar && avatar.startsWith("url("))
                this._avatar = avatar.slice(5, -2);
        }
        if (this._race === null) {
            this._race = $(".ddbc-character-summary__race").text();
            if (this._race == "")
                this._race = null;
        }
        if (this._classes === null) {
            const jClasses = $(".ddbc-character-summary__classes");
            if (jClasses.length > 0) {
                const classes = jClasses.text().split(" / ");
                this._classes = {}
                for (let class_ of classes) {
                    const parts = class_.split(" ");
                    const name = parts.slice(0, -1).join(" ");
                    const level = parts.slice(-1)[0];
                    this._classes[name] = level;
                }
            }
        }
        if (this._level === null) {
            const level = $(".ddbc-character-progression-summary__level");
            const xp = $(".ddbc-character-progression-summary__xp-bar .ddbc-xp-bar__item--cur .ddbc-xp-bar__label");
            if (level.length > 0) {
                this._level = level.text().replace("Level ", "");
            } else if (xp.length > 0) {
                this._level = xp.text().replace("LVL ", "").trim();
                if (this._level === "19") {
                    // With XP progress, a level 20 will have their XP bar from 19 to 20 with progression full, since it can't show 20->21
                    const xp_data = $(".ddbc-character-progression-summary__xp-bar .ddbc-character-progression-summary__xp-data").text();
                    if (xp_data === "355,000 / 355,000 XP") {
                        this._level = "20";
                    }
                }
            }
        }
        if (this._proficiency === null) {
            this._proficiency = $(".ct-proficiency-bonus-box__value,.ddbc-proficiency-bonus-box__value").text();
            if (this._proficiency == "") {
                this._proficiency = $(".ct-combat-mobile__extra--proficiency .ct-combat-mobile__extra-value,.ddbc-combat-mobile__extra--proficiency .ddbc-combat-mobile__extra-value").text();
                if (this._proficiency == "")
                    this._proficiency = null;
            }
        }
        if (Object.keys(this._to_hit_cache).length == 0) {
            const items = $(".ct-combat-attack--item .ct-item-name,.ddbc-combat-attack--item .ddbc-item-name");
            for (let item of items.toArray()) {
                const item_name = item.textContent;
                const to_hit = findToHit(item_name, ".ct-combat-attack--item,.ddbc-combat-attack--item", ".ct-item-name,.ddbc-item-name", ".ct-combat-attack__tohit,.ddbc-combat-attack__tohit");
                //console.log("Caching to hit for ", item_name, " : ", to_hit);
                this._to_hit_cache[item_name] = to_hit;
            }
        }
        // Values that could change/get overriden dynamically;
        let ac = $(".ct-armor-class-box__value,.ddbc-armor-class-box__value").text();
        if (ac == "")
            ac = $(".ct-combat-mobile__extra--ac .ct-combat-mobile__extra-value,.ddbc-combat-mobile__extra--ac .ddbc-combat-mobile__extra-value").text();
        if (ac != "")
            this._ac = ac;
        let speed = $(".ct-speed-box__box-value .ct-distance-number__number,.ddbc-speed-box__box-value .ddbc-distance-number__number").text();
        if (speed == "")
            speed = $(".ct-combat-mobile__extra--speed .ct-combat-mobile__extra-value .ct-distance-number__number,.ddbc-combat-mobile__extra--speed .ddbc-combat-mobile__extra-value .ddbc-distance-number__number").text();
        if (speed != "")
            this._speed = speed;
        let abilities = $(".ct-quick-info__ability,.ddbc-quick-info__ability");
        if (abilities.length == 0)
            abilities = $(".ct-main-mobile__ability,.ddbc-main-mobile__ability");
        if (abilities.length == 0)
            abilities = $(".ct-main-tablet__ability,.ddbc-main-tablet__ability");

        if (abilities.length > 0)
            this._abilities = [];
        for (let ability of abilities.toArray()) {
            const name = $(ability).find(".ct-ability-summary__heading .ct-ability-summary__label,.ddbc-ability-summary__heading .ddbc-ability-summary__label").text();
            const abbr = $(ability).find(".ct-ability-summary__heading .ct-ability-summary__abbr,.ddbc-ability-summary__heading .ddbc-ability-summary__abbr").text().toUpperCase();
            let modifier = $(ability).find(".ct-ability-summary__primary .ct-signed-number,.ddbc-ability-summary__primary .ddbc-signed-number").text();
            let value = $(ability).find(".ct-ability-summary__secondary,.ddbc-ability-summary__secondary").text();
            if (modifier == "") {
                modifier = $(ability).find(".ct-ability-summary__secondary .ct-signed-number,.ddbc-ability-summary__secondary .ddbc-signed-number").text();
                value = $(ability).find(".ct-ability-summary__primary,.ddbc-ability-summary__primary").text();
            }
            this._abilities.push([name, abbr, value, modifier]);
        }
        if (this._settings) {
            this.updateHP();
            this.updateFeatures();
        }
    }

    updateHP() {
        const health_pane = $(".ct-health-manager");
        let hp = null;
        let max_hp = null;
        let temp_hp = null;
        if (health_pane.length > 0) {
            hp = parseInt(health_pane.find(".ct-health-manager__health-item--cur .ct-health-manager__health-item-value").text());
            max_hp = parseInt(health_pane.find(".ct-health-manager__health-item--max .ct-health-manager__health-item-value .ct-health-manager__health-max-current").text());
            temp_hp = parseInt(health_pane.find(".ct-health-manager__health-item--temp .ct-health-manager__health-item-value input").val());
        } else {
            const hp_items = $(".ct-health-summary__hp-group--primary .ct-health-summary__hp-item");
            for (let item of hp_items.toArray()) {
                const label = $(item).find(".ct-health-summary__hp-item-label").text();
                if (label == "Current") {
                    // Make sure it's !an input being modified;
                    const number = $(item).find(".ct-health-summary__hp-item-content .ct-health-summary__hp-number");
                    if (number.length > 0)
                        hp = parseInt(number.text());
                } else if (label == "Max") {
                    max_hp = parseInt($(item).find(".ct-health-summary__hp-item-content .ct-health-summary__hp-number").text());
                }
            }
            const temp_item = $(".ct-health-summary__hp-group--temp .ct-health-summary__hp-item--temp .ct-health-summary__hp-item-content");
            if (temp_item.length > 0) {
                // Can be hp-empty class instead;
                temp_hp = parseInt(temp_item.find(".ct-health-summary__hp-number").text()) || 0;
            } else {
                temp_hp = this._temp_hp;
            }

            const mobile_hp = $(".ct-status-summary-mobile__hp-current");
            if (mobile_hp.length > 0) {
                hp = parseInt(mobile_hp.text());
                max_hp = parseInt($(".ct-status-summary-mobile__hp-max").text());
                const has_temp = $(".ct-status-summary-mobile__hp.ct-status-summary-mobile__hp--has-temp");
                if (has_temp.length > 0)
                    temp_hp = this._temp_hp;
                else
                    temp_hp = 0;
                hp = hp - temp_hp;
            }
            if ($(".ct-status-summary-mobile__deathsaves-group").length > 0 ||
                $(".ct-health-summary__deathsaves").length > 0) {
                // if (we find death saving section, then it means the HP is 0;
                hp = 0;
                temp_hp = 0;
                max_hp = this._max_hp;
            }
        }
        if (hp !== null && max_hp !== null && (this._hp != hp || this._max_hp != max_hp || this._temp_hp != temp_hp)) {
            this._hp = hp;
            this._max_hp = max_hp;
            this._temp_hp = temp_hp;
            console.log("HP updated to : (" + hp + "+" + temp_hp + ")/" + max_hp);

            if (this.getGlobalSetting("update-hp", true)) {
                const req = { "action": "hp-update", "character": this.getDict() }
                console.log("Sending message: ", req);
                chrome.runtime.sendMessage(req, (resp) => beyond20SendMessageFailure(this, resp));
            }
        }
    }

    updateConditions(conditions = null, exhaustion_level = null) {
        if (conditions === null)
            conditions = this.getSetting("conditions", []);
        if (exhaustion_level === null)
            exhaustion_level = this.getSetting("exhaustion-level", 0);

        this._conditions = conditions;
        this._exhaustion = exhaustion_level;
        //console.log("Updating conditions to : ", conditions, exhaustion_level);
        if (this._settings &&
            (!isListEqual(this._conditions, this.getSetting("conditions", [])) ||
                this._exhaustion != this.getSetting("exhaustion-level", 0))) {
            this.mergeCharacterSettings({
                "conditions": this._conditions,
                "exhaustion-level": this._exhaustion
            }, () => {
                const req = { "action": "conditions-update", "character": this.getDict() }
                console.log("Sending message: ", req);
                chrome.runtime.sendMessage(req, (resp) => beyond20SendMessageFailure(this, resp));
            });
        }
    }

    featureDetailsToList(selector, name) {
        const features = $(selector).find(".ct-feature-snippet > .ct-feature-snippet__heading");
        const feature_list = [];
        for (let feat of features.toArray()) {
            const feat_name = feat.childNodes[0].textContent.trim();
            feature_list.push(feat_name);
            const options = $(feat).parent().find(".ct-feature-snippet__option > .ct-feature-snippet__heading");
            for (let option of options.toArray()) {
                const option_name = option.childNodes[0].textContent.trim();
                feature_list.push(feat_name + ": " + option_name);
            }
        }

        //console.log(name, feature_list);
        return feature_list;
    }

    updateFeatures() {
        let update = false;
        // Use classes instead of level because using XP method, you could reach the higher level before you level up
        const last_classes = this.getSetting("last-features-classes", "");
        const current_classes = $(".ddbc-character-summary__classes").text();
        let updated_features_list = false;
        const class_detail = $(".ct-features .ct-classes-detail");
        if (class_detail.length > 0) {
            updated_features_list = true;
            this._class_features = this.featureDetailsToList(class_detail, "Class Features");
            if (!isListEqual(this._class_features, this.getSetting("class-features", []))) {
                console.log("New class feature");
                update = true;
            }
        } else {
            this._class_features = this.getSetting("class-features", []);
        }

        const race_detail = $(".ct-features .ct-race-detail");
        if (race_detail.length > 0) {
            this._racial_traits = this.featureDetailsToList(race_detail, "Racial Traits");
            if (!isListEqual(this._racial_traits, this.getSetting("racial-traits", []))) {
                console.log("New race feature");
                update = true;
            }
        } else {
            this._racial_traits = this.getSetting("racial-traits", []);
        }

        const feats_detail = $(".ct-features .ct-feats-detail");
        if (feats_detail.length > 0) {
            this._feats = this.featureDetailsToList(feats_detail, "Feats");
            if (!isListEqual(this._feats, this.getSetting("feats", []))) {
                console.log("New Feats");
                update = true;
            }
        } else {
            this._feats = this.getSetting("feats", []);
        }

        const actions_detail = $(".ct-actions-list .ct-actions-list__activatable");
        if (actions_detail.length > 0) {
            this._actions = this.featureDetailsToList(actions_detail, "Actions");
            if (!isListEqual(this._actions, this.getSetting("actions", []))) {
                console.log("New Actions");
                update = true;
            }
        } else if (this.getSetting("actions", null)) {
            this._actions = this.getSetting("actions", []);
        }

        // Spell modifier, Spell attack && spell save DC;
        const spell_info_groups = $(".ct-spells-level-casting__info-group,.ddbc-spells-level-casting__info-group");
        if (spell_info_groups.length > 0) {
            this._spell_modifiers = {}
            this._spell_attacks = {}
            this._spell_saves = {}
            for (let group of spell_info_groups.toArray()) {
                const label = $(group).find(".ct-spells-level-casting__info-label,.ddbc-spells-level-casting__info-label");
                const items = $(group).find(".ct-spells-level-casting__info-item,.ddbc-spells-level-casting__info-item");
                let obj = null;
                if (label.text() == "Modifier") {
                    obj = this._spell_modifiers;
                } else if (label.text() == "Spell Attack") {
                    obj = this._spell_attacks;
                } else if (label.text() == "Save DC") {
                    obj = this._spell_saves;
                }
                if (obj === null)
                    continue;
                for (let item of items.toArray()) {
                    const modifier = item.textContent;
                    const char_classes = item.getAttribute("data-original-title").split(",");
                    for (let char_class of char_classes)
                        obj[char_class.trim()] = modifier;
                }
            }
            if (!isObjectEqual(this._spell_modifiers, this.getSetting("spell_modifiers", {})) ||
                !isObjectEqual(this._spell_attacks, this.getSetting("spell_attacks", {})) ||
                !isObjectEqual(this._spell_saves, this.getSetting("spell_saves", {}))) {
                console.log("New Spell information");
                update = true;
            }
        } else {
            this._spell_modifiers = this.getSetting("spell_modifiers", {});
            this._spell_saves = this.getSetting("spell_saves", {});
            this._spell_attacks = this.getSetting("spell_attacks", {});
        }
        if (updated_features_list && last_classes !== current_classes) {
            update = true;
        }
        this._features_needs_refresh = current_classes && !updated_features_list && last_classes !== current_classes;

        if (this._settings && update) {
            this.mergeCharacterSettings({
                "class-features": this._class_features,
                "racial-traits": this._racial_traits,
                "feats": this._feats,
                "actions": this._actions,
                "spell_modifiers": this._spell_modifiers,
                "spell_saves": this._spell_saves,
                "spell_attacks": this._spell_attacks,
                "last-features-classes": updated_features_list ? current_classes : last_classes
            });
        }
    }

    hasClassFeature(name, substring=false) {
        if (substring) return this._class_features.some(f => f.includes(name));
        else return this._class_features.includes(name);
    }
    hasRacialTrait(name, substring=false) {
        if (substring) return this._racial_traits.some(f => f.includes(name));
        else return this._racial_traits.includes(name);
    }
    hasFeat(name, substring=false) {
        if (substring) return this._feats.some(f => f.includes(name));
        else return this._feats.includes(name);
    }
    hasAction(name, substring=false) {
        if (substring) return this._actions.some(f => f.includes(name));
        else return this._actions.includes(name);
    }
    getClassLevel(name) {
        return this._classes[name] || 0;
    }
    hasClass(name) {
        return this._classes[name] !== undefined;
    }
    getAbility(abbr) {
        const ability = this._abilities.find(abi => abi[1] === abbr);
        if (!ability) return {score: 0, mod: 0};
        return {score: parseInt(ability[2]), mod: parseInt(ability[3])}
    }

    _cacheToHit(item_name, to_hit) {
        this._to_hit_cache[item_name] = to_hit;
    }

    _getToHitCache(item_name) {
        return this._to_hit_cache[item_name] || null;
    }

    mergeCharacterSettings(data, callback = null) {
        const cb = (settings) => {
            chrome.runtime.sendMessage({
                "action": "settings",
                "type": "character",
                "id": this._id,
                "settings": settings
            });
            if (callback)
                callback(settings);
        }
        for (let k in data) {
            this._settings[k] = data[k];
        }
        mergeSettings(data, cb, "character-" + this._id, character_settings);
    }

    updateSettings(new_settings = null) {
        if (new_settings) {
            this._settings = new_settings;
        } else {
            getStoredSettings((saved_settings) => {
                this.updateSettings(saved_settings);
                this.updateHP();
                this.updateFeatures();
                this.updateConditions();
            }, "character-" + this._id, character_settings);
        }
    }

    getDict() {
        const settings = {}
        // Make a copy of the settings but without the features since they are;
        // the.includes(already) dict;
        for (let key in this._settings) {
            if (!["class-features", "racial-traits", "feats", "actions",
                "spell_modifiers", "spell_saves", "spell_attacks",
                "conditions", "exhaustion-level"].includes(key))
                settings[key] = this._settings[key];
        }
        return {
            "name": this._name,
            "avatar": this._avatar,
            "id": this._id,
            "type": this.type(),
            "abilities": this._abilities,
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
            "conditions": this._conditions,
            "settings": settings,
            "class-features": this._class_features,
            "racial-traits": this._racial_traits,
            "feats": this._feats,
            "actions": this._actions,
            "spell_modifiers": this._spell_modifiers,
            "spell_saves": this._spell_saves,
            "spell_attacks": this._spell_attacks,
            "url": this._url
        }
    }
}
