#!/usr/bin/env node
const path = require('path')
const webpack = require('webpack')
const { spawn } = require('child_process');
const DEST_PATH = process.cwd()
const ENTRY_PATH = path.join(DEST_PATH, 'index.js')
const webpackConfig = require('../config/webpack/webpack.config.api')()
const compiler = webpack(webpackConfig)

compiler.run((e, stats) => {
  if(e) {
    return console.log('Compiler error', e)
  }
  const apiProcess = spawn('node', [path.join(process.cwd(), '/dist/api/server.js')], {stdio: ['pipe', 'inherit', 'inherit']})

  apiProcess.on('close', (code) => {
    console.log(`spawnedApiProcess shut down with code ${code}`);
  });
  console.log('Compiled.')
})
