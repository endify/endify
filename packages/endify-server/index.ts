import {ServerService} from './setup/ServerService/ServerService'
import {LoggerService} from '../endify-tools/LoggerService/LoggerService'
import * as express from 'express'
import {ConfigService} from '../endify-tools/ConfigService/ConfigService'
import config from '@app/config'
import {endifyVueMiddleware} from '@endify/vue/server'
import {ServerHookTypes} from '../endify-tools/HookService/types/ServerHookTypes'

// TODO: Modify webpack hot logs to match endify style
// import webpackHotLog from '@endify/node_modules/webpack/hot/log'
// webpackHotLog.setLogLevel(null)

// TODO: Add inversify container to handle these
const hooks: Record<ServerHookTypes, unknown> = {

}

const b = ServerHookTypes.Log as ServerHookTypes

const loggerService = new LoggerService('Endify', ' |')
const configService = new ConfigService()
const serverService = new ServerService(loggerService, appFactory)

loggerService.hooks.log.tap('test', (args) => {
  console.log('taki mamy length argsow', args.length)
  return true
})
async function appFactory() {
  const app = express()
  app.use('/', await endifyVueMiddleware(configService.config.vue))
  return app
}

async function setup() {
  await configService.loadConfig(config)
  await serverService.setPort(configService.config.port)
  await serverService.setupServer()
}
setup().then()

if (module.hot) {
  module.hot.accept(['@app/config'], async () => {
    try {
      loggerService.log('Reloading configuration file...')
      await configService.loadConfig(config)
      loggerService.log('Restarting server...')
      await serverService.reloadApp()
      loggerService.success('Server has reloaded successfully.')
    } catch(e) {
      loggerService.error(e)
    }
  })
}