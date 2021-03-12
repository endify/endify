import {Request} from 'express'
import {renderToString, SSRContext} from '@vue/server-renderer'
import {App} from 'vue';
import {IVueBundleService} from './types/IVueBundleService'

export class VueBundleService implements IVueBundleService {
  private app: App

  constructor() {

  }

  watch() {

  }

  async renderAppToString(app, req: Request): Promise<string> {
    const context = this.getContextFromRequest(req)
    return await renderToString(app, context)
  }

  private getContextFromRequest(req: Request): SSRContext {
    return {
      request: req,
    }
  }
}