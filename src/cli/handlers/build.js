const path = require('path')
const webpack = require('webpack')
const builder = require("electron-builder")
const Platform = builder.Platform

const handle = async ({paths, config, argv}) => {
  const handleWebpackBuild = async (configPath) => {
    const webpackConfig = require(configPath)({
      ...paths,
      buildConfig: config,
      env: 'production',
    })
    const compiler = webpack(webpackConfig)
    return new Promise((resolve, reject) => {
      compiler.run((e, stats) => {
        if (e || (stats.errors && stats.errors.length)) {
          return reject(e || stats.errors)
        }
        resolve(stats)
      })
    })
  }

  const targetFunctions = {
    api() {
      return handleWebpackBuild('../../config/webpack/webpack.config.api.js')
    },
    vueClient() {
      return handleWebpackBuild('../../config/webpack/webpack.config.vue.client.js')
    },
    vueServer() {
      return handleWebpackBuild('../../config/webpack/webpack.config.vue.server.js')
    },
    vueClientElectron() {
      return handleWebpackBuild('../../config/webpack/webpack.config.vue.electron.js')
    },
    async electron(targets) {
      const electronEntryPath = path.join(paths.basePath, './src/entry/electron.js')
      const electronBuilderConfig = config.electronBuilderConfig || {}
      return await builder.build({
        targets,
        config: {
          ...electronBuilderConfig,
          directories: {
            output: path.join(paths.issuerPath, '/dist/native'),
            app: paths.issuerPath,
            buildResources: path.join(paths.issuerPath, 'src/build')
          },
          extraMetadata: {
            ...(electronBuilderConfig.extraMetadata || {}),
            main: './endify/entry/electron.js',
          },
          files: [
            '!*/**',
            './package.json',
            {
              "from": path.resolve(electronEntryPath, '../'),
              "to": "endify/entry",
              "filter": ["electron.js"]
            },
            {
              "from": path.join(paths.issuerPath, 'dist/client-native'),
              "to": "dist/client-native",
              "filter": ["**/*"]
            },
            {
              "from": path.join(paths.issuerPath, 'node_modules'),
              "to": "node_modules",
              "filter": ["**/*", '!./endify/**']
            }
          ],
          extends: null,
        },
        publish: 'always'
      })
    }
  }

  const argvMap = {
    'api'() {
      return targetFunctions.api()
    },
    async 'client'() {
      await Promise.all([
        targetFunctions.vueServer(),
        targetFunctions.vueClient()
      ])
    },
    'client:native'() {
      return targetFunctions.vueClientElectron()
    },
    'native:win'() {
      return targetFunctions.electron(Platform.WINDOWS.createTarget())
    },
    'native:mac'() {
      return targetFunctions.electron(Platform.MAC.createTarget())
    },
    'native:linux'() {
      return targetFunctions.electron(Platform.LINUX.createTarget())
    },
  }

  try {
    const res = await argvMap[argv[0].split(':').slice(1).join(':')]()
    console.log('Operation successfull. Thanks for using Endify!')
  } catch(e) {
    console.error('An error occurred while trying to build:', e)
  }
}

module.exports = handle

