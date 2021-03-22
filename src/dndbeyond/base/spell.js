
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
        this.range = get_statblock(range_area_label)
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
        const aoe = body.find(`${statblock_selector}-item-${range_area_label} .aoe-size`).text().trim();
        // If there's an AoE, process the second portion of the Range/Area to separate the two
        if (aoe != "") {
            this.range = this.range.slice(0, -1 * aoe.length).trim();
            // Remove parenthesis around the aoe range, and a possible '*' at the end 
            this.aoe = aoe.trim().replace(/^\(\s*|\s*\*?\)$/g, "");
            // Find the icon with the AoE effect (<i class="i-aoe-sphere">) and convert it to a word
            const i = body.find(`${statblock_selector}-item-${range_area_label} .aoe-size i`);
            const aoeClass = (i.attr("class") || "").split(" ").find(c => c.startsWith("i-aoe-"));
            // Remove class prefix and capitalize first letter
            this.aoe_shape = aoeClass ? aoeClass.replace(/^i-aoe-(.)/, (_, g) => g.toUpperCase()) : undefined;
        }
        // In case of a range with an extra span, remove all the spaces and indents/newlines (metor swarm)
        this.range = this.range.replace(/\s+/g, " ");
    }

    display() {
        sendRoll(this._character, "spell-card", 0, {
            "name": this.spell_name,
            "preview": this.preview,
            "level-school": this.level_school,
            "range": this.range,
            "aoe": this.aoe,
            "aoe-shape": this.aoe_shape,
            "concentration": this.concentration,
            "duration": this.duration,
            "casting-time": this.casting_time,
            "components": this.components,
            "ritual": this.ritual,
            "description": this.description
        });
    }
}
