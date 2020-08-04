const webpack = require('webpack')
const path = require('path')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const defaultVueConfig = require('./webpack.config.vue.default.js')

module.exports = (options) => {
  const basePath = options.basePath
  const issuerPath = options.issuerPath
  const IS_DEV = options.env !== 'production'

  const entryVueServerPath = path.join(basePath, '/src/entry/vue.client.js')
  const c = defaultVueConfig(options)

  if(IS_DEV) {
    c.entry = ['webpack-hot-middleware/client', entryVueServerPath]
  } else {
    c.entry = entryVueServerPath
  }

  c.output = {
    path: path.join(issuerPath, '/dist/vue-client'),
    publicPath: '/dist/'
  }

  c.plugins.push(new VueSSRClientPlugin())
  if(IS_DEV) {
    c.plugins.push(new webpack.HotModuleReplacementPlugin())
  }

  c.plugins.push(new webpack.DefinePlugin({
    'process.env': '__ENV__',
  }))

  return c
}
