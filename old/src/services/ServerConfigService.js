import endifySettings from '@project/endify.config.server.js'

class ServerConfigService {
  config = null
  configLoaded = false

  async getConfig() {
    if(!this.configLoaded) {
      await this.loadConfig()
    }
    return this.config
  }

  async loadConfig() {
    if(typeof endifySettings === 'function') {
      this.config = await endifySettings()
    } else {
      this.config =  endifySettings
    }
    this.configLoaded = true
  }

  invalidateConfig() {
    this.configLoaded = false
  }
}

export const serverConfigService = new ServerConfigService()