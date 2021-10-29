import {IEndifyCoreService} from './types/IEndifyCoreService'
import {Environment} from './enum/Environment'
import {EmitterService} from '../EmitterService/EmitterService'
import {ConfigService} from '../ConfigService/ConfigService'
import {CliProgressService} from '../CliProgressService/CliProgressService'
import {LoggerService} from '../LoggerService/LoggerService'

export class EndifyCoreService implements IEndifyCoreService {
  private environment: Environment
  public readonly emitters = new EmitterService()
  private configService = new ConfigService()
  private cliProgressService = new CliProgressService()
  private progressEntities = []
  private loggerService = new LoggerService('[@endify/core]')

  constructor() {
    this.registerEmitterEvents()
  }

  registerEmitterEvents() {
    const endifyCoreEmitter = this.emitters.registerEmitter('@endify/core')
    endifyCoreEmitter.on('update-progress-entity', progressEntity => {
      const existingProgressEntity = this.progressEntities.find(existingProgressEntity => {
        return existingProgressEntity.name === progressEntity.name
      })
      if(!existingProgressEntity) {
        this.progressEntities.push(progressEntity)
      } else {
        existingProgressEntity.message = progressEntity.message
        existingProgressEntity.percentage = progressEntity.percentage
      }
      this.cliProgressService.updateBarState(this.progressEntities)
    })
  }

  async setup({rootPath, configPath}) {
    const resolvedConfigPath = this.configService.getConfigPath(configPath, rootPath)
    const config = await this.configService.loadConfigFromFile(resolvedConfigPath)
    if(config.launchers) {
      await Promise.all(config.launchers.map(async (launcher) => {
        await launcher.setup(this)
      }))
    }
  }

  async build() {
    const endifyCoreEmitter = this.emitters.getEmitter('@endify/core')
    const endifyCliEmitter = this.emitters.getEmitter('@endify/core')
    await endifyCoreEmitter.emit('first-build')
    // this.cliProgressService.removeBars()
  }
}
