/* globals describe, it, expect */

const Store = require('./Store')

describe('Store', () => {
  it('can be created', () => {
    const s = new Store()
    expect(s).toBeTruthy()
  })

  it('supports transaction semantics', () => {
    const s = new Store()

    const result = s.transact(state => {
      state.x = 100
    })

    expect(result.then).toBeInstanceOf(Function)
  })

  it('transactions resolve to returned value', () => {
    const s = new Store()

    const result = s.transact(state => 10)

    expect(result).resolves.toEqual(10)
  })

  it('successful transactions get retained', async () => {
    const s = new Store()

    await s.transact(state => {
      state.x = 1
    })

    return s.transact(state => {
      expect(state.x).toEqual(1)
    })
  })

  it('failing transactions get rolledback', async () => {
    const s = new Store()

    expect(s.transact(state => {
      state.x = 1
      throw new Error('ROLLBACK')
    })).rejects.toMatchObject({message: 'ROLLBACK'})

    return s.transact(state => {
      expect(state.x).toBeUndefined()
    })
  })

  it('works with deleting props', async () => {
    const s = new Store()
    await s.transact(state => {
      state.x = {a: 1}
    })
    await s.transact(state => {
      delete state.x.a
    })
    expect(await s.transact(state => state.x.a)).toBeUndefined()
  })
})
