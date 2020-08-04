import Vue from 'vue'
import {setupRouter} from './setupRouter'
import {setupStore} from './setupStore'
import {clientConfig} from '../../services/ClientConfigService'
import headMixin from '../../mixins/headMixin'

export function setupApp() {
  const vueConfig = {
    render: h => h(clientConfig.mainComponent),
  }
  setupRouter({Vue, vueConfig})
  setupStore({Vue, vueConfig})
  Vue.mixin(headMixin)

  const vueApp = new Vue(vueConfig)
  return {vueApp, vueConfig}
}
