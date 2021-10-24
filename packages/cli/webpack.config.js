const {join, resolve} = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

module.exports = () => {
  return {
    target: 'node',
    entry: join(__dirname, '/src/scripts/cli.ts'),
    output: {
      path: resolve(__dirname, 'dist'),
      filename: 'cli.js',
    },
    mode: 'development',
    plugins: [
      new webpack.BannerPlugin({
        banner: '#!/usr/bin/env node',
        raw: true,
      }),
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            configFile: resolve(__dirname, 'tsconfig.json'),
          },
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    externals: [nodeExternals()],
  }
}
