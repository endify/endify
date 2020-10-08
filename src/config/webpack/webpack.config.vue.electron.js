const webpack = require('webpack')
const path = require('path')
const defaultVueConfig = require('./webpack.config.vue.client.js')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (options) => {
  const basePath = options.basePath
  const issuerPath = options.issuerPath
  const buildConfig = options.buildConfig
  const IS_DEV = options.env !== 'production'
  const c = defaultVueConfig(options)

  c.output = {
    path: path.join(issuerPath, '/dist/client-native'),
    publicPath: './'
  }

  c.plugins.push(new HtmlWebpackPlugin({
    template: path.join(basePath, 'src/setup/electron/index.html')
  }))
  c.target = 'electron-renderer'

  if(buildConfig.clientEnv) {
    const environmentVariables = {}
    Object.keys(buildConfig.clientEnv).forEach(key => {
      environmentVariables[`__ENDIFY_ENV__.${key}`] = JSON.stringify(buildConfig.clientEnv[key])
    })
    c.plugins.push(new webpack.DefinePlugin(environmentVariables))
  }

  c.plugins.push(new webpack.DefinePlugin({
    'process.env': JSON.stringify({})
  }))

  // const nodeExternals = require('webpack-node-externals')
  // c.externals = {
  //   ...nodeExternals({
  //     target: 'node',
  //     // modulesDir: ['node_modules', path.join(process.env.BASE_PATH, 'node_modules')]
  //   }),
  //   // 'fs-extra': 'commonjs2 fs-extra',
  //   'fs': 'commonjs2 fs',
  //   'electron': 'commonjs2 electron'
  // }
  //

  c.externals = {
    // 'electron': 'commonjs2 electron'
  }
  return c
}
