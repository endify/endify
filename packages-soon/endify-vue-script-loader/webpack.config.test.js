const {VueLoaderPlugin} = require('vue-loader')


module.exports = () => {
  return {
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
      ],
    },
    plugins: [
      new VueLoaderPlugin(),
    ],
    entry: 'test.js',
    target: 'node',
    output: {
      filename: 'old-index.ts',
      publicPath: '/public/',
      path: 'build',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.vue', '.json'],
    },
  }
}
