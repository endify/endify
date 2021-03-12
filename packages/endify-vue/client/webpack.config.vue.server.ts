import {WebpackConfigVueBase} from './webpack.config.vue.base'
import {join} from 'path'

export class WebpackConfigVueServer extends WebpackConfigVueBase {
  constructor({env, issuerPath, installedModulePath}) {
    super({
      env,
      issuerPath,
      installedModulePath
    })
  }

  async getConfig() {
    const config = {
      entry: join(this.installedModulePath, 'packages/endify-vue/client/entry/server-entry'),
      target: 'node',
      output: {
        filename: 'index.js',
        publicPath: '/public/',
        path: join(this.buildPath, 'vue-server'),
      },
    }
    return this.mergeConfig(await super.getConfig(), config)
  }
}