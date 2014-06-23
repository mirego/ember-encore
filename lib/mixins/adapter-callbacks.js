var capitalize = Ember.String.capitalize;

export default Ember.Mixin.create((function() {
  var callbacks = ['create', 'update', 'delete'];

  return callbacks.reduce(function(memo, callback) {
    memo[callback + 'Record'] = function(store, type, record) {
      var callbackName = 'will' + capitalize(callback);
      if (Ember.canInvoke(record, callbackName)) record[callbackName]();
      return this._super(store, type, record);
    };

    return memo;
  }, {});
})());
