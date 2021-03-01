import * as http from 'http'
import {ILoggerService} from '../../endify-tools/LoggerService/types/ILoggerService'

export class ServerService {
  private app
  private server
  private loggerService: ILoggerService
  private readonly port: number

  constructor(loggerService) {
    this.loggerService = loggerService
    this.port = 3000
  }

  setupServer() {
    this.loggerService.log('Creating server...')
    this.server = http.createServer(this.app || undefined)
    this.server.listen(this.port, () => {
      this.loggerService.success(`Server is listening on http://localhost:${this.port}`)
    })
  }

  loadApp(app) {
    if(this.app) {
      this.server.removeListener('request', this.app)
    }
    this.server.on('request', app)
    this.app = app
  }
}

// if (module.hot) {
//   module.hot.accept(['../services/api/setupServerService', '@project/endify.config.server.js', '../services/ServerConfigService'], async () => {
//     try {
//       serverConfigService.invalidateConfig()
//       const expressApp = await setupServerAdapter()
//       if(currentExpressApp) {
//         server.removeListener('request', currentExpressApp)
//       }
//       server.on('request', expressApp)
//       currentExpressApp = expressApp
//     } catch(e) {
//       console.error(e)
//     }
//   })
// }