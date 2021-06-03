
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

    setTotal(total) {
        this.total = total;
    }

    static parseTable(table, name) {
        const dice_columns = [];
        const columns = {};
        const headers = table.find("thead tr th");
        for (let index = 0; index < headers.length; index++) {
            const header = headers.eq(index).text().trim();
            if (!header) break;
            // If header is a dice formula, then this is a roll table
            const replaced = replaceRolls(header, () => "").trim();
            if (dice_columns.length === 0) {
                if (replaced) break;
                dice_columns.push(index);
                continue;
            } else {
                // Look for other columns that are part of this roll table
                // (some tables are split horizontally, having multiple columns for the same data)
                // see https://www.dndbeyond.com/sources/dmg/adventure-environments#BuildingaDungeon
                if (replaced) {
                    columns[header] = {};
                    continue;
                }
                const firstColumn = headers.eq(dice_columns[0]).text().trim();
                if (header === firstColumn) {
                    dice_columns.push(index);
                }
            }
        }
        if (dice_columns.length === 0) return;
    
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
    
        return new this(name, headers.eq(dice_columns[0]).text().trim(), columns);
    }

}