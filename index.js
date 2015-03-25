'use strict';
var _ = require('lodash'),
  embed = require('./lib/embed'),
  engines = require('./lib/engines');

module.exports = function (instances) {
  // if instances are passed through, use them
  if (instances) {
    _.forOwn(instances, function (instance, name) {
      // add them to our engines
      engines.set(name, instance);
    });
  }

  // expose the renderer and the engines
  return {
    render: embed.render,
    engines: engines.engines
  };
};