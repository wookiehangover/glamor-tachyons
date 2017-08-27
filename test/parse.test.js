'use strict'

const Lab = require('lab')
const { expect } = require('code')
const lab = exports.lab = Lab.script()
const { describe, it } = lab
const parse = require('../lib/parse')

describe('Tachyons ClassName Parser', function () {
  it('converts a string of classes into an object', (done) => {
    expect(parse('mv3')).to.equal({ marginTop: '1rem', marginBottom: '1rem' })
    done()
  })

  it('accepts an array of classes', (done) => {
    expect(parse(['red', 'bg-black'])).to.equal({ color: '#ff4136', backgroundColor: '#000' })
    done()
  })

  it('handles media queries', (done) => {
    expect(parse('mt3-l ml3-l mt2-m mt1-ns')).to.equal({
      '@media screen and (min-width: 30em)': {
        marginTop: '.25rem'
      },
      '@media screen and (min-width: 30em) and (max-width: 60em)': {
        marginTop: '.5rem'
      },
      '@media screen and (min-width: 60em)': {
        marginTop: '1rem',
        marginLeft: '1rem'
      }
    })
    done()
  })

  it('logs an error when a class is not found', (done) => {
    const err = console.error
    global.console.error = (msg) => {
      expect(msg).to.include('f9')
    }
    expect(parse('mt3 f9')).to.equal({
      marginTop: '1rem'
    })
    global.console.error = err
    done()
  })
})
