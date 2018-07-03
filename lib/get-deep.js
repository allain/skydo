module.exports = function getDeep (obj, path) {
  return obj
    ? path.length === 0 ? obj : getDeep(obj[path[0]], path.slice(1))
    : undefined
}
