import axios from 'axios'

const axios = {}
export class ApiService {
  static get(path, options) {
    return ApiService.request(path, 'GET', options)
  }

  static post(path, options) {
    return ApiService.request(path, 'POST', options)
  }

  static delete(path, options) {
    return ApiService.request(path, 'DELETE', options)
  }

  static async request(path, method, options) {
    const host = __ENDIFY_ENV__.INTERNAL_API_HOST || __ENDIFY_ENV__.API_HOST
    const url = host + path
    try {
      const axiosRes = await axios({
        method: method,
        url: url,
        ...(options || {})
      })
      const res = await axiosRes.data
      if(res.success) {
        return res.data
      }
      throw new Error('Invalid API response')
    } catch(e) {
      console.error(`Failed to fetch ${url}, reason:`, e)
      throw e
    }

  }
}
