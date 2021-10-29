import {VueBaseBundler} from './VueBaseBundler'
import {join} from 'path'
import {createContext, Script} from 'vm'
import {wrap} from 'module'
import {readFile} from 'fs/promises'
import * as Module from 'module'

export class VueServerBundler extends VueBaseBundler {
  // private context = createContext(this.createSandbox())

  constructor(loggerService, webpackConfigObject) {
    super(loggerService, webpackConfigObject)
  }

  private createSandbox() {
    const sandbox = {
      Buffer,
      console,
      process,
      setTimeout,
      setInterval,
      setImmediate,
      clearTimeout,
      clearInterval,
      clearImmediate,
      global: null,
    }
    sandbox.global = sandbox
    return sandbox
  }

  createContext() {
    return createContext(this.createSandbox())
  }

  protected async loadBundle() {
    const entryFilePath = join(this.bundleOutputPath, 'index.ts')
    const code = await readFile(entryFilePath, 'utf8')
    const wrapper = wrap(code)
    console.log('wrapper', wrapper.slice(500))
    const script = new Script(wrapper, {
      filename: entryFilePath,
      displayErrors: true,
    })
    const scriptContext = this.createContext()
    const compiledWrapper = script.runInNewContext(scriptContext)
    const fakeModulePolyfill = {
      exports: {

      },
    } as Module

    function requirePolyfill(path) {
      return __non_webpack_require__(path)
    }

    compiledWrapper.call(
      fakeModulePolyfill.exports,
      fakeModulePolyfill.exports,
      requirePolyfill,
      fakeModulePolyfill,
    )
    const hasDefaultExport = Object.prototype.hasOwnProperty.call(fakeModulePolyfill.exports, 'default')
    return hasDefaultExport ? fakeModulePolyfill.exports.default : fakeModulePolyfill.exports
  }
}
