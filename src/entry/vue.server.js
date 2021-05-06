import {setupApp} from '../setup/vue/setupApp'
import {clientConfig} from '../services/ClientConfigService'

function vueEntryServer(context) {
  return new Promise(async (resolve, reject) => {
    try {
      const {vueApp, vueConfig: {router, store}, clientConfig} = setupApp({
        req: context.req,
        url: context.url,
      })
      const {fullPath} = router.resolve(context.path).route
      if (fullPath !== context.path) {
        throw ({redirectUrl: fullPath})
      }
      router.push(context.path)
      const finishRequest = (options) => {
        if(!options) {
          options = {}
        }
        if(!options.statusCode) {
          options.statusCode = 200
        }

        context.statusCode = options.statusCode

        if(options.statusCode !== 200) {
          store.commit('endify/SET_ERROR', {
            code: options.statusCode
          })
        }

        context.state = store.state
        context.meta = vueApp.$meta()
        resolve(vueApp)
      }

      //Fetch Asynchronous data
      await new Promise((resolve, reject) => {
        router.onReady(resolve, reject)
      })

      let matchedComponents = router.getMatchedComponents()
      if(!matchedComponents.length) {
        return finishRequest({
          statusCode: 404
        })
      }
      let wasRedirectCalled = false
      const redirect = (route) => {
        wasRedirectCalled = true
        const resolvedRoute = router.resolve(route)
        reject({redirectUrl: resolvedRoute.href})
      }
      const componentstoCallAsyncData = [
        clientConfig.mainComponent,
        ...matchedComponents
      ]
      const asyncPromises = componentstoCallAsyncData.map(({ asyncData }) => asyncData && asyncData({
        store,
        route: router.currentRoute,
        redirect,
        request: context.request,
        url: context.url,
        vueApp,
        req: context.request,
      }))

      try {
        await Promise.all(asyncPromises)
      } catch(e) {
        return finishRequest({
          statusCode: 500
        })
      }
      if(!wasRedirectCalled) {
        finishRequest()
      }
    } catch(e) {
      reject(e)
    }
  })
}

export default vueEntryServer
