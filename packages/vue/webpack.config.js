const {join, resolve} = require('path')
const nodeExternals = require('webpack-node-externals')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = () => {
  return {
    target: 'node',
    entry: {
      extension: join(__dirname, '/src/extension'),
      launcher: join(__dirname, '/src/launcher'),
    },
    context: join(__dirname),
    output: {
      path: resolve(__dirname, 'dist'),
      filename: '[name].js',
      library: {
        type: 'commonjs2',
      },
    },
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /(node_modules)/,
          options: {
            configFile: resolve(__dirname, 'tsconfig.json'),
            onlyCompileBundledFiles: true,
          },
        },
      ],
    },
    // plugins: [
    //   new CopyPlugin({
    //     patterns: [
    //       {
    //         from: join(__dirname, '/src/entry'),
    //         to: 'entry.js',
    //       },
    //     ],
    //   }),
    // ],
    resolve: {
      extensions: ['.ts', '.js'],
    },
    externals: [nodeExternals()],
    node: {
      __dirname: false,
    },
  }
}
