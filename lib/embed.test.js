'use strict';
var expect = require('chai').expect,
  proxyquire = require('proxyquire'),
  sinon = require('sinon');

describe('Template embedding:', function () {
  var fakeTemplateWithoutData = 'Fake T3mpl4te',
    fakeTemplateData = {thing: 'stuff!'},
    fakeMergedDefaults = {thing: 'stuff!', otherThing: 'more stuff!'},
    expectation, embed;

  beforeEach(function () {
    expectation = sinon.expectation.create('render');
    embed = proxyquire('./embed', { './render': expectation });
  });

  describe('standalone:', function () {
    it('Handles missing name by returning emptystring', function () {
      var result = embed();
      expect(result).to.equal('');
    });

    it('Renders template with empty data', function () {
      expectation.withArgs('jfklda', {});
      embed('jfklda');
      expectation.verify();
    });

    it('Return data in template when piped from calling template', function () {
      expectation.withArgs('withData', fakeTemplateData);
      embed('withData', fakeTemplateData);
      expectation.verify();
    });

    it('Return data in template when given from extraData parameter', function () {
      expectation.withArgs('withData', fakeTemplateData);
      embed('withData', {}, fakeTemplateData);
      expectation.verify();
    });

    it('Data piped from parent has higher priority than extra parameters', function () {
      expectation.withArgs('withData', fakeTemplateData);
      embed('withData', fakeTemplateData, { thing: 'defaults'});
      expectation.verify();
    });
  });

  describe('nunjucks:', function () {
    var nunjucks = require('nunjucks'),
      fakeTemplateWithData = 'Fake T3mpl4te {{ thing }}',
      locals, MockLoader, env;

    before(function () {
      MockLoader = nunjucks.Loader.extend({
        init: function () {},
        async: false,
        getSource: function (name) {
          if (name.indexOf('withData') !== -1) {
            return {src: fakeTemplateWithData};
          } else {
            return {src: fakeTemplateWithoutData};
          }
        }
      });
      
      //NOTE:  Nunjucks is REALLY slow when starting up, so to prevent everyone having to wait for it whenever they run
      // tests, we'll only be testing using a single copy.  Just a warning.
      nunjucks.configure('views', {
        watch: false
      });
      env = new nunjucks.Environment(new MockLoader());
    });

    beforeEach(function () {
      locals = { embed: embed };
    });

    it('data passed from parent', function () {
      var template = 'start {{ embed("withData", {thing: "stuff!"}) }}';

      expectation.withArgs('withData', fakeTemplateData);
      env.renderString(template, locals);
      expectation.verify();
    });

    it('empty passed from parent and data passed as default', function () {
      var template = 'start {{ embed("withData", {}, {thing: "stuff!"}) }}';

      expectation.withArgs('withData', fakeTemplateData);
      env.renderString(template, locals);
      expectation.verify();
    });

    it('data from parent wins', function () {
      var template = 'start {{ embed("withData", {thing: "stuff!"}, {thing: "not shown"}) }}';

      expectation.withArgs('withData', fakeTemplateData);
      env.renderString(template, locals);
      expectation.verify();
    });

    it('using extraData', function () {
      var template = 'start {{ embed("withData", {thing: "stuff!"}, {otherThing: "more stuff!"}) }}';

      expectation.withArgs('withData', fakeMergedDefaults);
      env.renderString(template, locals);
      expectation.verify();
    });
  });

  describe('jade function:', function () {
    var jade = require('jade'),
      locals;

    beforeEach(function () {
      locals = { embed: embed };
    });

    it('data passed from parent', function () {
      var template = 'start #{embed("withData", {thing: "stuff!"})}';

      expectation.withArgs('withData', fakeTemplateData);
      jade.render(template, locals);
      expectation.verify();
    });

    it('empty passed from parent and data passed as default', function () {
      var template = 'start #{embed("withData", {}, {thing: "stuff!"})}';

      expectation.withArgs('withData', fakeTemplateData);
      jade.render(template, locals);
      expectation.verify();
    });

    it('data from parent wins', function () {
      var template = 'start #{embed("withData", {thing: "stuff!"}, {thing: "not shown"})}';

      expectation.withArgs('withData', fakeTemplateData);
      jade.render(template, locals);
      expectation.verify();
    });

    it('using extraData', function () {
      var template = 'start #{embed("withData", {thing: "stuff!"}, {otherThing: "more stuff!"})}';

      expectation.withArgs('withData', fakeMergedDefaults);
      jade.render(template, locals);
      expectation.verify();
    });
  });
});