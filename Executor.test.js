/* globals describe, it, expect */
const Executor = require('./Executor')

describe('Executor', () => {
  it('can be created', () => {
    const d = new Executor()
    expect(typeof d).toEqual('object')
  })

  it('exposes minimal public API', () => {
    const d = new Executor()
    expect(Object.keys(d)).toEqual([])
    expect(Object.getOwnPropertyNames(d)).toEqual([])
    expect(Object.getOwnPropertyNames(Object.getPrototypeOf(d))).toEqual([
      'constructor',
      'exec'
    ])
  })

  it('can execute javascript code', async () => {
    const d = new Executor()
    const result = d.exec('Date.now()', {})
    expect(result).toBeInstanceOf(Promise)
    expect(typeof await result).toEqual('number')
  })

  it('can modify state using global variables', async () => {
    const state = {}
    const d = new Executor()
    expect(await d.exec('x = 10', state)).toEqual(10)
    expect(state).toEqual({ x: 10 })
  })

  it('changes to state persists', async () => {
    const state = {}
    const d = new Executor()
    await d.exec('x = 10', state)
    await d.exec('y = 20', state)
    expect(state).toEqual({ x: 10, y: 20 })
  })

  it('supports `cd`', async () => {
    const state = {}
    const d = new Executor()
    await d.exec('test = {a: 1}', state)
    await d.exec('cd("test")', state)
    expect(await d.exec('a', state)).toEqual(1)
  })
})
