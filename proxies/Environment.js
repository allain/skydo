module.exports = globals => ({
  get (target, key) {
    return globals[key] || target[key]
  },
  set (target, key, value) {
    target[key] = value
  }
})
