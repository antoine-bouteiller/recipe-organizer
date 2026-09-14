import { describe, expect, it } from 'vite-plus/test'

import { parseLoginSearch, parseRecipeId, parseRecipeListSearch } from './route-params'

describe('route parameter parsers', () => {
  it.each([
    [{ id: '42' }, { id: 42 }],
    [{ id: '12recipes' }, { id: 12 }],
    [{ id: '' }, { id: Number.NaN }],
    [{ id: '42', ignored: true }, { id: 42 }],
  ])('preserves recipe ID parsing for %o', (input, output) => {
    expect(parseRecipeId(input)).toEqual(output)
  })

  it.each([{}, { id: undefined }, { id: 42 }, null, []])('rejects invalid recipe IDs: %o', (input) => {
    expect(() => parseRecipeId(input)).toThrow()
  })

  it.each([
    [parseRecipeListSearch, {}, {}],
    [parseRecipeListSearch, { search: undefined }, { search: undefined }],
    [parseRecipeListSearch, { ignored: true, search: true }, { search: true }],
    [parseLoginSearch, {}, {}],
    [parseLoginSearch, { error: undefined }, { error: undefined }],
    [parseLoginSearch, { error: 'account_pending', ignored: true }, { error: 'account_pending' }],
  ])('strips extra search keys for %p', (parse, input, output) => {
    expect(parse(input)).toEqual(output)
  })

  it.each([
    [parseRecipeListSearch, { search: 'true' }],
    [parseRecipeListSearch, { search: 1 }],
    [parseLoginSearch, { error: true }],
    [parseLoginSearch, { error: 1 }],
    [parseLoginSearch, null],
    [parseLoginSearch, []],
  ])('rejects invalid search values for %p', (parse, input) => {
    expect(() => parse(input)).toThrow()
  })
})
