<template>
  <button class="createAccount" @click="endpoint()">Zaloz konto</button>
  <Basket/>
  <Products category="123"></Products>
</template>

<script backend>
import {Basket} from '@endify/basket-extension'
import {Products} from '@endify/products-extension'

  export default {
    extendApp({container}) {
      const endpoint = container.resolve('UserController').createAccount
      return {
        endpoint
      }
    }
  }
</script>

<script front>
  export default {
    env: {
      mainComponent: `App.vue`
    }
  }
</script>