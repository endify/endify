import {ServerSetupService} from './services/ServerSetupService'
import serverEntry from '@endify/server/entry'

const serverSetupService = new ServerSetupService(serverEntry)
serverSetupService.setup()

if (module.hot) {
  module.hot.accept(['@endify/server/entry'], async () => {
    serverSetupService.performHotUpdate(serverEntry)
  })
}
