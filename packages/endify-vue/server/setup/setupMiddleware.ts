import {LoggerService} from '../../../endify-tools/LoggerService/LoggerService'
// import {VueBundleService} from '../services/VueBundleService/VueBundleService'
// import {EndifyVueMiddleware} from '../middleware/EndifyVueMiddleware'
import {WebpackConfigVueServer} from '../../client/webpack.config.vue.server'
import {Environments} from '../../../endify-tools/enum/Environments'

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


  console.log(await vueServerWebpackConfig.getConfig())

  // await new Promise(async (resolve, reject) => {
  //   const compiler = webpack(await vueServerWebpackConfig.getConfig(), (error, stats) => {
  //     if(error) {
  //       this.loggerService.error(`Vue server compiler error in ${((stats.endTime - stats.startTime))}ms.`, error)
  //       return reject(error)
  //     }
  //     // console.log('wtf', stats)
  //     this.loggerService.success(`Vue server bundle compiled in ${((stats.endTime - stats.startTime))}ms.`)
  //     resolve(stats)
  //   })
  // })
  await new Promise(async (resolve, reject) => {
    const compiler = webpack(await vueServerWebpackConfig.getConfig(), (error, stats) => {
      if(error) {
        this.loggerService.error(`Vue server compiler error in ${((stats.endTime - stats.startTime))}ms.`, error)
        return reject(error)
      }
      // console.log('wtf', stats)
      this.loggerService.success(`Vue server bundle compiled in ${((stats.endTime - stats.startTime))}ms.`)
      resolve(stats)
    })
  })


  return (req, res) => {
    res.send(':)')
  }
  // const vueBundleService = new VueBundleService() // classesThatWillEmitSomethingLike: BundleHasBeenUpdated/Createdforthefirsttime
  // const vueMiddleware = new EndifyVueMiddleware(loggerService, vueBundleService)

  // // const
  // const dev = true
  // if(dev) {
  //   vueBundleService.watch()
  // }
  // return vueMiddleware.middleware
}