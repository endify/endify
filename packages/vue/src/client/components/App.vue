<template>
  <div class="siema">
    Siemanko {{abc}}
    <button @click="abc++"> asd</button>
  </div>
</template>

<script>
import {ref} from 'vue'

export default {
  setup() {
    const abc = ref(88)

    return {
      abc
    }
  }
}
</script>