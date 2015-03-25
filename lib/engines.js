// todo: use consolidate.js when it exposes engines and
// allows you to add filters, globals, etc to engine instances before rendering
'use strict';
var nunjucks = require('nunjucks').configure('.', { autoescape: true }),
    jade = require('jade');

// add nunjucks embed filter
nunjucks.addFilter('embed', require('./nunjucks').embedFilter);

module.exports = {
  // expose engines
  engines: {
    nunjucks: nunjucks,
    jade: jade
  },

  // expose consolidated render methods for each engine
  nunjucks: {
    render: nunjucks.render.bind(nunjucks)
  },

  jade: {
    render: jade.renderFile.bind(jade)
  }
};