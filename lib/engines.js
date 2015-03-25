'use strict';
var _ = require('lodash'),
  engines = {},
  supported = ['nunjucks', 'jade'];

module.exports = function (instances) {
  // if instances are passed through, use them
  if (instances) {
    _.forOwn(instances, function (instance, name) {
      // add them to our engines
      engines[name] = instance;
    });
  }

  // iterate through the supported engines, instantiating any that weren't passed in (or don't exist already)
  _.map(supported, function(name) {
    if (!engines[name]) {
      if (name === 'nunjucks') {
        engines.nunjucks = require('nunjucks').configure('.', { autoescape: true });
      } else if (name === 'jade') {
        engines.jade = require('jade');
      }
    }
  });

  // add embed filters and mixins
  engines.nunjucks.addFilter('embed', require('./nunjucks').embedFilter);

  return {
    engines: engines,

    // expose consolidated render method for each engine
    nunjucks: {
      render: engines.nunjucks.render.bind(engines.nunjucks)
    },

    jade: {
      render: engines.jade.renderFile.bind(engines.jade)
    }
  };
};