'use strict';
var embed = require('./lib/embed'),
  engines = require('./lib/engines');

module.exports = function (instances) {
  var instantiatedEngines = engines(instances);

  // expose the renderer and the engines
  return {
    render: embed.render,
    engines: instantiatedEngines.engines
  };
};