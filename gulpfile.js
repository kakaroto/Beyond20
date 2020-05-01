const gulp = require('gulp');
const concat = require('gulp-concat');

const ROLL_RENDERER_DEPS = [
    "src/common/utils.js",
    "src/common/settings.js",
    "src/common/constants.js",
    "src/discord/discord.js",
    "src/common/roll_renderer.js"
];
const DNDBEYOND_PAGE_DEPS = [
    ...ROLL_RENDERER_DEPS,
    "src/dndbeyond/base/dice.js",
    "src/dndbeyond/base/base.js",
    "src/dndbeyond/base/hotkeys.js",
    "src/dndbeyond/base/utils.js",
];

const SRC_FILES = {
    background: [
        "src/common/constants.js",
        "src/common/utils.js",
        "src/common/settings.js",
        "src/extension/background.js"
    ],
    options: [
        "src/common/utils.js",
        "src/common/settings.js",
        "src/extension/options.js"
    ],
    default_popup: [
        "src/common/sandbox-header.js",
        "src/common/utils.js",
        "src/common/settings.js",
        "src/extension/default_popup.js",
        "src/common/sandbox-footer.js"
    ],
    popup: [
        "src/common/constants.js",
        "src/common/utils.js",
        "src/common/settings.js",
        "src/extension/popup.js"
    ],
    roll20: [
        "src/common/utils.js",
        "src/common/settings.js",
        "src/roll20/content-script.js"
    ],
    roll20_script: [
        "src/common/sandbox-header.js",
        "src/common/utils.js",
        "src/roll20/page-script.js",
        "src/common/sandbox-footer.js"
    ],
    fvtt_test: [
        "src/fvtt/check-tab.js"
    ],
    fvtt: [
        "src/common/utils.js",
        "src/common/settings.js",
        "src/fvtt/content-script.js"
    ],
    fvtt_script: [
        "src/common/sandbox-header.js",
        ...ROLL_RENDERER_DEPS,
        "src/fvtt/page-script.js",
        "src/common/sandbox-footer.js"
    ],
    dndbeyond_spell: [
        ...DNDBEYOND_PAGE_DEPS,
        "src/dndbeyond/base/spell.js",
        "src/dndbeyond/content-scripts/spell.js",
    ],
    dndbeyond_item: [
        ...DNDBEYOND_PAGE_DEPS,
        "src/dndbeyond/content-scripts/item.js",
    ]
}
const CSS_FILES = ['src/extension/beyond20.css']

const targets = {};
for (const target in SRC_FILES) {
    // Use an object with a named key so each task function gets
    // named instead of being anonymous functions
    const task = {
        [target]: () => gulp.src(SRC_FILES[target])
            .pipe(concat(`${target}.js`))
            .pipe(gulp.dest("dist"))
    };
    targets[target] = task[target];
    gulp.task(target, targets[target]);
}
css = () => gulp.src(CSS_FILES)
    .pipe(concat(`beyond20.css`))
    .pipe(gulp.dest("dist"))

watch = () => {
    for (target in SRC_FILES)
        gulp.watch(SRC_FILES[target], targets[target]);
    gulp.watch(CSS_FILES, css);
}

build = gulp.series(css, ...Object.values(targets));

gulp.task('css', css);
gulp.task('watch', watch);
gulp.task('build', build);
gulp.task('default', gulp.series(build, watch));