import http from 'http'
import path from 'path'
import dotEnvExtended from 'dotenv-extended';
import {setupServer} from '../setup/api/setupServer'
import {VueBundleWatcher} from '../services/VueBundleWatcher'
import serverWebpackConfig from '../config/webpack/webpack.config.vue.server.js'
import clientWebpackConfig from '../config/webpack/webpack.config.vue.client.js'
import endifyServerConfig from '@project/endify.config.server.js'

const vueClientDistPath = path.join(process.env.ISSUER_PATH, '/dist/vue-client')
const vueServerBundlePath = path.join(process.env.ISSUER_PATH, '/dist/vue-server/vue-ssr-server-bundle.json')
const vueServerClientManifestPath = path.join(process.env.ISSUER_PATH, '/dist/vue-client/vue-ssr-client-manifest.json')
const vueTemplatePath = path.join(process.env.BASE_PATH, '/src/setup/vue/template.html')
const publicDistPath = '/dist'

let currentExpressApp, vueBundleWatcher, server

const setupServerAdapter = async () => {
  return await setupServer({
    vueClientDistPath,
    vueBundleWatcher
  })
}

const start = async function() {
  dotEnvExtended.load({
    defaults: path.join(process.env.BASE_PATH, '/.env.defaults'),
    path: path.join(process.env.BASE_PATH, '/.env')
  });

  // Watch for bundle or load it on production
  vueBundleWatcher = new VueBundleWatcher({
    serverBundlePath: vueServerBundlePath,
    manifestBundlePath: vueServerClientManifestPath,
    templatePath: vueTemplatePath,
    publicPath: publicDistPath,
    clientWebpackConfig: clientWebpackConfig(),
    serverWebpackConfig: serverWebpackConfig(),
    bundleRendererBaseDir: process.env.BASE_PATH
  })
  if(process.env.NODE_ENV === 'production') {
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
    const PORT = endifyServerConfig.port || process.env.PORT || 3000
  server.listen(PORT, () => {
    console.log('Server is listening on port', PORT)
  })
}

start()

if (module.hot) {
  module.hot.accept('../setup/api/setupServer', async () => {
    try {
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
