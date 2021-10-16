export class ServerSetupService {
  private serverEntry

  constructor(serverEntry) {
    this.serverEntry = serverEntry
  }

  setup() {
    console.log('[ServerSetupService/setup]', this.serverEntry)
  }

  performHotUpdate(serverEntry) {
    console.log('[ServerSetupService/performHotUpdate]', serverEntry)
    this.serverEntry = serverEntry
  }
}
