'use strict';
var expect = require('chai').expect;

describe('Engines', function () {
  it('should expose nunjucks and jade engines', function () {
    var engines = require('./engines')();
    expect(engines.engines).to.have.keys(['nunjucks', 'jade']);
  });

  it('should add nunjucks embed filter', function () {
    var engines = require('./engines')();

    expect(engines.engines.nunjucks.getFilter('embed')).to.be.a('function');
  });

  it('should use passed-in nunjucks instance', function () {
    var env = require('nunjucks').configure('.'),
      engines = require('./engines')({ nunjucks: env });

    expect(engines.engines.nunjucks).to.eql(env);
  });

  it('should use passed-in jade instance', function () {
    var env = require('jade'),
      engines = require('./engines')({ jade: env });

    expect(engines.engines.jade).to.eql(env);
  });
});