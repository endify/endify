import {join, resolve} from 'path'
import {webpack} from 'webpack'
import {fork, spawn} from 'child_process'
import {Configuration, HotModuleReplacementPlugin, ProgressPlugin} from 'webpack'
import * as nodeExternals from 'webpack-node-externals'
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
    this.endifyLogger.log('Setting up VueLauncher...')
    const endifyCoreEmitter = endify.emitters.getEmitter('@endify/core')
    endifyCoreEmitter.on('first-build', async () => {
      await this.dev(endify)
    })
  }

  async dev(endify) {
    const endifyServerEmitter = endify.emitters.getEmitter('@endify/server')
    const endifyCoreEmitter = endify.emitters.getEmitter('@endify/core')

    endifyServerEmitter.on('receive-child', ({id, payload}) => {
      console.log('got message from child', id, payload)
      if(id === '@endify/vue:build-progress-change') {
        endifyCoreEmitter.emit('update-progress-entity', {
          percentage: payload.percentage,
          message: payload.message,
          name: '@endify/vue',
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
