import * as webpack from 'webpack'
import * as chalk from 'chalk'
import * as randomTextFaces from 'random-text-faces'
import {spawn} from 'child_process'
import {WebpackConfigServer} from '../../webpack.config.server'
import {resolve, join} from 'path'
import {Environments} from '../../../endify-tools/enum/Environments'
import {LoggerService} from '../../../endify-tools/LoggerService/LoggerService'
import {ILoggerService} from '../../../endify-tools/LoggerService/types/ILoggerService'

export const DEFAULT_PORT = 3000

export class LauncherService {
  private port: number
  private readonly installedModulePath: string
  private readonly issuerPath: string
  private loggerService: ILoggerService
  private compiler: webpack.Compiler

  constructor(port) {
    this.port = port || DEFAULT_PORT
    this.installedModulePath = resolve(__dirname, '../../../')
    this.issuerPath = process.cwd()
    this.loggerService = new LoggerService('Endify', ' |')
  }

  setupCompiler() {
    const webpackApiConfig = new WebpackConfigServer({
      env: Environments.DEVELOPMENT,
      webpackPollInterval: 500,
      issuerPath: this.issuerPath,
      installedModulePath: this.installedModulePath,
      apiEntryPath: resolve(__dirname, '../../endify-server')
    })
    this.loggerService.log('Building API...')
    return new Promise(async (resolve, reject) => {
      console.log(await webpackApiConfig.getConfig())
      this.compiler = webpack(await webpackApiConfig.getConfig(), (error, stats) => {
        if(error) {
          this.loggerService.error(`Error in ${((stats.endTime - stats.startTime))}ms.`, error)
          return reject(error)
        }
        // console.log('wtf', stats)
        this.loggerService.success(`Ready in ${((stats.endTime - stats.startTime))}ms.`)
        resolve(stats)
      })
    })

  }

  async runDevelopmentServer() {
    await this.loggerService.logHelloLine()
    this.loggerService.log(randomTextFaces.get())
    this.loggerService.log('Starting development server...')
    const stats = await this.setupCompiler()
    const apiProcess = spawn('node', [
      // '--inspect=9229',
      join(this.issuerPath, '/.endify/build/server/server.js')
    ], {
      stdio: ['pipe', 'inherit', 'inherit']
    })
    apiProcess.on('close', (code) => {
      this.loggerService.log(`Spawned server process shut down with ${code} code.`)
    });
    // let done = false
    // this.compiler.watch({}, (e, stats) => {
    //
    //   if(e) {
    //     return console.error(chalk.bold('Endify') + chalk.red(' | ') + 'Failed to build...')
    //   }
    //   console.log('Api compiled')
    //   if(done) {
    //     return
    //   }
    //   done = true
      // const electronProcess = spawn(electron, [join(this.installedModulePath, '/src/entry/electron.js')], {
        //   stdio: ['pipe', 'inherit', 'inherit'],
        //   windowsHide: false,
        //   env: process.env,
        //   cwd: this.installedModulePath
        // })


      // electronProcess.on('close', (code) => {
      //   console.log(`Electron process shut down with code ${code}`);
      // });
      // console.log('Successfully started an app.')
    // })
  }
}