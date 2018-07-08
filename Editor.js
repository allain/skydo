const isObject = require('./lib/is-object')
const mapObj = require('./lib/map-object')
const isEmptyObject = require('./lib/is-empty-object')
const uniqueKeys = require('./lib/unique-keys')

const EDITS = Symbol('@Edits')
const DELETED = Symbol('@Delete')

function edit (target, edits = {}) {
  if (!target || !isObject(target) || target[EDITS]) return target

  const getEdited = (target, key) => {
    if (edits.hasOwnProperty(key)) return edits[key]

    if (target.hasOwnProperty(key)) return (edits[key] = edit(target[key]))

    return undefined
  }

  return new Proxy(target, {
    get (target, key) {
      if (key === EDITS) return edits
      const result = getEdited(target, key)
      return (result === DELETED) ? undefined : result
    },

    set (_, key, value) {
      edits[key] = (!isObject(value) || value[EDITS]) ? value : edit({}, value)
    },

    ownKeys (target) {
      return uniqueKeys(edits, target).filter(key => getEdited(target, key) !== DELETED)
    },

    getOwnPropertyDescriptor (target, key) {
      return Object.getOwnPropertyDescriptor(edits.hasOwnProperty(key) ? edits : target, key)
    },

    deleteProperty (target, key) {
      edits[key] = DELETED
    }
  })
}

function edits (obj) {
  if (!isObject(obj)) return obj

  if (obj[EDITS]) return edits(obj[EDITS])

  const reduced = mapObj(edits)(obj)

  return isEmptyObject(reduced) ? undefined : reduced
}

module.exports = {edit, edits, DELETED}
