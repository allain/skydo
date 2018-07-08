const vm = require('vm')

const PathSymbol = Symbol('@path')
const EnvironmentHandler = require('./proxies/Environment')
const Contextable = require('./proxies/Contextable')

class Executor {
  constructor () {
    this[PathSymbol] = []
  }

  async exec (code, state) {
    if (!state) throw new Error('state not given to executor')

    const cd = key => {
      if (key === '..') {
        this[PathSymbol].pop()
      } else {
        this[PathSymbol].push(key)
      }
    }

    const globals = { Object, Date, cd }

    const environment = new Proxy(
      new Proxy(state, Contextable(this[PathSymbol])),
      EnvironmentHandler(globals)
    )

    return vm.runInContext(code, vm.createContext(environment))
  }
}

module.exports = Executor
