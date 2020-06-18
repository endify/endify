export class ApiResponseMiddleware {
  beginning(req, res, next) {
    res.sendApiResponse = (data) => {
      res.send(JSON.stringify({
        success: true,
        data
      }))
    }
    next()
  }

  notFoundErrorFactory(req, res, next) {
    throw new Error('Page not found')
  }

  errorHandler(err, req, res, next) {
    return res.send(JSON.stringify({
      success: false,
      error: {
        message: err.message || 'Something went wrong'
      }
    }))
  }
}
