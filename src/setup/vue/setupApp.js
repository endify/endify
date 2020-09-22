import Vue from 'vue'
import {setupRouter} from './setupRouter'
import {setupStore} from './setupStore'
import {clientConfig} from '../../services/ClientConfigService'
import headMixin from '../../mixins/headMixin'
import VueMeta from 'vue-meta'

export function setupApp() {
  const vueConfig = {
    render: h => h({
      metaInfo: {
        title: 'Endify App',
      },
      ...clientConfig.mainComponent
    }),
  }
  setupRouter({Vue, vueConfig})
  setupStore({Vue, vueConfig})
  // Vue.mixin(headMixin)
  Vue.use(VueMeta)
  const vueApp = new Vue(vueConfig)
  return {vueApp, vueConfig}
}
