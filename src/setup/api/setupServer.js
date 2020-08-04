import express from 'express'
import {setupRoutes} from './setupRoutes'
import {setupContainer} from './setupContainer'
import {serverConfig} from '../../services/ServerConfigService'

export async function setupServer({vueClientDistPath, vueBundleWatcher}) {
  const container = setupContainer()
  const routes = setupRoutes({container})
  const loggerService = container.resolve('loggerService')
  const app = express()

  app.use('/api', routes)

  if(process.env.NODE_ENV !== 'production') {
    app.use(vueBundleWatcher.devMiddleware);
    app.use(vueBundleWatcher.hotMiddleware);
  }
  app.use('/dist', express.static(vueClientDistPath))
  app.use(async (req, res) => {
    if(process.env.NODE_ENV !== 'production' && !vueBundleWatcher.renderer) {
      await new Promise((resolve, reject) => {
        vueBundleWatcher.once('update', () => {
          resolve()
        })
      })
    }
    try {
      const context = {
        url: req.url,
        env: {
          API_HOST: process.env.API_HOST,
          ...serverConfig.clientEnv,
        }
      }
      const html = await vueBundleWatcher.renderer.renderToString(context)
      res.status(typeof context.statusCode === 'undefined' ? 200 : context.statusCode).end(html)
    } catch(e) {
      console.error(e)
      res.send(e.message)
    }

  })
  loggerService.scopeLog('setup/server', 'Server setup complete!')
  return app
}
