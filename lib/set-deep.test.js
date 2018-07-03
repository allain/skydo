const setDeep = require('./set-deep')

describe('set-deep', () => {
  it('throws when object is not an object', () =>
    expect(() => setDeep(false, ['a'], 10)).toThrowError())

  it('throws when object is null', () =>
    expect(() => setDeep(null, ['a'], 10)).toThrowError())

  it('throws on empty path', () =>
    expect(() => setDeep({}, [], 10)).toThrowError())

  it('throws on falsy path', () =>
    expect(() => setDeep({}, false, 10)).toThrowError())

  it('works for shallow set', () => {
    const obj = {}
    expect(setDeep(obj, ['a'], 10)).toEqual(10)
    expect(obj).toEqual({ a: 10 })
  })

  it('works for leaf creation', () => {
    const obj = { a: { b: {} } }
    expect(setDeep(obj, ['a', 'b', 'c'], 10)).toEqual(10)
    expect(obj).toEqual({ a: { b: { c: 10 } } })
  })

  it('works for branch creation', () => {
    const obj = {}
    expect(setDeep(obj, ['a', 'b', 'c'], 10)).toEqual(10)
    expect(obj).toEqual({ a: { b: { c: 10 } } })
  })

  it('works for Arrays', () => {
    const arr = []
    setDeep(arr, [0], 1)
    expect(arr).toEqual([1])
  })
})
