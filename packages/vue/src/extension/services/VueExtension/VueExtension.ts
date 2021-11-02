import {IVueExtensionOptions} from "./types/IVueExtensionOptions";
import {join, resolve, relative} from "path";
import {Configuration, HotModuleReplacementPlugin, ProgressPlugin, webpack} from "webpack";
import * as nodeExternals from 'webpack-node-externals'
import * as webpackHotMiddleware from 'webpack-hot-middleware'
import * as webpackDevMiddleware from 'webpack-dev-middleware'
import {VueLoaderPlugin} from 'vue-loader'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import {readFile} from 'fs'
import * as ErrorOverlayPlugin from 'error-overlay-webpack-plugin'

export class VueExtension {
  private options: IVueExtensionOptions
  private outputPath: string = join(process.cwd(), 'build/endify-vue')

  constructor(options: IVueExtensionOptions) {
    this.options = options
  }

  setup(endify) {
    const endifyServerEmitter = endify.emitters.getEmitter('@endify/server')
    endifyServerEmitter.on('after-register', async () => {
      const webpackConfig = await this.getWebpackConfig(endify)
      await this.dev(endify, webpackConfig)
    })
  }

  async getWebpackConfig({emitters}) {
    const endifyServerEmitter = emitters.getEmitter('@endify/server')
    endifyServerEmitter.emit('call-parent', {
      id: '@endify/vue:get-launcher-options'
    }).then()
    const launcherOptions: {userEntry: string} = await new Promise((resolve) => {
      endifyServerEmitter.on('receive-parent', ({id, payload}) => {
        if(id === '@endify/vue:set-launcher-options') {
          resolve(payload)
        }
      })
    })


    const endifyVueEntry = resolve(__dirname, __non_webpack_require__.resolve('@endify/vue/entry'))
    const webpackHotPollPath = __non_webpack_require__.resolve('webpack/hot/poll')
    const userEntry = resolve(process.cwd(), launcherOptions.userEntry)
    console.log({launcherOptions, userEntry})
    const webpackConfig: Configuration = {
      entry: [__non_webpack_require__.resolve('webpack-hot-middleware/client'), endifyVueEntry],
      mode: 'development',
      output: {
        filename: 'endify-vue.js',
        path: this.outputPath,
        // libraryTarget: 'commonjs2',
      },
      resolve: {
        alias: {
          '@endify/vue/user-entry': userEntry,
        },
        extensions: ['.ts', '.js', '.json', '.vue'],
        modules: [
          relative(process.cwd(), resolve(__dirname, '../node_modules'))
        ]
      },
      plugins: [
        new HotModuleReplacementPlugin(),
        new ProgressPlugin((percentage, message) => {
          endifyServerEmitter.emit('call-parent', {
            id: '@endify/vue:build-progress-change',
            payload: {
              percentage,
              message,
              name: '@endify/vue',
            },
          })
        }),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
          publicPath: '/dist',
          template: this.options.htmlTemplatePath
        }),
        new ErrorOverlayPlugin()
      ],
      optimization: {
        moduleIds: 'named',
      },
      module: {
        rules: [
          {
            test: /\.vue$/,
            use: 'vue-loader'
          }
        ],
      },
      // stats: false,
      externals: [nodeExternals({
        allowlist: ['@endify/vue/user-entry'],
      })],
      resolveLoader: {
        modules: [
          relative(process.cwd(), resolve(__dirname, '../node_modules'))
        ]
      },
      devtool: 'cheap-module-source-map',
    }
    return webpackConfig
  }

  async dev({emitters}, webpackConfig) {
    const compiler = webpack(await this.getWebpackConfig({emitters}))
    const endifyServerEmitter = emitters.getEmitter('@endify/server')
    endifyServerEmitter.on('create-app', ({app}) => {
      app.use(webpackDevMiddleware(compiler, {
        publicPath: '/dist',
        writeToDisk: true,
        // stats: false,
      }));
      app.use(webpackHotMiddleware(compiler, {
        // log: false,
      }));
      app.get('*', (req, res) => {
        readFile(join(this.outputPath, 'index.html'), (err, html) => {
          if (err) {
            throw err
          }

          // html = html
          //   .toString()
          //   .replace('<div id="app">', `<div id="app">${appContent}`)
          res.setHeader('Content-Type', 'text/html')
          res.send(html)
        })
      })
    })
    // const userBuildPath = this.buildPath
    // const compiler = webpack(webpackConfig)
    // let spawned = false
    // compiler.watch({
    //
    // }, async (error, stats) => {
    //   if(error) {
    //     return this.endifyLogger.error('Build failed', error)
    //   }
    //   if(!spawned) {
    //     let inspectPort = null
    //     if(this.inspectPort === true) {
    //       inspectPort = 9229
    //     }
    //     if(typeof this.inspectPort === 'number') {
    //       inspectPort = this.inspectPort
    //     }
    //     // const args = this.inspectPort === null ? [userBuildPath] : [`--inspect=${inspectPort}`, userBuildPath]
    //     // const apiProcess = spawn('node', args, {
    //     //   stdio: ['pipe', 'inherit', 'inherit'],
    //     // })
    //     const apiProcess = fork(userBuildPath, [], {
    //       // stdio: ['pipe', 'inherit', 'inherit'],
    //       // execArgv:
    //       cwd: process.cwd(),
    //     })
    //     apiProcess.on('close', (code) => {
    //       return this.endifyLogger.warn('API process has been shut down, status code:', code)
    //     })
    //     spawned = true
    //   }
    // })
  }
}