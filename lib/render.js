'use strict';
var path = require('path'),
  _ = require('lodash'),
  fs = require('fs'),
  deasync = require('deasync'),
  cons = require('consolidate'),
  engines = Object.keys(cons),
  embedTemplate;

// remove consolidate.js helpers
_.remove(engines, function (prop) {
  return prop === 'clearCache' || prop === 'requires';
});

/**
 * include static files, e.g. html, png, gifs
 * @param  {string} file
 * @return {string}
 */
function includeFile(file) {
  try {
    return fs.readFileSync(file).toString();
  } catch (e) {
    // this will throw errors if your file can't be read!
    console.log(e.message, e.stack);
  }
}

/**
 * render a layout or component with some data
 * @param  {string} tpl
 * @param  {{}} data
 * @return {string}
 */
function render(tpl, data) {
  var engine, syncRender;
  // "the monk who renders nothing receives only empty strings" -Master Foo
  if (!tpl) {
    return '';
  }

  // grab the template file and find out what engine it uses (from the extension)
  engine = path.extname(tpl).substring(1); // get rid of the .

  // nunjucks and handlebars support alternate extensions
  if (engine === 'njk') {
    engine = 'nunjucks';
  }

  if (engine === 'hbs') {
    engine = 'handlebars';
  }

  if (_.includes(engines, engine)) {
    // extension is a supported consolidate.js engine!
    // set up the renderer
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
  } else {
    // extension is something else (png, html, etc)
    return includeFile(tpl);
  }
}

/**
 * Tries to embed another template into this template
 * @param {string} tpl
 * @param {{}} [data]
 * @param {{}} [extraData]
 */
embedTemplate = function (tpl, data, extraData) {
  if (!_.isString(tpl)) {
    return '';
  }

  if (_.isObject(data)) {
    // Add extra data.
    if (_.isObject(extraData)) {
      data = _.cloneDeep(data); // cloneDeep is necessary for embeds within for loops that have extraData.
      _.defaults(data, extraData);
    }

    return render(tpl, data);
  }

  return '';
};

module.exports = render;
module.exports.embedTemplate = embedTemplate; // for testing

// DI
module.exports.setRenderer = function (renderer) {
  render = renderer;
};
