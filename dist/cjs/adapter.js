"use strict";
var Ember = require("ember")["default"] || require("ember");
var DS = require("ember-data")["default"] || require("ember-data");

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