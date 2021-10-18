import {ServerSetupService} from '@endify/server'
import serverEntry from '@endify/server/user-entry'

const serverSetupService = new ServerSetupService(serverEntry)
serverSetupService.setup()

if (module.hot) {
  module.hot.accept(['@endify/server/user-entry'], async () => {
    console.log('eeee? update')
    serverSetupService.performHotUpdate(serverEntry)
  })
}
