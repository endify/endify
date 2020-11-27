require('dotenv-extended').load();
const {VueLoaderPlugin} = require('vue-loader')
const webpack = require('webpack')
const fs = require('fs')
const path = require('path')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

module.exports = (options) => {
  const basePath = options.basePath
  const issuerPath = options.issuerPath

  const IS_DEV = options.env !== 'production'

  const c = {
    mode: IS_DEV ? 'development' : 'production',
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                implementation: require('sass')
              }
            }
          ],
        },
        {
          test: /\.scss$/,
          use: [
            'vue-style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                implementation: require('sass')
              }
            }
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                esModule: false,
              },
            },
          ],
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
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
        },
        {
          test: /\.ya?ml$/,
          use: 'yaml-loader',
          type: 'json'
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
    ],
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.vue', '.json'],
      modules: ['node_modules', path.join(basePath, 'node_modules')],
      alias: {
        '@project': issuerPath,
        'endify/server': path.join(basePath, 'server/index.ts'),
      }
    },
    resolveLoader: {
      modules: [path.join(basePath, 'node_modules'), 'node_modules']
    }
  }

  if(IS_DEV) {
    c.stats = 'errors-only'
    // c.plugins.push(new webpack.NoEmitOnErrorsPlugin())
    c.plugins.push(new FriendlyErrorsWebpackPlugin())
  }

  const packageJsonContent = fs.readFileSync(path.join(issuerPath, 'package.json'), 'utf-8')
  const packageJson = JSON.parse(packageJsonContent)
  const version = packageJson.version

  c.plugins.push(new webpack.DefinePlugin({
    '__PACKAGE_JSON_VERSION__': JSON.stringify(version),
    'process.env.BASE_PATH': JSON.stringify(basePath),
  }))

  c.context = path.resolve(basePath)

  return c
};
//
// module.exports = () => {
//   return {
//     plugins: []
//   }
// }
