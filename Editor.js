const isObject = require('./lib/is-object')
const mapObj = require('./lib/map-object')

const EditsSymbol = Symbol('@Edits')
const DELETED = Symbol('@Delete')

module.exports.DELETED = DELETED

// TODO: Handle the deletion of properties
module.exports.edit = function edit (target) {
  const edits = {}

  const handler = {
    get (target, key) {
      if (key === EditsSymbol) return edits

      if (edits.hasOwnProperty(key)) {
        const value = edits[key]
        return (value === DELETED) ? undefined : edits[key]
      }

      const value = target[key]

      return isObject(value) ? (edits[key] = edit(value)) : value
    },

    set (_, key, value) {
      edits[key] = value
      return value
    },

    ownKeys: () => {
      const keys =

    [
      ...new Set([...Object.keys(edits), ...Object.keys(target)])
    ]
      return keys.filter(key => edits[key] !== DELETED)
    },

    getOwnPropertyDescriptor: (target, key) => {
      if (edits.hasOwnProperty(key) || target.hasOwnProperty(key)) {
        return {
          value: handler.get(target, key),
          enumerable: true,
          configurable: true
        }
      }
    },

    deleteProperty (target, key) {
      edits[key] = DELETED
    }
  }

  return new Proxy(target, handler)
}

module.exports.edits = draft => {
  if (!draft[EditsSymbol]) throw new Error('edits not found on plain objects')
  return reduceEdits(draft)
}

const reduceEdits = obj => {
  if (!isObject(obj)) return obj

  const edits = obj[EditsSymbol]
  if (edits) return reduceEdits(edits)

  const reduced = mapObj((value, key) => reduceEdits(value))(obj)

  return Object.keys(reduced).length ? reduced : undefined
}
