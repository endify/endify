import chalk from 'chalk'
import callerCallsite from 'caller-callsite'

export class LoggerService {
  contructor() {

  }
  log(...args) {
    const dateString = this.getFormattedDate(new Date())
    console.log(`[${dateString}]`, ...args)
  }

  scopeLog(scope, ...args) {
    let color = 'blue'
    if(typeof scope !== 'string') {
      color = scope.color
      scope = scope.scope
    }
    this.log(`[${chalk[color].bold(scope)}]`, ...args)
  }

  getFormattedDate(date) {
    return ("0" + date.getDate()).slice(-2) + "-" + ("0"+(date.getMonth()+1)).slice(-2) + "-" +
    date.getFullYear() + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
  }
  get styler() {
    return chalk
  }
}
