const handle = () => {
  const webpack = require('webpack')

  const webpackConfigs = {
    api: require('../../config/webpack/webpack.config.api.js')({
      env: 'development'
    }),
    vueClient: require('../../config/webpack/webpack.config.vue.client.js')({
      env: 'development'
    }),
    vueServer: require('../../config/webpack/webpack.config.vue.server.js')({
      env: 'development'
    }),
  }

  const compilers = {
    api: webpack(webpackConfigs.api),
    vueClient: webpack(webpackConfigs.vueClient),
    vueServer: webpack(webpackConfigs.vueServer),
  }

  compilers.api.run((e, stats) => {
    if(e) {
      return console.log('Compiler error', e)
    }
    console.log('Api compiled')
  })

  compilers.vueClient.run((e, stats) => {
    if(e) {
      return console.log('Compiler error', e)
    }
    console.log('Vue client compiled')
  })

  compilers.vueServer((e, stats) => {
    if(e) {
      return console.log('Compiler error', e)
    }
    console.log('Vue server compiled')
  })
}

module.exports = handle

