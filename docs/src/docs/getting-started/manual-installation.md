# Manual installation
We strongly recommend using [hello-endify](./README.md) to scaffold an app but if you really need to set up Endify by yourself this is a good place to start.


## Install
1. Create a project directory or navigate to existing one:
```shell:no-line-numbers
mkdir hello-world && cd hello-world
```


2. Create an empty package.json or run init command:
```shell:no-line-numbers
npm init 
```

3. Install required dependencies
```shell
npm i @endify/cli @endify/core @endify/server @endify/vue 
```

::: tip
Note that @endify/vue is optional if you want to create server only application, however @endify/server is always required, even if you only need client side app.
:::

4. Create `endify.config.js` inside the root folder of your project and export a default config object or a function
```js
const {resolve} = require('path')
const {ServerLauncher} = require('@endify/server/launcher')
const {VueLauncher} = require('@endify/vue/launcher')

module.exports = () => {
  return {
    launchers: [
      new ServerLauncher({
        entry: resolve('src/server'),
        inspectPort: false,
      }),
      new VueLauncher({
        entry: resolve('src/client'),
        template: resolve('src/client/template'),
      }),
    ],
  }
}
```