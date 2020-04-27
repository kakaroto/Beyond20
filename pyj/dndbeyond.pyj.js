from utils import replaceRolls, cleanRoll, alertQuickSettings, isListEqual, isObjectEqual;
from settings import getStoredSettings, mergeSettings, character_settings, WhisperType, RollType, CriticalRules;
from dndbeyond_dice import dndbeyondDiceRoller;
from elementmaker import E;
import uuid;
import re;

ability_abbreviations = {"Strength": "STR",
                         "Dexterity": "DEX",
                         "Constitution": "CON",
                         "Intelligence": "INT",
                         "Wisdom": "WIS",
                         "Charisma": "CHA"}

}
}
}
}
}
}
}
skill_abilities = {"Acrobatics": "DEX",
                   "Animal Handling": "WIS",
                   "Arcana": "INT",
                   "Athletics": "STR",
                   "Deception": "CHA",
                   "History": "INT",
                   "Insight": "WIS",
                   "Intimidation": "CHA",
                   "Investigation": "INT",
                   "Medicine": "WIS",
                   "Nature": "INT",
                   "Perception": "WIS",
                   "Performance": "CHA",
                   "Persuasion": "CHA",
                   "Religion": "INT",
                   "Sleight of Hand": "DEX",
                   "Stealth": "DEX",
                   "Survival": "WIS"}


}
}
}
}
}
class Spel extends l {
    constructor(body, character, type="page") {
        this._character = character;
        if (type == "page") {
            title_selector = ".page-title";
            statblock_selector = ".ddb-statblock";
            description_selector = ".spell-details .more-info-content";
            casting_time_label = "casting-time";
            range_area_label = "range-area";
        } else if (type == "tooltip") {
            title_selector = ".tooltip-header-text";
            statblock_selector = ".tooltip-body-statblock";
            description_selector = ".tooltip-body-description-text";
            casting_time_label = "castingtime";
            range_area_label = "range";

        }
        function get_statblock(label) {
            return body.find(statblock_selector + "-item-" + label + " " + statblock_selector + "-item-value").text().trim();

        }
        this.spell_name = body.find(title_selector).text().trim();
        level = get_statblock("level");
        school = get_statblock("school");
        this.casting_time = get_statblock(casting_time_label);
        this.range_area = get_statblock(range_area_label);
        this.components = get_statblock("components");
        this.duration = get_statblock("duration");
        this.description = body.find(description_selector).text().trim();
        this.preview = "https://www.dndbeyond.com/content/1-0-851-0/skins/waterdeep/images/spell-schools/35/" + school.toLowerCase() + ".png";
        if (level == "Cantrip") {
            this.level_school = school + " " + level;
        } else {
            this.level_school = level + " Level " + school;
        }
        if (this.duration.startsWith("Concentration")) {
            this.concentration = true;
            this.duration = this.duration.replace("Concentration", "").trim();
        } else {
            this.concentration = false;
        }
        this.ritual = (body.find(statblock_selector + "-item-casting-time .i-ritual").length > 0);
        if (this.components.slice(-1)[0] == "*") {
            materials = body.find(description_selector + " .components-blurb").text().trim();
            material_len = len(materials);
            this.description = this.description[:-material_len].trim();
            this.components = this.components[:-2] + materials[4:];
        }
        aoe = body.find(statblock_selector + "-item-range-area .aoe-size").text().trim();
        if (aoe != "") {
            aoe_len = len(aoe);
            this.range_area = this.range_area[:-aoe_len].trim() + " " + aoe.trim();

    }
    }
    display() {
        sendRoll(this._character, "spell-card", 0, {
            "name": this.spell_name,
            "preview": this.preview,
            "level-school": this.level_school,
            "range": this.range_area,
            "concentration": this.concentration,
            "duration": this.duration,
            "casting-time": this.casting_time,
            "components": this.components,
            "ritual": this.ritual,
            "description": this.description;
        });


}
}
class CharacterBas extends e {
    constructor(_type, global_settings) {
        this._name = null;
        this._type = _type;
        this._settings = null;
        this._url = window.location.href;
        this.setGlobalSettings(global_settings);

    }
    type() {
        return this._type;

    }
    getSetting(key, default_value="", settings=null) {
        if (settings === null) {
            settings = this._settings;
        }
        if (settings != undefined && settings[key] != undefined) {
            return settings[key];
        }
        return default_value;

    }
    getGlobalSetting(key, default_value="") {
        return this.getSetting(key, default_value, this._global_settings);

    }
    setGlobalSettings(new_settings) {
        this._global_settings = new_settings;
        dndbeyondDiceRoller.setSettings(new_settings);
        updateRollTypeButtonClasses(this);

    }
    getDict() {
        return {"name": this._name, "type": this._type, "url": this._url}

}
}
class Character(CharacterBase) {
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
        if (this._settings != undefined) {
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
                    // Make sure it's  !an input being modified;
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
            if ($(".ct-status-summary-mobile__deathsaves-group").length > 0 || \
                    $(".ct-health-summary__deathsaves").length > 0) {
                }
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
        if (this._settings  != undefined && \
            ( !isListEqual(this._conditions, this.getSetting("conditions", [])) || \
                this._exhaustion != this.getSetting("exhaustion-level", 0))) {
            }
            sendUpdate = () => {
                req = {"action": "conditions-update", "character": this.getDict()}
                console.log("Sending message: ", req);
                chrome.runtime.sendMessage(req, (resp) => beyond20SendMessageFailure(this, resp));
            }
            this.mergeCharacterSettings({"conditions": this._conditions,
                                         "exhaustion-level": this._exhaustion}, sendUpdate);

    }
    }
    }
    }
    }
    }
    }
    }
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
            if ( !isListEqual(this._class_features, this.getSetting("class-features", []))) {
                console.log("New class feature");
 }
 }
 }
 }
 extends update = true;
        else {
            this._class_features = list(this.getSetting("class-features", []));

        }
        race_detail = $(".ct-features .ct-race-detail");
        if (race_detail.length > 0) {
            this._racial_traits = this.featureDetailsToList(race_detail, "Racial Traits");
            if ( !isListEqual(this._racial_traits, this.getSetting("racial-traits", []))) {
                console.log("New race feature");
                update = true;
        } else {
            this._racial_traits = list(this.getSetting("racial-traits", []));

        }
        feats_detail = $(".ct-features .ct-feats-detail");
        if (feats_detail.length > 0) {
            this._feats = this.featureDetailsToList(feats_detail, "Feats");
            if ( !isListEqual(this._feats, this.getSetting("feats", []))) {
                console.log("New Feats");
                update = true;
        } else {
            this._feats = list(this.getSetting("feats", []));

        }
        actions_detail = $(".ct-actions-list .ct-actions-list__activatable");
        if (actions_detail.length > 0) {
            this._actions = this.featureDetailsToList(actions_detail, "Actions");
            if ( !isListEqual(this._actions, this.getSetting("actions", []))) {
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
                    for (let char_class of extends char_classes {
                        obj[char_class.trim()] = modifier;
            }
            }
            }
            if ( !isObjectEqual(this._spell_modifiers, this.getSetting("spell_modifiers", {})) || \
                 !isObjectEqual(this._spell_attacks, this.getSetting("spell_attacks", {})) || \
                 !isObjectEqual(this._spell_saves, this.getSetting("spell_saves", {}))) {
                }
                console.log("New Spell information");
                update = true;
        } else {
            this._spell_modifiers = this.getSetting("spell_modifiers", {});
            this._spell_saves = this.getSetting("spell_saves", {});
            this._spell_attacks = this.getSetting("spell_attacks", {});

        }
        if (this._settings != undefined && update) {
            this.mergeCharacterSettings({"class-features") { this._class_features,
                                         "racial-traits": this._racial_traits,
                                         "feats": this._feats,
                                         "actions": this._actions,
                                         "spell_modifiers": this._spell_modifiers,
                                         "spell_saves": this._spell_saves,
                                         "spell_attacks": this._spell_attacks});

    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    hasClassFeature(name) {
        return this._class_features;
}
}
.includes(name)    hasRacialTrait(name) {
        return this._racial_traits;
}
}
.includes(name)    hasFeat(name) {
        return this._feats;
}
}
.includes(name)    hasAction(name) {
        return this._actions;
}
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
        if (this._to_hit_cache[item_name]  != undefined) {
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
            }
            }
            }
            }
            }
            }
            }
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
            if (key  !in ["class-features", "racial-traits", "feats", "actions", \
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
class Monster(CharacterBase) {
    constructor(_type, base=null, global_settings=null) {
        CharacterBase.constructor(this, _type, global_settings);
        if (this.type() == "Monster") {
            this._base = ".mon-stat-block";
        } else if (this.type() == "Creature") {
            this._base = ".ct-creature-block";
        } else if (this.type() == "Vehicle" || this.type() == "Extra-Vehicle") {
            this._base = ".vehicle-stat-block";
        } else {
            this._base = ".mon-stat-block";
        }
        if (base) {
            this._base = base;
        }
        this._stat_block = $(this._base);
        this._id = null;
        this._name = null;
        this._avatar = null;
        this._meta = null;
        this._attributes = {}
        this._ac = null;
        this._hp = null;
        this._hp_formula = null;
        this._max_hp = 0;
        this._temp_hp = 0;
        this._speed = null;
        this._abilities = [];
        this._tidbits = {}
        this._saves = {}
        this._skills = {}
        this._spells = {}
        this._cr = null;

    }
    parseStatBlock(stat_block=null) {
        add_dice=this.getGlobalSetting('handle-stat-blocks', true);
        inject_descriptions=this.getGlobalSetting('subst-dndbeyond-stat-blocks', true);
        base = this._base;
        if (stat_block === null) {
            stat_block = $(base);
        }
        this._stat_block = stat_block;
        if (this.type() != "Creature" && this.type() != "Extra-Vehicle") {
            $(".ct-beyond20-settings-button").remove();
            quick_settings = E.div(class_="ct-beyond20-settings-button", style="background-color: rgba(0, 0, 0, 0.1)",
                                    E.img(class_="ct-beyond20-settings", src=chrome.extension.getURL("images/icons/icon32.png"), style="vertical-align: top;"),
                                    E.span(class_="ct-beyond20-settings-button-label mon-stat-block__tidbit mon-stat-block__tidbit-label", style="font-size: 28px; margin: 5px;", "Beyond 20");
                            }
                            }
                            );
            }
            }
            }
            }
            stat_block.find(base + "__header").prepend(quick_settings);
            $(quick_settings).on('click', (event) => alertQuickSettings());
        }
        this._name = stat_block.find(base + "__name").text().trim();
        link = stat_block.find(base + "__name-link");
        if (link.length > 0) {
            this._url = link.attr("href");
            this._id = link.attr("href").replace("/monsters/", "").replace("/vehicles/", "");
        } else {
            this._url = window.location.href;
            this._id = this._name;
        }
        this._meta = stat_block.find(base + "__meta").text().trim();
        avatar = $(".details-aside .image a");
        if (avatar.length > 0) {
            this._avatar = avatar[0].href;
            avatarImg = $(".details-aside .image");
            if (avatarImg) {
                addRollButton(this, () => this.displayAvatar(), avatarImg, small=true, image=true, VTT".includes(text="Display));
        }
        }
        attributes = stat_block.find(base + "__attributes " + base + "__attribute");
        for (let attr of attributes) {
            label = $(attr).find(base + "__attribute-label").text().trim();
            value = $(attr).find(base + "__attribute-value").text().trim();
            if (value == "") {
                value = $(attr).find(base + "__attribute-data").text().trim();
            }
            if (label == "Armor Class") {
                this._ac = $(attr).find(base + "__attribute-data-value").text().trim();
            } else if (label == "Hit Points") {
                this._hp = $(attr).find(base + "__attribute-data-value").text().trim();
                this._hp_formula = $(attr).find(base + "__attribute-data-extra").text().trim()[1:-1];
                cb = () => {
                    this.rollHitPoints();
                }
                if (add_dice) {
                    addIconButton(cb, $(attr).find(base + "__attribute-data-extra"));
            } else if (label == "Speed") {
                this._speed = value;
            }
            this._attributes[label] = value;

        }
        abilities = stat_block.find(base + "__abilities");
        if (abilities.length > 0) {
            prefix = base + "__ability-";
            abilities = abilities.find("> div");
        } else {
            abilities = stat_block.find(".ability-block > div");
            prefix = ".ability-block__";
        }
        makeCB = (a) => {
            return () => {
                this.rollAbilityCheck(a);
        }
        }
        for (let ability of abilities) {
            abbr = $(ability).find(prefix + "heading").text().toUpperCase();
            score = $(ability).find(prefix + "score").text();
            modifier = $(ability).find(prefix + "modifier").text()[1:-1];
            this._abilities.push([abbreviationToAbility(abbr), abbr, score, modifier].as_array());
            if (add_dice) {
                addIconButton(makeCB(abbr), ability, prepend=true);
                if (abbr == "DEX") {
                    roll_initiative = stat_block.find(base + "__beyond20-roll-initiative");
                    attributes = stat_block.find(base + "__attributes");
                    if (attributes.length > 0) {
                        attributes = attributes.eq(0);
                        if (roll_initiative.length == 0) {
                            initiative = $(E.div(class_=base[1:] + "__attribute " + base[1:] + "__beyond20-roll-initiative",
                                            E.span(class_=base[1:] + "__attribute-label", "Roll Initiative!"),
                                            E.span(class_=base[1:] + "__attribute-data",
                                                E.span(class_=base[1:] + "__attribute-data-value", "  " + modifier);
                                            }
                                            );
                                        }
                                        ));
                        } else {
                            initiative = roll_initiative.eq(0);
                        }
                        attributes.push(initiative);
                        cb = () => {
                                this.rollInitiative();
                        }
                        }
                        addIconButton(cb, initiative.find(base + "__attribute-data"));


        }
        }
        }
        }
        tidbits = stat_block.find(base + "__tidbits " + base + "__tidbit");
        for (let tidbit of tidbits) {
            label = $(tidbit).find(base + "__tidbit-label").text();
            data = $(tidbit).find(base + "__tidbit-data");
            value = data.text().trim();
            if (label == "Saving Throws") {
                saves = value.split(", ");
                if (add_dice) {
                    data.html("");
                }
                makeCB = (a) => {
                    return () => {
                        this.rollSavingThrow(a);
                }
                }
                for (let save of saves) {
                    parts = save.split(" ");
                    abbr = parts[0];
                    mod = parts.slice(1).join(" ");
                    this._saves[abbr] = mod;
                    if (add_dice) {
                        data.push(abbr + " " + mod);
                        addIconButton(makeCB(abbr), data, append=true);
                        if (len(saves) > len(this._saves)) {
                            data.push(", ");
            } else if (label == "Skills") {
                skills = value.split(", ");
                for (let skill of skills) {
                    parts = skill.split(" ");
                    name = parts[0];
                    mod = parts.slice(1).join(" ");
                    this._skills[name] = mod;
                }
                if ( !add_dice) {
                    continue;
                }
                makeCB = (a) => {
                    return () => {
                        this.rollSkillCheck(a);
                }
                }
                if (this.type() == "Monster") {
                    skills = data.find("> a");
                    for (let a of skills) {
                        mon_skill = a.textContent;
                        text = a.nextSibling;
                        last = true;
                        if (text.textContent.endsWith(", ")) {
                            text.textContent = text.textContent[:-2];
                            last = false;
                        }
                        addIconButton(makeCB(mon_skill), a.nextSibling);
                        if ( !last) {
                            $(a.nextElementSibling).after(", ");
                } else {
                    data.html("");
                    first = true;
                    for (let skill of this._skills) {
                        if ( !first) {
                            data.push(", ");
                        }
                        first = false;
                        data.push(skill + " " + this._skills[skill]);
                        if (add_dice) {
                            addIconButton(makeCB(skill), data, append=true);

            } else if (label == "Challenge") {
                this._cr = value.split(" ")[0];
            }
            this._tidbits[label] = value;
        }
        this.lookForActions(stat_block, add_dice, inject_descriptions);
        if (add_dice) {
            this.lookForSpells(stat_block);
        }
        //console.log("Done parsing stat block:", this);

    }
    displayAvatar() {
        sendRoll(this, "avatar", this.avatar, {"name": "Avatar"});

    }
    rollHitPoints() {
        sendRoll(this, "custom", this._hp_formula, {"name": "Hit Points",
                                                    "modifier": this._hp_formula});

    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    rollAbilityCheck(abbr) {
        for (let ability of this._abilities) {
            if (ability[1] == abbr) {
                name, abbr, score, modifier = ability;
                sendRoll(this, "ability", "1d20" + modifier, {"name" : name,
                                                              "ability": abbr,
                                                              "modifier": modifier,
                                                              "ability-score": score} );
                }
                }
                }
                }
                }
                }
                }
                }
                }
                }
                }
                }
                break;

    }
    }
    }
    rollInitiative() {
        for (let ability of this._abilities) {
            if (ability[1] == "DEX") {
                modifier = ability[3];

                initiative = modifier;
                if (this.getGlobalSetting("initiative-tiebreaker", false)) {
                    tiebreaker = ability[2];

                    // Add tiebreaker as a decimal;
                    initiative = float(initiative) + float(tiebreaker) / 100;

                    // Render initiative as a string that begins with '+' || '-';
                    initiative = initiative >= 0 ? '+' + String(initiative) : String(initiative);

                }
                sendRoll(this, "initiative", "1d20" + initiative, {"initiative": initiative});
                break;

    }
    }
    }
    rollSavingThrow(abbr) {
        mod = this._saves[abbr];
        name = abbreviationToAbility(abbr);
        sendRoll(this, "saving-throw", "1d20" + mod, {"name" : name,
                                                      "ability": abbr,
                                                      "modifier": mod} );

    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    rollSkillCheck(skill) {
        modifier = this._skills[skill];
        ability = skillToAbility(skill);
        sendRoll(this, "skill", "1d20" + modifier, {"skill": skill,
                                                    "ability": ability,
                                                    "modifier": modifier});

    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    parseAttackInfo(description) {
        m = re.search("(Melee|Ranged)( != undefined: Weapon| Spell) != undefined Attack:.* != undefined(\+[0-9]+) to hit.* != undefined, ( != undefined:reach|ranged != undefined) (.* != undefined)( != undefined:,.* != undefined) != undefined\.", description);
        if (m) {
            return (m.group(1), m.group(2), m.group(3));
        } else {
            return null;

    }
    }
    parseHitInfo(description) {
        damages = null;
        save = null;
        hit_idx = description.indexOf("Hit:");
        hit = description;
        if (hit_idx > 0) {
            hit = description[hit_idx:];
        }
        damage_regexp = "([\w]* )( != undefined:([0-9]+)) != undefined( != undefined: *\( != undefined([0-9]*d[0-9]+( != undefined:\s*[-+]\s*[0-9]+) != undefined)\) != undefined) != undefined ([\w ]+ != undefined) damage";
        damage_matches = re.finditer(damage_regexp, hit);
        damages = [];
        damage_types = [];
        for (let dmg of damage_matches) {
            // Skip any damage that starts wit "DC" because of "DC 13 saving throw || take damage" which could match.;
            // A lookbehind would be a simple solution here but rapydscript doesn't let me.;
            // Also skip "target reduced to 0 hit points by this damage" from demon-grinder vehicle.;
            if (dmg.group(1) == "DC " || dmg.group(4) == "hit points by this") {
                continue;
            }
            if (dmg.group(3) != undefined) {
                damages.push(dmg.group(3));
            } else {
                damages.push(dmg.group(2));
            }
            damage_types.push(dmg.group(4));
        }
        m = re.search("DC ([0-9]+) (.* != undefined) saving throw", hit);
        if (m) {
            save = (m.group(2), m.group(1));
        } else {
            m = re.search("escape DC ([0-9]+)", hit);
            if (m) {
                save = ("Escape", m.group(1));

        }
        }
        if (damages.length == 0 && save === null) {
            return null;
        }
        return (damages, damage_types, save);

    }
    buildAttackRoll(name, description) {
        roll_properties = {"name": name,
                           "preview": this._avatar,
                           "attack-source": "monster-action",
                           "description": description}

        }
        }
        }
        }
        }
        attackInfo = this.parseAttackInfo(description);
        //console.log("Attack info for ", name, attackInfo);
        if (attackInfo) {
            attack_type, to_hit, reach_range = attackInfo;
            roll_properties["to-hit"] = to_hit;
            roll_properties["attack-type"] = attack_type;
            roll_properties["reach" if (attack_type == "Melee" else "range"] = reach_range;


        }
        hitInfo = this.parseHitInfo(description);
        //console.log("Hit info for ", name, hitInfo);
        if hitInfo) {
            // Can't use '(damages, damage_types, save) = hitInfo' because rapydscript flattens;
            // the lists within the list && assigns the strings to each of the 3 vars instead of lists;
            damages = hitInfo[0];
            damage_types = hitInfo[1];
            save = hitInfo[2];
            if (len(damages) > 0) {
                roll_properties["damages"] = damages.as_array();
                roll_properties["damage-types"] = damage_types.as_array();
                crits = damagesToCrits(this, damages, damage_types);
                crit_damages = [];
                crit_damage_types = [];
                for (let [i, dmg] of crits.entries()) {
                    if (dmg != "") {
                        crit_damages.push(dmg);
                        crit_damage_types.push(damage_types[i]);
                }
                }
                roll_properties["critical-damages"] = crit_damages.as_array();
                roll_properties["critical-damage-types"] = crit_damage_types.as_array();
            }
            if (save) {
                roll_properties["save-ability"] = save[0];
                roll_properties["save-dc"] = save[1];

        }
        }
        if (attackInfo || hitInfo) {
            return roll_properties;
        } else {
            return null;

    }
    }
    lookForActions(stat_block, add_dice, inject_descriptions) {
        blocks = stat_block.find(this._base + "__description-blocks " + this._base + "__description-block");
        makeCB = (props) => {
            return () => {
                sendRoll(this, "attack", "1d20" + props["to-hit"], props);
        }
        }
        for (let block of blocks) {
            actions = $(block).find(this._base + "__description-block-content p");
            for (let action of actions) {
                //console.log("Found action: ", action);
                firstChild = action.firstElementChild;
                if (firstChild) {
                    // Usually <em><strong> || <strong><em> (Orcus is <span><em><strong>);
                    action_name = $(firstChild).find("> :first-child").text().trim();
                } else {
                    if (inject_descriptions) {
                        injectDiceToRolls(action, this, this._name);
                    }
                    continue;
                }
                //console.log("Action name: ", action_name);
                if (action_name.slice(-1)[0] == ".") {
                    action_name = action_name[:-1];
                }
                if (add_dice) {
                    description = descriptionToString(action);
                    roll_properties = this.buildAttackRoll(action_name, description);
                    if (roll_properties) {
                        id = addRollButton(this, makeCB(roll_properties), action,
                                           small=true, prepend=true, image=true, text=action_name);
                        }
                        }
                        }
                        }
                        }
                        $("//" + id).css({"float": "", "text-align": ""});
                }
                }
                if (inject_descriptions) {
                    injectDiceToRolls(action, this, action_name);

        }
        }
        }
        handleAction = (action_name, block, action) => {
            description = $(action).text();
            if (action_name.slice(-1)[0] == ".") {
                action_name = action_name[:-1];
            }
            if (add_dice) {
                roll_properties = this.buildAttackRoll(action_name, description);
                if (roll_properties) {
                    id = addRollButton(this, makeCB(roll_properties), block,
                                        small=true, before=true, image=true, text=action_name);
                    }
                    }
                    }
                    }
                    }
                    $("//" + id).css({"float": "", "text-align": "", "margin-top": "15px"});
            }
            }
            if (inject_descriptions) {
                injectDiceToRolls(action, this, action_name);

        }
        }
        // Parse Vehicle (boats) weapons;
        blocks = stat_block.find(this._base + "__component-block");
        for (let block of blocks) {
            action_name = $(block).find(this._base + "__component-block-heading").text();
            attributes = $(block).find(this._base + "__component-block-content " + this._base + "__attribute-value");
            for (let action of attributes) {
                description = $(action).text();
                // HACK: Skip ship movement to  avoid having a "-5 ft speed per 25 damage taken" inject dice rolls on '-5';
                if (re.search("-\d+ ft. speed", description) !== null) {
                    continue;
                }
                handleAction(action_name, block, action);

        }
        }
        // Parse Vehicle (boats) weapons (in character extra);
        blocks = stat_block.find(this._base + "-component");
        for (let block of blocks) {
            action_name = $(block).find(this._base + "__section-header").text();
            actions = $(block).find(this._base + "-component__actions");
            // We can't parse each action separately because the entire block is interactive.;
            handleAction(action_name, block, actions);

        }
        // Parse Vehicle (infernal machines) features;
        blocks = stat_block.find(this._base + "__feature," + this._base + "__features-feature");
        for (let block of blocks) {
            action_name = $(block).find(this._base + "__feature-label").text();
            action = $(block).find(this._base + "__feature-value");
            if (action_name == "" && action.length == 0) {
                action_name = $(block).find(this._base + "__features-feature-name").text();
                action = $(block).find(this._base + "__features-feature-description");
            }
            handleAction(action_name, block, action);

        }
        // Parse Vehicle (infernal machines) action stations;
        blocks = stat_block.find(this._base + "__action-station-block," + this._base + "-action-station");
        for (let block of blocks) {
            action_name = $(block).find(this._base + "__action-station-block-heading").text();
            action = $(block).find(this._base + "__action-station-block-content " + this._base + "__attribute-value");
            if (action_name == "" && action.length == 0) {
                action_name = $(block).find(this._base + "-action-station__heading").text();
                action = $(block).find(this._base + "-action-station__action");
            }
            handleAction(action_name, block, action);


    }
    }
    injectSpellRolls(element, url) {
        icon16 = chrome.extension.getURL("images/icons/icon16.png");

        roll_icon = $('<img class="ct-beyond20-spell-icon" x-beyond20-spell-url="' + url + '"></img>');

        $(element).after(roll_icon);

        $(".ct-beyond20-spell-icon").css("margin-right", "3px");
        $(".ct-beyond20-spell-icon").css("margin-left", "3px");
        $(".ct-beyond20-spell-icon").attr("src", icon16);
        $(".ct-beyond20-spell-icon").off('click');
        $(".ct-beyond20-spell-icon").on('click', (event) => {
            spell_url = $(event.currentTarget).attr("x-beyond20-spell-url");
            if (this._spells.includes(spell_url)) {
                this._spells[spell_url].display();
            } else {
                //console.log("Fetching Spell Tooltip from URL : ", spell_url);
                $.get(spell_url, (text) => {
                    spell_json = JSON.parse(text[1:-1]);
                    spell = Spell($(spell_json.Tooltip), this, "tooltip");
                    spell.display();
                    this._spells[spell_url] = spell;
                }
                );
        }
        }
        );

    }
    lookForSpells(stat_block) {
        spells = stat_block.find(this._base + "__description-blocks a.spell-tooltip");
        for (let spell of spells) {
            tooltip_href = $(spell).attr("data-tooltip-href");
            tooltip_url = re.sub("-tooltip.*$", "/tooltip", tooltip_href);
            this.injectSpellRolls(spell, tooltip_url);

    }
    }
    updateInfo() {
        // Creature name could change/be between.includes(customized) calls;
        this._name = this._stat_block.find(this._base + "__name").text().trim();
        hp = max_hp = temp_hp = null;
        groups = $(".ct-creature-pane .ct-collapsible__content .ct-creature-pane__adjuster-group,.ct-creature-pane .ddbc-collapsible__content .ct-creature-pane__adjuster-group");
        for (let item of groups) {
            label = $(item).find(".ct-creature-pane__adjuster-group-label").text();
            if (label == "Current HP") {
                hp = int($(item).find(".ct-creature-pane__adjuster-group-value").text());
            } else if (label == "Max HP") {
                max_hp = int($(item).find(".ct-creature-pane__adjuster-group-value").text());
            } else if (label == "Temp HP") {
                temp_hp = int($(item).find(".ct-creature-pane__adjuster-group-value input").val());
        }
        }
        if (hp !== null && max_hp !== null && (this._hp != hp || this._max_hp != max_hp || this._temp_hp != temp_hp)) {
            this._hp = hp;
            this._max_hp = max_hp;
            this._temp_hp = temp_hp;
            print("Monster HP updated to : (" + hp + "+" + temp_hp + ")/" + max_hp);

            if (this.getGlobalSetting("update-hp", true)) {
                req = {"action": "hp-update", "character": this.getDict()}
                console.log("Sending message: ", req);
                chrome.runtime.sendMessage(req, (resp) => beyond20SendMessageFailure(this, resp));

    }
    }
    }
    getDict() {
        return {"name": this._name,
                "avatar": this._avatar,
                "type": this.type(),
                "id": this._id,
                "ac": this._ac,
                "hp": this._hp,
                "hp-formula": this._hp_formula,
                "max-hp": this._max_hp,
                "temp-hp": this._temp_hp,
                "speed": this._speed,
                "abilities": this._abilities.as_array(),
                "saves": this._saves,
                "skills": this._skills,
                "cr": this._cr,
                "url": this._url}


}
}
}
}
function skillToAbility(skill) {
    if (skill_abilities[skill] != undefined) {
        return skill_abilities[skill];
    }
    return "";

}
function abbreviationToAbility(abbr) {
    for (let ability of ability_abbreviations) {
        if (ability_abbreviations[ability] == abbr) {
            return ability;
    }
    }
    return abbr;


}
function propertyListToDict(propList) {
    properties = {}
    for (let i = 0; i < (propList.length); i++) {
        label = propList.eq(i).find(".ct-property-list__property-label,.ddbc-property-list__property-label").text()[:-1];
        value = propList.eq(i).find(".ct-property-list__property-content,.ddbc-property-list__property-content").text();
        properties[label] = value;
    }
    return properties;

}
function descriptionToString(selector) {
    // strip tags : https://www.sitepoint.com/jquery-strip-html-tags-div/;
    return ($(selector).html() || "").replace(/<\/ != undefined[^>]+>/gi, '');

}
function findToHit(name_to_match, items_selector, name_selector, tohit_selector) {
    items = $(items_selector);
    for (let i = 0; i < (items.length); i++) {
        if (items.eq(i).find(name_selector).text() == name_to_match) {
            to_hit = items.eq(i).find(tohit_selector);
            if (to_hit.length > 0) {
                to_hit = to_hit.text();
                return to_hit;
            }
            break;
    }
    }
    return null;

}
function damagesToCrits(character, damages) {
    crits = [];
    rule = int(character.getGlobalSetting("critical-homebrew", CriticalRules.PHB));
    if (rule == CriticalRules.HOMEBREW_REROLL || rule == CriticalRules.HOMEBREW_MOD) {
        return damages[:];
    }
    for (let damage of damages) {
        damage_parts = re.findall("([0-9]*)d([0-9]+)(ro<2) != undefined", damage).map((formula) => {
            match = re.search("([0-9]*)d([0-9]+)(ro<2) != undefined", formula);
            if (rule == CriticalRules.HOMEBREW_MAX) {
                dice = int(match.group(1) || 1);
                faces = int(match.group(2));
                return String(dice * faces);
            } else {
                return match.group(0);
        }
        }
        );
        console.log("Damage to crits : ", damage, damage_parts);
        crits.push(damage_parts.join(" + "));
    }
    return crits;

}
function buildAttackRoll(character, attack_source, name, description, properties, damages=[], damage_types=[], to_hit=null, brutal=0) {
    roll_properties = {"name": name,
                       "attack-source": attack_source,
                       "description": description}
    }
    }
    }
    }
    }
    if (to_hit) {
        roll_properties["to-hit"] = to_hit;

    }
    if (properties["Reach"] != undefined) {
        roll_properties["reach"] = properties["Reach"];
        roll_properties["attack-type"] = "Melee";
    } else if (properties["Range"] != undefined) {
        roll_properties["range"] = properties["Range"];
        roll_properties["attack-type"] = "Ranged";
    } else {
        range_area = properties["Range/Area"]  || "";
        if (range_area.includes("Reach")) {
            roll_properties["attack-type"] = "Melee";
            roll_properties["reach"] = range_area.replace(" Reach", "");
        } else {
            roll_properties["attack-type"] = "Ranged";
            roll_properties["range"] = range_area;
    }
    }
    if (properties["Attack Type"] != undefined) {
        roll_properties["attack-type"] = properties["Attack Type"];

    }
    if (properties["Attack/Save"] != undefined) {
        save_ability, save_dc = properties["Attack/Save"].split(" ");
        roll_properties["save-ability"] = abbreviationToAbility(save_ability);
        roll_properties["save-dc"] = save_dc;

    }
    if (properties["Properties"] != undefined) {
        roll_properties["properties"] = properties["Properties"].split(", ");

    }
    if (len(damages) > 0) {
        roll_properties["damages"] = damages.as_array();
        roll_properties["damage-types"] = damage_types.as_array();
        if (to_hit) {
            crits = damagesToCrits(character, damages, damage_types);
            crit_damages = [];
            crit_damage_types = [];
            for (let [i, dmg] of crits.entries()) {
                if (dmg != "") {
                    crit_damages.push(dmg);
                    crit_damage_types.push(damage_types[i]);
            }
            }
            if (brutal > 0) {
                highest_dice = 0;
                for (let dmg of crit_damages) {
                    match = re.search("[0-9]*d([0-9]+)", dmg);
                    if (match != undefined) {
                        sides = int(match.group(1));
                        if (sides > highest_dice) {
                            highest_dice = sides;
                }
                }
                }
                if (highest_dice != 0) {
                    crit_damages.push(String(brutal) + "d" + String(highest_dice));
                    crit_damage_types.push("Brutal");
            }
            }
            roll_properties["critical-damages"] = crit_damages.as_array();
            roll_properties["critical-damage-types"] = crit_damage_types.as_array();

    }
    }
    return roll_properties;

}
function sendRoll(character, rollType, fallback, args) {
    nonlocal key_modifiers;

    whisper = int(character.getGlobalSetting("whisper-type", WhisperType.NO));
    whisper_monster = int(character.getGlobalSetting("whisper-type-monsters", WhisperType.YES));
    if ((character.type() == "Monster" || character.type() == "Vehicle") && whisper_monster != WhisperType.NO) {
        whisper = whisper_monster;
    }
    advantage = int(character.getGlobalSetting("roll-type", RollType.NORMAL));
    if (args["advantage"] == RollType.OVERRIDE_ADVANTAGE) {
        args["advantage"] = advantage == RollType.SUPER_ADVANTAGE ? RollType.SUPER_ADVANTAGE : RollType.ADVANTAGE;

    }
    // Default advantage/whisper would get overriden if (they are part of provided args;
    req = {"action") { "roll", "character": character.getDict(), "type": rollType, "roll": cleanRoll(fallback),
           "advantage": advantage, "whisper": whisper}
    }
    }
    if (character.getGlobalSetting("weapon-force-critical", false)) {
        req["critical-limit"] = 1;
    }
    for (let key of args) {
        req[key] = args[key];
    }
    if (key_modifiers.shift) {
        req["advantage"] = RollType.ADVANTAGE;
    } else if (key_modifiers.ctrl) {
        req["advantage"] = RollType.DISADVANTAGE;
    } else if (key_modifiers.alt) {
        req["advantage"] = RollType.NORMAL;

    }
    console.log("Sending message: ", req);
    chrome.runtime.sendMessage(req, (resp) => beyond20SendMessageFailure(character, resp));

}
function isRollButtonAdded() {
    return $(".ct-beyond20-roll,.ct-beyond20-roll-display").length > 0;

}
function isCustomRollIconsAdded() {
    return $(".ct-beyond20-custom-roll").length > 0;

}
function isHitDieButtonAdded() {
    return $(".ct-beyond20-roll-hitdie").length > 0;

}
function getRollTypeButtonClass(character) {
    if (character != undefined) {
        advantage = int(character.getGlobalSetting("roll-type", RollType.NORMAL));
    }
    if (key_modifiers.shift) {
        advantage = RollType.ADVANTAGE;
    } else if (key_modifiers.ctrl) {
        advantage = RollType.DISADVANTAGE;
    } else if (key_modifiers.alt) {
        advantage = RollType.NORMAL;
    }
    if (advantage == RollType.DOUBLE) {
        return "beyond20-roll-type-double";
    }
    if (advantage == RollType.QUERY) {
        return "beyond20-roll-type-query";
    }
    if (advantage == RollType.THRICE) {
        return "beyond20-roll-type-thrice";
    }
    if (advantage == RollType.ADVANTAGE) {
        return "beyond20-roll-type-advantage";
    }
    if (advantage == RollType.DISADVANTAGE) {
        return "beyond20-roll-type-disadvantage";
    }
    if (advantage == RollType.SUPER_ADVANTAGE) {
        return "beyond20-roll-type-super-advantage";
    }
    if (advantage == RollType.SUPER_DISADVANTAGE) {
        return "beyond20-roll-type-super-disadvantage";
    }
    return "";

}
last_character_used = null;
function updateRollTypeButtonClasses(character) {
    nonlocal last_character_used;
    button_roll_type_classes="beyond20-roll-type-double beyond20-roll-type-query beyond20-roll-type-thrice beyond20-roll-type-advantage beyond20-roll-type-disadvantage beyond20-roll-type-super-advantage beyond20-roll-type-super-disadvantage";
    rolltype_class = getRollTypeButtonClass(character || last_character_used);
    $(".ct-beyond20-roll .ct-beyond20-roll-button,.beyond20-quick-roll-tooltip").removeClass(button_roll_type_classes).addClass(rolltype_class);


}
button_class = "ct-theme-button ct-theme-button--filled ct-theme-button--interactive ct-button character-button";
button_class_small = button_class + " character-button-small";
function addRollButton(character, callback, where, small=false, append=false, prepend=false, before=false, image=true, text="Beyond 20") {
    nonlocal last_character_used;
    last_character_used = character;

    icon32 = chrome.extension.getURL("images/dice24.png");
    icon16 = chrome.extension.getURL("images/dice16.png");
    id = uuid.uuid4();

    rolltype_class = " " + getRollTypeButtonClass(character);

    button = E.div(class_="ct-beyond20-roll", id=String(id),
                    E.button(class_= small ? "ct-beyond20-roll-button " + (button_class_small : button_class) + rolltype_class,
                             E.img(class_= image ? "ct-beyond20-icon", small ? src=((icon16 : icon32) : ""),
                                   style= image ? ("margin-right: 6px;" : "")),
                             }
                             }
                             E.span(class_="ct-button__content", text);
                             );
                    }
                    }
                    }
                    );

    }
    }
    }
    }
    if (append) {
        $(where).push(button);
    } else if (prepend) {
        $(where).prepend(button);
    } else if (before) {
        $(where).before(button);
    } else {
        $(where).after(button);
    }
    $("//" + String(id)).css({"float": "right",
                                "display": "block",
                                "text-align": "center"});
    }
    }
    }
    }
    }
    }
    }
    $("//" + String(id) + " button").on('click', (event) => {
        callback();
    }
    );
    return id;

}
function addDisplayButton(callback, where, VTT",.includes(text="Display) append=true, small=true) {
    button = E.div(class_="ct-beyond20-roll-display",
                   E.button(class_= small ? "ct-beyond20-display-button " + (button_class_small : button_class).replace("filled", "outline"),
                            E.span(class_="ct-button__content", text);
                            );
                   }
                   }
                   }
                   );
    }
    }
    }
    }
    if (append) {
        $(where).push(button);
    } else {
        $(where).after(button);
    }
    $(".ct-beyond20-roll-button").css({"margin-left": "auto",
                                       "margin-right": "auto"});
    }
    }
    }
    }
    }
    }
    }
    }
    }
    $(".ct-beyond20-roll-display").css("margin-top", "2px");
    $(".ct-beyond20-roll-display").on('click', (event) => {
        callback();
    }
    );

}
function addHitDieButtons(rollCallback) {
    icon16 = chrome.extension.getURL("images/icons/icon16.png");
    button = E.div(class_="ct-beyond20-roll-hitdie", style="float: right;",
                    E.img(class_="ct-beyond20-icon", src=icon16, style="margin-right: 6px;"),
                    E.button(class_="ct-beyond20-roll-button " + button_class_small,
                             E.span(class_="ct-button__content", "Roll Hit Die");
                             );
                    }
                    }
                    }
                    );
    }
    }
    }
    }
    print("Adding Hit Dice buttons");

    $(".ct-reset-pane__hitdie-heading").push(button);
    hitdice = $(".ct-reset-pane__hitdie");
    multiclass = hitdice.length > 1;
    for (let i = 0; i < (hitdice.length); i++) {
        cb = (rollCallback, index) => {
            return (event) => {
                rollCallback(multiclass, index);

        }
        }
        $(".ct-beyond20-roll-hitdie").eq(i).on('click', cb(rollCallback, i));

}
}
function addIconButton(callback, where, append=false, prepend=false) {
    icon16 = chrome.extension.getURL("images/icons/icon16.png");
    id = uuid.uuid4();
    button = E.span(class_="ct-beyond20-roll", id=String(id),
                    style="margin-right:3px; margin-left: 3px;",
                    E.img(class_="ct-beyond20-icon", src=icon16));

    }
    }
    }
    }
    if (append) {
        $(where).push(button);
    } else if (prepend) {
        $(where).prepend(button);
    } else {
        $(where).after(button);
    }
    $("//" + String(id)).on('click', (event) => {
        callback();
    }
    );

}
function removeRollButtons() {
    $(".ct-beyond20-roll").remove();
    $(".ct-beyond20-roll-hitdie").remove();
    $(".ct-beyond20-roll-display").remove();
    $(".ct-beyond20-custom-icon").remove();
    custom_rolls = $("u.ct-beyond20-custom-roll");
    for (let i = 0; i < (custom_rolls.length); i++) {
        custom_rolls.eq(i).replaceWith(custom_rolls.eq(i).text());


}
}
function recursiveDiceReplace(node, cb) {
    if (node.hasChildNodes()) {
        // We need to copy the list since its size could change as we modify it;
        children = list(node.childNodes);
        for (let child of children) {
            // don't replace anything inside of a roll button itthis;
            if ($(child).hasClass("ct-beyond20-roll")) {
                continue;
            }
            recursiveDiceReplace(child, cb);
    } else if (node.nodeName == "//text") {
        text = replaceRolls(node.textContent, cb);
        // Only replace if (we changed it, otherwise we might break existing html code bindings;
        if text != node.textContent) {
            $(node).replaceWith($.parseHTML(text));

}
}
}
function injectDiceToRolls(selector, character, name="") {
    icon16 = chrome.extension.getURL("images/icons/icon16.png");
    replaceCB = (dice, modifier) => {
        dice_formula = dice == "" ? ("1d20" : dice) + modifier;
        return '<u class="ct-beyond20-custom-roll"><strong>' + dice + modifier + '</strong>' + \
            '<img class="ct-beyond20-custom-icon" x-beyond20-name="' + name + \
            '" x-beyond20-roll="' + dice_formula + '"></img></u>';

    }
    }
    items = $(selector);
    for (let item of items) {
        recursiveDiceReplace(item, replaceCB);

    }
    $(".ct-beyond20-custom-icon").css("margin-right", "3px");
    $(".ct-beyond20-custom-icon").css("margin-left", "3px");
    $(".ct-beyond20-custom-icon").attr("src", icon16);
    $(".ct-beyond20-custom-roll").off('click');
    $(".ct-beyond20-custom-roll").on('click', (event) => {
        name = $(event.currentTarget).find("img").attr("x-beyond20-name");
        roll = $(event.currentTarget).find("img").attr("x-beyond20-roll");
        sendRoll(character, "custom", roll, {"name": name});
    }
    );

}
function beyond20SendMessageFailure(character, response) {
    if ( !response  != undefined) {
        return;
    }
    console.log("Received response : ", response);
    if (response.request.action == "roll" && (response.vtt == "dndbeyond" || response.error != undefined)) {
        dndbeyondDiceRoller.handleRollError(response.request, response.error);
    } else if (response.error != undefined) {
        alertify.error("<strong>Beyond 20 : </strong>" + response.error);

}
}
alertify.set("alert", "title", "Beyond 20");
alertify.set("notifier", "position", "top-center");

key_modifiers = {"alt": false, "ctrl": false, "shift": false}
checkKeyModifiers = (event) => {
    nonlocal key_modifiers;
    if (event.originalEvent.repeat) {
        return;
    }
    needsUpdate = Object.values(key_modifiers).some((v) => v);
    key_modifiers.ctrl = event.ctrlKey || event.metaKey;
    key_modifiers.shift = event.shiftKey;
    key_modifiers.alt = event.altKey;
    needsUpdate = needsUpdate || Object.values(key_modifiers).some((v) => v);
    if (needsUpdate) {
        updateRollTypeButtonClasses();
}
}
resetKeyModifiers = (event) => {
    nonlocal key_modifiers;
    needsUpdate = Object.values(key_modifiers).some((v) => v);
    key_modifiers.ctrl = false;
    key_modifiers.shift = false;
    key_modifiers.alt = false;
    if (needsUpdate) {
        updateRollTypeButtonClasses();
}
}
$(window).keydown(checkKeyModifiers).keyup(checkKeyModifiers).blur(resetKeyModifiers);
