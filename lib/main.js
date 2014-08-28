import Ember from 'ember';
import Adapter from './adapter';
import Serializer from './serializer';
import initializer from './initializer';

Ember.onLoad('Ember.Application', function(Application) {
  Application.initializer(initializer);
});

if (Ember.libraries) {
  Ember.libraries.register('ember-encore', '@@VERSION');
}

export { Adapter, Serializer };
