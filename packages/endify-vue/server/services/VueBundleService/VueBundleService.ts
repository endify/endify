import {Request} from 'express'
import {renderToString, SSRContext} from '@vue/server-renderer'
import {App} from 'vue';
import {IVueBundleService} from './types/IVueBundleService'
import {IVueBundler} from './bundlers/types/IVueBundler'

export class VueBundleService implements IVueBundleService {
  private isReady: boolean = false
  private vueServerBundler: IVueBundler
  private bundlers: IVueBundler[]

  constructor(vueServerBundler) {
    this.vueServerBundler = vueServerBundler
    this.bundlers = [vueServerBundler]
  }

  async watch() {
    await Promise.all(this.bundlers.map(bundler => {
      return bundler.watch()
    }))
    this.isReady = true
  }

  async renderAppToString(req: Request): Promise<string> {
    const setupApp = this.vueServerBundler.bundle as (IServerEntryContext) => App
    const context = this.getContextFromRequest(req)
    console.log('hmm', setupApp)
    const app = await setupApp(context)
    console.log('app', app)
    return await renderToString(app, context)
  }

  private getContextFromRequest(req: Request): SSRContext {
    return {
      req: req,
    }
  }
}