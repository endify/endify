const path = require('path')

const handle = async ({paths}) => {
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
    vueClientElectron: require('../../config/webpack/webpack.config.vue.electron.js')({
      ...paths,
      env: 'production',
    }),
  }

  const compilers = {
    api: webpack(webpackConfigs.api),
    vueClient: webpack(webpackConfigs.vueClient),
    vueClientElectron: webpack(webpackConfigs.vueClientElectron),
    vueServer: webpack(webpackConfigs.vueServer),
  }

  await new Promise((resolve, reject) => {
    compilers.vueClientElectron.run((e, stats) => {
      if(e) {
        console.log('Electron compiler error', e)
        return reject(e)
      }
      if(stats.errors && stats.errors.length) {
        console.log('Electron stats error', stats.errors)
        return reject(stats.errors)
      }
      console.log('Electron compiled', stats)
      resolve()
    })
  })
  const builder = require("electron-builder")
  const Platform = builder.Platform
  const res = await builder.build({
    targets: Platform.WINDOWS.createTarget(),
    config: {
      appId: 'com.apkeo.sunday-polska-converter',
      productName: 'SunConverter',
      copyright: 'Apkeo - Wszystkie Prawa Zastrzeżone',
      directories: {
        output: path.join(paths.issuerPath, '/dist/electron'),
        app: paths.basePath,
        buildResources: 'assets'
      },
      extraMetadata: {
        main: './src/entry/electron.js',
        version: '1.0.0',
        name: 'SunConverter',
      },
      files: [
        '!*/**',
        './package.json',
        './src/entry/electron.js',
        {
          "from": path.join(paths.issuerPath, 'dist/vue-electron'),
          "to": "dist/vue-electron",
          "filter": ["**/*"]
        }
      ],
      extends: null,
    }
  })

  return console.log('done', res);

  compilers.api.run((e, stats) => {
    if(e) {
      return console.log('Compiler error', e)
    }
    if(stats.errors && stats.errors.length) {
      return console.log('Api stats error', stats.errors)
    }
    console.log('Api compiled')
  })

  compilers.vueClient.run((e, stats) => {
    if(e) {
      return console.log('Compiler error', e)
    }
    if(stats.errors && stats.errors.length) {
      return console.log('Vue client stats error', stats.errors)
    }
    console.log('Vue client compiled')
  })

  compilers.vueServer.run((e, stats) => {
    if(e) {
      return console.log('Compiler error', e)
    }
    if(stats.errors && stats.errors.length) {
      return console.log('Vue server stats error', stats.errors)
    }
    console.log('Vue server compiled')
  })
}

module.exports = handle

