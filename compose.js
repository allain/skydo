const isObject = require('./lib/is-object')
const findFirst = require('./lib/find-first')

module.exports = function compose (...sources) {
  const keys = () =>
    Array.from(
      new Set(
        sources
          .reverse()
          .reduce((result, src) => result.concat(Object.keys(src)), [])
      )
    )

  const composedPropCache = {}
  const composeProp = name =>
    composedPropCache[name] ||
    (composedPropCache[name] = compose(
      ...sources.map(src => isObject(src[name]) && src[name]).filter(Boolean)
    ))

  return new Proxy(Object.create(null), {
    get: (target, name) =>
      findFirst(
        sources,
        src =>
          // Arrays are treated as a value for now
          (isObject(src[name]) ? composeProp(name) : src[name])
      ),

    set (target, name, value) {
      throw new Error('composed states are read-only')
    },

    has: (_, sKey) => keys().includes(sKey),

    ownKeys: keys,

    getOwnPropertyDescriptor: (_, sKey) => {
      const descriptor = findFirst(sources, src =>
        Object.getOwnPropertyDescriptor(src, sKey)
      )
      return descriptor ? { ...descriptor, writable: false } : undefined
    }
  })
}
