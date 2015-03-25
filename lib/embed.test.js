'use strict';
var embed = require('./embed'),
  expect = require('chai').expect,
  sinon = require('sinon'),
  glob = require('glob'),
  engines = require('./engines')();

describe('Embed Module', function () {
  describe('getTemplate()', function () {
    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      sandbox.restore();
    });

    it('throws error if no templates found', function () {
      sandbox.stub(glob, 'sync').returns([]);
      expect(function () {
        return embed.getTemplate();
      }).to.throw(Error);
    });

    it('throws error if templates found are not supported', function () {
      sandbox.stub(glob, 'sync').returns(['foo.html']);
      expect(function () {
        return embed.getTemplate();
      }).to.throw(Error);
    });

    it('gets a nunjucks template', function () {
      sandbox.stub(glob, 'sync').returns(['template.nunjucks']);
      expect(embed.getTemplate()).to.eql('template.nunjucks');
    });

    it('gets a jade template', function () {
      sandbox.stub(glob, 'sync').returns(['template.jade']);
      expect(embed.getTemplate()).to.eql('template.jade');
    });

    it('gets a mustache template', function () {
      sandbox.stub(glob, 'sync').returns(['template.mustache']);
      expect(embed.getTemplate()).to.eql('template.mustache');
    });
  });

  describe('render()', function () {
    var sandbox, nunjucksMock, jadeMock,
    string = 'foo',
    obj = {text: 'foo'};

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
      nunjucksMock = sinon.mock(engines.engines.nunjucks);
      jadeMock = sinon.mock(engines.engines.jade);
    });

    afterEach(function () {
      sandbox.restore();
      nunjucksMock.restore();
      jadeMock.restore();
    });

    it('should render nunjucks', function () {
      sandbox.stub(glob, 'sync').returns(['foo.nunjucks']);
      nunjucksMock.expects('render').withArgs(string, obj);
      embed.render(string, obj);
      nunjucksMock.verify();
    });

    it('should render jade', function () {
      sandbox.stub(glob, 'sync').returns(['foo.jade']);
      jadeMock.expects('renderFile').withArgs(string, obj);
      embed.render(string, obj);
      nunjucksMock.verify();
    });
  });
});