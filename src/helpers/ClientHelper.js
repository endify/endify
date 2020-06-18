import {ClientTypes} from '../enum/ClientTypes'

export class ClientHelper {
  static get currentClientType() {
    if(typeof navigator === 'undefined') {
      return ClientTypes.BROWSER
    }
    const userAgent = navigator.userAgent.toLowerCase()
    const isElectron = userAgent.indexOf(' electron/') > -1
    return isElectron ? ClientTypes.ELECTRON : ClientTypes.BROWSER
  }

  static get isServer() {
    return typeof navigator === 'undefined'
  }
}
