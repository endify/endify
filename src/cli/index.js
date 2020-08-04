#!/usr/bin/env node
const FUNCTIONS = {
  dev: () => {
    require('./handlers/dev')()
  },
  build: () => {
    require('./handlers/build')()
  },
  start: () => {
    console.log('Start function is not supported yet')
  }
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

