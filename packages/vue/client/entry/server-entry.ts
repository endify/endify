import {createSSRApp} from 'vue'
import {createMemoryHistory, createRouter} from 'vue-router'
import {IServerEntryContext} from './enum/IServerEntryContext'
import {setupRoutes} from '../setup/setupRoutes'
import {ConfigService} from '../../../core/src/services/ConfigService/ConfigService'
import config from '@app/config'
import {setupStore} from '../setup/setupStore'
import {setupRouter} from '../setup/setupRouter'

const configService = new ConfigService()

export default async function(context: IServerEntryContext) {
  await configService.loadConfig(config) // TODO: Move this function, it can't be loaded each request
  const app = createSSRApp(configService.config.mainComponent) // TODO: Add default main component
  await setupRouter({
    app,
    url: context.req.url,
    history: createMemoryHistory(),
    routes: await setupRoutes({
      config: configService.config,
    }),
  })
  setupStore({
    app,
  })
  return app
}

