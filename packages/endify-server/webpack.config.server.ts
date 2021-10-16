import {join, resolve} from 'path'
import {Environment} from '../endify-core/enum/Environment'
import {WebpackConfigBase} from '../endify-core/webpack.config.base'
import {DefinePlugin} from 'webpack'

export class WebpackConfigServer extends WebpackConfigBase {
  private readonly apiEntryPath: string
  private readonly webpackPollInterval: number

  constructor({env, webpackPollInterval, issuerPath, installedModulePath, apiEntryPath}) {
    super({
      env,
      issuerPath,
      installedModulePath,
    })
    this.webpackPollInterval = webpackPollInterval || 500
    this.apiEntryPath = apiEntryPath
  }

  get webpackHotPollPath() {
    return join(this.nodeModulesPath, `webpack/hot/poll?${this.webpackPollInterval}`)
  }

  async getConfig() {
    const c = {
      target: 'node',
      entry: this.env === Environment.PRODUCTION ? this.apiEntryPath : [this.webpackHotPollPath, this.apiEntryPath],
      output: {
        filename: 'server.js',
        path: join(this.buildPath, 'server'),
        libraryTarget: 'commonjs2',
      },
      resolve: {
        extensions: ['.endify.server.ts', '.endify.server.js'],
      },
      node: {
        __dirname: true,
      },
      plugins: [
        new DefinePlugin({
          '$endify.issuerPath': JSON.stringify(this.issuerPath),
          '$endify.installedModulePath': JSON.stringify(this.installedModulePath),
        }),
      ],
      // devtool: 'eval-source-map'
    }
    return this.mergeConfig(await super.getConfig(), c)
  }
}
