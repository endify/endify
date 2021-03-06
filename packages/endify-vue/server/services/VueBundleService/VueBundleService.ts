import {Request} from 'express'
import {renderToStream, SSRContext} from '@vue/server-renderer'
import {Readable} from 'stream'
import {App} from 'vue';
import {IVueBundleService} from './types/IVueBundleService'

export class VueBundleService implements IVueBundleService {
  private app: App

  constructor() {

  }

  watch() {

  }

  renderAppToStream(req: Request): Readable {
    const context = this.getContextFromRequest(req)
    return renderToStream(this.app, context)
  }

  private getContextFromRequest(req: Request): SSRContext {
    return {
      request: req,
    }
  }
}