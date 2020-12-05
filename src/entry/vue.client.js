import {setupApp} from '../setup/vue/setupApp'
const {vueApp, vueConfig: {router, store}, clientConfig} = setupApp({
  url: window.location.href
})

const beforeResolveAction = async (to, from, next) => {
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
  // let diffed = false
  // const activated = matched.filter((c, i) => {
  //   return diffed || (diffed = (prevMatched[i] !== c))
  // })
  const activated = matched

  const componentstoCallAsyncData = [
    clientConfig.mainComponent,
    ...activated
  ]

  const asyncDataHooks = componentstoCallAsyncData.map(c => c.asyncData).filter(_ => _)

  store.commit('endify/SET_ROUTE_LOADING_STATUS', true)

  let wasRedirectCalled = false
  const redirect = (route) => {
    wasRedirectCalled = true
    next(route)
  }

  try {
    await Promise.all(asyncDataHooks.map(hook => hook({
      store,
      route: to,
      redirect,
      url: window.location.href,
      vueApp
    })))
    if(!wasRedirectCalled) {
      return finishRequest({
        statusCode: 200
      })
    }
  } catch(e) {
    console.error(e)
    if(!wasRedirectCalled) {
      return finishRequest({
        statusCode: 500
      })
    }
  }
}
let wasAsyncCalledOnSsr = false
if (window.__INITIAL_STATE__) {
  wasAsyncCalledOnSsr = true
  store.replaceState(window.__INITIAL_STATE__)
}
if(!wasAsyncCalledOnSsr) {
  router.beforeResolve(beforeResolveAction)
}
router.onReady(() => {
  if(wasAsyncCalledOnSsr) {
    router.beforeResolve(beforeResolveAction)
  }
  vueApp.$mount('#app')
})
