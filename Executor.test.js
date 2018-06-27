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
      'context',
      'exec'
    ])
  })

  it('executors have contexts', () => {
    const d = new Executor()

    expect(typeof d.context).toEqual('object')
  })

  it('can execute javascript code', async () => {
    const d = new Executor()
    const result = d.exec('Date.now()')
    expect(result).toBeInstanceOf(Promise)
    expect(typeof await result).toEqual('number')
  })

  it('can modify context using global variables', async () => {
    const d = new Executor()
    await d.exec('x = 10')
    expect(d.context).toEqual({ x: 10 })
  })

  it('changes to context persist', async () => {
    const d = new Executor()
    await d.exec('x = 10')
    await d.exec('y = 20')
    expect(d.context).toEqual({ x: 10, y: 20 })
  })
})
