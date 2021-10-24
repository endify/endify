import * as http from 'http'
import {ILoggerService} from '../../../../core/src/services/LoggerService/types/ILoggerService'
import * as chalk from 'chalk'
import * as EventEmitter from 'events'
import {ServerServiceEvent} from './enum/ServerServiceEvent'

const DEFAULT_PORT = 3000

export class ServerService extends EventEmitter {
  private app
  private server
  private loggerService: ILoggerService
  private port: number
  private appFactory: () => Promise<unknown>

  constructor(loggerService, appFactory) {
    super()
    this.loggerService = loggerService
    this.appFactory = appFactory
    this.port = DEFAULT_PORT
  }

  private createServer() {
    this.server = http.createServer(this.app || undefined)
  }

  closeServer() {
    this.server.close()
  }

  listen(port: number): Promise<void> {
    return new Promise(resolve => {
      this.server.listen(port, () => {
        resolve()
      })
    })
  }

  public setPort(port): void {
    this.port = port || DEFAULT_PORT
  }

  async setupServer(): Promise<void> {
    this.loggerService.log('Creating server...')
    this.app = await this.appFactory()
    this.createServer()
    await this.listen(this.port)
    this.loggerService.log(chalk.gray('--------------------------------'))
    this.loggerService.success('Server has started successfully.')
    this.loggerService.success(`Listening on http://localhost:${this.port}`)
    this.loggerService.log(chalk.gray('--------------------------------'))
  }

  async reloadApp() {
    const app = await this.appFactory()
    if(this.app) {
      this.server.removeListener('request', this.app)
      this.server.on('request', app)
    }
    this.app = app
  }
}
