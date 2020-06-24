const webpack = require('webpack')
const path = require('path')
const StartServerPlugin = require('start-server-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
require('dotenv-extended').load();


module.exports = () => {
  const ISSUER_PATH = process.cwd()
  const BASE_PATH = path.resolve(__dirname, '../../../');
  const entryApiPath = path.resolve(__dirname, '../../entry/api.js')

  const webpackPollInterval = 500;
  const c = {}

  const IS_DEV = process.env.NODE_ENV !== 'production'

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
      modulesDir: path.join(BASE_PATH, 'node_modules')
    }),
    webpack: path.join(BASE_PATH, 'node_modules/webpack'),
    'webpack-dev-middleware': `commonjs ${path.join(BASE_PATH, 'node_modules/webpack-dev-middleware')}`
  }


  // c.externals = {
  //
  //
  //   target: 'node',
  //   modulesDir: path.join(BASE_PATH, 'node_modules')
  // }),

  // Set externals - ignore hot poll
  // if(IS_DEV) {
  //   c.externals = [nodeExternals({
  //     whitelist: [
  //       `webpack/hot/poll?${webpackPollInterval}`
  //     ]
  //   })]
  // } else {
  //   c.externals = {
  //     'webpack': 'commonjs webpack',
  //     'babel-loader': 'commonjs babel-loader',
  //     'vue-loader': 'commonjs vue-loader',
  //     'vue-server-renderer': 'commonjs vue-server-renderer',
  //     'express': 'commonjs express',
  //     'sequelize': 'commonjs sequelize',
  //     'awilix': 'commonjs awilix'
  //   }
  // }

  // c.externals = {
  //     ...nodeExternals({
  //       whitelist: [
  //         `webpack/hot/poll?${webpackPollInterval}`
  //       ],
  //       target: 'node',
  //       modulesDir: path.join(BASE_PATH, 'node_modules')
  //     }),
    // webpack: path.join(BASE_PATH, 'node_modules/webpack'),
      // 'webpack-dev-middleware': `commonjs ${path.join(BASE_PATH, 'node_modules/webpack-dev-middleware')}`
    // 'webpack': 'commonjs2 webpack',
    // 'babel-loader': 'commonjs babel-loader',
    // 'vue-loader': 'commonjs vue-loader',
    // [path.join(BASE_PATH, 'node_modules')]
    // 'vue-server-renderer': 'commonjs vue-server-renderer',
    // 'express': `commonjs ${path.join(BASE_PATH, 'node_modules/express')}`,
    // 'sequelize': 'commonjs sequelize',
    // 'awilix': 'commonjs awilix',
    // '@babel/plugin-proposal-optional-chaining': 'commonjs @babel/plugin-proposal-optional-chaining',
  // }

  // Set mode
  c.mode = IS_DEV ? 'development' : 'production'

  // Watch only in dev
  if(IS_DEV) {
    c.watch = true
  }

  c.output = {
    filename: 'server.js',
    path: path.join(ISSUER_PATH, '/dist/api'),
    libraryTarget: 'commonjs2',
  }

  c.plugins = []

  if(IS_DEV) {
    // c.plugins.push(new StartServerPlugin('server.js'))
    c.plugins.push(new webpack.HotModuleReplacementPlugin())
    // c.plugins.push(new webpack.NoEmitOnErrorsPlugin())
  }

  c.plugins.push(new webpack.DefinePlugin({
    'process.env.BASE_PATH': JSON.stringify(BASE_PATH),
    'process.env.ISSUER_PATH': JSON.stringify(ISSUER_PATH)
  }))

  // if(!IS_DEV) {
  //   c.optimization = {
  //     minimize: false
  //   }
  // }

  if(IS_DEV) {
    // c.stats = 'errors-only'
  }

  // const pp = path.join(ISSUER_PATH)
  // let pp = path.join(path.normalize(process.cwd()), 'asd', 'fajnyplik.js')
  // pp = pp.replace(/\\/g, '/')
  c.resolve = {
    alias: {
      '@project': ISSUER_PATH,
    },
    modules: [path.join(BASE_PATH, '/node_modules')]
  }
  // console.log(path.join(BASE_PATH, '/node_modules'))
  //   C:\Users\pieczorx\projects\endify\src\config\test
  //   C:\Users\pieczorx\projects\apkeo-website\asd
  //
  setTimeout(() => {
    console.log(ISSUER_PATH)
  }, 1500)
  // c.resolve = {
  //   // extensions: ['*', '.js', '.vue', '.json'],
  //   // modules: [path.join(BASE_PATH, 'node_modules')],
  //   //   alias: {
  //   //       '@testx': path.resolve(ISSUER_PATH)
  //   //   }
  // }

  c.resolveLoader = {
    modules: [path.join(BASE_PATH, 'node_modules')]
  }

  c.context = path.resolve(BASE_PATH)

  // console.log(c.resolve)
  return c
}
