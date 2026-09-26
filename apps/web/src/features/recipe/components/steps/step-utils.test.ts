import { describe, expect, it } from 'vite-plus/test'

import { clampStepRange, toggleBold } from './step-utils'

describe('toggleBold', () => {
  it('wraps then unwraps the selection', () => {
    const wrapped = toggleBold({ end: 13, start: 9, value: 'Mélanger vite.' })
    expect(wrapped).toEqual({ end: 15, start: 11, value: 'Mélanger **vite**.' })
    expect(toggleBold(wrapped)).toEqual({ end: 13, start: 9, value: 'Mélanger vite.' })
  })

  it('unwraps a selection that includes the delimiters', () => {
    expect(toggleBold({ end: 17, start: 9, value: 'Mélanger **vite**.' })).toEqual({ end: 13, start: 9, value: 'Mélanger vite.' })
  })

  it('inserts empty delimiters at the caret', () => {
    expect(toggleBold({ end: 2, start: 2, value: 'ab' })).toEqual({ end: 4, start: 4, value: 'ab****' })
  })
})

describe('clampStepRange', () => {
  it.each([
    { count: 5, expected: { first: 2, last: 4 }, fromStep: 2, toStep: 4 },
    { count: 3, expected: { first: 2, last: 3 }, fromStep: 2, toStep: 4 },
    { count: 5, expected: { first: 1, last: 5 } },
    { count: 3, expected: { first: 4, last: 3 }, fromStep: 4 },
  ])('clamps $fromStep-$toStep over $count steps', ({ count, expected, fromStep, toStep }) => {
    expect(clampStepRange(count, fromStep, toStep)).toEqual(expected)
  })
})
