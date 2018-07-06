const compose = require('./compose')

const {edit, edits} = require('./Editor')

class Store {
  constructor () {
    this.version = 0 // increments every time a commit is accepted

    this.commits = [{}]
    this.transactions = new Set()
  }

  async transact (executor) {
    const transaction = {
      version: this.version,
      state: edit(compose(...this.commits))
    }

    this.transactions.add(transaction)

    try {
      const result = await executor(transaction.state)
      const delta = edits(transaction.state)
      if (delta) { this.commits.push(delta) }
      return result
    } catch (err) {
      // TODO: Cleanup
      throw err
    }
  }
}

module.exports = Store
