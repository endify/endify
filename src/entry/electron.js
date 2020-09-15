const {app, BrowserWindow} = require('electron')
const path = require('path')
const {dialog} = require('electron')



const createWindow = () => {
  const IS_DEV = !app.isPackaged
  if(IS_DEV) {
    require('dotenv-extended').load();
  }
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // <--- flag
      nodeIntegrationInWorker: true, // <---  for web workers
      enableRemoteModule: true
    }
  })
  // BrowserWindow.addDevToolsExtension(path.join(process.env.BASE_PATH, '/node_modules/vue-devtools/vender'))
  // mainWindow.webContents.openDevTools()
  //




  if(IS_DEV) {
    mainWindow.loadURL(`http://localhost:${process.env.PORT}`)
  } else {
    const distTemplatePath = path.resolve(__dirname, '../../dist/vue-electron/index.html')
    const mainWindowUrl = `file://${distTemplatePath}`
    dialog.showMessageBox({
      message: mainWindowUrl
    });

    dialog.showMessageBox({
      message: __dirname
    });
    mainWindow.loadURL(mainWindowUrl)
  }

}

app.on('ready', createWindow)
