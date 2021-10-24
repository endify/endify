export class ConfigService {
  private _config = null

  async loadConfig(config) {
    if(typeof config === 'function') {
      this._config = await config()
    } else {
      this._config = config
    }
  }

  get config() {
    return this._config
  }
}