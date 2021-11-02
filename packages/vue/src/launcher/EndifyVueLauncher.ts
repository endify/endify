import {join} from 'path'
import {EndifyCore, EndifyLogger} from '@endify/core'

export class EndifyVueLauncher {
  private readonly userEntry: string
  private readonly inspectPort: number|boolean
  private readonly buildPath: string
  private endifyLogger = new EndifyLogger('[@endify/vue]')

  constructor({entry, inspectPort, buildPath}) {
    this.userEntry = entry
    this.inspectPort = inspectPort
    this.buildPath = buildPath || join(process.cwd(), 'build/endify-vue/endify-vue.js')
  }

  async setup(endify: EndifyCore) {
    const endifyCoreEmitter = endify.emitters.getEmitter('@endify/core')
    endifyCoreEmitter.on('first-build', async () => {
      await this.dev(endify)
    })
  }

  async dev(endify) {
    const endifyServerEmitter = endify.emitters.getEmitter('@endify/server')
    const endifyCoreEmitter = endify.emitters.getEmitter('@endify/core')

    endifyServerEmitter.on('receive-child', ({id, payload}) => {
      if(id === '@endify/vue:build-progress-change') {
        endifyCoreEmitter.emit('update-progress-entity', {
          percentage: payload.percentage,
          message: payload.message,
          name: '@endify/vue',
        })
      }
      if(id === '@endify/vue:get-launcher-options') {
        endifyServerEmitter.emit('call-child', {
          id: '@endify/vue:set-launcher-options',
          payload: {
            userEntry: this.userEntry
          }
        })
      }
    })




    let childBuiltOnce = false
    await new Promise((resolve, reject) => {
      endifyServerEmitter.on('receive-child', ({id}) => {
        if(!childBuiltOnce && id === '@endify/vue:after-build') {
          resolve(null)
        }
      })
    })
  }
}
