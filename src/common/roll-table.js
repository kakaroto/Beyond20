
class RollTable {
    constructor(name, formula, table) {
        this.name = name;
        this.formula = formula;
        this.table = table;
        this.total = null;
    }
    get results() {
        const results = {};
        for (const row of Object.keys(this.table)) {
            for (const [range, description] of Object.entries(this.table[row])) {
                const match = range.match(/([0-9]+)(?:[–-]([0-9]+))?/);
                if (!match) continue;
                let min = parseInt(match[1]);
                let max = parseInt(match[2] || min);
                // A d100 table will use '00' for the 100 result
                if (min === 0) min = 100;
                if (max === 0) max = 100;
                if (this.total >= min && this.total <= max) {
                    results[row] = description;
                    break;
                }
            }
        }
        return results;
    }

    async roll() {
        const roll = new DNDBRoll(this.formula);
        await roll.roll();
        this.setTotal(roll.total);
        return this.results;
    }

    async resolveFormula() {
        const bardicInspirationDie = /Bardic Insp.* Die/.test(this.formula);
        if (bardicInspirationDie) {
            const choices = {
                "1d6": "1d6 (Bard levels 1-4)",
                "1d8": "1d8 (Bard levels 5-9)",
                "1d10": "1d10 (Bard levels 10-14)",
                "1d12": "1d12 (Bard levels 15-20)"
            }
            const choice = await dndbeyondDiceRoller.queryGeneric(this.name, "Select Bardic Inspiration Die : ", choices);
            if (choice === null) return null;
            this.formula = choice;
        }
        return this.formula;
    }

    setTotal(total) {
        this.total = total;
    }

    static parseTable(table, name, options={}) {
        const dice_columns = []; // Index of columns that contain dice results
        const columns = {};
        const headers = table.find("thead tr th");
        let formula = null;
        for (let index = 0; index < headers.length; index++) {
            const header = headers.eq(index).text().trim();
            if (!header) break;
            // If header is a dice formula, then this is a roll table
            const isDiceFormula = !replaceRolls(header, () => "").trim();
            const bardicInspirationDie = /Bardic Insp.* Die/.test(header);
            if (!formula) {
                if (!isDiceFormula && !bardicInspirationDie) break;
                dice_columns.push(index);
                formula = header;
                continue;
            } else {
                // Look for other columns that are part of this roll table
                // (some tables are split horizontally, having multiple columns for the same data)
                // see https://www.dndbeyond.com/sources/dmg/adventure-environments#BuildingaDungeon
                if (!isDiceFormula && !bardicInspirationDie) {
                    columns[header] = {};
                    continue;
                }
                const firstColumn = headers.eq(dice_columns[0]).text().trim();
                if (header === firstColumn) {
                    dice_columns.push(index);
                }
            }
        }
        if (!formula) return;
    
        const bardicInspirationDie = /Bardic Insp.* Die/.test(formula);
        if (bardicInspirationDie) {
            if (options.character) {
                const lvl = options.character.getClassLevel("Bard");
                if (lvl < 5) formula = "1d6";
                else if (lvl < 10) formula = "1d8";
                else if (lvl < 15) formula = "1d10";
                else formula = "1d12";
            }
        }
        const rows = table.find("tbody tr");
        for (const row of rows.toArray()) {
            const cells = $(row).find("td");
            let last_range = null;
            for (let index = 0; index < headers.length; index++) {
                if (dice_columns.includes(index)) {
                    last_range = cells.eq(index).text().trim();
                } else if (last_range === null) {
                    break;
                } else {
                    const header = headers.eq(index).text().trim();
                    const description = cells.eq(index).text().trim();
                    if (columns[header] === undefined) continue;
                    columns[header][last_range] = description;
                }
            }
        }
    
        return new this(name, formula, columns);
    }

}