import {Readable} from 'stream'

export interface IVueBundleService {
  renderAppToStream(req: Request): Readable
}