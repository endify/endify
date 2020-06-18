const webpack = require('webpack')
const path = require('path')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const defaultVueConfig = require('./webpack.config.vue.default.js')

module.exports = () => {
  const IS_DEV = process.env.NODE_ENV !== 'production'

  const entryVueServerPath = path.join(process.env.BASE_PATH, '/src/entry/vue.client.js')
  const c = defaultVueConfig()

  if(IS_DEV) {
    c.entry = ['webpack-hot-middleware/client', entryVueServerPath]
  } else {
    c.entry = entryVueServerPath
  }

  c.output = {
    path: path.join(process.env.ISSUER_PATH, '/dist/vue-client'),
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
