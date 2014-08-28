define(
  ["ember-data","./adapter","./serializer","./models/callbacks","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"] || __dependency1__;
    var Adapter = __dependency2__["default"] || __dependency2__;
    var Serializer = __dependency3__["default"] || __dependency3__;
    var callbacks = __dependency4__["default"] || __dependency4__;

    __exports__["default"] = {
      name: 'ember-encore',
      initialize: function(container) {
        DS.Model.reopen(callbacks);
        container.register('adapter:-encore', Adapter);
        container.register('serializer:-encore', Serializer);
      }
    };
  });