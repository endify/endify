import {ServerService} from './setup/ServerService/ServerService'
import {LoggerService} from '../endify-core/src/services/LoggerService/LoggerService'
import * as express from 'express'
import {ConfigService} from '../endify-core/src/services/ConfigService/ConfigService'
import config from '@app/config'
import {endifyVueMiddleware} from '@endify/vue/server'
import {ServerHookTypes} from '../endify-core/src/services/HookService/types/ServerHookTypes'
import configExtension from '@endify/config-extension'
import {HookService} from '../endify-core/src/services/HookService/HookService'

// TODO: Modify webpack hot logs to match endify style
// import webpackHotLog from '@endify/node_modules/webpack/hot/log'
// webpackHotLog.setLogLevel(null)

// TODO: Add inversify container to handle these
// const hooks: Record<ServerHookTypes, unknown> = {
//  [ServerHookTypes.Log]: loggerService
// }
const loggerService = new LoggerService('Endify', ' |')
const configService = new ConfigService()
const serverService = new ServerService(loggerService, appFactory)
const hookService = new HookService()

async function appFactory() {
  const app = express()
  await hookService.call(ServerHookTypes.BeforeClientMiddleware, {
    app,
  })
  app.use('/', await endifyVueMiddleware(configService.config.vue))
  await hookService.call(ServerHookTypes.AfterClientMiddleware, {
    app,
  })
  return app
}

async function setup() {
  const extensions = [
    configExtension,
  ] as Function[]
  for(const extension of extensions) {
    extension({
      call: hookService.call.bind(hookService),
      on: hookService.on.bind(hookService),
    })
  }
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
