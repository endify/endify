import {join, relative, resolve} from 'path'
import {Command} from 'commander'

export class CliService {
  private argv

  constructor(argv) {
    this.argv = argv
  }

  async start() {
    const program = new Command()
    const cwdPath = process.cwd()
    program.option('-c, --config <configPath>', 'Config file')
    program.parse(this.argv)
    const options = program.opts()
    const configPath = options.configPath ? resolve(cwdPath, options.configPath) : join(cwdPath, 'endify.config.js')
    console.log('Start endify config at', configPath)
    const relativeConfigPath = relative(__dirname, configPath)
    const configFile = __non_webpack_require__(`./${relativeConfigPath}`)
    const config = typeof configFile === 'function' ? await configFile() : configFile
    console.log('Config fetched', config)
    if(config.packages) {
      for(const pack of config.packages) {
        pack.dev({
          config,
        })
      }
    }
  }
}
