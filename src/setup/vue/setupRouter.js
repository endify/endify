import VueRouter from 'vue-router'
import endifySettings from 'ISSUER_PATH/endify.config.client.js'

export function setupRouter({Vue, vueConfig}) {
  Vue.use(VueRouter)
  const routes = [
      ...endifySettings.pages,
  ]
  vueConfig.router = new VueRouter({
    mode: 'history',
    routes
  })
}
