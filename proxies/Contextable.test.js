/* globals describe, it, expect */

const Contextable = require('./Contextable')

describe('Contextable', () => {
  it('supports empty path', () => {
    const c = Contextable([])
    const s = new Proxy({ a: { b: 1 } }, c)
    expect(s).toEqual({ a: { b: 1 } })
  })

  it('supports changing context', () => {
    const c = Contextable(['a'])
    const s = new Proxy({ a: { b: { c: 1 } } }, c)
    expect(s).toEqual({ b: { c: 1 } })
  })

  it('supports changing deep context', () => {
    const c = Contextable(['a'])
    const root = { a: {} }
    const s = new Proxy(root, c)
    s.b = 1
    expect(root).toEqual({ a: { b: 1 } })
  })
})
