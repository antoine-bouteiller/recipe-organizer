import { describe, expect, it } from 'vite-plus/test'

import { normalize } from './normalize'

describe('normalize', () => {
  it('lowercases the value', () => {
    expect(normalize('Pesto')).toBe('pesto')
  })

  it('strips diacritics', () => {
    expect(normalize('Crème brûlée')).toBe('creme brulee')
  })

  it('makes accented and unaccented inputs compare equal', () => {
    expect(normalize('crème')).toBe(normalize('CREME'))
  })

  it('leaves an empty string unchanged', () => {
    expect(normalize('')).toBe('')
  })
})
