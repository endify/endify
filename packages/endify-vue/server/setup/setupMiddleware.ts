import {LoggerService} from '../../../endify-tools/LoggerService/LoggerService'
import {VueBundleService} from '../services/VueBundleService/VueBundleService'
// import {EndifyVueMiddleware} from '../middleware/EndifyVueMiddleware'
import {WebpackConfigVueServer} from '../../client/webpack.config.vue.server'
import {Environments} from '../../../endify-tools/enum/Environments'
import {join} from 'path'

import * as webpack from 'webpack'

export async function setupMiddleware(config) {
  const loggerService = new LoggerService('Endify', ' |')
  // Here we will add classes to update dependencies
  loggerService.log('Setting up Vue...')
  const vueServerWebpackConfig = new WebpackConfigVueServer({
    env: Environments.DEVELOPMENT,
    issuerPath: $endify.issuerPath,
    installedModulePath: $endify.installedModulePath
  })

  const vueServerWebpackConfigObject = await vueServerWebpackConfig.getConfig()
  let setupApp
  const res = await new Promise(async (resolve, reject) => {
    const compiler = webpack(vueServerWebpackConfigObject, (error, stats) => {
      console.log('done!', error, stats)
      if(error) {
        loggerService.error(`Vue server compiler error`, error)
        return reject(error)
      }
      loggerService.success(`Vue server bundle compiled in ${((stats.endTime - stats.startTime))}ms.`)
      setupApp = __non_webpack_require__(join(vueServerWebpackConfigObject.output.path, 'index.js')).default
      // console.log(setupApp)
      resolve(stats)
    })
    console.log('ok')
  })

  const vueBundleService = new VueBundleService() // classesThatWillEmitSomethingLike: BundleHasBeenUpdated/Createdforthefirsttime

  return async (req, res) => {
    if(setupApp) {
      const appHtml = await vueBundleService.renderAppToString(await setupApp({req}), req)
      res.send(appHtml)
      // compiledAppStream.on('end', () => res.end());
      // compiledAppStream.pipe(res);
      // console.log('compiledAppStream', compiledAppStream)
      // compiledAppStream.pipe(res)
    } else {
      res.send(':(')
    }
  }
  // const vueMiddleware = new EndifyVueMiddleware(loggerService, vueBundleService)

  // // const
  // const dev = true
  // if(dev) {
  //   vueBundleService.watch()
  // }
  // return vueMiddleware.middleware
}