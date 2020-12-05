import express from 'express'
import {setupRoutes} from './setupRoutes'
import {setupContainer} from './setupContainer'
import {serverConfigService} from '../../services/ServerConfigService'
import {join} from 'path'

export async function setupServer({vueClientDistPath, vueBundleWatcher}) {
  const endifyServerConfig = await serverConfigService.getConfig()
  const container = setupContainer()
  const routes = await setupRoutes({container})
  const loggerService = container.resolve('loggerService')
  const app = express()

  app.use('/api', routes)

  if(__ENDIFY_ENV__.ENV !== 'production') {
    app.use(vueBundleWatcher.devMiddleware);
    app.use(vueBundleWatcher.hotMiddleware);
  }
  app.use('/dist', express.static(vueClientDistPath))
  app.use('/static', express.static(join(__ENDIFY_ENV__.ISSUER_PATH, 'static')))
  app.use(async (req, res) => {
    if(__ENDIFY_ENV__.ENV !== 'production' && !vueBundleWatcher.renderer) {
      await new Promise((resolve, reject) => {
        vueBundleWatcher.once('update', () => {
          resolve()
        })
      })
    }

    try {
      const url = req.protocol + '://' + req.get('host') + req.originalUrl;
      console.log('===')
      console.log('This is url', url)
      console.log('this is path:', req.url)
      const context = {
        url,
        path: req.url,
        env: {
          API_HOST: __ENDIFY_ENV__.API_HOST,
          ...endifyServerConfig.clientEnv,
        },
        request: req
      }
      const html = await vueBundleWatcher.renderer.renderToString(context)
      res.status(typeof context.statusCode === 'undefined' ? 200 : context.statusCode).end(html)
    } catch(e) {
      if(e.redirectUrl) {
        return res.redirect(e.redirectUrl)
      }
      console.error(e)
      res.send(e.message)
    }

  })
  loggerService.scopeLog('setup/server', 'Server setup complete!')
  return app
}
