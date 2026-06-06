import { describe, expect, it } from 'vite-plus/test'

import { scaleQuantity } from './scale-quantity'

describe('scaleQuantity', () => {
  it('scales up when the desired servings exceed the base', () => {
    expect(scaleQuantity(100, 8, 4)).toBe(200)
  })

  it('scales down when the desired servings are below the base', () => {
    expect(scaleQuantity(100, 2, 4)).toBe(50)
  })

  it('returns the quantity unchanged when desired equals base', () => {
    expect(scaleQuantity(100, 4, 4)).toBe(100)
  })

  it('applies a fractional multiplier', () => {
    expect(scaleQuantity(50, 1.5, 1)).toBe(75)
  })
})
