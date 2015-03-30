'use strict';
var glob = require('glob'),
  path = require('path'),
  _ = require('lodash'),
  Promise = require('bluebird'),
  cons = require('consolidate'),
  embed = require('./template').embed;

/**
 * get full filename w/ extension
 * @param  {string} filePath e.g. "layouts/index/template"
 * @return {string}          e.g. "layouts/index/template.jade"
 */
function getTemplate(filePath) {
  var possibleTemplates = glob.sync(filePath + '.*'),
    i = 0,
    l = possibleTemplates.length,
    possTemplate;

  if (!l) {
    throw new Error('No template files found for ' + filePath);
  }

  for (; i < l; i++) {
    possTemplate = possibleTemplates[i];

    if (_.contains(possTemplate, 'nunjucks') || _.contains(possTemplate, '.jade') || _.contains(possTemplate, '.mustache')) {
      return possTemplate;
    } else {
      throw new Error('No supported templates found for ' + filePath);
    }
  }
}

/**
 * render a layout or component with some data
 * @param  {string} name 
 * @param  {{}} data 
 * @param  {string} [type] "layout"/"component" defaults to "component"
 * @return {Promise}
 */
function render(name, data, type) {
  var d = Promise.defer();

  data = data || {};
  type = type || 'component';

  if (!data.embed) {
    // add embed function to the locals passed into the template
    data.embed = embed;
  }

  // grab the template file and find out what engine it uses (from the extension)
  var templateFile = getTemplate(type + 's/' + name + '/template'),
    engine = path.extname(templateFile).substring(1); // get rid of the .

  cons[engine](templateFile, data, function (err, html) {
    if (err) {
      d.reject(err);
    } else {
      d.resolve(html);
    }
  });

  return d.promise;
}

exports.getTemplate = getTemplate;
exports.render = render;