import {EmitterService, EndifyLogger} from '@endify/core'
import {ServerService} from '../ServerService/ServerService'
import * as express from 'express'

export class ServerSetupService {
  private serverEntry
  private config
  private loggerService = new EndifyLogger('[@endify/server]')
  private serverService: ServerService
  public readonly emitters = new EmitterService()

  constructor(serverUserEntry) {
    this.serverEntry = serverUserEntry
    this.serverService = new ServerService(this.loggerService, () => {
      return this.appFactory()
    })
  }

  async appFactory() {
    const app = express()
    const endifyServerEmitter = this.emitters.getEmitter('@endify/server')
    app.get('/test', (req, res) => {
      res.send('test')
    })
    await endifyServerEmitter.emit('create-app', {app})
    return app
  }

  registerEmitterEvents() {
    const endifyServerEmitter = this.emitters.registerEmitter('@endify/server')
    endifyServerEmitter.on('call-parent', ({id, payload}) => {
      process.send({
        __endify: true,
        id,
        payload,
      })
    })

    process.on('message', ({__endify, id, payload}) => {
      if(__endify) {
        endifyServerEmitter.emit('receive-parent', {
          id,
          payload,
        }).catch(e => {
          this.loggerService.error('Error after emit receive-parent', e)
        })
      }
    })
  }

  async setup() {
    this.registerEmitterEvents()
    await this.loadConfig()
    await this.setupExtensions()
    const endifyServerEmitter = this.emitters.getEmitter('@endify/server')
    await endifyServerEmitter.emit('after-register')
    this.serverService.setPort(this.config.port)
    await this.serverService.setupServer()
  }

  async setupExtensions() {
    await Promise.all(this.config.extensions.map(extension => extension.setup({
      emitters: this.emitters
    })))
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
    this.config = await this.serverEntry()
  }
}
