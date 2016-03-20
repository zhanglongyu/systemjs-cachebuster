var gulp = require("gulp");
var FileHashIndex = require("systemjs-cachebuster");
var watch = require("gulp-watch");

var files = "src/**/*.js";
var fileHashIndex = new FileHashIndex();

gulp.task('watch', function () {
    return gulp
        .src(files)
        .pipe(fileHashIndex.full())
        .pipe(watch(files))
        .pipe(fileHashIndex.incremental());
});

gulp.task('prep', function () {
    return gulp
        .src([
            "node_modules/systemjs/dist/system.src.js", 
            "node_modules/systemjs-cachebuster/src/system.cachebuster.js"])
        .pipe(gulp.dest("./lib"));
});
