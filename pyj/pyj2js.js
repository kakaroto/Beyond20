const regexps = [
    // comments
    [new RegExp(/#/gm), "//"],

    // Functions
    [new RegExp(/def *\(([^:)]*)\) *: *$/gm), "($1) => {"],
    [new RegExp(/def *\(([^:)]*)\) *: *return +(.*);/gm), "($1) => $2"],
    [new RegExp(/def *\(([^:)]*)\) *: *(.*);/gm), "($1) => $2"],
    [new RegExp(/def *\(([^:)]*)\) *: *return +(.*)$/gm), "($1) => $2"],
    [new RegExp(/def *\(([^:)]*)\) *: *(.+)$/gm), "($1) => $2"],
    [new RegExp(/def +([^ (]+) *\(self *,? *([^:)]*)\) *: *$/gm), "$1($2) {"],
    [new RegExp(/def +([^ (]+) *\(([^:)]*)\) *: *$/gm), "function $1($2) {"],

    // Classes
    [new RegExp(/class +([^ ]+) *(([^)]+)) *:/gm), "class $1 extends $2 {"],
    [new RegExp(/class +([^ ]+) *:/gm), "class $1 {"],
    [new RegExp(/__init__/gm), "constructor"],
    [new RegExp(/self/gm), "this"],

    // if/else
    [new RegExp(/\? ""/gm), " or \"\""],
    [new RegExp(/\?/gm), " != undefined"],
    [new RegExp(/= *(.*) +if +(.+) +else +(.+)/gm), "= $2 ? $1 : $3"],
    [new RegExp(/, *(.*) +if +(.+) +else +(.+)/gm), ", $2 ? $1 : $3"],
    [new RegExp(/return *(.*) +if +(.+) +else +(.+)/gm), "return $2 ? $1 : $3"],
    [new RegExp(/( +)if *([^:]+):/gm), "$1if ($2) {"],
    [new RegExp(/( +)elif *([^:]+):/gm), "$1} else if ($2) {"],
    [new RegExp(/( +)else *:/gm), "$1} else {"],
    [new RegExp(/^if *([^:]+):/gm), "if ($1) {"],
    [new RegExp(/^elif *([^:]+):/gm), "} else if ($1) {"],
    [new RegExp(/^else *:/gm), "} else {"],

    // Loops
    [new RegExp(/( +)while *([^:]+):/gm), "$1while ($2) {"],
    [new RegExp(/( +)for *([^ ,]+) +in +x?range(([^:]+)) *:/gm), "$1for (let $2 = 0; i < $3; i++) {"],
    [new RegExp(/( +)for *([^ ,]+) +in +([^:]+) *:/gm), "$1for (let $2 of $3) {"],
    [new RegExp(/( +)for *([^ ,]+) *, *([^ ,]+) +in enumerate\(+([^:]+)\) *:/gm), "$1for (let [$2, $3] of $4.entries()) {"],

    // Try/Catch
    [new RegExp(/( +)try *:/gm), "$1try {"],
    [new RegExp(/( +)except *:/gm), "$1} catch(err) {"],
    [new RegExp(/( +)except .* as ([^:]+)*:/gm), "$1} catch($2) {"],


    // operators
    [new RegExp(/is None/gm), "=== null"],
    [new RegExp(/is not None/gm), "!== null"],
    [new RegExp(/None/gm), "null"],
    [new RegExp(/ or /gm), " || "],
    [new RegExp(/ and /gm), " && "],
    [new RegExp(/not /gm), " !"],
    [new RegExp(/\(not /gm), "(!"],
    [new RegExp(/True/gm), "true"],
    [new RegExp(/False/gm), "false"],
    [new RegExp(/del /gm), " delete "],
    [new RegExp(/jstype/gm), "typeof"],
    [new RegExp(/str\(/gm), "String("],
    [new RegExp(/len\(([^)])\)/gm), "$1.length"],
    [new RegExp(/([( ])([^( ]+) +not in +([^ )]+)/gm), "$1!$3.includes($2)"],
    [new RegExp(/([( ])([^( ]+) +in +([^ )]+)/gm), "$1$3.includes($2)"],
    [new RegExp(/"""/gm), "`"],

    // Arrays
    [new RegExp(/\[ *([^]:]+) *: *\]/gm), ".slice($1)"],
    [new RegExp(/\[ *: *([^]]+) *\]/gm), ".slice(0, $1)"],
    [new RegExp(/\[ *([^]:]+) *: *([^]]+) *\]/gm), ".slice($1, $2)"],
    [new RegExp(/\.append\(/gm), ".push("],
    [new RegExp(/\.extend\(/gm), ".push(..."],
    [new RegExp(/\[ *-([0-9]+) *\]/gm), ".slice(-$1)[0]"]
];

function getLineIndent(line) {
    let non_space = false;
    return line.split('').reduce((t, c) => {
        if (non_space) return t;
        if (c === ' ') t++;
        else non_space = true;
        return t;
    }, 0)
}
function replaceFile(contents) {
    let result = contents;
    for (let change of regexps) {
        result = result.replace(change[0], change[1])
    }
    const original_lines = result.split("\n");
    const lines = [];
    let indent = 0;
    for (let line of original_lines) {
        const line_indent = getLineIndent(line);
        if (line.trim() !== "" && line_indent < indent && line[line_indent] != "}") {
            let i = line_indent;
            while (i < indent) {
                lines.push(" ".repeat(i) + "}")
                indent -= 4;
            }
        }
        if (line.trim() !== "")
            indent = line_indent;
        line = line.trimEnd();
        if (![",", "\\", "{", "}", ""].includes(line.substr(-1)))
            line += ";";
        lines.push(line);
    }
    return lines.join("\n");
}

const fs = require("fs");
const glob = require("glob");

glob.glob("pyj/*.pyj", (err, files) => {
    for (let file of files) {
        const contents = fs.readFileSync(file).toString();
        fs.writeFileSync(file + ".js", replaceFile(contents));
    }
});