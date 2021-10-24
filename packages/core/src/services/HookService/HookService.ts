import {IHookService} from './types/IHookService'

export class HookService implements IHookService {
  private hooks = {

  }

  public registerHook<T>(name: string, hook: T): T {
    if(this.hooks[name]) {
      throw new Error(`Hook already registered: ${name}`)
    }
    this.hooks[name] = hook
    return hook
  }

  public getHook<T>(name: string) {
    const hook = this.hooks[name]
    if(!hook) {
      throw new Error(`Hook not found: ${name}`)
    }
    return hook
  }
}
