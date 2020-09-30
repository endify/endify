import {ApiResponseHelper, ErrorData} from '../src/services/ApiResponseHelper'

export {
  ErrorData,
}

export const sendSuccessResponse = ApiResponseHelper.sendSuccessResponse
export const sendErrorResponse = ApiResponseHelper.sendErrorResponse