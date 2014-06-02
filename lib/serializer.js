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

  extractLinks: function(type, hash) {
    for (var link in hash.links) {
      var value = hash.links[link];

      if (value) {
        if (typeof value == 'string') {
          hash[link] = hash.links[link];

        // Support `async` relationships
        } else {
          var namespace = type.store.adapterFor(type).namespace;
          hash.links[link] = '/' + namespace + '/' + value.href;
        }
      }
    }
  },

  extractLinked: function(hash) {
    for (var link in hash.linked) {
      hash[link] = hash.linked[link];
    }

    delete hash.linked;
  },

  normalize: function(type, hash) {
    if (hash && hash.links) this.extractLinks(type, hash);
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

  serializeAttribute: function(record, json, key, attribute) {
    if (!attribute.options.readOnly) {
      this._super(record, json, key, attribute);
      var newKey = underscore(key);
      var value = get(record, key);
      json[newKey] = value;
      if (newKey != key) delete json[key];
    }
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
