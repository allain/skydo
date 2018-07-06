/**
 * Naive Implementation of MemoryStore with no optimizations
 *
 * All other store implementations should pass memory store's tests too
 */

function findUpdateInTransaction (transaction, key) {
  return transaction.updates.reverse().find(u => u.key === key)
}

module.exports = class MemoryStore {
  constructor () {
    this.transactions = []
  }

  get size () {
    return this.transactions.length
  }

  async startTransaction (options) {
    const startIndex = this.transactions.length
    const { authorId } = options

    let committed = false

    const newTransaction = {
      updates: [],
      authorId
    }

    const get = key => {
      let lastUpdate = findUpdateInTransaction(newTransaction, key) || null
      if (lastUpdate) return lastUpdate.value

      let lastAuthorId = options.authorId

      let i = startIndex
      while (i-- > 0) {
        const newUpdate = findUpdateInTransaction(this.transactions[i], key)
        if (newUpdate) {
          if (lastUpdate === null) {
            // first candidate, automatic win
            lastUpdate = newUpdate
            lastAuthorId = this.transactions[i].authorId
            continue
          }

          if (newUpdate.ts > lastUpdate.ts) {
            // newest candidate wins
            lastUpdate = newUpdate
            lastAuthorId = this.transactions[i].authorId
          } else if (
            newUpdate.ts === lastUpdate.ts &&
            this.transactions[i].authorId < lastAuthorId
          ) {
            // If two updates happen at the same time, then the one done by the user with the greatest authorId wins
            lastUpdate = newUpdate
            lastAuthorId = this.transactions[i].authorId
          }
        }
      }
      return lastUpdate ? lastUpdate.value : undefined
    }

    const set = (key, value) => {
      if (committed) throw new Error('cannot modify committed context')

      newTransaction.updates.push({ key, value, ts: Date.now() })
    }

    const commit = async () => {
      if (newTransaction.updates.length) {
        this.transactions.push(newTransaction)
      }
      committed = true
      return newTransaction
    }

    return { get, set, commit }
  }

  addTransaction (transaction) {
    this.transactions.push(transaction)
  }
}
