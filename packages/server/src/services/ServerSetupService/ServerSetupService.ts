import {EndifyLogger} from '@endify/core'
import {ServerService} from '../ServerService/ServerService'
import * as express from 'express'

export class ServerSetupService {
  private serverEntry
  private config
  private loggerService = new EndifyLogger('[@endify/server]')
  private serverService: ServerService

  constructor(serverUserEntry) {
    this.serverEntry = serverUserEntry
    this.serverService = new ServerService(this.loggerService, () => {
      const app = express()
      app.get('/', (req, res) => {
        res.send('siema')
      })
      return app
    })
  }

  async setup() {
    await this.loadConfig()
    this.serverService.setPort(this.config.port)
    await this.serverService.setupServer()
  }

  async performHotUpdate(serverEntry) {
    this.serverEntry = serverEntry
    const previousConfig = this.config
    await this.loadConfig()
    if(previousConfig.port !== this.config.port) {
      this.serverService.closeServer()
      this.serverService.setPort(this.config.port)
      await this.serverService.setupServer()
    } else {
      await this.serverService.reloadApp()
    }
  }

  async loadConfig() {
    const config = await this.serverEntry()
    this.loggerService.log('Config reloaded', config)
    this.config = config
  }
}
