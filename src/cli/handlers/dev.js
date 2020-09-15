const handle = ({paths}) => {
  const path = require('path')
  const webpack = require('webpack')
  const { spawn } = require('child_process');
  const DEST_PATH = process.cwd()
  const ENTRY_PATH = path.join(DEST_PATH, 'index.js')
  const electron = require('electron')
  const webpackConfig = require('../../config/webpack/webpack.config.api')({
    env: 'development',
    ...paths,
  })
  const compiler = webpack(webpackConfig)

  compiler.run((e) => {
    if(e) {
      return console.log('Compiler error', e)
    }
    const apiProcess = spawn('node', [path.join(DEST_PATH, '/dist/api/server.js')], {stdio: ['pipe', 'inherit', 'inherit']})
    const electronProcess = spawn(electron, [path.join(paths.basePath, '/src/entry/electron.js')], {
      stdio: ['pipe', 'inherit', 'inherit'],
      windowsHide: false,
      env: process.env,
      cwd: paths.basePath
    })

    apiProcess.on('close', (code) => {
      console.log(`Api process shut down with code ${code}`);
    });
    electronProcess.on('close', (code) => {
      console.log(`Electron process shut down with code ${code}`);
    });
    console.log('Successfully started an app.')
  })
}

module.exports = handle

