import {relative, resolve, join} from 'path'
import {ILauncherConfig} from './types/ILauncherConfig'

export class ConfigService {
  public config: ILauncherConfig = null

  getConfigPath(configPath, cwdPath) {
    return configPath ? resolve(cwdPath, configPath) : join(cwdPath, 'endify.config.js')
  }

  async loadConfigFromFile(configPath: string): Promise<ILauncherConfig> {
    const relativeConfigPath = relative(__dirname, configPath)
    const configFile = __non_webpack_require__(`./${relativeConfigPath}`)
    await this.loadConfig(configFile)
    return this.config
  }

  async loadConfig(config) {
    if(typeof config === 'function') {
      this.config = this.parseConfig(await config())
    } else {
      this.config = this.parseConfig(config)
    }
  }

  parseConfig(config): ILauncherConfig {
    return config
  }
}
