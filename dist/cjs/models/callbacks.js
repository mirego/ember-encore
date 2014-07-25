"use strict";
var Ember = require("ember")["default"] || require("ember");

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