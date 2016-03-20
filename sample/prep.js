var shell = require('shelljs');
var open = require('open');

shell.echo('hello world');

shell.exec("npm install");

shell.exec("gulp prep");

shell.exec('node server.js', {async:true});

open('http://localhost:3000/index.html');