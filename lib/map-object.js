module.exports = fn => obj =>
  Object.keys(obj).reduce((result, key) => {
    result[key] = fn(obj[key])
    return result
  }, {})
