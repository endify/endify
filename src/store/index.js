import endify from './endify'
import {clientConfig} from '../services/ClientConfigService'

export default {
  endify,
  ...clientConfig.store,
}
