import {LoggerService} from '../../../core/src/services/LoggerService/LoggerService'
import {VueBundleService} from '../services/VueBundleService/VueBundleService'
// import {EndifyVueMiddleware} from '../middleware/EndifyVueMiddleware'
import {WebpackConfigVueServer} from '../../client/webpack.config.vue.server'
import {Environment} from '../../../core/src/services/EndifyCoreService/enum/Environment'
import {join} from 'path'
import * as webpack from 'webpack'
import {readFile} from 'fs'
import {VueServerBundler} from '../services/VueBundleService/bundlers/VueServerBundler'


export async function setupMiddleware(config) {
  const loggerService = new LoggerService('Endify', ' |')
  // Here we will add classes to update dependencies

  loggerService.log('Setting up Vue...')
  const vueServerWebpackConfig = new WebpackConfigVueServer({
    env: Environment.DEVELOPMENT,
    issuerPath: $endify.issuerPath,
    installedModulePath: $endify.installedModulePath,
  })

  const vueServerWebpackConfigObject = await vueServerWebpackConfig.getConfig()

  const vueServerBundler = new VueServerBundler(
    loggerService,
    vueServerWebpackConfigObject,
  )

  const vueBundleService = new VueBundleService(vueServerBundler) // classesThatWillEmitSomethingLike: BundleHasBeenUpdated/Createdforthefirsttime
  if(true) {
    vueBundleService.watch().then()
  } // if dev

  return async (req, res) => {
    if(!vueServerBundler.isReady) {
      const loadingHtml = await new Promise((resolve, reject) => {
        readFile(join($endify.installedModulePath, 'packages/endify-vue/server/templates/endify-loading.html'), 'utf8', (err, data) => {
          if(err) {
            return reject(err)
          }
          resolve(data)
        })
      })
      return res.send(loadingHtml)
    }
    const appHtml = await vueBundleService.renderAppToString(req)
    res.send(appHtml)
  }
  // const vueMiddleware = new EndifyVueMiddleware(loggerService, vueBundleService)

  // // const
  // const dev = true
  // if(dev) {
  //   vueBundleService.watch()
  // }
  // return vueMiddleware.middleware
}
