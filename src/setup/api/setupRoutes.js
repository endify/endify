import ExpressPromiseRouter from 'express-promise-router'
import bodyParser from 'body-parser'
import {serverConfigService} from '../../services/ServerConfigService'

export const setupRoutes = async ({container}) => {
  const endifyServerConfig = await serverConfigService.getConfig()
  const r = new ExpressPromiseRouter()

  r.use(bodyParser.json())
  r.use(bodyParser.urlencoded({extended: true}))
  r.use(container.resolve('apiResponseMiddleware').beginning)
  if(typeof endifyServerConfig.extendRouter === 'function') {
    endifyServerConfig.extendRouter(r)
  }
  r.use(container.resolve('apiResponseMiddleware').notFoundErrorFactory)
  r.use(container.resolve('apiResponseMiddleware').errorHandler)

  return r
}
