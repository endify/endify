import {sendErrorResponse, sendSuccessResponse} from '../../server'

export class ApiResponseMiddleware {
  beginning(req, res, next) {
    res.sendSuccessResponse = sendSuccessResponse
    next()
  }

  notFoundErrorFactory(req, res, next) {
    throw new Error('Page not found')
  }

  errorHandler(err, req, res, next) {
    return sendErrorResponse(res, {
      code: 'internalServerError',
      message: 'Internal server error'
    }, 500)
  }
}
