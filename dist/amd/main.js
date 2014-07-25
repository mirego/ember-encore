define(
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