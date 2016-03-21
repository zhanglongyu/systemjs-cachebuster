## SystemJS Cache Buster

Most developers use DevTools and disable cache during development. For a large scale SPA application this might be too expensive. Refreshing the browser becomes slower.
systemjs-cachebuster patches SystemJS loader with hash values of each module thus enforce the browser to reload only the modules that were changed

## Installation

```
npm install systemjs-cachebuster
```

Then, you should configure your gulpfile to create a central hash file for all modules. Currently, we only support gulp.

An example of such gulp task may be

```js
var gulp = require("gulp");
var SystemJSCacheBuster = require("systemjs-cachebuster");
var watch = require("gulp-watch");

var files = "src/**/*.js";
var cacheBuster = new SystemJSCacheBuster();

gulp.task('watch', function () {
    return gulp
        .src(files)
        .pipe(cacheBuster.full())
        .pipe(watch(files))
        .pipe(cacheBuster.incremental());
});
```

Once executing the gulp task a file named **system.cachebuster.json** is created. The file contains all calculated hash values (for each file) and is used later by **system.cachebuster.js**
  
Add **system.cachebuster.js** into your HTML. This file patches SystemJS loader so each module is loaded with the hash value.

 ```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body id="body">
    <script src="system.src.js"></script>
    <script src="system.cachebuster.js"></script>
    <script>
        System.defaultJSExtensions = true;

        System.import("src/module3");
    </script>
</body>
</html>
```

## License

MIT
