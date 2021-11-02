import {createApp} from "vue";
import userEntry from '@endify/vue/user-entry'

function setupApp() {
  console.log('userEntry', userEntry)
  const app = createApp(userEntry.rootComponent)
  app.mount('#app')
}

setupApp()