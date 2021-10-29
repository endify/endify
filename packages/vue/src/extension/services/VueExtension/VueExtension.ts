import {IVueExtensionOptions} from "./types/IVueExtensionOptions";
import {join, resolve} from "path";
import {Configuration, HotModuleReplacementPlugin, ProgressPlugin, webpack} from "webpack";
import {fork} from "child_process";

export class VueExtension {
  private options: IVueExtensionOptions

  constructor(options: IVueExtensionOptions) {
    this.options = options
  }

  setup(endify) {
    const endifyServerEmitter = endify.emitters.getEmitter('@endify/server')
    endifyServerEmitter.on('after-register', async () => {
      const webpackConfig = await this.getWebpackConfig(endify)
      await this.dev(endify, webpackConfig)
    })
  }

  async getWebpackConfig({emitters}) {
    // const endifyVueEntry = resolve(__dirname, __non_webpack_require__.resolve('@endify/vue/entry'))
    // const webpackHotPollPath = __non_webpack_require__.resolve('webpack/hot/poll')
    // const userEntry = resolve(process.cwd(), this.userEntry)
    // const endifyCoreEmitter = emitters.getEmitter('@endify/core')
    // const webpackConfig: Configuration = {
    //   target: 'node',
    //   entry: [`${webpackHotPollPath}?1000`, endifyVueEntry],
    //   mode: 'development',
    //   output: {
    //     filename: 'endify-server.js',
    //     path: join(process.cwd(), 'build/endify-server'),
    //     libraryTarget: 'commonjs2',
    //   },
    //   resolve: {
    //     alias: {
    //       '@endify/vue/user-entry': userEntry,
    //     },
    //     extensions: ['.ts', '.js', '.json', '.vue'],
    //   },
    //   plugins: [
    //     new HotModuleReplacementPlugin(),
    //     new ProgressPlugin((percentage, message) => {
    //       endifyCoreEmitter.emit('update-progress-entity', {
    //         percentage,
    //         message,
    //         name: '@endify/vue',
    //       })
    //     }),
    //   ],
    //   optimization: {
    //     moduleIds: 'named',
    //   },
    //   externals: [nodeExternals({
    //     allowlist: [`${webpackHotPollPath}?1000`, '@endify/vue/user-entry'],
    //   })],
    // }
    // return webpackConfig
  }

  async dev({emitters}, webpackConfig) {
    console.log('woaah 1')
    const endifyServerEmitter = emitters.getEmitter('@endify/server')
    endifyServerEmitter.emit('call-parent', {
      id: '@endify/vue:build-progress-change',
      payload: {
        siema: 1,
        elo: 2,
        test: true
      },
    })
    // const userBuildPath = this.buildPath
    // const compiler = webpack(webpackConfig)
    // let spawned = false
    // compiler.watch({
    //
    // }, async (error, stats) => {
    //   if(error) {
    //     return this.endifyLogger.error('Build failed', error)
    //   }
    //   if(!spawned) {
    //     let inspectPort = null
    //     if(this.inspectPort === true) {
    //       inspectPort = 9229
    //     }
    //     if(typeof this.inspectPort === 'number') {
    //       inspectPort = this.inspectPort
    //     }
    //     // const args = this.inspectPort === null ? [userBuildPath] : [`--inspect=${inspectPort}`, userBuildPath]
    //     // const apiProcess = spawn('node', args, {
    //     //   stdio: ['pipe', 'inherit', 'inherit'],
    //     // })
    //     const apiProcess = fork(userBuildPath, [], {
    //       // stdio: ['pipe', 'inherit', 'inherit'],
    //       // execArgv:
    //       cwd: process.cwd(),
    //     })
    //     apiProcess.on('close', (code) => {
    //       return this.endifyLogger.warn('API process has been shut down, status code:', code)
    //     })
    //     spawned = true
    //   }
    // })
  }
}