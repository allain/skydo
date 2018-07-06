const isObject = require('./lib/is-object')
const mapObj = require('./lib/map-object')

const EditsSymbol = Symbol('@Edits')

module.exports.edit = function edit (target) {
  const edits = {}

  const handler = {
    get (target, key) {
      if (key === EditsSymbol) return edits

      if (edits.hasOwnProperty(key)) return edits[key]

      const value = target[key]
      return isObject(value) ? (edits[key] = edit(value)) : value
    },

    set (_, key, value) {
      edits[key] = value
      return value
    },

    ownKeys: () => [
      ...new Set([...Object.keys(edits), ...Object.keys(target)])
    ],

    getOwnPropertyDescriptor: (target, key) => {
      if (edits.hasOwnProperty(key) || target.hasOwnProperty(key)) {
        return {
          value: handler.get(target, key),
          enumerable: true,
          configurable: true
        }
      }
    }
  }

  return new Proxy(target, handler)
}

module.exports.edits = draft => {
  if (!draft[EditsSymbol]) throw new Error('edits not found on plain objects')
  return reduceEdits(draft)
}

const reduceEdits = obj => {
  const edits = obj[EditsSymbol]
  if (edits) return reduceEdits(obj[EditsSymbol])

  const reduced = JSON.parse(
    JSON.stringify(
      mapObj((value, key) => (isObject(value) ? reduceEdits(value) : value))(
        obj
      )
    )
  )

  return Object.keys(reduced).length ? reduced : undefined
}
