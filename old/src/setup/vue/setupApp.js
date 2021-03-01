import Vue from 'vue'
import {setupRouter} from './setupRouter'
import {setupStore} from './setupStore'
import {clientConfig} from '../../services/ClientConfigService'
import VueMeta from 'vue-meta'

export function setupApp({url, req}) {
  let vueConfig = {
    render: h => h({
      metaInfo: {
        title: 'Endify App',
      },
      ...clientConfig.mainComponent
    }),
  }
  setupRouter({Vue, vueConfig})
  setupStore({Vue, vueConfig})
  Vue.use(VueMeta)
  if(clientConfig.extendVue) {
    vueConfig = {
      ...vueConfig,
      ...clientConfig.extendVue({vueConfig, Vue, url, req})
    }

  }
  const vueApp = new Vue(vueConfig)
  return {vueApp, vueConfig, clientConfig}
}
