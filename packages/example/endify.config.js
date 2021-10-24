// const {ServerLauncher} = require('@endify/server/launcher')
// const {VueLauncher} = require('@endify/vue/launcher')
// const {resolve} = require('path')

module.exports = () => {
  return {
    // packages: [
    //   new ServerLauncher({
    //     entry: resolve('src/server'),
    //     inspectPort: false,
    //   }),
    //   new VueLauncher({
    //     entry: resolve('src/client'),
    //     inspectPort: false,
    //   }),
    // ],
    extendWebpackConfig(config, target) {
      return {
        ...config,
        test: 123,
      }
    },
  }
}
