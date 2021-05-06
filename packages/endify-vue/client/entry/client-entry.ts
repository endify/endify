import {createApp} from 'vue'
import config from '@app/config'
import {ConfigService} from '../../../endify-tools/ConfigService/ConfigService'
import {setupRouter} from '../setup/setupRouter'
import {createWebHistory} from 'vue-router'
import {setupRoutes} from '../setup/setupRoutes'
import {setupStore} from '../setup/setupStore'

const configService = new ConfigService()

const start = async () => {
  await configService.loadConfig(config)
  const app = createApp(configService.config.mainComponent)
  await setupRouter({
    app,
    url: window.location.href,
    history: createWebHistory(),
    routes:  await setupRoutes({
      config: configService.config
    })
  })
  setupStore({app})
  app.mount('#app')
}

start().then()