"use strict";
var DS = require("ember-data")["default"] || require("ember-data");
var callbacks = require("./models/callbacks")["default"] || require("./models/callbacks");
var Adapter = require("./adapter")["default"] || require("./adapter");
var Serializer = require("./serializer")["default"] || require("./serializer");
var Ember = require("ember")["default"] || require("ember");

Ember.Application.initializer({
  name: 'ember-encore',
  initialize: function(container) {
    DS.Model.reopen(callbacks);
    container.register('adapter:-encore', Adapter);
    container.register('serializer:-encore', Serializer);
  }
});

exports.Adapter = Adapter;
exports.Serializer = Serializer;