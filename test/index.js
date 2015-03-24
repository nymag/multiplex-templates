'use strict';
var glob = require('glob'),
  _ = require('lodash'),
  tests = glob.sync(__dirname + '/../lib/*.test.js');

_.map(tests, function (test) {
  require(test);
});