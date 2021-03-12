import { createSSRApp } from 'vue'
import {createMemoryHistory, createRouter} from 'vue-router'
import {IServerEntryContext} from './enum/IServerEntryContext'
import MainComponent from '../components/MainComponent'
import {setupRoutes} from '../setup/setupRoutes'
import {ConfigService} from '../../../endify-tools/ConfigService/ConfigService'
import config from '@app/config'

const configService = new ConfigService()

import testConfig from '@app/config-vue'


export default async function(context: IServerEntryContext) {
  console.log('mamy config', testConfig)
  await configService.loadConfig(config) // TODO: Move this function, it can't be loaded each request
  let history = createMemoryHistory()
  let router = createRouter({
    routes: await setupRoutes(),
    history
  })
  await router.push(context.req.url)
  await router.isReady()
  const app = createSSRApp(MainComponent)
  app.use(router)
  return app
}