'use strict';
var expect = require('chai').expect;

describe('Engines', function () {
  it('should expose engines', function () {
    var engines = require('./engines');
    expect(engines.engines).to.have.keys(['nunjucks', 'jade']);
  });

  it('should use the same nunjucks instance', function () {
    expect(require('./engines').engines.nunjucks).to.eql(require('./engines').engines.nunjucks);
  });

  it('should use the same jade instance', function () {
    expect(require('./engines').engines.jade).to.eql(require('./engines').engines.jade);
  });
});