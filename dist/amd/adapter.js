define(
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