'use strict';
var expect = require('chai').expect,
  sinon = require('sinon'),
  template = require('./template'),
  embed = require('./embed');

describe('Template embedding:', function () {
  describe('nunjucks filter:', function () {
    var nunjucks = require('nunjucks'),
      filter = template.embed,
      fakeTemplateWithoutData = 'Fake T3mpl4te',
      fakeTemplateWithData = 'Fake T3mpl4te {{ thing }}',
      fakeTemplateData = {thing: 'stuff!'},
      fakeMergedDefaults = {thing: 'stuff!', otherThing: 'more stuff!'},
      MockLoader, env, mock;

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
      mock = sinon.mock(embed);
    });

    afterEach(function () {
      mock.restore();
    });

    it('Handles missing name by returning emptystring', function () {
      var result = filter();
      expect(result).to.equal('');
    });

    it('Renders template with empty data', function () {
      mock.expects('render').withArgs('jfklda', {});
      filter(undefined, 'jfklda', undefined);
      mock.verify();
    });

    it('Return data in template when piped from calling template', function () {
      mock.expects('render').withArgs('withData', fakeTemplateData);
      filter(fakeTemplateData, 'withData', {});
      mock.verify();
    });

    it('Return data in template when given from extraData parameter', function () {
      mock.expects('render').withArgs('withData', fakeTemplateData);
      filter({}, 'withData', fakeTemplateData);
      mock.verify();
    });

    it('Data piped from parent has higher priority than extra parameters', function () {
      mock.expects('render').withArgs('withData', fakeTemplateData);
      filter(fakeTemplateData, 'withData', { thing: 'defaults'});
      mock.verify();
    });

    it('Full test from within nunjucks, data passed from parent', function () {
      var template = 'start {{ {thing: "stuff!"} | embed("withData") }}';

      mock.expects('render').withArgs('withData', fakeTemplateData);
      env.addFilter('embed', filter);
      env.renderString(template);
      mock.verify();
    });

    it('Full test from within nunjucks, empty passed from parent and data passed as default', function () {
      var template = 'start {{ {} | embed("withData", {thing: "stuff!"}) }}';

      mock.expects('render').withArgs('withData', fakeTemplateData);
      env.addFilter('embed', filter);
      env.renderString(template);
      mock.verify();
    });

    it('Full test from within nunjucks, data from parent wins', function () {
      var template = 'start {{ {thing: "stuff!"} | embed("withData", {thing: "not shown"}) }}';

      mock.expects('render').withArgs('withData', fakeTemplateData);
      env.addFilter('embed', filter);
      env.renderString(template);
      mock.verify();
    });

    it('Full test from within nunjucks, using extraData', function () {
      var template = 'start {{ {thing: "stuff!"} | embed("withData", {otherThing: "more stuff!"}) }}';

      mock.expects('render').withArgs('withData', fakeMergedDefaults);
      env.addFilter('embed', filter);
      env.renderString(template);
      mock.verify();
    });
  });
});