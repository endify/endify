import {Environment} from './enum/Environment'
import {merge} from 'webpack-merge'
import {isAbsolute, join, relative, resolve} from 'path'
import {Configuration as WebpackConfiguration, HotModuleReplacementPlugin} from 'webpack'
import * as nodeExternals from 'webpack-node-externals'

export class WebpackConfigBase {
  protected readonly issuerPath: string
  protected readonly installedModulePath: string
  protected readonly env: Environment

  constructor({env, issuerPath, installedModulePath}) {
    this.issuerPath = issuerPath
    this.installedModulePath = installedModulePath
    this.env = env || Environment.PRODUCTION
  }

  public async getConfig(): Promise<WebpackConfiguration> {
    let c = {
      output: {
        libraryTarget: 'commonjs2',
      },
      mode: this.env === Environment.PRODUCTION ? Environment.PRODUCTION : Environment.DEVELOPMENT,
      watch: this.env === Environment.DEVELOPMENT,
      resolve: {
        alias: {
          '@app/config': join(this.issuerPath, 'config'),
          '@app': this.issuerPath,
          '@endify/vue': join(this.installedModulePath, 'packages/endify-vue'),
          '@endify/config-extension': join(this.installedModulePath, 'packages/endify-config-extension'),
          '@endify': this.installedModulePath,
          // Can be problematic if installed directly to node_modules on the same level, should detect it in the future
          // 'webpack/hot/log': join(this.installedModulePath, 'packages/endify-core/WebpackHotLog/WebpackHotLog'),
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
      module: {
        rules: [
          {
            test: /\.(j|t)sx?$/,
            exclude: /node_modules\/(?!(endify)\/).*/,
            use: {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                babelrc: false,
                presets: [
                  join(this.installedModulePath, 'node_modules', '@babel/preset-typescript'),
                ],
                plugins: [
                  [join(this.installedModulePath, 'node_modules', '@babel/plugin-proposal-decorators'), {
                    legacy: true,
                  }],
                  [join(this.installedModulePath, 'node_modules', '@babel/plugin-proposal-class-properties'), {
                    loose: true,
                  }],
                  [join(this.installedModulePath, 'node_modules', 'babel-plugin-transform-typescript-metadata')],
                  [join(this.installedModulePath, 'node_modules', 'babel-plugin-parameter-decorator'), {
                    legacy: true,
                  }],
                  join(this.installedModulePath, 'node_modules', '@babel/plugin-proposal-optional-chaining'),
                ],
              },
            },
          },
        ],
      },
      resolveLoader: {
        modules: [join(this.installedModulePath, 'node_modules'), join(this.issuerPath, 'node_modules')],
      },
      externals: [
        nodeExternals({
          importType: (moduleName: string) => {
            try {
              require.resolve(moduleName)
              return `commonjs ${moduleName}`
            } catch(e) {
              return `commonjs2 ${join(this.installedModulePath, 'node_modules', moduleName)}`
            }
          },
          modulesDir: join(this.installedModulePath, 'node_modules'),
        }),
        {
          // fs: 'commonjs2 fs',
          // path: 'commonjs2 path',
          // webpack: 'commonjs2 webpack'
        },
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
          // 'chalk': `commonjs ${join(this.installedModulePath, 'node_modules', 'chalk')}`,
          // 'webpack': `commonjs ${join(this.installedModulePath, 'node_modules', 'webpack')}`
          // 'chalk': 'commonjs2 chalk'
        },
      ],
      // stats: 'errors-only',
      context: this.isCurrentModuleSymlinked ? resolve(this.installedModulePath) : resolve(this.issuerPath),
    }

    if(this.env === Environment.DEVELOPMENT) {
      c = this.mergeConfig(c, {
        plugins: [
          new HotModuleReplacementPlugin(),
        ],
      })
    }

    return c
  }

  protected mergeConfig(config, ...configs) {
    return merge(config, ...configs)
  }

  protected get nodeModulesPath() {
    return this.isCurrentModuleSymlinked ? join(this.installedModulePath, 'node_modules') : ''
  }

  protected get isCurrentModuleSymlinked() {
    return this.isModuleSymlinked(this.issuerPath, this.installedModulePath)
  }

  protected isModuleSymlinked(issuerPath, installedModulePath) {
    const relativePath = relative(this.issuerPath, this.installedModulePath)
    return !(relativePath && !relativePath.startsWith('..') && !isAbsolute(relativePath))
  }

  protected get buildPath() {
    return join(this.issuerPath, '/.endify/build')
  }
}
