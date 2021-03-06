import * as express from 'express'
import {ILoggerService} from '../../../endify-tools/LoggerService/types/ILoggerService'
import {IVueBundleService} from '../services/VueBundleService/types/IVueBundleService'

export class EndifyVueMiddleware {
  private hasBeenInitiallyCompiled = false
  private vueBundleService: IVueBundleService
  private loggerService: ILoggerService

  constructor(loggerService: ILoggerService, vueBundleService: IVueBundleService) {
    this.loggerService = loggerService
    this.vueBundleService = vueBundleService
  }

  setup() {
    // this.endifyBundleWatcher.watch()
  }


  get middleware() {
    const app = express()
    // app.use(this.vueBundleService.devMiddleware);
    // app.use(this.vueBundleService.hotMiddleware);
    app.use(async (req, res) => {
      const compiledAppStream = this.vueBundleService.renderAppToStream(req)
      compiledAppStream.pipe(res)
    })
    return app
  }
}