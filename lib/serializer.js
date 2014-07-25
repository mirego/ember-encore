import DS from 'ember-data';
import extractor from './mixins/extractor';
import serializer from './mixins/serializer';

export default DS.RESTSerializer.extend(extractor, serializer);
