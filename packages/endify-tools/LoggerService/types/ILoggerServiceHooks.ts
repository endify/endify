import {SyncHook} from 'tapable'
import {LogLevels} from './LogLevels'

export interface ILoggerServiceHooks {
  log: SyncHook<[LogLevels, unknown[]], boolean|void>
}