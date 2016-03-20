var express = require('express');
var app = express();

var oneDay = 86400000;

var staticWithCaching = express.static(__dirname, {maxAge: oneDay});
var staticWithoutCaching = express.static(__dirname);

app.use(function(req, res, next) {
    var options;
    if (req.path.indexOf("/src") == 0) {
        return staticWithCaching(req, res, next);
    }

    return staticWithoutCaching(req, res, next);
});


app.listen(process.env.PORT || 3000);
