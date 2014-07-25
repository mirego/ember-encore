// jshint node:true

var moduleFilter = require('broccoli-dist-es6-module');

var modules = moduleFilter('lib', {
  global: 'EmberEncore',
  packageName: 'ember-encore',
  main: 'main',
  shim: {
    'ember': 'Ember',
    'ember-data': 'DS'
  }
});

module.exports = modules;
