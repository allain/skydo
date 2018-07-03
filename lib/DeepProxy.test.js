const DeepProxy = require('./DeepProxy')
describe('DeepProxy', () => {
  it('supports creation', () => {
    const p = new DeepProxy({ a: 1 }, {})
    expect(typeof p).toEqual('object')
    expect(p).toEqual({ a: 1 })
  })

  it('handles things with proxy methods', () => {
    const p = new DeepProxy(
      {},
      {
        get (target, key) {
          return `get:${key}`
        }
      }
    )
    expect(p.a).toEqual('get:a')
  })

  it('installs handlers for sub objects', () => {
    const TEST = Symbol('test')

    const p = new DeepProxy(
      {},
      {
        get (target, key) {
          if (key === TEST) {
            return 'YAY!'
          }
          return target[key]
        }
      }
    )

    const assigned = (p.child = { a: 1 })
    // expect(assigned[TEST]).toEqual('YAY!')
    expect(p[TEST]).toEqual('YAY!')
    expect(p.child[TEST]).toEqual('YAY!')
  })

  it('returns the same object when getting subobjects repeatedly', () => {
    const p = new DeepProxy({}, {})
    p.child = { a: 1 }
    expect(p.child).toBe(p.child)
  })

  it('replacing child works', () => {
    const p = new DeepProxy({}, {})

    p.child = { a: 1 }
    const child1 = p.child

    p.child = { new: 1 }
    expect(p.child).not.toBe(child1)
  })
})
