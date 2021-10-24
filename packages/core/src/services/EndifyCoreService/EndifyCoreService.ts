import {IEndifyCoreService} from './types/IEndifyCoreService'
import {Environment} from './enum/Environment'
import {EmitterService} from '../EmitterService/EmitterService'

export class EndifyCoreService implements IEndifyCoreService {
  private environment: Environment
  public readonly emitters = new EmitterService()

  constructor() {
    this.registerEmitterEvents()
  }

  registerEmitterEvents() {
    const endifyCoreEmitter = this.emitters.registerEmitter('@endify/core')

  }

  build() {

  }

  runDevelopmentServer() {
    const endifyCoreEmitter = this.emitters.getEmitter('@endify/core')
    endifyCoreEmitter.emit('before-setup')
  }

  startProductionServer() {

  }
}
