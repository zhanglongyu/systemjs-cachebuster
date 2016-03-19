var gulp = require("gulp");
var FileHashIndex = require("systemjs-cachebuster");
var watch = require("gulp-watch");

var files = "src/**/*.js";
var fileHashIndex = new FileHashIndex();

gulp.task('default', function () {
    return gulp
        .src(files)
        .pipe(fileHashIndex.onInit())
        .pipe(watch(files))
        .pipe(fileHashIndex.onChange());
});

gulp.task('dev', function () {
    return gulp
        .src("node_modules/systemjs/dist/system.src.js")
        .pipe(gulp.dest("./"));
});
