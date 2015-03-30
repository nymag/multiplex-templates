'use strict';
var _ = require('lodash'),
  cons = require('consolidate'),
  embed = require('./lib/embed');

module.exports = function (instances) {
  // if instances are passed through, use them
  if (instances) {
    _.forOwn(instances, function (instance, name) {
      // add them to our engines
      cons.requires[name] = instance;
    });
  }

  // expose the renderer and the engines
  return {
    render: embed.render,
    engines: cons.engines
  };
};