import {setupCli} from './setupCli'
import {setupEndifyCore} from './setupEndifyCore'
import {EndifyLogger} from '@endify/core'
import * as randomTextFaces from 'random-text-faces'

export async function setup() {
  const loggerService = new EndifyLogger('[@endify/cli]')
  loggerService.log('Nice to see you, Endifier!', randomTextFaces.get())
  loggerService.log('Initializing @endify/core')
  const endify = await setupEndifyCore()
  const cliService = await setupCli(endify)
  await cliService.run()
}
