'use strict'

const fs = require('mz/fs')
const nativeCss = require('native-css')
const glamor = require('glamor')
const { forEach, reduce, kebabCase } = require('lodash')

function fixSelector(selector) {
  return kebabCase(selector.replace('__', 'q')).replace(/-?q-?/, '--')
}

fs.readFile('./node_modules/tachyons/css/tachyons.css', 'utf8')
  .then((src) => {
    const [ resetSrc, tachyonsModules ] = src.split('/* Modules */')
    const tachyons = reduce(nativeCss.convert(tachyonsModules), (result, rule, selector) => {
      if (selector.indexOf('@') !== 0) {
        result[fixSelector(selector)] = rule
      }
      // Handle Media Queries by flattening them into the list of global rules
      else {
        forEach(rule, (value, key) => {
          result[fixSelector(key)] = {
            [selector]: value
          }
        })
      }
      return result
    }, {})

    const reset = reduce(resetSrc.split('\n'), (result, line) => {
      if (/^[\/ ]+[\*=]/.test(line) === false) {
        result.push(line)
      }
      return result
    }, [])

    return { reset, tachyons }
  })
  .then((tachyons) => {
    return fs.writeFile('./tachyons.json', JSON.stringify(tachyons, null, 2))
  })