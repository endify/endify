import {createMemoryHistory, createRouter, createWebHistory} from 'vue-router'

export async function setupRouter() {
  const isServer = true
  let history = isServer ? createMemoryHistory() : createWebHistory()

  const routes = [
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound
    },
  ]

  let router = createRouter({ routes, history })

  await router.push(req.url)
  await router.isReady()
}