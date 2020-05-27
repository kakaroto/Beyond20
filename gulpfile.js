const gulp = require('gulp');
const concat = require('gulp-concat');

const ROLL_RENDERER_DEPS = [
    "src/common/utils.js",
    "src/common/settings.js",
    "src/common/constants.js",
    "src/discord/discord.js",
    "src/common/dice.js",
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
            .pipe(gulp.dest("compiled"))
    };
    targets[target] = task[target];
    gulp.task(target, targets[target]);
}
css = () => gulp.src(CSS_FILES)
    .pipe(concat(`beyond20.css`))
    .pipe(gulp.dest("compiled"))

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

// New gulp code

var clean = require('gulp-clean');

gulp.task("clean", () => {
    return gulp.src('./dist/', { read: false, allowEmpty: true }).pipe(clean());
});

gulp.task("copy-src", () => {
    return gulp.src("./src/**")
        .pipe(gulp.dest('./dist/base/src/'))
});

gulp.task("copy-compiled", gulp.series("build", () => {
    return gulp.src("./compiled/**")
        .pipe(gulp.dest('./dist/base/dist/'));
}));

gulp.task("copy-libs", () => {
    return gulp.src("./libs/**")
        .pipe(gulp.dest('./dist/base/libs/'));
});

gulp.task("copy-images", () => {
    return gulp.src("images/**")
        .pipe(gulp.dest('./dist/base/images/'));
});

gulp.task("copy-misc", () => {
    return gulp.src(["LICENSE", "options.*", "*.html", "*.md"])
        .pipe(gulp.dest('./dist/base/'));
});

gulp.task("build-base", gulp.parallel([
    "copy-src",
    "copy-compiled",
    "copy-misc",
    "copy-libs",
    "copy-images",
]));

// Creates the specific folders for Chrome and Firefox


gulp.task("copy-firefox-from-base", gulp.series("build-base", () => {
    return gulp.src("./dist/base/**")
        .pipe(gulp.dest('./dist/firefox/'));
}));

gulp.task("copy-chrome-from-base", gulp.series("build-base", () => {
    return gulp.src("./dist/base/**")
        .pipe(gulp.dest('./dist/chrome/'));
}));

// Copies manifests around

var rename = require("gulp-rename");

gulp.task("firefox-manifest", () => {

    return gulp.src("./manifest_ff.json")
        .pipe(rename({
            basename: "manifest",
        }))
        .pipe(gulp.dest("./dist/firefox/"));
});

gulp.task("chrome-manifest", () => {

    return gulp.src("./manifest.json")
        .pipe(rename({
            basename: "manifest",
        }))
        .pipe(gulp.dest("./dist/chrome/"));
});

// Performs full builds

gulp.task("firefox-build", gulp.series(
    gulp.parallel([
        "copy-firefox-from-base",
        "firefox-manifest"
    ])
));

gulp.task("chrome-build", gulp.series(
    gulp.parallel([
        "copy-chrome-from-base",
        "chrome-manifest"
    ])
));