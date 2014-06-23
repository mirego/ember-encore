import callbacks from 'ember-encore/mixins/adapter-callbacks';

export default DS.RESTAdapter.extend(callbacks, {
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
