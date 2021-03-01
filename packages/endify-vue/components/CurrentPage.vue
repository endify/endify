<template>
  <div>
    <router-view class="view" v-if="!error"></router-view>
    <div>
      <ErrorPage v-if="error"/>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import ErrorPage from '../../../old/src/pages/_Error'

  export default {
    components: {
      ErrorPage
    },
    computed: {
      ...mapGetters('endify', ['routeLoadingStatus', 'error'])
    }
  }
</script>
