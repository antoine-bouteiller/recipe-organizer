import { describe, expect, it } from 'vite-plus/test'

import { toggleBold } from './step-utils'

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
