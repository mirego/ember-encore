import extractor from 'ember-encore/mixins/extractor';
import serializer from 'ember-encore/mixins/serializer';

export default DS.RESTSerializer.extend(extractor, serializer);
