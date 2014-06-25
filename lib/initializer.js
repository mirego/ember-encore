import callbacks from 'ember-encore/models/callbacks';
import Adapter from 'ember-encore/adapter';
import Serializer from 'ember-encore/serializer';

Ember.onLoad('Ember.Application', function(Application) {
  Application.initializer({
    name: 'ember-encore',
    initialize: function(container) {
      DS.Model.reopen(callbacks);
      container.register('adapter:-encore', Adapter);
      container.register('serializer:-encore', Serializer);
    }
  });
});
