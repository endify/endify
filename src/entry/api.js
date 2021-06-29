import http from 'http'
import path from 'path'
import dotEnvExtended from 'dotenv-extended';
import {setupServer} from '../setup/api/setupServer'
import {VueBundleWatcher} from '../services/VueBundleWatcher'
import {serverConfigService} from '../services/ServerConfigService'

const vueClientDistPath = path.join(__ENDIFY_ENV__.ISSUER_PATH, '/dist/vue-client')
const vueServerBundlePath = path.join(__ENDIFY_ENV__.ISSUER_PATH, '/dist/vue-server/vue-ssr-server-bundle.json')
const vueServerClientManifestPath = path.join(__ENDIFY_ENV__.ISSUER_PATH, '/dist/vue-client/vue-ssr-client-manifest.json')
const vueTemplatePath = path.join(__ENDIFY_ENV__.BASE_PATH, '/src/setup/vue/template.html')
const publicDistPath = '/dist'

let currentExpressApp, vueBundleWatcher, server

const setupServerAdapter = async () => {
  return await setupServer({
    vueClientDistPath,
    vueBundleWatcher
  })
}

const start = async function() {
  const endifyServerConfig = await serverConfigService.getConfig()

  dotEnvExtended.load({
    defaults: path.join(__ENDIFY_ENV__.BASE_PATH, '/.env.defaults'),
    path: path.join(__ENDIFY_ENV__.BASE_PATH, '/.env')
  });

  let clientWebpackConfig, serverWebpackConfig
  if(__ENDIFY_ENV__.ENV !== 'production') {
    clientWebpackConfig = require('../config/webpack/webpack.config.vue.client.js')
    serverWebpackConfig = require('../config/webpack/webpack.config.vue.server.js')
  }

  // Watch for bundle or load it on production
  const bundleWatcherOptions = {
    serverBundlePath: vueServerBundlePath,
    manifestBundlePath: vueServerClientManifestPath,
    templatePath: vueTemplatePath,
    publicPath: publicDistPath,
    bundleRendererBaseDir: __ENDIFY_ENV__.BASE_PATH
  }
  if(__ENDIFY_ENV__.ENV !== 'production') {
    bundleWatcherOptions.clientWebpackConfig = clientWebpackConfig({
      basePath: __ENDIFY_ENV__.BASE_PATH,
      issuerPath: __ENDIFY_ENV__.ISSUER_PATH,
    })
    bundleWatcherOptions.serverWebpackConfig = serverWebpackConfig({
      basePath: __ENDIFY_ENV__.BASE_PATH,
      issuerPath: __ENDIFY_ENV__.ISSUER_PATH,
    })
  }

  vueBundleWatcher = new VueBundleWatcher(bundleWatcherOptions)
  if(__ENDIFY_ENV__.ENV === 'production') {
    await vueBundleWatcher.loadRenderer()
  } else {
    vueBundleWatcher.watch()
  }

  // Setup express server
  let expressApp
  try {
    expressApp = await setupServerAdapter()
    currentExpressApp = expressApp
  } catch(e) {
    console.error(e)
  }
  server = http.createServer(expressApp || undefined)
  if(typeof endifyServerConfig.extendServer === 'function') {
    endifyServerConfig.extendServer(server)
  }
  const PORT = endifyServerConfig.port || __ENDIFY_ENV__.PORT || 3000
  server.listen(PORT, () => {
    console.log('Server is listening on port', PORT)
  })
}

start()

if (module.hot) {
  module.hot.accept(['../setup/api/setupServer', '@project/endify.config.server.js', '../services/ServerConfigService'], async () => {
    try {
      serverConfigService.invalidateConfig()
      const expressApp = await setupServerAdapter()
      if(currentExpressApp) {
        server.removeListener('request', currentExpressApp)
      }

      server.on('request', expressApp)
      currentExpressApp = expressApp
    } catch(e) {
      console.error(e)
    }
  })
}
