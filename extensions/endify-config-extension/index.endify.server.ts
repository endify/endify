import {ServerHookTypes} from '../../packages/endify-tools/HookService/types/ServerHookTypes'
import config from '@app/config'
import {ConfigService} from '../../packages/endify-tools/ConfigService/ConfigService'

const configService = new ConfigService()

export default function({hooks}) {
  hooks.tap(ServerHookTypes.Log, 'QuietLogging', () => {
    return false
  })

}

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