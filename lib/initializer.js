import DS from 'ember-data';
import Adapter from './adapter';
import Serializer from './serializer';
import callbacks from './models/callbacks';

export default {
  name: 'ember-encore',
  initialize: function(container) {
    DS.Model.reopen(callbacks);
    container.register('adapter:-encore', Adapter);
    container.register('serializer:-encore', Serializer);
  }
};
