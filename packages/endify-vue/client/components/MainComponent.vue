<template>
  <div class="main-component">
    MainComponent siemanko
    <button @click="testClick"></button>
  </div>
</template>

<script lang="ts">
  export default {
    setup(props) {
      console.log('Setting up component', props)
      const testClick = () => {
        alert('clicked!')
      }
      return {
        testClick
      }
    },
    asyncData({req}) {
      console.log('mamy req', req)
    }
  }
</script>