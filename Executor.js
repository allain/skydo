const vm = require('vm')

const PathSymbol = Symbol('@path')
const StateSymbol = Symbol('@state')
const EnvironmentHandler = require('./proxies/Environment')
const Contextable = require('./proxies/Contextable')

class Executor {
  constructor (state) {
    if (!state) throw new Error('state not given to executor')
    this[PathSymbol] = []

    this[StateSymbol] = state
  }

  async exec (code) {
    const cd = key => {
      if (key === '..') {
        this[PathSymbol].pop()
      } else {
        this[PathSymbol].push(key)
      }
    }

    const globals = { Date, cd }

    const environment = new Proxy(
      new Proxy(this[StateSymbol], Contextable(this[PathSymbol])),
      EnvironmentHandler(globals)
    )

    return vm.runInContext(code, vm.createContext(environment))
  }
}

module.exports = Executor
