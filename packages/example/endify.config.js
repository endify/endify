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



// extendWebpackConfig(config, target) {
//   return {
//     ...config,
//     test: 123,
//   }
// },