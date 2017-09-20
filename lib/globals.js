'use strict'

var helpers = require('./helpers')
var map = require('lodash/map')
var reduce = require('lodash/reduce')
var kebabCase = require('lodash/kebabCase')
var flatten = require('lodash/flatten')
var tachyons = require('../tachyons')

function reduceRule (className, rule) {
    var size = tachyons[helpers.getAtRuleSize(className)]
    return reduce(rule, function (result, value, key) {
        var raw = '.' + className + '{' + kebabCase(key) + ':' + value + ';}'
        if (typeof size === 'string') {
            raw = size + '{' + raw + '}'
        }
        result.push(raw)
        return result
    }, [])
}

module.exports = function (classes) {
    var classList
    if (typeof classes === 'string') {
      classList = classes.split(' ')
    } else {
      classList = classes
    }

    var raws = map(classList, function (className) {
        var rule = tachyons[className]
        if (typeof rule === 'string') {
            var selector = rule
            rule = tachyons[selector]
        }

        if (rule) {
            // console.log(rule)
            return reduceRule(className, rule)
        } else {
            console.error(className + ' is not in the list of available Tachyons classes')
            return []
        }
    })

    return flatten(raws)
}
