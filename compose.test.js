const compose = require('./compose')

describe('compose', () => {
  it('can be created empty', () => {
    expect(compose()).toBeTruthy()
  })

  it('reading, object works', () => {
    const s = compose({ x: { y: 1 } }, {})
    expect(typeof s.x).toEqual('object')
    expect(s.x.y).toEqual(1)
  })

  it('composes all nested objects together', () => {
    const s = compose({ a: { b: { c: 1 } } }, { a: { b: { d: 2 } } })
    expect(s.a.b.c).toEqual(1)
    expect(s.a.b.d).toEqual(2)
  })

  it('composes all props of all objects together', () => {
    const s = compose({ a: 1 }, { b: 2 }, { c: 3 })
    expect(s.a).toEqual(1)
    expect(s.b).toEqual(2)
    expect(s.c).toEqual(3)
    expect(s.d).toBeUndefined()
  })

  it('composed object has expected keys', () => {
    const s = compose({ a: 1 }, { b: 2 }, { c: 3 })
    expect(Object.keys(s)).toEqual(['c', 'b', 'a'])
  })

  it('makes composed object look like real object', () => {
    const s = compose({ a: 1 }, { b: 2 }, { c: 3 })
    expect(s).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('toString is sane', () => {
    const s = compose({ a: 1 }, { b: 2 }, { c: 3 })
    const r = { a: 1, b: 2, c: 3 }
    expect(s.toString()).toEqual(r.toString())
  })
})
