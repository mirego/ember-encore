"use strict";
var Ember = require("ember")["default"] || require("ember");
var Adapter = require("./adapter")["default"] || require("./adapter");
var Serializer = require("./serializer")["default"] || require("./serializer");
var initializer = require("./initializer")["default"] || require("./initializer");

Ember.onLoad('Ember.Application', function(Application) {
  Application.initializer(initializer);
});

if (Ember.libraries) {
  Ember.libraries.register('ember-encore', '1.1.0');
}

exports.Adapter = Adapter;
exports.Serializer = Serializer;