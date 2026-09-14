const day = 24 * 60 * 60

export const cacheLimits = {
  images: { maxAgeFrom: 'last-used' as const, maxAgeSeconds: 365 * day, maxEntries: 200 },
  publicAssets: { maxAgeFrom: 'last-used' as const, maxAgeSeconds: 30 * day, maxEntries: 150 },
  publicRecipes: { maxAgeFrom: 'last-used' as const, maxAgeSeconds: 7 * day, maxEntries: 100 },
}

export const navigationDenylist = [/^\/api(?:\/|$)/]

export const isPublicRecipeRequest = ({ request, sameOrigin, url }: { request: Request; sameOrigin: boolean; url: URL }) =>
  sameOrigin &&
  request.method === 'GET' &&
  (/^\/api\/recipes(?:\/\d+(?:\/instructions)?)?\/?$/.test(url.pathname) || url.pathname === '/api/shopping-list/recipes')

export const isPublicAssetRequest = ({ request, sameOrigin, url }: { request: Request; sameOrigin: boolean; url: URL }) =>
  sameOrigin && request.method === 'GET' && /^\/assets\/.+\.(?:css|js)$/.test(url.pathname)

export const isApiRequest = ({ sameOrigin, url }: { sameOrigin: boolean; url: URL }) => sameOrigin && /^\/api(?:\/|$)/.test(url.pathname)
