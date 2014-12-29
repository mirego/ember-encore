"use strict";
var Ember = require("ember")["default"] || require("ember");

var isArray = Ember.isArray;
var camelize = Ember.String.camelize;
var underscore = Ember.String.underscore;
var singularize = Ember.String.singularize;

exports["default"] = Ember.Mixin.create({
  camelizeKeys: function(hash) {
    for (var key in hash) {
      var newKey = camelize(key);

      if (newKey !== key) {
        hash[newKey] = hash[key];
        delete hash[key];
      }
    }
  },

  extract: function(store, type, payload, id, requestType) {
    // Remove top-level links
    delete payload.links;

    this.extractLinked(payload);

    return this._super(store, type, payload, id, requestType);
  },

  extractSingle: function(store, type, payload, id, requestType) {
    var typeKey = type.typeKey;

    for (var key in payload) {
      var payloadKey = singularize(key);
      if (payloadKey === underscore(typeKey) && isArray(payload[key])) {
        payload[payloadKey] = payload[key][0];
        break;
      }
    }

    delete payload[key];

    return this._super(store, type, payload, id, requestType);
  },

  extractLinks: function(store, type, hash) {
    for (var link in hash.links) {
      this.extractSingleLink(store, type, hash, link);
    }

    if (Ember.keys(hash.links).length === 0) delete hash.links;
  },

  extractSingleLink: function(store, type, hash, link) {
    var newKey = camelize(link);
    var value = hash.links[link];

    var relationships = Ember.get(type, 'relationshipsByName');
    var relationship = relationships.get(newKey);
    var relationshipIsPolymorphic = relationship && relationship.options.polymorphic;

    if (value && value.href) {
      // If we already have the model, just link it
      var model = singularize(camelize(value.type));
      if (store.getById(model, value.id)) {
        this.extractSingleIdLink(hash, link, newKey, value.id, relationshipIsPolymorphic);
      } else {
        var namespace = type.store.adapterFor(type).namespace;
        hash.links[newKey] = '/' + namespace + value.href;
        if (newKey !== link) delete hash.links[link];
      }

    } else {
      this.extractSingleIdLink(hash, link, newKey, value, relationshipIsPolymorphic);
    }

    if (relationshipIsPolymorphic) delete hash[link + '_type'];
  },

  extractSingleIdLink: function(hash, link, newKey, id, relationshipIsPolymorphic) {
    if (relationshipIsPolymorphic) {
      hash[newKey] = {
        id: id,
        type: hash[link + '_type']
      };
    } else {
      hash[newKey] = id;
    }

    delete hash.links[link];
  },

  extractLinked: function(hash) {
    for (var link in hash.linked) {
      if (hash[link]) {
        hash['_' + link] = hash.linked[link];
      } else {
        hash[link] = hash.linked[link];
      }
    }

    delete hash.linked;
  },

  normalize: function(type, hash) {
    hash = this._super(type, hash);

    if (hash && hash.links) this.extractLinks(type.store, type, hash);
    this.camelizeKeys(hash);

    return hash;
  },

  extractMeta: function(store, type, payload) {
    for (var key in payload.meta) {
      var meta = payload.meta[key];
      this.camelizeKeys(meta);
      store.setMetadataFor(type, meta);
    }

    delete payload.meta;
  }
});