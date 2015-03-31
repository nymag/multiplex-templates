'use strict';
var render = require('./render'),
  sinon = require('sinon'),
  glob = require('glob'),
  cons = require('consolidate');

describe('Render', function () {
  var sandbox, mock,
    obj = {text: 'foo'};

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    mock = sinon.mock(cons);
  });

  afterEach(function () {
    sandbox.restore();
    mock.restore();
  });

  it('should render nunjucks', function () {
    var tpl = 'foo.nunjucks';

    sandbox.stub(glob, 'sync').returns([tpl]);
    mock.expects('nunjucks').withArgs(tpl, obj);
    render(tpl, obj).then(function () {
      mock.verify();
    });
  });

  it('should render jade', function () {
    var tpl = 'foo.jade';

    sandbox.stub(glob, 'sync').returns([tpl]);
    mock.expects('jade').withArgs(tpl, obj);
    render(tpl, obj).then(function () {
      mock.verify();
    });
  });
});