import {setupCli} from './setupCli'
import {setupEndifyCore} from './setupEndifyCore'

export async function setup() {
  const endify = await setupEndifyCore()
  const cliService = await setupCli(endify)
  await cliService.run()
}
