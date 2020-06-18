import Vue from 'vue'
import App from '../../components/App'
import {setupRouter} from './setupRouter'
import {setupStore} from './setupStore'

export function setupApp() {
  const vueConfig = {
    render: h => h(App),
  }
  setupRouter({Vue, vueConfig})
  setupStore({Vue, vueConfig})
  const vueApp = new Vue(vueConfig)
  return {vueApp, vueConfig}
}
