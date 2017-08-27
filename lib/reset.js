'use strict'

var reset = require('../tachyons/reset')

// TODO: glamor/reset has an out of date normalize version compared to Tachyons,
// so we need to add it to the global
module.exports = function (glamor) {
  reset.forEach(function (rule) {
    glamor.insertRule(rule)
  })
}
