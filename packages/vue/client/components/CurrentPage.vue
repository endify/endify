<template>
  <RouterView class="endify-view" v-if="!error"/>
  <ErrorPage v-else/>
</template>

<script>
  import {mapGetters} from 'vuex'
  import ErrorPage from '../pages/_Error'

  export default {
    components: {
      ErrorPage
    },
    computed: {
      ...mapGetters('endify', ['routeLoadingStatus', 'error'])
    }
  }
</script>
