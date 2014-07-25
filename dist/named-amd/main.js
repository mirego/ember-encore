define("ember-encore/adapter",
  ["ember","ember-data","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    var DS = __dependency2__["default"] || __dependency2__;

    __exports__["default"] = DS.RESTAdapter.extend({
      defaultSerializer: '-encore',

      pathForType: function(type) {
        return Ember.String.pluralize(Ember.String.underscore(type));
      },

      ajaxError: function(jqXHR) {
        var error = this._super(jqXHR);
        var data = JSON.parse(jqXHR.responseText);

        if (jqXHR && jqXHR.status === 422) {
          var errors = data.errors.reduce(function(memo, errorGroup) {
            memo[errorGroup.field] = errorGroup.types[0];
            return memo;
          }, {});

          return new DS.InvalidError(errors);

        } else {
          return error;
        }
      }
    });
  });
define("ember-encore",
  ["ember-data","./models/callbacks","./adapter","./serializer","ember","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"] || __dependency1__;
    var callbacks = __dependency2__["default"] || __dependency2__;
    var Adapter = __dependency3__["default"] || __dependency3__;
    var Serializer = __dependency4__["default"] || __dependency4__;
    var Ember = __dependency5__["default"] || __dependency5__;

    Ember.Application.initializer({
      name: 'ember-encore',
      initialize: function(container) {
        DS.Model.reopen(callbacks);
        container.register('adapter:-encore', Adapter);
        container.register('serializer:-encore', Serializer);
      }
    });

    __exports__.Adapter = Adapter;
    __exports__.Serializer = Serializer;
  });
define("ember-encore/mixins/extractor",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;

    var isArray = Ember.isArray;
    var camelize = Ember.String.camelize;
    var underscore = Ember.String.underscore;
    var singularize = Ember.String.singularize;

    __exports__["default"] = Ember.Mixin.create({
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
          var value = hash.links[link];
          var newKey = camelize(link);

          // Support async relationships
          if (value && value.href) {

            // If we already have the model, just link it
            var model = singularize(camelize(value.type));
            if (store.getById(model, value.id)) {
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
          store.metaForType(type, meta);
        }

        delete payload.meta;
      }
    });
  });
define("ember-encore/mixins/serializer",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;

    var get = Ember.get;
    var isNone = Ember.isNone;
    var underscore = Ember.String.underscore;
    var classify = Ember.String.classify;
    var pluralize = Ember.String.pluralize;

    __exports__["default"] = Ember.Mixin.create({
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
  });
define("ember-encore/models/callbacks",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;

    __exports__["default"] = (function() {
      var capitalize = Ember.String.capitalize;

      var callbackFactory = function(callback) {
        return function() {
          var callbackName = 'will' + capitalize(callback);
          if (Ember.canInvoke(this, callbackName)) this[callbackName]();
        };
      };

      return {
        deleteRecord: function() {
          callbackFactory('deleteRecord').apply(this, arguments);
          return this._super();
        },

        reload: function() {
          callbackFactory('reload').apply(this, arguments);
          return this._super();
        },

        save: function() {
          if (!this.get('isDeleted')) {
            callbackFactory('save').apply(this, arguments);

            if (this.get('isNew')) {
              callbackFactory('create').apply(this, arguments);
            } else {
              callbackFactory('update').apply(this, arguments);
            }
          }

          return this._super();
        }
      };
    })();
  });
define("ember-encore/serializer",
  ["ember-data","./mixins/extractor","./mixins/serializer","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"] || __dependency1__;
    var extractor = __dependency2__["default"] || __dependency2__;
    var serializer = __dependency3__["default"] || __dependency3__;

    __exports__["default"] = DS.RESTSerializer.extend(extractor, serializer);
  });