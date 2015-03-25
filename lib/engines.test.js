'use strict';
var expect = require('chai').expect,
  engines = require('./engines');

describe('Engines', function () {
  it('should expose nunjucks and jade engines', function () {
    expect(engines.engines).to.have.keys(['nunjucks', 'jade']);
  });

  it('should add nunjucks embed filter', function () {
    expect(engines.engines.nunjucks.getFilter('embed')).to.be.a('function');
  });

  it('should use passed-in nunjucks instance', function () {
    var env = require('nunjucks').configure('.');
    // add a filter to this specific instance
    env.addFilter('foo', function () {});
    engines.set('nunjucks', env);
    expect(engines.engines.nunjucks.getFilter('foo')).to.be.a('function');
  });

  it('should use passed-in jade instance', function () {
    var env = require('jade');
    engines.set('jade', env);
    expect(engines.engines.jade).to.eql(env);
  });
});