import endify from './endify'
import {clientConfig} from '../../../old/src/services/ClientConfigService'

export default {
  endify,
  ...clientConfig.store,
}
