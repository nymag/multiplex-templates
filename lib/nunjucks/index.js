'use strict';

var _ = require('lodash'),
  embed = require('../embed');

/**
 * Tries to embed another template into this template
 * @param {{}} data
 * @param {string} name
 * @param {{}} [extraData]
 */
function embedFilter(data, name, extraData) {
  if (!_.isString(name)) {
    return '';
  }

  data = data || {};

  // Add extra data.
  if (_.isObject(extraData)) {
    data = _.cloneDeep(data); // cloneDeep is necessary for embeds within for loops that have extraData.
    _.defaults(data, extraData);
  }

  return embed.render(name, data);
}

exports.embedFilter = embedFilter;