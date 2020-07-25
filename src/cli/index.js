#!/usr/bin/env node
const path = require('path')
const paths = {
  issuerPath: process.cwd(),
  basePath: path.resolve(__dirname, '../../'),
}
const FUNCTIONS = {
  dev: () => {
    require('./handlers/dev')({paths})
  },
  build: () => {
    require('./handlers/build')({paths})
  },
  start: () => {
    require('./handlers/start')()
  },
}
const DEFAULT_FUNCTION = () => {
  console.log(`Unknown command "${process.argv[2]}"`)
}
const FUNCTION_ALIASES = {
  '': FUNCTIONS.dev
}

const getCommandHandler = () => {
  const firstArg = process.argv[2] || ''
  if(typeof FUNCTIONS[firstArg] === 'function') {
    return FUNCTIONS[firstArg]
  }

  if(typeof FUNCTION_ALIASES[firstArg] === 'function') {
    return FUNCTION_ALIASES[firstArg]
  }

  return DEFAULT_FUNCTION
}


const cmdHandler = getCommandHandler()

cmdHandler()

