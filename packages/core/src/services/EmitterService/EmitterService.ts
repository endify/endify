import * as Emittery from 'emittery'

export class EmitterService {
  private emitters = {

  }

  registerEmitter(name: string): Emittery {
    if(this.emitters[name]) {
      throw new Error(`Emitter already registered: ${name}`)
    }
    const emitter = new Emittery()
    this.emitters[name] = emitter
    return emitter
  }

  getEmitter(name: string): Emittery {
    const emitter = this.emitters[name]
    if(!emitter) {
      throw new Error(`Emitter not found: ${name}`)
    }
    return emitter
  }
}
