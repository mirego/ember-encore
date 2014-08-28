define(
  ["ember","./adapter","./serializer","./initializer","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    var Adapter = __dependency2__["default"] || __dependency2__;
    var Serializer = __dependency3__["default"] || __dependency3__;
    var initializer = __dependency4__["default"] || __dependency4__;

    Ember.onLoad('Ember.Application', function(Application) {
      Application.initializer(initializer);
    });

    if (Ember.libraries) {
      Ember.libraries.register('ember-encore', '1.1.0');
    }

    __exports__.Adapter = Adapter;
    __exports__.Serializer = Serializer;
  });