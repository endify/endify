import {join, resolve} from 'path'
import {webpack} from 'webpack'
import {spawn} from 'child_process'
import {Configuration, HotModuleReplacementPlugin, ProgressPlugin} from 'webpack'
import * as nodeExternals from 'webpack-node-externals'
import {CliHooks} from '../../../endify-core/enum/CliHooks'

console.log({
  HotModuleReplacementPlugin,
  nodeExternals,
})
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

  dev({config, hooks}) {
    const buildProgressChangeHook = hooks.getHook(CliHooks.BUILD_PROGRESS_CHANGE)
    const emitBuildProgressChangeHook = hooks.getHook(CliHooks.EMIT_BUILD_PROGRESS_CHANGE)
    buildProgressChangeHook.tap('Get endify/server build progress', (entities) => {
      entities.push({
        percentage: this.progressReport[0],
        message: this.progressReport[1],
        name: '@endify/server',
      })
    })

    let test = 0
    buildProgressChangeHook.tap('Get endify/test build progress', (entities) => {
      entities.push({
        percentage: test,
        message: 'Calculating something...',
        name: '@endify/test',
      })
    })
    setInterval(() => {
      test = test + 0.01
      emitBuildProgressChangeHook.call()
    }, 500)

    let test2 = 0
    buildProgressChangeHook.tap('Get endify/test build progress', (entities) => {
      entities.push({
        percentage: test2,
        message: 'Well, bundling files...',
        name: '@endify/test2',
      })
    })
    setInterval(() => {
      test2 = test2 + 0.05
      emitBuildProgressChangeHook.call()
    }, 750)
    console.log('Initialize hot watch for EndifyServer with config')
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
      watch: true,
    }
    const compiler = webpack(webpackConfig)
    let spawned = false
    compiler.watch({

    }, (error, stats) => {
      return ''
      if(error) {
        return console.log('Error 2', error)
      }
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
      console.log('Successfully built the Endify Server')
    })
  }

  prod() {
    console.log('Build production launcher for EndifyServer')
  }

  start() {
    console.log('Start EndifyServer')
  }
}
