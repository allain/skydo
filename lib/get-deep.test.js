/* globals describe it expect */

const getDeep = require('./get-deep')

describe('get-deep', () => {
  it('returns undefined on empty', () => {
    expect(getDeep(null, [])).toBeUndefined()
    expect(getDeep(undefined, [])).toBeUndefined()
    expect(getDeep(false, [])).toBeUndefined()
    expect(getDeep(null, ['a'])).toBeUndefined()
    expect(getDeep(undefined, ['a'])).toBeUndefined()
    expect(getDeep(false, ['a'])).toBeUndefined()
  })
})
