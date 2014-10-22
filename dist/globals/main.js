!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.EmberEncore=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;
var DS = window.DS["default"] || window.DS;

exports["default"] = DS.RESTAdapter.extend({
  defaultSerializer: '-encore',

  pathForType: function(type) {
    return Ember.String.pluralize(Ember.String.underscore(type));
  },

  ajaxError: function(jqXHR) {
    var error = this._super(jqXHR);
    var data = JSON.parse(jqXHR.responseText);

    if (jqXHR && jqXHR.status === 422) {
      var errors = data.errors.reduce(function(memo, errorGroup) {
        memo[errorGroup.field] = errorGroup.types;
        return memo;
      }, {});

      return new DS.InvalidError(errors);

    } else {
      return error;
    }
  }
});
},{}],2:[function(_dereq_,module,exports){
"use strict";
var DS = window.DS["default"] || window.DS;
var Adapter = _dereq_("./adapter")["default"] || _dereq_("./adapter");
var Serializer = _dereq_("./serializer")["default"] || _dereq_("./serializer");
var callbacks = _dereq_("./models/callbacks")["default"] || _dereq_("./models/callbacks");

exports["default"] = {
  name: 'ember-encore',
  initialize: function(container) {
    DS.Model.reopen(callbacks);
    container.register('adapter:-encore', Adapter);
    container.register('serializer:-encore', Serializer);
  }
};
},{"./adapter":1,"./models/callbacks":6,"./serializer":7}],3:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;
var Adapter = _dereq_("./adapter")["default"] || _dereq_("./adapter");
var Serializer = _dereq_("./serializer")["default"] || _dereq_("./serializer");
var initializer = _dereq_("./initializer")["default"] || _dereq_("./initializer");

Ember.onLoad('Ember.Application', function(Application) {
  Application.initializer(initializer);
});

if (Ember.libraries) {
  Ember.libraries.register('ember-encore', '1.1.0');
}

exports.Adapter = Adapter;
exports.Serializer = Serializer;
},{"./adapter":1,"./initializer":2,"./serializer":7}],4:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

var isArray = Ember.isArray;
var camelize = Ember.String.camelize;
var underscore = Ember.String.underscore;
var singularize = Ember.String.singularize;

exports["default"] = Ember.Mixin.create({
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
},{}],5:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

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
},{}],6:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

exports["default"] = (function() {
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
},{}],7:[function(_dereq_,module,exports){
"use strict";
var DS = window.DS["default"] || window.DS;
var extractor = _dereq_("./mixins/extractor")["default"] || _dereq_("./mixins/extractor");
var serializer = _dereq_("./mixins/serializer")["default"] || _dereq_("./mixins/serializer");

exports["default"] = DS.RESTSerializer.extend(extractor, serializer);
},{"./mixins/extractor":4,"./mixins/serializer":5}]},{},[3])
(3)
});