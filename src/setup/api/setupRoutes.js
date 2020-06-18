import ExpressPromiseRouter from 'express-promise-router'
import bodyParser from 'body-parser'

export const setupRoutes = ({container}) => {
  const r = new ExpressPromiseRouter()

  r.use(bodyParser.json())
  r.use(bodyParser.urlencoded({extended: true}))
  r.use(container.resolve('apiResponseMiddleware').beginning)

  r.use(container.resolve('apiResponseMiddleware').notFoundErrorFactory)
  r.use(container.resolve('apiResponseMiddleware').errorHandler)

  return r
}
