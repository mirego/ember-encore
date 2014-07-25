define(
  ["ember-data","./mixins/extractor","./mixins/serializer","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"] || __dependency1__;
    var extractor = __dependency2__["default"] || __dependency2__;
    var serializer = __dependency3__["default"] || __dependency3__;

    __exports__["default"] = DS.RESTSerializer.extend(extractor, serializer);
  });