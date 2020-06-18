const {app, BrowserWindow} = require('electron')
const path = require('path')
require('dotenv-extended').load();

const createWindow = () => {
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  })
  // BrowserWindow.addDevToolsExtension(path.join(process.env.BASE_PATH, '/node_modules/vue-devtools/vender'))
  // mainWindow.webContents.openDevTools()
  mainWindow.loadURL(`http://localhost:${process.env.PORT}`)
}

app.on('ready', createWindow)
