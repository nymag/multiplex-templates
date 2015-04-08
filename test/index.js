'use strict';
var glob = require('glob'),
  _ = require('lodash'),
  tests = glob.sync(__dirname + '/../lib/**/*.test.js'),
  multiplex = require('../.'),
  sinon = require('sinon'),
  expect = require('chai').expect;

_.map(tests, function (test) {
  require(test);
});

describe('interface', function () {

  var sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('can stub render on bare function', function () {
    sandbox.mock(multiplex).expects('render').once();

    expect(function () {
      multiplex.render();
    }).to.not.throw();

    sandbox.verify();
  });

  it('can stub render on function results', function () {
    sandbox.mock(multiplex).expects('render').once();

    expect(function () {
      multiplex().render();
    }).to.not.throw();

    sandbox.verify();
  });

  it('can replace engines from object or bare function', function () {
    var newEngine = {},
      instance = multiplex({thing: newEngine});

    expect(instance.engines.thing).to.equal(newEngine); //not deep equal, but ref equal
    expect(multiplex.engines.thing).to.equal(newEngine); //not deep equal, but ref equal

    sandbox.verify();
  });
});