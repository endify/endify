import {createContainer, InjectionMode, asClass} from 'awilix'
import {LoggerService} from '../../services/LoggerService'
import {ApiResponseMiddleware} from '../../middleware/ApiResponseMiddleware'

export function setupContainer() {
  console.log('Starting container...')
  const c = createContainer({
    injectionMode: InjectionMode.PROXY
  })

  // Middleware
  c.register({
    apiResponseMiddleware: asClass(ApiResponseMiddleware),
  })

  // Services
  c.register({
    loggerService: asClass(LoggerService),
  })

  return c
}
