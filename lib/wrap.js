'use strict'

var reduce = require('lodash/reduce')
var isObject = require('lodash/isObject')
var isFunction = require('lodash/isFunction')
var parse = require('./parse')

module.exports = function wrap (styles, transform) {
  return reduce(styles, function (result, value, key) {
    if (isObject(value) === true) {
      result[key] = wrap(value, transform)
    } else {
      result[key] = isFunction(transform)
        ? transform(parse(value)) : parse(value)
    }
    return result
  }, {})
}
