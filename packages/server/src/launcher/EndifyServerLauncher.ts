import {join, resolve} from 'path'
import {webpack} from 'webpack'
import {spawn} from 'child_process'
import {Configuration, HotModuleReplacementPlugin, ProgressPlugin} from 'webpack'
import * as nodeExternals from 'webpack-node-externals'
import {EndifyCoreHooks} from '../../../core/src/services/EndifyCoreService/enum/EndifyCoreHooks'

export class EndifyServerLauncher {
  private readonly userEntry: string
  private readonly inspectPort: number|boolean
  private readonly buildPath: string
  private progressReport: [number, string, ...string[]]

  constructor({entry, inspectPort, buildPath}) {
    this.userEntry = entry
    this.inspectPort = inspectPort
    this.buildPath = buildPath || join(process.cwd(), 'build/endify-server/endify-server.js')
  }

  async dev({config, hooks}) {
    const buildProgressChangeHook = hooks.getHook(EndifyCoreHooks.BUILD_PROGRESS_CHANGE)
    const emitBuildProgressChangeHook = hooks.getHook(EndifyCoreHooks.EMIT_BUILD_PROGRESS_CHANGE)
    buildProgressChangeHook.tap('Get endify/server build progress', (entities) => {
      entities.push({
        percentage: this.progressReport[0],
        message: this.progressReport.slice(1),
        name: '@endify/server',
      })
    })
    const endifyServerEntry = resolve(__dirname, __non_webpack_require__.resolve('@endify/server/entry'))
    const webpackHotPollPath = __non_webpack_require__.resolve('webpack/hot/poll')
    const userEntry = resolve(process.cwd(), this.userEntry)
    const userBuildPath = this.buildPath
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
        new ProgressPlugin((percentage, message, ...args) => {
          this.progressReport = [percentage, message, ...args]
          emitBuildProgressChangeHook.call()
        }),
      ],
      optimization: {
        moduleIds: 'named',
      },
      externals: [nodeExternals({
        allowlist: [`${webpackHotPollPath}?1000`, '@endify/server/user-entry'],
      })],
    }
    const compiler = webpack(webpackConfig)
    let spawned = false
    compiler.watch({

    }, async (error, stats) => {
      if(error) {
        return console.log('Failed to build', error)
      }
      emitBuildProgressChangeHook.call()
      if(!spawned) {
        let inspectPort = null
        if(this.inspectPort === true) {
          inspectPort = 9229
        }
        if(typeof this.inspectPort === 'number') {
          inspectPort = this.inspectPort
        }
        const args = this.inspectPort === null ? [userBuildPath] : [`--inspect=${inspectPort}`, userBuildPath]
        const apiProcess = spawn('node', args, {
          stdio: ['pipe', 'inherit', 'inherit'],
        })
        apiProcess.on('close', (code) => {
          console.log(`Api process shut down with code ${code}`)
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
