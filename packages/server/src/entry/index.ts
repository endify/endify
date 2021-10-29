//TODO: Fix starting broken entry
import {ServerSetupService} from '@endify/server'

let serverSetupService
async function start() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const userEntry = await import('@endify/server/user-entry')
  serverSetupService = new ServerSetupService(userEntry.default)
  await serverSetupService.setup()
}

start().catch(error => {
  console.log('error with start', error)
})

if (module.hot) {
  module.hot.accept(['@endify/server/user-entry'], async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const userEntry = await import('@endify/server/user-entry')
      await serverSetupService.performHotUpdate(userEntry.default)
    } catch(e) {
      console.log('eeee?', e)
    }
  })
}
