'use strict'

const fs = require('fs')
const postcss = require('postcss')
const tachyonsCss = fs.readFileSync('node_modules/tachyons/css/tachyons.css', 'utf8')
const { camelCase, forEach, isEqual, map } = require('lodash')

const hasClass = (selector) => /^\.\S+/.test(selector)
const isClassSelector = (selector) => /^\.\S+$/.test(selector)
const atRuleRegExp = /^(.*)-([nsml]{1,2})$/
const getAtRuleSize = (selector) => selector.replace(atRuleRegExp, '$2')
const stripAtRuleSize = (selector) => selector.replace(atRuleRegExp, '$1')

const parseCSS = function (contents) {
    const root = postcss.parse(contents)
    const reset = []
    const tachyons = {}
    const atRules = {}

    root.walkRules((rule) => {
        const isGlobal = hasClass(rule.selector) === false

        if (isGlobal) {
            reset.push(rule.toString().replace(/\/\* \d+ \*\//g, '').replace(/\n/g, ''))
        }

        forEach(rule.selectors, (selector) => {
            if (isClassSelector(selector) !== true) {
                return
            }
            const name = selector.replace(/^\./, '')
            const props = {}

            rule.walkDecls((decl) => {
                props[camelCase(decl.prop)] = decl.value
            })

            // Prefix all @rules with the right params
            if (rule.parent.type === 'atrule') {
                const size = getAtRuleSize(selector)
                const baseName = stripAtRuleSize(name)
                const atRule = `@${rule.parent.name} ${rule.parent.params}`
                
                if (atRules[size] && atRules[size] !== atRule) {
                    throw new Error(`Yike, multiple at rules detected. Something's wrong.`)
                }

                atRules[size] = atRule

                if (tachyons[baseName] && isEqual(tachyons[baseName], props)) {
                    tachyons[name] = baseName
                } else {
                    tachyons[name] = {}
                    tachyons[name][atRule] = props
                }
            } else {
                tachyons[name] = props
            }
        })
    })

    return {
        reset,
        tachyons,
        atRules
    }
}

const data = parseCSS(tachyonsCss)

const toExport = (rule, selector) =>
    `exports['${selector}'] = ${JSON.stringify(rule)};`

fs.writeFileSync('tachyons-reset.js', `module.exports = ${JSON.stringify(data.reset, null, 2)}`)
fs.writeFileSync('tachyons.js', `'use strict'
${map(data.tachyons, toExport).join('\n')}
${map(data.atRules, toExport).join('\n')}
`)
