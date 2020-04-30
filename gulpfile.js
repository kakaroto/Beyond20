const gulp = require('gulp');
const concat = require('gulp-concat');

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
        "src/common/utils.js",
        "src/common/settings.js",
        "src/extension/default_popup.js"
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
        "src/common/utils.js",
        "src/roll20/page-script.js"
    ],
    fvtt_test: [
        "src/fvtt/check-tab.js"
    ],
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