#!/usr/bin/env node
console.log('endify cli initialized')
const path = require('path')
const paths = {
  issuerPath: process.cwd(),
  basePath: path.resolve(__dirname, '../../'),
}
const relativePath = path.relative(paths.issuerPath, paths.basePath);
paths.isSymlinked = !(relativePath && !relativePath.startsWith('..') && !path.isAbsolute(relativePath))
const config = require(path.join(paths.issuerPath, 'endify.config.build.js'))

const handlerInfoObject = {
  paths,
  config,
  argv: process.argv.slice(2)
}
const FUNCTIONS = {
  dev: () => {
    require('./handlers/dev')(handlerInfoObject)
  },
  'build:api': () => {
    require('./handlers/build')(handlerInfoObject)
  },
  start: () => {
    require('./handlers/start')(handlerInfoObject)
  },
}
const DEFAULT_FUNCTION = () => {
  console.log(`Unknown command "${process.argv[2]}"`)
}
const FUNCTION_ALIASES = {
  '': FUNCTIONS.dev,
  'build:api': FUNCTIONS['build:api'],
  'build:client': FUNCTIONS['build:api'],
  'build:client:native': FUNCTIONS['build:api'],
  'build:native:win': FUNCTIONS['build:api'],
  'build:native:mac': FUNCTIONS['build:api'],
  'build:native:linux': FUNCTIONS['build:api'],
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
