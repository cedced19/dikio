#!/usr/bin/env node
'use strict';
var app = require('express')(),
    serveStatic = require('serve-static'),
    path = require('path'),
    program = require('commander'),
    fs = require('fs'),
    join = require('path').join,
    pkg = require('./package.json'),
    port = require('env-port')('8882');

program
    .version(pkg.version)
    .option('-p, --port [number]', 'specified the port')
    .parse(process.argv);

if (!isNaN(parseFloat(program.port)) && isFinite(program.port)) {
  port = program.port;
}

/*
app.get('/api/words', function (req, res) {

});
*/

app.disable('x-powered-by');

app.use(serveStatic(__dirname + '/dist'));

app.listen(port, function () {
  console.log(require('server-welcome')(port, 'Dikio'));
  require('check-update')({
    packageName: pkg.name,
    packageVersion: pkg.version,
    isCLI: true
  }, function (err, latestVersion, defaultMessage) {
    if (!err) {
      console.log(defaultMessage);
    }
  });
});
