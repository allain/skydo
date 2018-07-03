const getDeep = require('../lib/get-deep')
const setDeep = require('../lib/set-deep')

module.exports = path => ({
  get (target, key) {
    return getDeep(target, path.concat(key))
  },

  set (target, key, value) {
    return setDeep(target, path.concat(key), value)
  },

  ownKeys (target, key) {
    return Object.keys(getDeep(target, path))
  },

  has (target, key) {
    return key in getDeep(target, path)
  },

  getOwnPropertyDescriptor (target, key) {
    const resolved = getDeep(target, path)
    if (typeof resolved !== 'object') return undefined

    return Object.getOwnPropertyDescriptor(resolved, key)
  }
})
