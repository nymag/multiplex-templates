'use strict';
var expect = require('chai').expect,
  sinon = require('sinon'),
  template = require('./template'),
  embed = require('./embed');

describe('Template embedding:', function () {
  var fakeTemplateWithoutData = 'Fake T3mpl4te',
    fakeTemplateData = {thing: 'stuff!'},
    fakeMergedDefaults = {thing: 'stuff!', otherThing: 'more stuff!'},
    mock;

  beforeEach(function () {
    mock = sinon.mock(embed);
  });

  afterEach(function () {
    mock.restore();
  });

  describe('standalone:', function () {
    it('Handles missing name by returning emptystring', function () {
      var result = template.embed();
      expect(result).to.equal('');
    });

    it('Renders template with empty data', function () {
      mock.expects('render').withArgs('jfklda', {});
      template.embed(undefined, 'jfklda', undefined);
      mock.verify();
    });

    it('Return data in template when piped from calling template', function () {
      mock.expects('render').withArgs('withData', fakeTemplateData);
      template.embed(fakeTemplateData, 'withData', {});
      mock.verify();
    });

    it('Return data in template when given from extraData parameter', function () {
      mock.expects('render').withArgs('withData', fakeTemplateData);
      template.embed({}, 'withData', fakeTemplateData);
      mock.verify();
    });

    it('Data piped from parent has higher priority than extra parameters', function () {
      mock.expects('render').withArgs('withData', fakeTemplateData);
      template.embed(fakeTemplateData, 'withData', { thing: 'defaults'});
      mock.verify();
    });
  });

  describe('nunjucks filter:', function () {
    var nunjucks = require('nunjucks'),
      filter = template.embed,
      fakeTemplateWithData = 'Fake T3mpl4te {{ thing }}',
      MockLoader, env;

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

    it('data passed from parent', function () {
      var template = 'start {{ {thing: "stuff!"} | embed("withData") }}';

      mock.expects('render').withArgs('withData', fakeTemplateData);
      env.addFilter('embed', filter);
      env.renderString(template);
      mock.verify();
    });

    it('empty passed from parent and data passed as default', function () {
      var template = 'start {{ {} | embed("withData", {thing: "stuff!"}) }}';

      mock.expects('render').withArgs('withData', fakeTemplateData);
      env.addFilter('embed', filter);
      env.renderString(template);
      mock.verify();
    });

    it('data from parent wins', function () {
      var template = 'start {{ {thing: "stuff!"} | embed("withData", {thing: "not shown"}) }}';

      mock.expects('render').withArgs('withData', fakeTemplateData);
      env.addFilter('embed', filter);
      env.renderString(template);
      mock.verify();
    });

    it('using extraData', function () {
      var template = 'start {{ {thing: "stuff!"} | embed("withData", {otherThing: "more stuff!"}) }}';

      mock.expects('render').withArgs('withData', fakeMergedDefaults);
      env.addFilter('embed', filter);
      env.renderString(template);
      mock.verify();
    });
  });

  describe('jade function:', function () {
    var jade = require('jade'),
      locals = { embed: template.embed };

    beforeEach(function () {
      mock = sinon.mock(embed);
    });

    afterEach(function () {
      mock.restore();
    });

    it('data passed from parent', function () {
      var template = 'start #{embed({thing: "stuff!"}, "withData")}';

      mock.expects('render').withArgs('withData', fakeTemplateData);
      jade.render(template, locals);
      mock.verify();
    });

    it('empty passed from parent and data passed as default', function () {
      var template = 'start #{embed({}, "withData", {thing: "stuff!"})}';

      mock.expects('render').withArgs('withData', fakeTemplateData);
      jade.render(template, locals);
      mock.verify();
    });

    it('data from parent wins', function () {
      var template = 'start #{embed({thing: "stuff!"}, "withData", {thing: "not shown"})}';

      mock.expects('render').withArgs('withData', fakeTemplateData);
      jade.render(template, locals);
      mock.verify();
    });

    it('using extraData', function () {
      var template = 'start #{embed({thing: "stuff!"}, "withData", {otherThing: "more stuff!"})}';

      mock.expects('render').withArgs('withData', fakeMergedDefaults);
      jade.render(template, locals);
      mock.verify();
    });


  })
});