import  {ServerHookTypes} from '../endify-tools/HookService/types/ServerHookTypes'
import config from '@app/config'
import {ConfigService} from '../endify-tools/ConfigService/ConfigService'

const configService = new ConfigService()

export default async function({call, on}) {
  await configService.loadConfig(config)
  on(ServerHookTypes.BeforeClientMiddleware, 'endify-config', async ({app}) => {
    await configService.config.extendApp(app)
  })
}

// if (module.hot) {
//   module.hot.accept(['@app/config'], async () => {
//     try {
//       loggerService.log('Reloading configuration file...')
//       await configService.loadConfig(config)
//       loggerService.log('Restarting server...')
//       await serverService.reloadApp()
//       loggerService.success('Server has reloaded successfully.')
//     } catch(e) {
//       loggerService.error(e)
//     }
//   })
// }