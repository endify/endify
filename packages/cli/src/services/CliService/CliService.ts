// import {join, relative, resolve} from 'path'
import {Command} from 'commander'
// import {HookService} from '../../../../core/src/services/HookService/HookService'
// import {CliProgressService} from '../../../../core/src/services/CliProgressService/CliProgressService'
import {EndifyCore} from '@endify/core'

export class CliService {
  private argv
  private endify: EndifyCore
  // private hooks = new HookService()
  // private cliProgressService = new CliProgressService(this.hooks)

  constructor({argv, endify}) {
    this.argv = argv
    this.endify = endify
  }
  
  registerEmitterEvents() {
    const endifyCliEmitter = this.endify.emitters.registerEmitter('@endify/cli')
    endifyCliEmitter.on('after-program-create', (program: Command) => {
      console.log('We know the event ;)', program)
      program.option('-c, --config <configPath>', 'Config file')
    })
  }

  async run() {
    const endifyCliEmitter = this.endify.emitters.getEmitter('@endify/cli')
    endifyCliEmitter.emit('before-program-create')
    const program = new Command()
    endifyCliEmitter.emit('after-program-create', program)
    endifyCliEmitter.emit('before-program-parse', this.argv)
    program.parse(this.argv)
    const options = program.opts()
    // this.endify.runDevelopmentServer()
    // this.cliProgressService.setup()
    // const cwdPath = process.cwd()
    //
    //
    // const configPath = options.configPath ? resolve(cwdPath, options.configPath) : join(cwdPath, 'endify.config.js')
    // const relativeConfigPath = relative(__dirname, configPath)
    // const configFile = __non_webpack_require__(`./${relativeConfigPath}`)
    // const config = typeof configFile === 'function' ? await configFile() : configFile
    // if(config.packages) {
    //   for(const pack of config.packages) {
    //     pack.dev({
    //       config,
    //       hooks: this.hooks,
    //     })
    //   }
    // }
  }
}
