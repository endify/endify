export class ServerSetupService {
  private serverEntry
  private config

  constructor(serverEntry) {
    this.serverEntry = serverEntry
  }

  setup() {
    setTimeout(() => {}, 100000)
    this.loadConfig()
  }

  async performHotUpdate(serverEntry) {
    console.log('[ServerSetupService/performHotUpdate]', serverEntry)
    this.serverEntry = serverEntry
    await this.loadConfig()
  }

  async loadConfig() {
    const config = await this.serverEntry()
    console.log('[ServerSetupService/loadConfig] New config loaded', config)
  }
}
