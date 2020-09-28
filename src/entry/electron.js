const {app, BrowserWindow} = require('electron')
const path = require('path')

const createWindow = () => {
  const IS_DEV = !app.isPackaged
  if(IS_DEV) {
    require('dotenv-extended').load();
  }
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true
    }
  })
  // BrowserWindow.addDevToolsExtension(path.join(process.env.BASE_PATH, '/node_modules/vue-devtools/vender'))
  // mainWindow.webContents.openDevTools()

  if(IS_DEV) {
    mainWindow.loadURL(`http://localhost:${process.env.PORT}`)
  } else {
    const distTemplatePath = path.resolve(__dirname, '../../dist/client-native/index.html')
    const mainWindowUrl = `file://${distTemplatePath}`
    mainWindow.loadURL(mainWindowUrl)
    mainWindow.setMenuBarVisibility(false)

    const {autoUpdater} = require("electron-updater");

    const log = require("electron-log")
    log.transports.file.level = "debug"
    autoUpdater.logger = log
    autoUpdater.checkForUpdatesAndNotify()
  }

}

app.on('ready', createWindow)
