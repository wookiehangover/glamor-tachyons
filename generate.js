'use strict'

const fs = require('fs')
const path = require('path')
const postcss = require('postcss')
const { camelCase, forEach, isEqual, map } = require('lodash')
const helpers = require('./lib/helpers')

const parseCSS = function (contents) {
  const root = postcss.parse(contents)
  const reset = []
  const tachyons = {}
  const atRules = {}

  function wrapAtRule (selector, rule, props) {
    const size = helpers.getAtRuleSize(selector)
    const baseName = helpers.stripAtRuleSize(selector)
    const atRule = `@${rule.parent.name} ${rule.parent.params}`

    if (atRules[size] && atRules[size] !== atRule) {
      throw new Error(`Yikes, multiple at-rules detected. Something's wrong.`)
    }

    atRules[size] = atRule

    if (tachyons[baseName] && isEqual(tachyons[baseName], props)) {
      return baseName
    } else {
      const wrappedProps = {}
      wrappedProps[atRule] = props
      return wrappedProps
    }
  }

  root.walkRules((rule) => {
    const isGlobal = helpers.hasClass(rule.selector) === false

    if (isGlobal) {
      reset.push(rule.toString().replace(/\/\* \d+ \*\//g, '').replace(/\n/g, ''))
    }

    forEach(rule.selectors, (selector) => {
      if (helpers.isClassSelector(selector) !== true) {
        return
      }
      const name = selector.replace(/^\./, '').split(':')[0]
      let props = {}

      rule.walkDecls((decl) => {
        props[camelCase(decl.prop)] = decl.value
      })

      // Prefix all @rules with the right params
      if (rule.parent.type === 'atrule') {
        props = wrapAtRule(selector, rule, props)
      }

      if (/:/.test(selector)) {
        const pseudos = helpers.getPseudos(selector)
        let newProps = {}
        newProps[pseudos] = props
        props = newProps
      }

      tachyons[name] = Object.assign(props, tachyons[name] || {})
    })
  })

  return {
    reset,
    tachyons,
    atRules
  }
}

module.exports = function (tachyonsPath = require.resolve('tachyons/css/tachyons.css')) {
    const tachyonsCss = fs.readFileSync(tachyonsPath, 'utf8')
    const data = parseCSS(tachyonsCss)
    const toRow = (rule, selector) => `"${selector}": ${JSON.stringify(rule)},`
    const resetSrc = `module.exports = ${JSON.stringify(data.reset, null, 2)}`
    const tachyonsSrc = `'use strict'
module.exports = {
    ${map(data.tachyons, toRow).join('\n  ')}
    ${map(data.atRules, toRow).join('\n  ')}
}
    `
    
    fs.writeFileSync(path.join(__dirname, 'tachyons', 'reset.js'), resetSrc)
    fs.writeFileSync(path.join(__dirname, 'tachyons', 'index.js'), tachyonsSrc)

    console.log('glamor-tachyons/tachyons updated!')
}
