import {setupApp} from '../setup/vue/setupApp'
const {vueApp, vueConfig: {router, store}} = setupApp()

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

router.onReady(() => {
  router.beforeResolve(async (to, from, next) => {
    const finishRequest = (options) => {
      if(!options) {
        options = {}
      }
      if(!options.statusCode) {
        options.statusCode = 200
      }
      if(options.statusCode === 200) {
        store.commit('endify/REMOVE_ERROR')
      } else {
        store.commit('endify/SET_ERROR', {
          code: options.statusCode
        })
      }
      store.commit('endify/SET_ROUTE_LOADING_STATUS', false)
      next()
    }

    const matched = router.getMatchedComponents(to)
    if(!matched.length) {
      return finishRequest({
        statusCode: 404
      })
    }
    const prevMatched = router.getMatchedComponents(from)
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })
    const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _)

    store.commit('endify/SET_ROUTE_LOADING_STATUS', true)

    try {
      await Promise.all(asyncDataHooks.map(hook => hook({ store, route: to })))
      return finishRequest({
        statusCode: 200
      })
    } catch(e) {
      return finishRequest({
        statusCode: 500
      })
    }
  })
  vueApp.$mount('#app')
})
