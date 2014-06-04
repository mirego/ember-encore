var EmberEncore = {};

Ember.onLoad('Ember.Application', function(Application) {
  Application.initializer({
    name: 'EmberEncore',
    initialize: function(container) {
      container.register('serializer:-encore', EmberEncore.Serializer);
      container.register('adapter:-encore', EmberEncore.Adapter);
    }
  });
});
