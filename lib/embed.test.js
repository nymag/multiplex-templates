'use strict';
var embed = require('./embed'),
  expect = require('chai').expect,
  sinon = require('sinon'),
  glob = require('glob'),
  engines = require('./engines');

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
    var sandbox,
    html = '<strong>foo</strong>';

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      sandbox.restore();
    });

    it('should render nunjucks', function () {
      sandbox.stub(glob, 'sync').returns(['foo.nunjucks']);
      sandbox.stub(engines.nunjucks, 'render').returns(html);

      expect(embed.render('foo', 'foo')).to.equal(html);
    });

    it('should render jade', function () {
      sandbox.stub(glob, 'sync').returns(['foo.jade']);
      sandbox.stub(engines.jade, 'render').returns(html);

      expect(embed.render('foo', 'foo')).to.equal(html);
    });
  });
});