import {Readable} from 'stream'

export interface IVueBundleService {
  renderAppToString(app: unknown, req: Request): Promise<string>
}