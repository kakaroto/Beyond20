const gulp = require('gulp');
const concat = require('gulp-concat');

const SRC_FILES = {
    background: [
        "src/constants.js",
        "src/utils.js",
        "src/settings.js",
        "src/background.js"
    ],
    options: [
        "src/utils.js",
        "src/settings.js",
        "src/options.js"
    ]
}

targets = {};
for (target in SRC_FILES) {
    const task = {
        [target]: () => {
            return gulp.src(SRC_FILES[target])
                .pipe(concat(`${target}.js`))
                .pipe(gulp.dest("dist"))
        }
    };
    targets[target] = task[target];
    gulp.task(target, targets[target]);
}

watch = () => {  
    for (target in SRC_FILES)
        gulp.watch(SRC_FILES[target], targets[target]);
}
console.log(targets)

build = gulp.series(...Object.values(targets));

gulp.task('watch', watch);
gulp.task('build', build);
gulp.task('default', gulp.series(build, watch));