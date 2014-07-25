import DS from 'ember-data';
import callbacks from './models/callbacks';
import Adapter from './adapter';
import Serializer from './serializer';
import Ember from 'ember';

Ember.Application.initializer({
  name: 'ember-encore',
  initialize: function(container) {
    DS.Model.reopen(callbacks);
    container.register('adapter:-encore', Adapter);
    container.register('serializer:-encore', Serializer);
  }
});

export { Adapter, Serializer };
