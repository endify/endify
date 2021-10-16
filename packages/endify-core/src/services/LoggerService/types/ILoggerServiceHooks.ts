import {SyncHook} from 'tapable'
import {LogLevel} from './LogLevel'

export interface ILoggerServiceHooks {
  log: SyncHook<[LogLevel, unknown[]], boolean|void>
}
