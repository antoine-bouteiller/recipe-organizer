import { QueryClient } from '@tanstack/react-query'
import { afterEach, describe, expect, it, vi } from 'vite-plus/test'

import { prefetchPublicRecipeRoute } from './prefetch-public-route'

const queryClient = () => new QueryClient({ defaultOptions: { queries: { retry: false } } })
const response = () => Response.json([])

afterEach(() => vi.unstubAllGlobals())

describe('prefetchPublicRecipeRoute', () => {
  it('fetches the matched public recipe detail', async () => {
    const fetch = vi.fn().mockResolvedValue(response())
    vi.stubGlobal('fetch', fetch)

    await prefetchPublicRecipeRoute(queryClient(), [
      { params: {}, routeId: '__root__' },
      { params: { id: '42' }, routeId: '/recipe/$id' },
    ])

    expect(fetch).toHaveBeenCalledOnce()
    expect(fetch).toHaveBeenCalledWith('/api/recipes/42', expect.any(Object))
  })

  it('fetches public lists but does not speculate on protected routes', async () => {
    const fetch = vi.fn().mockResolvedValue(response())
    vi.stubGlobal('fetch', fetch)
    const client = queryClient()

    await prefetchPublicRecipeRoute(client, [{ params: {}, routeId: '/search' }])
    expect(fetch).toHaveBeenCalledWith('/api/recipes', expect.any(Object))

    fetch.mockClear()
    await prefetchPublicRecipeRoute(client, [{ params: {}, routeId: '/recipe/new' }])
    expect(fetch).not.toHaveBeenCalled()
  })
})
