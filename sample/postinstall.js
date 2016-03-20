var shell = require('shelljs');
var open = require('open');

shell.exec("gulp postinstall");

shell.exec('node server.js', {async:true});

open('http://localhost:3000/index.html');
