import {join, relative, isAbsolute, resolve} from 'path'
import nodeExternals from 'webpack-node-externals'
import webpack from 'webpack'
import {Environments} from './enum/Environments'

export class WebpackApiConfig {
  constructor({env, webpackPollInterval, issuerPath, installedModulePath, apiEntryPath}) {
    this.env = env || 'production'
    this.webpackPollInterval = webpackPollInterval || 500
    this.issuerPath = issuerPath
    this.installedModulePath = installedModulePath
    this.apiEntryPath = apiEntryPath
  }

  get webpackHotPollPath() {
    return join(this.nodeModulesPath, `webpack/hot/poll?${this.webpackPollInterval}`)
  }

  get nodeModulesPath() {
    return this.isCurrentModuleSymlinked ? join(this.installedModulePath, 'node_modules') : ''
  }

  get isCurrentModuleSymlinked() {
    return this.isModuleSymlinked(this.issuerPath, this.installedModulePath)
  }

  isModuleSymlinked(issuerPath, installedModulePath) {
    const relativePath = relative(this.issuerPath, this.installedModulePath)
    return !(relativePath && !relativePath.startsWith('..') && !isAbsolute(relativePath))
  }

  getConfig() {
    const c = {
      target: 'node',
      entry: this.env === Environments.PRODUCTION ? this.apiEntryPath : [this.webpackHotPollPath, this.apiEntryPath],
      externals: [
        // nodeExternals({
        //   allowlist: [
        //     this.webpackHotPollPath,
        //     // this.installedModulePath,
        //     // 'endify',
        //     // 'endify/server'
        //   ],
        //   target: 'node',
        //   importType: 'commonjs2',
        //   modulesDir: join(this.installedModulePath, 'node_modules'),
        //   additionalModuleDirs: [
        //     // 'node_modules',
        //     // join(this.installedModulePath, 'node_modules'),
        //     // this.issuerPath,
        //     // this.installedModulePath
        //   ]
        // })
        {
          // 'chalk': `commonjs ${join(this.installedModulePath, 'node_modules', 'chalk')}`.
          'chalk': 'commonjs2 chalk'
        }
      ],
      mode: this.env === Environments.PRODUCTION ? Environments.PRODUCTION : Environments.DEVELOPMENT,
      watch: this.env === Environments.DEVELOPMENT,
      output: {
        filename: 'server.js',
          path: join(this.issuerPath, '/build/api'),
          libraryTarget: 'commonjs2',
      },
      plugins: [],
      // stats: 'errors-only',
      module: {
        rules: [
          {
            test: /\.(j|t)sx?$/,
            exclude: /node_modules\/(?!(endify)\/).*/,
            use: {
              loader: require.resolve("babel-loader"),
              options: {
                cacheDirectory: true,
                babelrc: false,
                presets: [
                  join(this.installedModulePath, 'node_modules', '@babel/preset-typescript'),
                ],
                plugins: [
                  [join(this.installedModulePath, 'node_modules', '@babel/plugin-proposal-decorators'), { legacy: true }],
                  [join(this.installedModulePath, 'node_modules', '@babel/plugin-proposal-class-properties'), { loose: true }],
                  [join(this.installedModulePath, 'node_modules', 'babel-plugin-transform-typescript-metadata')],
                  [join(this.installedModulePath, 'node_modules', 'babel-plugin-parameter-decorator'), {legacy: true}],
                  join(this.installedModulePath, 'node_modules', '@babel/plugin-proposal-optional-chaining')
                ]
              }
            }
          }
        ]
      },
      resolve: {
        alias: {
          '@issuerPath': this.issuerPath,
        },
        modules: [
          // this.installedModulePath,
          // this.issuerPath,
          join(this.installedModulePath, 'node_modules'),
          'node_modules',
          // join(this.issuerPath, 'node_modules')
        ],
        extensions: ['.ts', '.tsx', '.js', '.node', '.json'],
      },
      resolveLoader: {
        modules: [join(this.installedModulePath, 'node_modules'), join(this.issuerPath, 'node_modules')]
      },
      context: this.isCurrentModuleSymlinked ? resolve(this.installedModulePath) : resolve(this.issuerPath),
      // context: this.issuerPath,
      node: {
        __dirname: true
      },
      devtool: 'eval-source-map'
    }

    console.log(this)
    // console.log(c.module.rules[0].use.options)
    // c.packages.push(new webpack.DefinePlugin({
    //   '__ENDIFY_ENV__.BASE_PATH': JSON.stringify(basePath),
    //   '__ENDIFY_ENV__.ISSUER_PATH': JSON.stringify(issuerPath),
    // }))
    // c.packages.push(new webpack.DefinePlugin({
    //   '__ENDIFY_ENV__': 'process.env',
    //   '__ENDIFY_ENV__.ENV': JSON.stringify(options.env)
    // }))

    if(this.env === Environments.DEVELOPMENT) {
      c.plugins.push(new webpack.HotModuleReplacementPlugin())
    }

    return c
  }
}