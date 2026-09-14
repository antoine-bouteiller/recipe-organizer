import { describe, expect, it } from 'vite-plus/test'

import { cacheLimits, isApiRequest, isPublicRecipeRequest, navigationDenylist } from './sw-policy'

const request = (path: string, method = 'GET') => ({
  request: new Request(`https://recipes.test${path}`, { method }),
  sameOrigin: true,
  url: new URL(`https://recipes.test${path}`),
})

describe('service worker cache policy', () => {
  it('caches only public recipe reads', () => {
    expect(isPublicRecipeRequest(request('/api/recipes'))).toBe(true)
    expect(isPublicRecipeRequest(request('/api/recipes/42'))).toBe(true)
    expect(isPublicRecipeRequest(request('/api/recipes/42/instructions'))).toBe(true)
    expect(isPublicRecipeRequest(request('/api/shopping-list/recipes?ids=%5B1%5D'))).toBe(true)
    expect(isPublicRecipeRequest(request('/api/shopping-list/recipes', 'POST'))).toBe(false)
    expect(isPublicRecipeRequest(request('/api/session'))).toBe(false)
    expect(isPublicRecipeRequest(request('/api/auth/session'))).toBe(false)
    expect(isPublicRecipeRequest(request('/api/recipes', 'POST'))).toBe(false)
  })

  it('excludes API navigations and identifies all API traffic for network-only handling', () => {
    expect(navigationDenylist.some((pattern) => pattern.test('/api/recipes'))).toBe(true)
    expect(navigationDenylist.some((pattern) => pattern.test('/recipes'))).toBe(false)
    expect(isApiRequest(request('/api/admin/users'))).toBe(true)
  })

  it('bounds every runtime cache', () => {
    expect(Object.values(cacheLimits).every(({ maxAgeSeconds, maxEntries }) => maxAgeSeconds > 0 && maxEntries > 0)).toBe(true)
  })
})
