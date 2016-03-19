var gulp = require("gulp");
var FileHashIndex = require("./FileHashIndex");
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
