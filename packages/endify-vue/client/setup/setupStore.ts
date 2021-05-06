import modules from '../store'
import {createStore} from 'vuex'

function getVuexStoreConfig() {
  return {
    modules
  }
}

export function setupStore({app}) {
  const store = createStore(getVuexStoreConfig())
  app.use(store)
  if (module.hot) {
    module.hot.accept('../store', () => {
      store.hotUpdate(getVuexStoreConfig())
    })
  }
}
