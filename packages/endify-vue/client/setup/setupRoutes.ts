import HomePage from '../pages/Home'

export async function setupRoutes() {
  return [
    {
      path: '/',
      component: HomePage
    }
  ]
}