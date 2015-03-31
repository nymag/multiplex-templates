'use strict';
var path = require('path'),
  Promise = require('bluebird'),
  cons = require('consolidate'),
  embed = require('./embed');

/**
 * render a layout or component with some data
 * @param  {string} tpl 
 * @param  {{}} data 
 * @param  {string} [type] "layout"/"component" defaults to "component"
 * @return {Promise}
 */
function render(tpl, data, type) {
  var d = Promise.defer();

  data = data || {};
  type = type || 'component';

  if (!data.embed) {
    // add embed function to the locals passed into the template
    data.embed = embed;
  }

  // grab the template file and find out what engine it uses (from the extension)
  var engine = path.extname(tpl).substring(1); // get rid of the .

  cons[engine](tpl, data, function (err, html) {
    if (err) {
      d.reject(err);
    } else {
      d.resolve(html);
    }
  });

  return d.promise;
}

module.exports = render;