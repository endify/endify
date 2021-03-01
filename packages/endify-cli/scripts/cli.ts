import {LauncherService} from '../../endify-server/LauncherService/LauncherService'

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

yargs(hideBin(process.argv)).command(['dev [port]', '$0'], 'Start Endify using development mode', (yargs) => {
    yargs.positional('port', {
        describe: 'port to bind on',
        default: 3000
      })
  }, (argv) => {
    const launcherService = new LauncherService(argv.port)
    launcherService.runDevelopmentServer()
  })
  // .option('verbose', {
  //   alias: 'v',
  //   type: 'boolean',
  //   description: 'Run with verbose logging'
  // })
  .scriptName('endify')
  .help()
  .showHelpOnFail(true)
  .argv