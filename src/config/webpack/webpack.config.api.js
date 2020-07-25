const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
require('dotenv-extended').load();


module.exports = (options) => {
  const issuerPath = options.issuerPath
  const basePath = options.basePath
  const entryApiPath = path.resolve(basePath, 'src/entry/api.js')

  const webpackPollInterval = 500;
  const c = {}

  const IS_DEV = options.env !== 'production'

  // Get entry file
  if(IS_DEV) {
    c.entry = [`webpack/hot/poll.js`, entryApiPath]
  } else {
    c.entry = entryApiPath
  }

  // Set target to node
  c.target = 'node'


  c.externals = {
    ...nodeExternals({
      whitelist: [
        `webpack/hot/poll?${webpackPollInterval}`
      ],
      target: 'node',
      modulesDir: path.join(basePath, 'node_modules')
    }),
    webpack: path.join(basePath, 'node_modules/webpack'),
    'webpack-dev-middleware': `commonjs ${path.join(basePath, 'node_modules/webpack-dev-middleware')}`,
    'http': 'commonjs http',
    'vue-server-renderer': `commonjs ${path.join(basePath, 'node_modules/vue-server-renderer')}`,
    'vue-loader': `commonjs ${path.join(basePath, 'node_modules/vue-loader')}`,
  }

  // Set mode
  c.mode = IS_DEV ? 'development' : 'production'

  // Watch only in dev
  if(IS_DEV) {
    c.watch = true
  }

  c.output = {
    filename: 'server.js',
    path: path.join(issuerPath, '/dist/api'),
    libraryTarget: 'commonjs2',
  }

  c.plugins = []

  if(IS_DEV) {
    // c.plugins.push(new StartServerPlugin('server.js'))
    c.plugins.push(new webpack.HotModuleReplacementPlugin())
    // c.plugins.push(new webpack.NoEmitOnErrorsPlugin())
  }

  c.plugins.push(new webpack.DefinePlugin({
    'process.env.BASE_PATH': JSON.stringify(basePath),
    'process.env.ISSUER_PATH': JSON.stringify(issuerPath)
  }))

  // if(!IS_DEV) {
  //   c.optimization = {
  //     minimize: false
  //   }
  // }

  if(IS_DEV) {
    // c.stats = 'errors-only'
  }

  c.resolve = {
    alias: {
      '@project': issuerPath,
    },
    modules: [path.join(basePath, '/node_modules')]
  }

  c.resolveLoader = {
    modules: [path.join(basePath, 'node_modules')]
  }

  c.context = path.resolve(basePath)
  return c
}
