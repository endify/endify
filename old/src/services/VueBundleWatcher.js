import EventEmitter from 'events'
import fs from 'fs'
import webpack from 'webpack'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackDevMiddleware from 'webpack-dev-middleware'
import {createBundleRenderer} from 'vue-server-renderer'

export class VueBundleWatcher {
  constructor({serverBundlePath, manifestBundlePath, templatePath, publicPath, clientWebpackConfig, serverWebpackConfig, bundleRendererBaseDir}) {
    this.serverBundlePath = serverBundlePath
    this.clientBundlePath = manifestBundlePath
    this.publicPath = publicPath
    this.templatePath = templatePath
    this.clientWebpackConfig = clientWebpackConfig
    this.serverWebpackConfig = serverWebpackConfig
    this.eventEmitter = new EventEmitter()
    this._renderer = null
    this.clientBundle = null
    this.serverBundle = null
    this.template = null
    this.bundleRendererBaseDir = bundleRendererBaseDir
  }

  loadRenderer() {
    this.serverBundle = this.loadSingleBundle(this.serverBundlePath)
    this.clientBundle = this.loadSingleBundle(this.clientBundlePath)
    this.loadTemplate()
    this.updateRenderer()
    return this._renderer
  }

  initWatch() {
    this.clientCompiler = webpack(this.clientWebpackConfig);
    this.serverCompiler = webpack(this.serverWebpackConfig);
    this.serverCompiler.watch({}, (e, stats) => {
      if(e) {
        return console.log('Server compiler error', e)
      }
      console.log('Server recompiled.')
      this.serverBundle = this.loadSingleBundle(this.serverBundlePath)
      this.updateRenderer()
    })
    this.devMiddleware = webpackDevMiddleware(this.clientCompiler, {
        publicPath: this.publicPath,
        writeToDisk: true,
        stats: false,
        logLevel: 'silent'
    })
    this.clientCompiler.plugin('done', (stats, e) => {
      if(e) {
        return console.log('Client compiler error', e)
      }
      console.log('Client recompiled.')
      this.clientBundle = this.loadSingleBundle(this.clientBundlePath)
      this.updateRenderer()
    })
    this.hotMiddleware = webpackHotMiddleware(this.clientCompiler)
    this.loadTemplate()
  }

  watch(fn) {
    this.initWatch()
  }

  updateRenderer() {
    if(!this.serverBundle || !this.clientBundle || !this.template) {
      return;
    }
    this._renderer = createBundleRenderer(this.serverBundle, {
      runInNewContext: false,
      template: this.template,
      clientManifest: this.clientBundle,
      basedir: this.bundleRendererBaseDir,
    })

    this.eventEmitter.emit('update', {
      renderer: this.renderer
    })
  }

  loadTemplate() {
    this.template = fs.readFileSync(this.templatePath, 'utf-8')
  }

  loadSingleBundle(path) {
    return JSON.parse(fs.readFileSync(path, 'utf-8'))
  }

  once(...args) {
    return this.eventEmitter.once(...args)
  }

  get renderer() {
    return this._renderer
  }
}
