// import {VueLoaderPlugin} from 'vue-loader'
import {WebpackConfigBase} from '../../endify-tools/webpack.config.base'

export class WebpackConfigVueBase extends WebpackConfigBase {
  constructor({env, issuerPath, installedModulePath}) {
    super({
      env,
      issuerPath,
      installedModulePath
    })
  }

  async getConfig() {
    const config = {
      module: {
        rules: [
          // {
          //   test: /\.css$/,
          //   use: [
          //     'vue-style-loader',
          //     'css-loader',
          //     {
          //       loader: 'sass-loader',
          //       options: {
          //         implementation: require('sass')
          //       }
          //     }
          //   ],
          // },
          // {
          //   test: /\.scss$/,
          //   use: [
          //     'vue-style-loader',
          //     'css-loader',
          //     {
          //       loader: 'sass-loader',
          //       options: {
          //         implementation: require('sass')
          //       }
          //     }
          //   ]
          // },
          // {
          //   test: /\.(png|jpe?g|gif|svg)$/i,
          //   use: [
          //     {
          //       loader: 'file-loader',
          //       options: {
          //         esModule: false,
          //       },
          //     },
          //   ],
          // },
          // {
          //   test: /\.vue$/,
          //   loader: 'vue-loader'
          // },
        ]
      },
      // plugins: [
      //   new VueLoaderPlugin(),
      // ],
      resolve: {
        extensions: ['.ts', '.tsx', '.js', '.vue', '.json'],
      },
    }

    return this.mergeConfig(await super.getConfig(), config)
  }
}