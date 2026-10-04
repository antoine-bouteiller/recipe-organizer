import { describe, expect, it } from 'vite-plus/test'

import { normalize } from './normalize'

describe('normalize', () => {
  it('lowercases the value', () => {
    expect(normalize('PESTO')).toBe('pesto')
  })

  it('strips diacritics', () => {
    expect(normalize('Crème brûlée')).toBe('creme brulee')
  })

  it('leaves an empty string unchanged', () => {
    expect(normalize('')).toBe('')
  })
})
