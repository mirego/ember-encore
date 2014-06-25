export default (function() {
  var capitalize = Ember.String.capitalize;
  var callbacks = ['update', 'deleteRecord', 'reload'];

  var callbackFactory = function(callback) {
    return function() {
      var callbackName = 'will' + capitalize(callback);
      if (Ember.canInvoke(this, callbackName)) this[callbackName]();
      return this._super();
    };
  };

  return callbacks.reduce(function(memo, callback) {
    if (callback != 'update') {
      memo[callback] = callbackFactory(callback);

    } else {
      var callbackFunction = callbackFactory('update');

      memo.save = function() {
        if (!this.get('isNew')) callbackFunction();
      };
    }

    return memo;
  }, {});
})();
