import {join, resolve} from 'path'
import {webpack} from 'webpack'
import {spawn} from 'child_process'

export class EndifyServerLauncher {
  private readonly userEntry: string
  private readonly inspectPort: number|boolean
  private readonly buildPath: string

  constructor({entry, inspectPort, buildPath}) {
    this.userEntry = entry
    this.inspectPort = inspectPort
    this.buildPath = buildPath || join(process.cwd(), 'build/endify-server/endify-server.js')
  }

  dev({config}) {
    console.log('Initialize hot watch for EndifyServer with config', config)
    const endifyServerEntry = resolve(__dirname, __non_webpack_require__.resolve('@endify/server/entry'))
    const userEntry = resolve(process.cwd(), this.userEntry)
    const userBuildPath = this.buildPath
    const webpackConfig = {
      target: 'node',
      entry: ['webpack/hot/poll?1000', endifyServerEntry],
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
    }
    console.log('webpackConfig', webpackConfig)
    const compiler = webpack(webpackConfig)
    let spawned = false
    compiler.watch({

    }, (error, stats) => {
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
