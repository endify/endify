const {EndifyServerBundle} = require('@endify/server/launcher')
const {resolve} = require('path')

module.exports = () => {
  return {
    packages: [
      new EndifyServerBundle({
        entry: resolve('src/server'),
        inspectPort: false,
      }),
    ],
    extendWebpackConfig(config, target) {
      return {
        ...config,
        test: 123,
      }
    },
  }
}
