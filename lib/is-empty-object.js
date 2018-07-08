module.exports = obj => {
  for (var key in obj) return false
  return true
}
