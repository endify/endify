import {Response} from 'express'

export interface ErrorData {
  message?: string;
  code: string|number;
}
export class ApiResponseHelper {
  static sendSuccessResponse(res: Response, data: any, statusCode = 200): void {
    res.status(statusCode).send(JSON.stringify({
      success: true,
      data
    }))
  }

  static sendErrorResponse(res: Response, errorData: ErrorData, statusCode = 500): void {
    res.status(statusCode).send(JSON.stringify({
      success: false,
      error: errorData
    }))
  }
}