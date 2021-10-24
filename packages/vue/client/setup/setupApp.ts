import { h } from 'vue'

export function setupApp(createApp) {
    // console.log('here we  are', ...args)
    const NotFoundComponent = { template: '<p>Page not found</p>' }
    const HomeComponent = { template: '<p>Home page</p>' }
    const AboutComponent = { template: '<p>About page</p>' }
    const routes = {
        '/': HomeComponent,
        '/about': AboutComponent
    }
    const SimpleRouter = {
        data: () => ({
            currentRoute: '/'
        }),
        computed: {
            CurrentComponent() {
                return routes[this.currentRoute] || NotFoundComponent
            }
        },
        render() {
            return h(this.CurrentComponent)
        }
    }

    return createApp(SimpleRouter)
}

//
//
// import {setupRouter} from './setupRouter'
//
// export function setupApp() {
//     setupRouter()
// }