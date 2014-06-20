import Adapter from 'ember-encore/adapter';
import Serializer from 'ember-encore/serializer';

Ember.onLoad('Ember.Application', function(Application) {
  Application.initializer({
    name: 'ember-encore',
    initialize: function(container) {
      container.register('adapter:-encore', Adapter);
      container.register('serializer:-encore', Serializer);
    }
  });
});
