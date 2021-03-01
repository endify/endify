import {ServerService} from './setup/ServerService'
import {LoggerService} from '../endify-tools/LoggerService/LoggerService'

const loggerService = new LoggerService('Endify', ' |')
const serverService = new ServerService(loggerService)
serverService.setupServer()
// setupServerService()