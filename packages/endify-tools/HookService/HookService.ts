export class HookService {
  private hooks = []

  constructor() {

  }

  public async call(hookId: string, payload: unknown): Promise<unknown> {
    const matchedHooks = this.hooks.filter(hook => {
      return hook[0] === hookId
    })
    return await new Promise((resolve, reject) => {
      let temporaryPayload = payload
      for(let hook of matchedHooks) {
        temporaryPayload = hook[2](temporaryPayload)
      }
      resolve(temporaryPayload)
    })
  }

  public on(hookId: string, name: string, fn: Function) {
    this.hooks.push([hookId, name, fn])
  }
}