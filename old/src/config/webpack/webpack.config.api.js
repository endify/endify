const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
require('dotenv-extended').load();


module.exports = (options) => {
  const issuerPath = options.issuerPath
  const basePath = options.basePath
  const isSymlinked = options.isSymlinked
  const entryApiPath = path.resolve(basePath, 'src/entry/api.js')
  const modulesPath = isSymlinked ? path.join(basePath, 'node_modules') : ``
  const webpackPollInterval = 500;
  const IS_DEV = options.env !== 'production'
  const webpackHotPollPath = path.join(modulesPath, `webpack/hot/poll?${webpackPollInterval}`)

  const c = {}

  // Get entry file
  if(IS_DEV) {
    c.entry = [webpackHotPollPath, entryApiPath]
  } else {
    c.entry = entryApiPath
  }

  // Set target to node
  c.target = 'node'

  // Externals
  // c.externals = {
  //   ...nodeExternals({
  //     allowlist: [
  //       webpackHotPollPath,
  //     ],
  //     target: 'node',
  //     modulesDir: path.join(issuerPath, 'node_modules'),
  //     additionalModuleDirs: ['node_modules', path.join(basePath, 'node_modules'), issuerPath, basePath]
  //   }),
  //   'webpack': `commonjs webpack`,
  //   'webpack-dev-middleware': `commonjs webpack-dev-middleware`,
  //   'vue-server-renderer': `commonjs vue-server-renderer`,
  //   'vue-loader': `commonjs vue-loader`,
  //   // 'argon2': 'commonjs argon2'
  // }
  c.externals = [
    nodeExternals({
      allowlist: [
        webpackHotPollPath,
        basePath,
        'endify',
        'endify/server'
      ],
      importType: 'commonjs2',
      target: 'node',
      modulesDir: path.join(issuerPath, 'node_modules'),
      additionalModuleDirs: ['node_modules', path.join(basePath, 'node_modules'), issuerPath, basePath]
    }),
  ]
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
    // c.packages.push(new StartServerPlugin('server.js'))
    c.plugins.push(new webpack.HotModuleReplacementPlugin())
    // c.packages.push(new webpack.NoEmitOnErrorsPlugin())
  }

  c.plugins.push(new webpack.DefinePlugin({
    '__ENDIFY_ENV__.BASE_PATH': JSON.stringify(basePath),
    '__ENDIFY_ENV__.ISSUER_PATH': JSON.stringify(issuerPath),
  }))
  c.plugins.push(new webpack.DefinePlugin({
    '__ENDIFY_ENV__': 'process.env',
    '__ENDIFY_ENV__.ENV': JSON.stringify(options.env)
  }))

  // if(!IS_DEV) {
  //   c.optimization = {
  //     minimize: false
  //   }
  // }

  if(IS_DEV) {
    // c.stats = 'errors-only'
  }
  c.module = {}
  c.module.rules = [
    // {
    //   test: /\.js?$/,
    //   // exclude: /node_modules/,
    //   use: {
    //     loader: 'babel-loader',
    //     options: {
    //       presets: ['@babel/preset-env'],
    //       packages: ['@babel/plugin-proposal-optional-chaining']
    //     }
    //   }
    // },
    // {
    //   test: /\.tsx?$/,
    //   use: 'ts-loader',
    //   exclude: /node_modules/,
    // },
    {
      test: /\.(j|t)sx?$/,
      exclude: /node_modules\/(?!(endify)\/).*/,
      use: {
        loader: require.resolve("babel-loader"),
        options: {
          cacheDirectory: true,
          babelrc: false,
          presets: [
            require.resolve("@babel/preset-typescript"),
          ],
          plugins: [
            // plugin-proposal-decorators is only needed if you're using experimental decorators in TypeScript
            [require.resolve("@babel/plugin-proposal-decorators"), { legacy: true }],
            [require.resolve("@babel/plugin-proposal-class-properties"), { loose: true }],
            [require.resolve('babel-plugin-transform-typescript-metadata')],
            [require.resolve("babel-plugin-parameter-decorator"), {legacy: true}],
            require.resolve("@babel/plugin-proposal-optional-chaining")
          ]
        }
      }
    }
  ]
  //'@babel/plugin-transform-modules-commonjs'???

  c.resolve = {
    alias: {
      '@project': issuerPath,
    },
    modules: [basePath, issuerPath, 'node_modules', path.join(basePath, 'node_modules'), path.join(issuerPath, 'node_modules')],
    extensions: [ '.ts', '.tsx', '.js', '.node', '.json' ],
  }
  c.resolveLoader = {
    modules: [path.join(basePath, 'node_modules'), path.join(issuerPath, 'node_modules')]
  }
  c.context = isSymlinked ? path.resolve(basePath) : path.resolve(issuerPath)
  c.node = {
    __dirname: true
  }
  c.devtool = 'eval-source-map'
  return c
}
