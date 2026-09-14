import { afterEach, describe, expect, it, vi } from 'vite-plus/test'

import { apiClient, readResponse } from './api-client'

afterEach(() => vi.unstubAllGlobals())

describe('API error validation', () => {
  it.each([
    [{ error: 'Specific failure' }, 'Specific failure'],
    [{ error: 42 }, 'Une erreur est survenue'],
    [null, 'Une erreur est survenue'],
    [[], 'Une erreur est survenue'],
  ])('validates the error response %j', async (body, message) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(body, { status: 500 })))
    await expect(readResponse(apiClient.session.$get())).rejects.toThrow(message)
  })

  it.each([401, 403])('preserves authentication redirects for status %s', async (status) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ error: 'account_blocked' }, { status })))
    await expect(readResponse(apiClient.session.$get())).rejects.toMatchObject({ options: { to: '/auth/login' } })
  })
})
