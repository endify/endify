import * as chalk from 'chalk'
import {ILoggerService} from './types/ILoggerService'
import {SyncHook} from 'tapable'
import {ILoggerServiceHooks} from './types/ILoggerServiceHooks'
import {LogLevel} from './types/LogLevel'

export class LoggerService implements ILoggerService {
  private readonly separator: string
  private readonly prefix: string
  public hooks: ILoggerServiceHooks

  constructor(prefix: string, separator = '·') {
    this.prefix = prefix
    this.separator = separator
    this.hooks = {
      log: new SyncHook(['logLevel', 'args']),
    }
  }

  log(...args): void {
    return this.callLog(LogLevel.log, [this.prefixString, chalk.gray(this.separator), ...args])
  }

  success(...args): void {
    return this.callLog(LogLevel.log, [chalk.bold.green(this.prefix), chalk.green(this.separator), ...args])
  }

  error(...args): void {
    return this.callLog(LogLevel.error, [chalk.bold.red(this.prefix), chalk.red(this.separator), ...args])
  }

  warn(...args): void {
    return this.callLog(LogLevel.warn, [chalk.bold.yellow(this.prefix), chalk.yellow(this.separator), ...args])
  }

  private callLog(logLevel: LogLevel, args) {
    const wtf = this.hooks.log.call(logLevel, args)
    if(wtf === false) {
      return
    }
    return console[logLevel](...args)
  }

  clearLastLine(): void {
    process.stdout.moveCursor(0, -1)
    process.stdout.clearLine(1)
  }

  async logHelloLine(): Promise<void> {
    const time = 500
    for(let i = 0; i < 30; i++) {
      let string = ''
      for(let j = 0; j < i; j++) {
        if(i === 30 - 1) {
          string += chalk.gray('-')
        } else {
          string += Math.random() > 0.5 ? chalk.gray('-') : chalk.white('-')
        }
      }
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(null)
        }, time / 30)
      })
      if(i > 0) {
        this.clearLastLine()
      }
    }
  }

  get prefixString(): string {
    return chalk.bold.white(this.prefix)
  }
}
