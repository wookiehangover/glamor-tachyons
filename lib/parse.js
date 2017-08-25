'use strict'

var map = require('lodash/map')
var isArray = require('lodash/isArray')
var merge = require('lodash/merge')
var tachyons = require('../tachyons')
var helpers = require('./helpers')

module.exports = function parseClassName(classes) {
  var classList
  if (typeof classes === 'string') {
    classList = classes.split(' ')
  } else if (isArray(classes)) {
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
      return ''
    }
  })
  .reduce(function (result, css) {
    return merge(result, css)
  }, {})
}