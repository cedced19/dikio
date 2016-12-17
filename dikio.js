#!/usr/bin/env node
'use strict';
var app = require('express')(),
    serveStatic = require('serve-static'),
    path = require('path'),
    program = require('commander'),
    fs = require('fs'),
    join = require('path').join,
    pkg = require('./package.json'),
    port = require('env-port')('8882'),
    iso639 = require('iso-639-1'),
    languageDetector = new (require('languagedetect'))();

program
    .version(pkg.version)
    .option('-p, --port [number]', 'specified the port')
    .parse(process.argv);

if (!isNaN(parseFloat(program.port)) && isFinite(program.port)) {
  port = program.port;
}

app.get('/api/languages/:langs/:word', function (req, res) {
  var langs = languageDetector.detect(req.params.word);
  var allowed = req.params.langs.split('-');
  var origins = [];
  langs.forEach(function (value, key) {
    if (allowed.indexOf(value[0]) > -1) origins.push({ name: value[0], code: iso639.getCode(value[0]) });
  });
  res.json(origins);
});

app.get('/api/detected-languages', function (req, res) {
  res.json(languageDetector.getLanguages());
});


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
