var get = Ember.get;
var isNone = Ember.isNone;
var isArray = Ember.isArray;

var camelize = Ember.String.camelize;
var underscore = Ember.String.underscore;
var classify = Ember.String.classify;
var pluralize = Ember.String.pluralize;
var singularize = Ember.String.singularize;

EmberEncore.Serializer = DS.RESTSerializer.extend({

  // Extraction methods

  camelizeKeys: function(hash) {
    for (var key in hash) {
      var newKey = camelize(key);

      if (newKey != key) {
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
      if (payloadKey === typeKey && isArray(payload[key])) {
        payload[payloadKey] = payload[key][0];
        break;
      }
    }

    delete payload[key];

    return this._super(store, type, payload, id, requestType);
  },

  extractLinks: function(store, type, hash) {
    for (var link in hash.links) {
      var value = hash.links[link];
      var newKey = camelize(link);

      // Support async relationships
      if (value && value.href) {

        // If we already have the model, just link it
        if (store.getById(Ember.String.singularize(newKey), value.id)) {
          hash[newKey] = value.id;
          delete hash.links[link];

        } else {
          var namespace = type.store.adapterFor(type).namespace;
          hash.links[newKey] = '/' + namespace + value.href;
          if (newKey != link) delete hash.links[link];
        }

      } else {
        hash[newKey] = hash.links[link];
        delete hash.links[link];
      }
    }

    if (Ember.keys(hash.links).length === 0) delete hash.links;
  },

  extractLinked: function(hash) {
    for (var link in hash.linked) {
      hash[link] = hash.linked[link];
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
      store.metaForType(type, meta);
    }

    delete payload.meta;
  },

  // Serialization methods

  serializeIntoHash: function(hash, type, record, options) {
    hash[pluralize(type.typeKey)] = [this.serialize(record, options)];
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
