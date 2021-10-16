# @endify/vue-async-data-extension [WIP]
Enable `asyncData` & `beforeRouteResolve` hook. This module is enabled by default. Read how to opt-out below.

## How it works
### Before
Default behaviour of Endify is to load new page instantly as soon as user navigates to. Every asynchronous action should be performed with Vue `mounted()` hook.
### After
Listening to mount event is no longer required. You can perform asynchronous requests in `asyncData` and this data will be directly available in `data` object. If you don't want to mix `data` object you can use `beforeRouteResolve` hook, that won't affect desired component.

## Usage
Let's say you want to fetch `/posts` route from the server before the `Posts.vue` page gets displayed.

This is how the component should look like:
```vue
<template>
  <div class="posts">
    <div class="post" v-for="post in posts"></div>
  </div>
</template>

<script lang="ts">
  import fetch from 'fetch'
  
  export default {
    data() {
      return {}
    },
    async asyncData() {
      const res = await fetch('/posts')
      return {
        posts: res.posts
      }
    }
  }
</script>
```


## Opt-out
In order to disable this extension edit your configuration file this way:

```typescript
export default function() {
  return {
    extensions: {
      '@endify/async-data-extension': false
    }
  }
}
```