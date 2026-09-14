import { getRecipeByIdsOptions } from '@client/features/shopping-list/api/get-recipe-by-ids'
import { getRouter } from '@client/router'
import { onlineManager, QueryClient } from '@tanstack/react-query'
import { afterEach, describe, expect, it, vi } from 'vite-plus/test'

import { getRecipeListOptions } from './get-all'
import { getRecipeInstructionsOptions } from './get-instructions'
import { getRecipeDetailsOptions } from './get-one'

afterEach(() => {
  onlineManager.setOnline(true)
  vi.unstubAllGlobals()
})

describe('public recipe offline reads', () => {
  it('lets the service worker answer public queries even when the browser is offline', async () => {
    onlineManager.setOnline(false)
    const fetch = vi.fn().mockImplementation(() => Promise.resolve(Response.json({ id: 1, instructions: '' })))
    vi.stubGlobal('fetch', fetch)
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })

    await Promise.all([
      client.query(getRecipeListOptions()),
      client.query(getRecipeDetailsOptions(1)),
      client.query(getRecipeInstructionsOptions(1)),
      client.query(getRecipeByIdsOptions([1])),
    ])

    expect(fetch).toHaveBeenCalledTimes(4)
    client.clear()
  })

  it('does not park failed offline reads indefinitely waiting for a retry', () => {
    const retry = getRouter().options.context?.queryClient.getDefaultOptions().queries?.retry
    if (typeof retry !== 'function') {
      throw new Error('Expected the router query retry policy')
    }
    vi.stubGlobal('navigator', { onLine: false })
    expect(retry(0, new Error('Cache miss'))).toBe(false)
    vi.stubGlobal('navigator', { onLine: true })
    expect(retry(0, new Error('Transient error'))).toBe(true)
    expect(retry(3, new Error('Persistent error'))).toBe(false)
  })
})
