import { afterEach, describe, expect, it, vi } from 'vite-plus/test'

import { loadAuthUser, resetAuthUserCache } from './get-auth-user'

afterEach(() => {
  resetAuthUserCache()
  vi.unstubAllGlobals()
})

describe('session loading', () => {
  it('does not hide online session failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Network failure')))
    await expect(loadAuthUser()).rejects.toThrow('Network failure')
  })
})
