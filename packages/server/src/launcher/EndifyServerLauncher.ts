import {join, resolve} from 'path'
import {webpack} from 'webpack'
import {fork, spawn} from 'child_process'
import {Configuration, HotModuleReplacementPlugin, ProgressPlugin} from 'webpack'
import * as nodeExternals from 'webpack-node-externals'
import {EndifyCore, EndifyLogger} from '@endify/core'

export class EndifyServerLauncher {
  private readonly userEntry: string
  private readonly inspectPort: number|boolean
  private readonly buildPath: string
  private endifyLogger = new EndifyLogger('[@endify/server]')

  constructor({entry, inspectPort, buildPath}) {
    this.userEntry = entry
    this.inspectPort = inspectPort
    this.buildPath = buildPath || join(process.cwd(), 'build/endify-server/endify-server.js')
  }

  async setup(endify: EndifyCore) {
    this.endifyLogger.log('Setting up ServerLauncher...')
    const endifyCoreEmitter = endify.emitters.getEmitter('@endify/core')
    endifyCoreEmitter.on('first-build', async () => {
      const webpackConfig = await this.getWebpackConfig(endify)
      await this.dev(endify, webpackConfig)
    })
  }

  async getWebpackConfig({emitters}) {
    const endifyServerEntry = resolve(__dirname, __non_webpack_require__.resolve('@endify/server/entry'))
    const webpackHotPollPath = __non_webpack_require__.resolve('webpack/hot/poll')
    const userEntry = resolve(process.cwd(), this.userEntry)
    const endifyCoreEmitter = emitters.getEmitter('@endify/core')
    const webpackConfig: Configuration = {
      target: 'node',
      entry: [`${webpackHotPollPath}?1000`, endifyServerEntry],
      mode: 'development',
      output: {
        filename: 'endify-server.js',
        path: join(process.cwd(), 'build/endify-server'),
        libraryTarget: 'commonjs2',
        // hotUpdateChunkFilename: 'hot/hot-update.js',
        // hotUpdateMainFilename: 'hot/hot-update.json',
      },
      resolve: {
        alias: {
          '@endify/server/user-entry': userEntry,
        },
        extensions: ['.ts', '.js', '.json'],
      },
      plugins: [
        new HotModuleReplacementPlugin(),
        new ProgressPlugin((percentage, message) => {
          endifyCoreEmitter.emit('update-progress-entity', {
            percentage,
            message,
            name: '@endify/server',
          })
        }),
      ],
      optimization: {
        moduleIds: 'named',
      },
      externals: [nodeExternals({
        allowlist: [`${webpackHotPollPath}?1000`, '@endify/server/user-entry'],
      })],
    }
    return webpackConfig
  }

  dev({emitters}: EndifyCore, webpackConfig) {
    const userBuildPath = this.buildPath
    const compiler = webpack(webpackConfig)
    let spawned = false
    compiler.watch({

    }, async (error, stats) => {
      if(error) {
        return this.endifyLogger.error('Build failed', error)
      }
      if(!spawned) {
        let inspectPort = null
        if(this.inspectPort === true) {
          inspectPort = 9229
        }
        if(typeof this.inspectPort === 'number') {
          inspectPort = this.inspectPort
        }
        // const args = this.inspectPort === null ? [userBuildPath] : [`--inspect=${inspectPort}`, userBuildPath]
        // const apiProcess = spawn('node', args, {
        //   stdio: ['pipe', 'inherit', 'inherit'],
        // })
        const apiProcess = fork(userBuildPath, [], {
          // stdio: ['pipe', 'inherit', 'inherit'],
          // execArgv:
          cwd: process.cwd(),
        })
        apiProcess.on('close', (code) => {
          return this.endifyLogger.warn('API process has been shut down, status code:', code)
        })
        spawned = true
      }
    })
  }

  prod() {
    console.log('Build production launcher for EndifyServer')
  }

  start() {
    console.log('Start EndifyServer')
  }
}
