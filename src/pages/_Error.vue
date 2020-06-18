<template>
  <div class="error">
    <div>
      <div class="bigErrorCode">{{error.code}}</div>
      <div class="errorMessage" v-if="error.code === 404">Nothing found on this page please <router-link to="/">go back</router-link></div>
      <div class="errorMessage" v-else-if="error.code === 500">An error occurred, please <router-link to="/">go back</router-link></div>
      <div class="errorMessage" v-else="">Another error occurred</div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {titleMixin} from '../helpers/titleMixin'

export default {
  title() {
    return `${this.error.code} error`
  },
  computed: {
    ...mapGetters('endify', ['error'])
  },
  async asyncData() {
    await new Promise((resolve, reject) => {
      setTimeout(resolve, 100)
    })
  },
  mixins: [titleMixin]
}
</script>

<style scoped>
  .bigErrorCode {
    font-weight: 700;
    font-size: 48px;
  }
  .error {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .errorMessage {
    margin-top: 10px;
  }
</style>
