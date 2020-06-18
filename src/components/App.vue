<template>
  <div>
    <router-view class="view" v-if="!error"></router-view>
    <div v-if="error">
      <ErrorPage />
    </div>
  </div>
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
