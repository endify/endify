const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

module.exports = () => {
  return {
    target: 'node',
    entry: path.join(__dirname, '/scripts/cli.ts'),
    output: {
      path: path.resolve(__dirname, 'build')
    },
    mode: 'development',
    plugins: [
      new webpack.BannerPlugin({banner: "#!/usr/bin/env node", raw: true}),
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            configFile: path.resolve(__dirname, 'tsconfig.json')
          }
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    externals: [nodeExternals()]
  }
}