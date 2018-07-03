const isObject = require('./is-object')

function DeepProxy (obj, handler) {
  const cache = new WeakMap()

  const deepHandler = Object.create(handler)
  Object.assign(deepHandler, {
    get (target, key) {
      const value = handler.get ? handler.get(target, key) : target[key]
      if (!isObject(value)) return value

      const cached = cache.get(value)
      if (cached) return cached

      const proxied = new Proxy(value, deepHandler)
      cache.set(value, proxied)
      return proxied
    },
    set (target, key, value) {
      const v = handler.set
        ? handler.set(target, key, value)
        : (target[key] = value)
      if (!isObject(v)) return v

      let proxied = cache.get(v)
      if (proxied) {
        proxied = new Proxy(v, deepHandler)
        cache.set(v, proxied)
      }

      return proxied
    }
  })

  return new Proxy(obj, deepHandler)
}

module.exports = DeepProxy
