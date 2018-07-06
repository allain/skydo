module.exports = (arr, fn = x => x) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    const result = fn(arr[i])
    if (result !== undefined) return result
  }
}
