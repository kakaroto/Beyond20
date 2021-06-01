const gulp = require('gulp');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const rename = require("gulp-rename");

const ROLL_RENDERER_DEPS = [
    "src/common/utils.js",
    "src/common/settings.js",
    "src/common/constants.js",
    "src/discord/discord.js",
    "src/common/dice.js",
    "src/common/roll-table.js",
    "src/common/roll_renderer.js"
];

const DNDBEYOND_PAGE_DEPS = [
    ...ROLL_RENDERER_DEPS,
    "src/dndbeyond/base/digital-dice.js",
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
    astral: [
        "src/common/utils.js",
        "src/common/settings.js",
        "src/astral/common.js",
        "src/astral/content-script.js"
    ],
    astral_script: [
        ...ROLL_RENDERER_DEPS,
        "src/common/utils.js",
        "src/astral/data-utils.js",
        "src/astral/renderer.js",
        "src/astral/common.js",
        "src/astral/page-script.js"
    ],
    roll20: [
        ...ROLL_RENDERER_DEPS,
        "src/roll20/renderer.js",
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
    ],
    dndbeyond_monster: [
        ...DNDBEYOND_PAGE_DEPS,
        "src/dndbeyond/base/spell.js",
        "src/dndbeyond/base/monster.js",
        "src/dndbeyond/content-scripts/monster.js",
    ],
    dndbeyond_encounter: [
        ...DNDBEYOND_PAGE_DEPS,
        "src/dndbeyond/base/spell.js",
        "src/dndbeyond/base/monster.js",
        "src/dndbeyond/content-scripts/encounter.js",
    ],
    dndbeyond_vehicle: [
        ...DNDBEYOND_PAGE_DEPS,
        "src/dndbeyond/base/spell.js",
        "src/dndbeyond/base/monster.js",
        "src/dndbeyond/content-scripts/vehicle.js",
    ],
    dndbeyond_character: [
        ...DNDBEYOND_PAGE_DEPS,
        "src/dndbeyond/base/spell.js",
        "src/dndbeyond/base/monster.js",
        "src/dndbeyond/base/character.js",
        "src/dndbeyond/content-scripts/character.js",
    ],
    dndbeyond_source: [
        ...DNDBEYOND_PAGE_DEPS,
        "src/dndbeyond/content-scripts/source.js",
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
    gulp.watch(["manifest.json", "manifest_ff.json", "dist/**"], gulp.series([
        "copy-chrome-dist", "chrome-manifest", "copy-firefox-dist", "firefox-manifest"
    ]));
    gulp.watch(["options.*", "*.html"], gulp.series([
        "copy-misc", "build-chrome", "build-firefox"
    ]));
}

build = gulp.series(css, ...Object.values(targets));

gulp.task('css', css);
gulp.task('watch', watch);
gulp.task('build', build);


gulp.task("clean", () => {
    return gulp.src(['./dist/', "./build/"], { read: false, allowEmpty: true }).pipe(clean());
});

gulp.task("copy-src", () => {
    return gulp.src("./src/**")
        .pipe(gulp.dest('./build/base/src/'))
});

gulp.task("copy-dist-nobuild", () => {
    return gulp.src("./dist/**")
        .pipe(gulp.dest('./build/base/dist/'));
});
gulp.task("copy-dist", gulp.series("build", "copy-dist-nobuild"));

gulp.task("copy-libs", () => {
    return gulp.src("./libs/**")
        .pipe(gulp.dest('./build/base/libs/'));
});

gulp.task("copy-images", () => {
    return gulp.src("images/**")
        .pipe(gulp.dest('./build/base/images/'));
});

gulp.task("copy-misc", () => {
    return gulp.src(["LICENSE", "LICENSE.MIT", "package.json", "gulpfile.js", "options.*", "*.html", "*.md"])
        .pipe(gulp.dest('./build/base/'));
});

gulp.task("build-base", gulp.parallel([
    "copy-src",
    "copy-dist",
    "copy-misc",
    "copy-libs",
    "copy-images",
]));

// Creates the specific folders for Chrome and Firefox

gulp.task("copy-firefox-dist", () => {
    return gulp.src("./dist/**")
        .pipe(gulp.dest('./build/firefox/dist/'));
});

gulp.task("copy-chrome-dist", () => {
    return gulp.src("./dist/**")
        .pipe(gulp.dest('./build/chrome/dist/'));
});


gulp.task("copy-firefox-from-base", gulp.series("build-base", () => {
    return gulp.src("./build/base/**")
        .pipe(gulp.dest('./build/firefox/'));
}));

gulp.task("copy-chrome-from-base", gulp.series("build-base", () => {
    return gulp.src("./build/base/**")
        .pipe(gulp.dest('./build/chrome/'));
}));

// Copies manifests around

gulp.task("firefox-manifest", () => {
    return gulp.src("./manifest_ff.json")
        .pipe(rename({
            basename: "manifest",
        }))
        .pipe(gulp.dest("./build/firefox/"));
});

gulp.task("chrome-manifest", () => {
    return gulp.src("./manifest.json")
        .pipe(gulp.dest("./build/chrome/"));
});

// Performs full builds

gulp.task("build-firefox",gulp.series([
    "copy-firefox-from-base",
    "firefox-manifest"
]));

gulp.task("build-chrome", gulp.series([
    "copy-chrome-from-base",
    "chrome-manifest"
])); 


gulp.task('default', gulp.series(['build', 'build-chrome', 'build-firefox', 'watch']));