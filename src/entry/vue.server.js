import {setupApp} from '../setup/vue/setupApp'

function vueEntryServer(context) {
  return new Promise(async (resolve, reject) => {
    try {
      const {vueApp, vueConfig: {router, store}} = setupApp()
      const {fullPath} = router.resolve(context.url).route
      if (fullPath !== context.url) {
        throw ({url: fullPath})
      }
      router.push(context.url)
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
      const asyncPromises = matchedComponents.map(({ asyncData }) => asyncData && asyncData({
        store,
        route: router.currentRoute
      }))

      try {
        await Promise.all(asyncPromises)
      } catch(e) {
        return finishRequest({
          statusCode: 500
        })
      }
      finishRequest()
    } catch(e) {
      reject(e)
    }
  })
}

export default vueEntryServer
