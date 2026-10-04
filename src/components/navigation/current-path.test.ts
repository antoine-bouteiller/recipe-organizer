import { describe, expect, it } from 'vite-plus/test'

import { isCurrentPath } from './current-path'

describe('isCurrentPath', () => {
  it('matches home exactly', () => {
    expect(isCurrentPath('/', '/')).toBe(true)
    expect(isCurrentPath('/settings', '/')).toBe(false)
  })

  it('keeps sections current on their nested pages', () => {
    expect(isCurrentPath('/settings', '/settings')).toBe(true)
    expect(isCurrentPath('/settings/users', '/settings')).toBe(true)
  })

  it('does not match sibling paths sharing a prefix', () => {
    expect(isCurrentPath('/settings-old', '/settings')).toBe(false)
  })
})
