const vm = require('vm')

const ContextSymbol = Symbol('@Context')
const EnvironmentSymbol = Symbol('@Environment')

const getDeep = require('./lib/get-deep')
// TODO: setDeep

class Executor {
  constructor (state = {}, path = []) {
    const globals = {Date}

    const environment = new Proxy(state, {
      get: (target, key) => globals[key] || getDeep(target, path.concat(key)),
      set: (target, key, value) => (target[key] = value)
    })

    this[EnvironmentSymbol] = environment
    this[ContextSymbol] = vm.createContext(environment)
  }

  get context () {
    return this[EnvironmentSymbol]
  }

  async exec (code) {
    return vm.runInContext(code, this[ContextSymbol])
  }
}

module.exports = Executor
