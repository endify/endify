const handle = ({paths}) => {
  const webpack = require('webpack')
  const webpackConfigs = {
    api: require('../../config/webpack/webpack.config.api.js')({
      ...paths,
      env: 'production',
    }),
    vueClient: require('../../config/webpack/webpack.config.vue.client.js')({
      ...paths,
      env: 'production',
    }),
    vueServer: require('../../config/webpack/webpack.config.vue.server.js')({
      ...paths,
      env: 'production',
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
    console.log('Api compiled', stats)
  })

  compilers.vueClient.run((e, stats) => {
    if(e) {
      return console.log('Compiler error', e)
    }
    console.log('Vue client compiled')
  })

  compilers.vueServer.run((e, stats) => {
    if(e) {
      return console.log('Compiler error', e)
    }
    console.log('Vue server compiled')
  })
}

module.exports = handle

