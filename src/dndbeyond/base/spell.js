
class SpellCharacter extends CharacterBase {
    constructor(global_settings) {
        super("spell", global_settings);
    }
}

class Spell {
    constructor(body, character, type = "page") {
        this._character = character;
        // if (type == "page")
        let title_selector = ".page-title";
        let statblock_selector = ".ddb-statblock";
        let description_selector = ".spell-details .more-info-content";
        let casting_time_label = "casting-time";
        let range_area_label = "range-area";

        if (type == "tooltip") {
            title_selector = ".tooltip-header-text";
            statblock_selector = ".tooltip-body-statblock";
            description_selector = ".tooltip-body-description-text";
            casting_time_label = "castingtime";
            range_area_label = "range";
        }

        const get_statblock = (label) => {
            return body.find(`${statblock_selector}-item-${label} ${statblock_selector}-item-value`).text().trim();
        }

        this.spell_name = body.find(title_selector).text().trim();
        this.casting_time = get_statblock(casting_time_label);
        this.range_area = get_statblock(range_area_label);
        this.components = get_statblock("components");
        this.duration = get_statblock("duration");
        this.description = body.find(description_selector).text().trim();
        const level = get_statblock("level");
        const school = get_statblock("school");
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
            const materials = body.find(description_selector + " .components-blurb").text().trim();
            this.description = this.description.slice(0, -1 * materials.length).trim();
            this.components = this.components.slice(0, -2) + materials.slice(4);
        }
        const aoe = body.find(statblock_selector + "-item-range-area .aoe-size").text().trim();
        if (aoe != "") {
            this.range_area = this.range_area.slice(0, -1 * aoe.length).trim() + " " + aoe.trim();
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
            "description": this.description
        });
    }
}
