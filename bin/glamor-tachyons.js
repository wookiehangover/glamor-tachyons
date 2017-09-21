#!/usr/bin/env node

'use strict'

const generate = require('../generate')
const args = process.argv.slice(2)[0]

switch (args) {
    case '-h':
    case '--help':
        console.log(`Usage: glamor-tachyons <path/to/tachyons.css> [options]\n`)
        break;
    default:
        generate(args)
        break
}