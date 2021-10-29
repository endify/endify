import {EndifyCore} from '../../../index'

export interface Ilauncher {
  setup(endify: EndifyCore): Promise<void>
}
