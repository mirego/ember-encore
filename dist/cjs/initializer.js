"use strict";
var DS = require("ember-data")["default"] || require("ember-data");
var Adapter = require("./adapter")["default"] || require("./adapter");
var Serializer = require("./serializer")["default"] || require("./serializer");
var callbacks = require("./models/callbacks")["default"] || require("./models/callbacks");

exports["default"] = {
  name: 'ember-encore',
  initialize: function(container) {
    DS.Model.reopen(callbacks);
    container.register('adapter:-encore', Adapter);
    container.register('serializer:-encore', Serializer);
  }
};