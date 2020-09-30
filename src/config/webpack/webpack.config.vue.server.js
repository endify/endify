const path = require('path')
const webpack = require('webpack')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const defaultVueConfig = require('./webpack.config.vue.default.js')

module.exports = (options) => {
  const basePath = options.basePath
  const issuerPath = options.issuerPath

  const IS_DEV = options.env !== 'production'
  const entryVueServerPath = path.join(basePath, '/src/entry/vue.server.js')
  const c = defaultVueConfig(options)
  const nodeExternals = require('webpack-node-externals')

  c.entry = entryVueServerPath
  c.target = 'node'
  c.devtool = 'source-map'
  c.output = {
    libraryTarget: 'commonjs2',
    path: path.join(issuerPath, '/dist/vue-server'),
    publicPath: '/dist/'
  }
  c.plugins.push(new VueSSRServerPlugin())

  c.plugins.push(new webpack.DefinePlugin({
    'process.env.NODE_PATH': JSON.stringify(path.join(issuerPath, '/node_modules')),
  }))

  c.externals = {
    ...nodeExternals({
      target: 'node',
      // modulesDir: ['node_modules', path.join(process.env.BASE_PATH, 'node_modules')]
    }),
    'fs': 'fs',
    'electron': 'commonjs2 electron'
  }

  return c
}
