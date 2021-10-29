// import {join, relative, resolve} from 'path'
import {Command} from 'commander'
import {EndifyCore} from '@endify/core'

export class CliService {
  private argv
  private endify: EndifyCore

  constructor({argv, endify}) {
    this.argv = argv
    this.endify = endify
  }
  
  registerEmitterEvents() {
    const endifyCliEmitter = this.endify.emitters.registerEmitter('@endify/cli')
    endifyCliEmitter.on('before-program-parse', ({program, argv}: {program: Command, argv: string[]}) => {
      const cwdPath = process.cwd()
      program
        .command('dev')
        .alias('')
        .description('Run development configuration')
        .option('-c, --config <configPath>', 'Config file')
        .action(async (env, options) => {
          await this.endify.setup({
            rootPath: cwdPath,
            configPath: options.configPath,
          })
          this.endify.build()
        })
    })
  }

  async run() {
    const endifyCliEmitter = this.endify.emitters.getEmitter('@endify/cli')
    endifyCliEmitter.emit('before-program-create')
    const program = new Command()
    await endifyCliEmitter.emit('after-program-create', {
      argv: this.argv,
      program,
    })
    await endifyCliEmitter.emit('before-program-parse', {
      argv: this.argv,
      program,
    })
    program.parse(this.argv)
    await endifyCliEmitter.emit('after-program-parse', {
      argv: this.argv,
      program,
    })

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
