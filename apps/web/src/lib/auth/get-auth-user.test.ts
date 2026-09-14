import { afterEach, describe, expect, it, vi } from 'vite-plus/test'

import { loadAuthUser, resetAuthUserCache } from './get-auth-user'

afterEach(() => {
  resetAuthUserCache()
  vi.unstubAllGlobals()
})

describe('session loading', () => {
  it('allows anonymous public reading offline and retries after reconnecting', async () => {
    const fetch = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('Offline'))
      .mockResolvedValueOnce(Response.json({ id: 'user', role: 'admin' }))
    vi.stubGlobal('fetch', fetch)
    vi.stubGlobal('navigator', { onLine: false })

    await expect(loadAuthUser()).resolves.toBeUndefined()
    vi.stubGlobal('navigator', { onLine: true })
    await expect(loadAuthUser()).resolves.toMatchObject({ id: 'user', role: 'admin' })
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it('does not hide online session failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Network failure')))
    vi.stubGlobal('navigator', { onLine: true })
    await expect(loadAuthUser()).rejects.toThrow('Network failure')
  })
})
