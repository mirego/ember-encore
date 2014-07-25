"use strict";
var Ember = require("ember")["default"] || require("ember");

var get = Ember.get;
var isNone = Ember.isNone;
var underscore = Ember.String.underscore;
var classify = Ember.String.classify;
var pluralize = Ember.String.pluralize;

exports["default"] = Ember.Mixin.create({
  serializeIntoHash: function(hash, type, record, options) {
    hash[pluralize(underscore(type.typeKey))] = [this.serialize(record, options)];
  },

  keyForAttribute: function(key) {
    return underscore(key);
  },

  serializeBelongsTo: function(record, json, relationship) {
    var key = relationship.key;
    var belongsTo = get(record, key);

    key = this.keyForRelationship ? this.keyForRelationship(key, 'belongsTo') : key;

    if (!json.links) json.links = {};
    json.links[underscore(key)] = isNone(belongsTo) ? null : get(belongsTo, 'id');

    delete json[key];
  },

  serializePolymorphicType: function(record, json, relationship) {
    var key = relationship.key;
    var belongsTo = get(record, key);
    key = this.keyForAttribute ? this.keyForAttribute(key) : key;

    json[key + '_type'] = classify(belongsTo.constructor.typeKey);
    delete json[relationship.key];
  }
});