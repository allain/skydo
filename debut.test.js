/* globals describe, it, expect */
const Debut = require('./debut')

describe('debut', () => {
  it('can create debuts', () => {
    const d = new Debut()
    expect(typeof d).toEqual('object')
  })

  it('exposes minimal public API', () => {
    const d = new Debut()
    expect(Object.keys(d)).toEqual([])
    expect(Object.getOwnPropertyNames(d)).toEqual([])
    expect(Object.getOwnPropertyNames(Object.getPrototypeOf(d))).toEqual([
      'constructor',
      'context',
      'exec'
    ])
  })

  it('debuts have contexts', () => {
    const d = new Debut()

    expect(typeof d.context).toEqual('object')
  })

  it('debut can execute javascript code', async () => {
    const d = new Debut()
    const result = d.exec('Date.now()')
    expect(result).toBeInstanceOf(Promise)
    expect(typeof (await result)).toEqual('number')
  })

  it('can modify context using global variables', async () => {
    const d = new Debut()
    await d.exec('x = 10')
    expect(d.context).toEqual({x: 10})
  })

  it('changes to context persist', async () => {
    const d = new Debut()
    await d.exec('x = 10')
    await d.exec('y = 20')
    expect(d.context).toEqual({x: 10, y: 20})
  })
})
