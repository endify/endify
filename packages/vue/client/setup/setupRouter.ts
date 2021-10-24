import {createRouter} from 'vue-router'

export async function setupRouter({app, url, history, routes}) {
  let router = createRouter({
    routes,
    history
  })
  await router.push(url)
  await router.isReady()
  app.use(router)
}