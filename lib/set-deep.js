const isObject = x => x && typeof x === 'object'

module.exports = function setDeep (obj, path, value) {
  // Arrays work too
  if (!isObject(obj)) throw new Error('target passed is not an object')

  if (!path || !path.length) throw new Error('path not given in setDeep')

  if (path.length === 1) return (obj[path[0]] = value)

  const segment = path[0]

  return setDeep(
    segment in obj ? obj[segment] : (obj[segment] = {}),
    path.slice(1),
    value
  )
}
