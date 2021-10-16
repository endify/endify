#!/usr/bin/env node
import {CliService} from '@endify/core'

const cliService = new CliService(process.argv)
cliService.start()
