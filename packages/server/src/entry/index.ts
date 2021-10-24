import {ServerSetupService} from '@endify/server'
import userEntry from '@endify/server/user-entry'

const serverSetupService = new ServerSetupService(userEntry)
serverSetupService.setup()

if (module.hot) {
  module.hot.accept(['@endify/server/user-entry'], async () => {
    serverSetupService.performHotUpdate(userEntry)
  })
}
