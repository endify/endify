require('dotenv-extended').load();
const {VueLoaderPlugin} = require('vue-loader')
const webpack = require('webpack')
const fs = require('fs')
const path = require('path')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

module.exports = () => {
  const IS_DEV = process.env.NODE_ENV !== 'production'

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
          test: /\.js?$/,
          // exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              // presets: ['@babel/preset-env'],
              // plugins: ['@babel/plugin-proposal-optional-chaining']
            }
          }
        },
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
    ],
    resolve: {
      extensions: ['*', '.js', '.vue', '.json'],
      modules: [path.join(process.env.BASE_PATH, 'node_modules'), 'node_modules'],
      alias: {
          '@project': process.env.ISSUER_PATH
      }
    },
    resolveLoader: {
      modules: [path.join(process.env.BASE_PATH, 'node_modules'), 'node_modules']
    }
  }

  if(IS_DEV) {
    // c.stats = 'errors-only'
    // c.plugins.push(new webpack.NoEmitOnErrorsPlugin())
    c.plugins.push(new FriendlyErrorsWebpackPlugin())
  }

  const packageJsonContent = fs.readFileSync(path.join(process.env.BASE_PATH, 'package.json'), 'utf-8')
  const packageJson = JSON.parse(packageJsonContent)
  const version = packageJson.version

  c.plugins.push(new webpack.DefinePlugin({
    '__PACKAGE_JSON_VERSION__': JSON.stringify(version),
    'process.env.BASE_PATH': JSON.stringify(process.env.BASE_PATH),
  }))

  c.context = path.join(process.env.BASE_PATH)

  return c
};
