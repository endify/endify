<h1 align="center">@endify/vue-script-loader</h1>

Main goal of this package is to separate server and client concerns using single file.

## Why?
When dealing with frontend & backend code in one codebase (thanks to Endify), everyone should be aware of a few things:
- Writing a plugin for both of these targets always requires separate files for each of them
- Mixing server and client code together is dangerous if not done in a good way

###Let's imagine the following scenario:
- We have `plugin.js` file containing some basic logic, for example:
```javascript
// client.js
import someMiddleware from './some-middleware.js'
import someVueComponent from './some-vue-component.vue'

export function serverLogic({app}) {
  app.use(someMiddleware)
}

export function clientLogic({Vue}) {
  Vue.component('some-vue-component', someVueComponent)
}
```

- Now, we want to include that logic in our server application, for example:
```javascript
// server.js
import {serverLogic} from './plugin.js'

const app = express()
serverLogic({app})
app.listen(3000)
```

- However, our server webpack bundler will not handle `.vue` files, instead an error will be thrown because our `plugin.js` file contains not compatible requirements using `import` phrase. 

So there comes a huge technology gap between using single file scripts and splitting client & server logic inside them.
## Solution
### Yes, it's `.endify.vue`, that extends `.vue` files and also knows what is what.

## How does it work?
All you have to do is to create a new file that ends with `.endify.vue`, for example `Plugin.endify.vue`
```html
<script id="server">
  import someMiddleware from './some-middleware.js'
  
  export function serverLogic({app}) {
    app.use(someMiddleware)
  }
</script>

<script id="client">
  import someVueComponent from './some-vue-component.vue'

  export function clientLogic({Vue}) {
    Vue.component('some-vue-component', someVueComponent)
  }
</script>
```
Then, depending on **webpack context** we can require only one of them, so they don't know anything about existence of the second one.

## Having a trouble understanding?
Please create a new issue or ask us on our @discord server

## Credits
- pieczorx on inventing this
- evan you for inventing .vue