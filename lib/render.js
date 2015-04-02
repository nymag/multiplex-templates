'use strict';
var path = require('path'),
  _ = require('lodash'),
  deasync = require('deasync'),
  cons = require('consolidate'),
  embedTemplate, render;

/**
 * Tries to embed another template into this template
 * @param {string} tpl
 * @param {{}} [data]
 * @param {{}} [extraData]
 */
embedTemplate = function(tpl, data, extraData) {
  if (!_.isString(tpl)) {
    return '';
  }

  data = data || {};

  // Add extra data.
  if (_.isObject(extraData)) {
    data = _.cloneDeep(data); // cloneDeep is necessary for embeds within for loops that have extraData.
    _.defaults(data, extraData);
  }

  return render(tpl, data);
};

/**
 * render a layout or component with some data
 * @param  {string} tpl 
 * @param  {{}} data
 * @return {Promise}
 */
function render(tpl, data) {
  // "the monk who renders nothing receives only empty strings" -Master Foo
  if (!tpl) {
    return '';
  }

  // grab the template file and find out what engine it uses (from the extension)
  var engine = path.extname(tpl).substring(1), // get rid of the .
    syncRender = deasync(cons[engine]);

  data = data || {};

  if (!data.embed) {
    // add embed function to the locals passed into the template
    data.embed = embedTemplate;
  }

  try {
    return syncRender(tpl, data);
  } catch (e) {
    // this will throw errors if your template is messed up!
    console.log(e.message, e.stack);
  }
}

module.exports = render;
module.exports.embedTemplate = embedTemplate; // for testing

// DI
module.exports.setRenderer = function (renderer) {
  render = renderer;
};