const path = require('path')
const webpack = require('webpack')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const defaultVueConfig = require('./webpack.config.vue.default.js')

module.exports = () => {
  const IS_DEV = process.env.NODE_ENV !== 'production'
  const entryVueServerPath = path.join(process.env.BASE_PATH, '/src/entry/vue.server.js')
  const c = defaultVueConfig()

  c.entry = entryVueServerPath
  c.target = 'node'
  c.devtool = 'source-map'
  c.output = {
    libraryTarget: 'commonjs2',
    path: path.join(process.env.ISSUER_PATH, '/dist/vue-server'),
    publicPath: '/dist/'
  }
  c.plugins.push(new VueSSRServerPlugin())

  c.plugins.push(new webpack.DefinePlugin({
    'process.env.NODE_PATH': JSON.stringify(path.join(process.env.BASE_PATH, '/node_modules')),
  }))
  // if(IS_DEV) {
  //   c.plugins.push(new webpack.NoEmitOnErrorsPlugin())
  // }
  return c
}
