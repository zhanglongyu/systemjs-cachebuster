var gulp = require("gulp");



gulp.task('publish', function () {
    return gulp
        .src([
            "src/system.cachebuster.gulp.js", 
            "src/system.cachebuster.js"])
        .pipe(gulp.dest("./dist"));
});
