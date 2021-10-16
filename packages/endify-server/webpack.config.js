const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = () => {
  return {
    target: 'node',
    entry: path.join(__dirname, '/src/launcher'),
    context: path.join(__dirname),
    output: {
      path: path.resolve(__dirname, 'build/launcher'),
      filename: 'index.js',
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
          exclude: /node_modules/,
          options: {
            configFile: path.resolve(__dirname, 'tsconfig.json'),
            onlyCompileBundledFiles: true,
          },
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    externals: [nodeExternals()],
    node: {
      __dirname: false,
    },
  }
}
