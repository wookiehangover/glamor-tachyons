'use strict'

exports.hasClass = function (selector) {
  return /^\.\S+/.test(selector)
}

exports.isClassSelector = function (selector) {
  return /^\.[^.# ]+$/.test(selector)
}

var atRuleRegExp = /^\.?(.*)-([nsml]{1,2})$/

exports.getAtRuleSize = function (selector) {
  return selector.replace(atRuleRegExp, '$2')
}

exports.stripAtRuleSize = function (selector) {
  return selector.replace(atRuleRegExp, '$1')
}

exports.getPseudos = function (selector) {
  return selector.replace(/^[^:]*(.*)$/, '$1')
}
