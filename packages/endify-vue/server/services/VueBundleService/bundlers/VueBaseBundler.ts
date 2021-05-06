import * as webpack from 'webpack'
import {join} from 'path'
import {ILoggerService} from '../../../../../endify-tools/LoggerService/types/ILoggerService'
import {IVueBundler} from './types/IVueBundler'

export class VueBaseBundler implements IVueBundler {
  private readonly webpackConfigObject: Object
  private loggerService: ILoggerService
  public isReady: boolean = false
  public bundle: unknown

  constructor(loggerService, webpackConfigObject) {
    this.webpackConfigObject = webpackConfigObject
    this.loggerService = loggerService
  }

  public load() {
    // const compiler = webpack(this.webpackConfigObject)
    // compiler.watch({}, () => {
    //
    // })

  }

  protected loadBundle() {
    return
  }

  public watch() {
    return new Promise((resolve, reject) => {
      const compiler = webpack(this.webpackConfigObject)
      compiler.watch({}, async (error, stats) => {
        console.log('done')
        if(error) {
          reject(error)
        } else {
          this.bundle = await this.loadBundle()
          this.setAsReady()
          return resolve(stats)
        }
      })
    })
  }

  setAsReady() {
    if(this.isReady) {
      return
    }
    this.isReady = true
  }

  public get bundleOutputPath() {
    return this.webpackConfigObject.output.path
  }
}