"use strict";
var DS = require("ember-data")["default"] || require("ember-data");
var extractor = require("./mixins/extractor")["default"] || require("./mixins/extractor");
var serializer = require("./mixins/serializer")["default"] || require("./mixins/serializer");

exports["default"] = DS.RESTSerializer.extend(extractor, serializer);