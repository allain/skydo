/* globals describe, it, expect */
const MemoryStore = require('./MemoryStore')

describe('MemoryStore', () => {
  it('behaves sanely when empty', async () => {
    const ms = new MemoryStore()
    expect(ms.size).toEqual(0)

    const ctx = await ms.startTransaction({ authorId: 1 })
    expect(ctx.get('a')).toBeUndefined()
    expect(ctx.set('a', 10)).toBeUndefined()
    expect(ctx.get('a')).toEqual(10)
    ctx.set('a', 20)
    expect(ctx.get('a')).toEqual(20)

    const ctx2 = await ms.startTransaction({ authorId: 1 })
    expect(ctx2.get('a')).toBeUndefined()
  })

  it('supports adding transactions', async () => {
    const ms = new MemoryStore()
    await ms.addTransaction({
      authorId: 1,
      updates: [{ ts: 1, key: 'a', value: 20 }]
    })

    const ctx = await ms.startTransaction({ authorId: 1 })
    expect(ctx.get('a')).toEqual(20)
  })

  it('when conflicts occur, take newest', async () => {
    const ms = new MemoryStore()

    await ms.addTransaction({
      authorId: 1,
      updates: [{ ts: 2, key: 'a', value: 10 }]
    })

    await ms.addTransaction({
      authorId: 2,
      updates: [{ ts: 1, key: 'a', value: 5 }]
    })

    const ctx = await ms.startTransaction({ authorId: 1 })
    expect(ctx.get('a')).toEqual(10)
  })

  it('when conflicts occur, and timestamps are equal, use the one by the smallest authorId', async () => {
    const ms = new MemoryStore()

    await ms.addTransaction({
      authorId: 1,
      updates: [{ ts: 1, key: 'a', value: 10 }]
    })

    await ms.addTransaction({
      authorId: 2,
      updates: [{ ts: 1, key: 'a', value: 5 }]
    })

    const ctx = await ms.startTransaction({ authorId: 1 })
    expect(ctx.get('a')).toEqual(10)
  })

  describe('TransactionContext', () => {
    it('allows creating context', async () => {
      const ms = new MemoryStore()
      const ctx = await ms.startTransaction({ authorId: 1 })
      expect(ctx).toBeTruthy()
      expect(ms.size).toEqual(0)
    })

    it('contexts are separate once created', async () => {
      const ms = new MemoryStore()
      const ctx1 = await ms.startTransaction({ authorId: 1 })
      ctx1.set('a', 100)

      const ctx2 = await ms.startTransaction({ authorId: 1 })
      expect(ctx2.get('a')).toBeUndefined()
      await ctx1.commit()

      expect(ctx2.get('a')).toBeUndefined()
    })

    it('exposes snapshot of store from context creation', async () => {
      const ms = new MemoryStore()

      const ctx1 = await ms.startTransaction({ authorId: 1 })
      ctx1.set('a', 100)
      await ctx1.commit()

      const ctx2 = await ms.startTransaction({ authorId: 1 })
      expect(ctx2.get('a')).toEqual(100)
    })

    it('does nothing when transaction is noop', async () => {
      const ms = new MemoryStore()

      const ctx1 = await ms.startTransaction({ authorId: 1 })
      await ctx1.commit()

      expect(ms.size).toEqual(0)
    })

    it('returns undefined if key is not found in any committed transaction', async () => {
      const ms = new MemoryStore()

      const ctx1 = await ms.startTransaction({ authorId: 1 })
      ctx1.set('a', 100)
      await ctx1.commit()

      const ctx2 = await ms.startTransaction({ authorId: 1 })
      expect(ctx2.get('b')).toBeUndefined()
    })

    it('fails when committed context is modified', async () => {
      const ms = new MemoryStore()
      const ctx = await ms.startTransaction({ authorId: 1 })
      ctx.set('a', 10)
      await ctx.commit()

      expect(() => ctx.set('b', 10)).toThrow()
    })
  })
})
