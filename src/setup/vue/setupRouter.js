import VueRouter from 'vue-router'
import {clientConfig} from '../../services/ClientConfigService'
import {ClientHelper} from '../../helpers/ClientHelper'
import {ClientTypes} from '../../enum/ClientTypes'

export function setupRouter({Vue, vueConfig}) {
  Vue.use(VueRouter)
  const routes = [
      ...clientConfig.pages
  ]
  vueConfig.router = new VueRouter({
    mode: ClientHelper.currentClientType === ClientTypes.ELECTRON ? 'hash' : 'history',
    routes,
    scrollBehavior: clientConfig.scrollBehavior,
  })
}
