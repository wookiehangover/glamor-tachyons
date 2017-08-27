'use strict'

const Lab = require('lab')
const { expect } = require('code')
const lab = exports.lab = Lab.script()
const { describe, it } = lab
const helpers = require('../lib/helpers')

describe('Helpers', function () {
  describe('.hasClass', function () {
    it('returns true if the input has a class selector', (done) => {
      expect(helpers.hasClass('.foo')).to.be.true()
      expect(helpers.hasClass('html')).to.be.false()
      expect(helpers.hasClass('#main .foo')).to.be.false()
      done()
    })
  })

  describe('.isClassSelector', function () {
    it('returns true if the input has exaclty one class selector', (done) => {
      expect(helpers.isClassSelector('.mv3-ns')).to.be.true()
      expect(helpers.isClassSelector('.mv3-ns.bar')).to.be.false()
      expect(helpers.isClassSelector('.foo #bar')).to.be.false()
      expect(helpers.isClassSelector('html')).to.be.false()
      done()
    })
  })

  describe('.stripAtRuleSize', function () {
    it('returns the name of input without the mq size (ns|m|l)', (done) => {
      expect(helpers.stripAtRuleSize('.mv3-ns')).to.be.equal('mv3')
      expect(helpers.stripAtRuleSize('.mv3-m')).to.be.equal('mv3')
      expect(helpers.stripAtRuleSize('.mv3-l')).to.be.equal('mv3')
      done()
    })
  })

  describe('.getPseudos', function () {
    it('returns all pseudo selectors found in the input', (done) => {
      expect(helpers.getPseudos('.foo:bar::biz')).to.be.equal(':bar::biz')
      done()
    })
  })
})
