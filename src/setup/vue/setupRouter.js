import VueRouter from 'vue-router'
import {clientConfig} from '../../services/ClientConfigService'
import {ClientHelper} from '../../helpers/ClientHelper'
import {ClientTypes} from '../../enum/ClientTypes'
import {ensureMixin} from '../../helpers/ensureMixin'
import headMixin from '../../mixins/headMixin'

export function setupRouter({Vue, vueConfig}) {
  Vue.use(VueRouter)
  const routes = [
      ...clientConfig.pages/*.map(route => {*/
      //   const component = route.component
      //   if(!component) {
      //     return route
      //   }
      //   let targetComponent
      //   if(typeof component === 'function') {
      //     targetComponent = async (...args) => {
      //       const loadedComponent = await component(...args)
      //       return ensureMixin(loadedComponent, headMixin)
      //     }
      //   } else {
      //     targetComponent = ensureMixin(component, headMixin)
      //   }
      //   return {
      //     ...route,
      //     component: targetComponent
      //   }
      // }),
  ]
  vueConfig.router = new VueRouter({
    mode: ClientHelper.currentClientType === ClientTypes.ELECTRON ? 'hash' : 'history',
    routes,
    scrollBehavior: clientConfig.scrollBehavior,
  })
}
