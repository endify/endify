import Vuex from 'vuex'
import modules from '../../../../packages/endify-vue/client/store'
import {sync} from 'vuex-router-sync'

function getVuexStoreConfig() {
  return {
    modules
  }
}

export function setupStore({Vue, vueConfig}) {
  Vue.use(Vuex)
  const store = new Vuex.Store(getVuexStoreConfig())
  sync(store, vueConfig.router)
  vueConfig.store = store
  if (module.hot) {
    module.hot.accept('../../store', () => {
      store.hotUpdate(getVuexStoreConfig())
    })
  }
}
