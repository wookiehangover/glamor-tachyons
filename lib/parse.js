'use strict'

var helpers = require('./helpers')
var map = require('lodash/map')
var merge = require('lodash/merge')
var tachyons = require('../tachyons')

module.exports = function (classes) {
  var classList
  if (typeof classes === 'string') {
    classList = classes.split(' ')
  } else {
    classList = classes
  }

  return map(classList, function (className) {
    var rule = tachyons[className]
    if (typeof rule === 'string') {
      var size = tachyons[helpers.getAtRuleSize(className)]
      var selector = rule
      rule = {}
      rule[size] = tachyons[selector]
    }

    if (rule) {
      return rule
    } else {
      console.error(className + ' is not in the list of available Tachyons classes')
      return null
    }
  })
  .reduce(function (result, css) {
    return merge(result, css)
  }, {})
}
