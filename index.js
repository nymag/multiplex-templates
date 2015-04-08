'use strict';
var Self,
  _ = require('lodash'),
  cons = require('consolidate'),
  render = require('./lib/render');

Self = function (instances) {
  // if instances are passed through, use them
  if (instances) {
    _.forOwn(instances, function (instance, name) {
      // add them to our engines
      Self.engines[name] = instance;
    });
  }
  return Self;
};
Self.render = render;
Self.engines = cons.requires;

module.exports = Self;