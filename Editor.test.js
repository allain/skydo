/* globals describe, it, expect */
const {edit, edits} = require('./Editor')

describe('editor', () => {
  it('supports simple edits', () => {
    const e = edit({ x: 5 })
    e.x = 10
    e.y = 20
    expect(e.y).toEqual(20)
    expect(Object.keys(e)).toEqual(['x', 'y'])
    expect(e).toEqual({ x: 10, y: 20 })
  })

  it('leaves src untouched', () => {
    const src = { x: 5 }
    const e = edit(src)
    e.x = 10
    e.y = 20
    expect(src).toEqual({ x: 5 })
  })

  it('supports deep edits', () => {
    const src = { a: { b: { c: 1 } } }
    const e = edit(src)
    e.a.b.d = 2
    expect(e.a.b.d).toEqual(2)
    expect(e).toEqual({ a: { b: { c: 1, d: 2 } } })

    // still leaves src unchanged
    expect(src).toEqual({ a: { b: { c: 1 } } })
  })

  it('edits can extract edits from an edit object', () => {
    const e = edit({})
    expect(edits(e)).toBeUndefined()

    e.a = 10
    e.b = { c: 1 }
    expect(edits(e)).toEqual({ a: 10, b: { c: 1 } })
  })

  it('computes the smallest edit possible', () => {
    const e = edit({ a: { b: { c: 1 } } })
    e.a.e = 2
    expect(edits(e)).toEqual({ a: { e: 2 } })
  })
})
