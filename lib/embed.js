'use strict';

var _ = require('lodash'),
  render = require('./render');

/**
 * Tries to embed another template into this template
 * @param {string} name
 * @param {{}} [data]
 * @param {{}} [extraData]
 */
function embedTemplate(name, data, extraData) {
  if (!_.isString(name)) {
    return '';
  }

  data = data || {};

  // Add extra data.
  if (_.isObject(extraData)) {
    data = _.cloneDeep(data); // cloneDeep is necessary for embeds within for loops that have extraData.
    _.defaults(data, extraData);
  }

  return render(name, data);
}

module.exports = embedTemplate;