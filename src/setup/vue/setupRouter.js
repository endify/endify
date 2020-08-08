import VueRouter from 'vue-router'
import {clientConfig} from '../../services/ClientConfigService'

export function setupRouter({Vue, vueConfig}) {
  Vue.use(VueRouter)
  const routes = [
      ...clientConfig.pages,
  ]
  vueConfig.router = new VueRouter({
    mode: 'history',
    routes,
    scrollBehavior: clientConfig.scrollBehavior,
  })
}
