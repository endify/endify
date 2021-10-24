import {CliService} from '../services/CliService/CliService'
import {EndifyCore} from '@endify/core'

export function setupCli(endify: EndifyCore) {
  const cliService = new CliService({
    argv: process.argv,
    endify,
  })
  cliService.registerEmitterEvents()
  return cliService
}

