import * as chalk from 'chalk'
import {ILoggerService} from './types/ILoggerService'

export class LoggerService implements ILoggerService {
  private readonly separator: string
  private readonly prefix: string

  constructor(prefix: string, separator: string) {
    this.prefix = prefix
    this.separator = separator
  }

  log(...args): void {
    return console.log(this.prefixString + chalk.gray(this.separator), ...args)
  }

  success(...args): void {
    return console.error(this.prefixString + chalk.green(this.separator), ...args)
  }

  error(...args): void {
    return console.error(this.prefixString + chalk.red(this.separator), ...args)
  }

  warn(...args): void {
    return console.warn(this.prefixString + chalk.yellow(this.separator), ...args)
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
      if(i > 0) {
        this.clearLastLine()
      }
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(null)
        }, time / 30)
      })
    }
  }

  get prefixString(): string {
    return chalk.bold.white(this.prefix)
  }
}