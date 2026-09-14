import {
  CacheFirst,
  ExpirationPlugin,
  NavigationRoute,
  NetworkFirst,
  NetworkOnly,
  Serwist,
  type PrecacheEntry,
  type SerwistGlobalConfig,
} from 'serwist'

import { cacheLimits, isApiRequest, isPublicAssetRequest, isPublicRecipeRequest, navigationDenylist } from './sw-policy'

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope

const serwist = new Serwist({
  clientsClaim: true,
  precacheEntries: self.__SW_MANIFEST,
  runtimeCaching: [
    {
      handler: new NetworkFirst({
        cacheName: 'public-recipes',
        networkTimeoutSeconds: 5,
        plugins: [new ExpirationPlugin(cacheLimits.publicRecipes)],
      }),
      matcher: isPublicRecipeRequest,
    },
    {
      handler: new CacheFirst({
        cacheName: 'images',
        plugins: [new ExpirationPlugin(cacheLimits.images)],
      }),
      matcher: ({ sameOrigin, url }) => sameOrigin && url.pathname.startsWith('/api/image/'),
    },
    {
      handler: new CacheFirst({
        cacheName: 'public-assets',
        plugins: [new ExpirationPlugin(cacheLimits.publicAssets)],
      }),
      matcher: isPublicAssetRequest,
    },
    {
      handler: new NetworkOnly(),
      matcher: isApiRequest,
    },
  ],
  skipWaiting: true,
})

serwist.registerRoute(new NavigationRoute(serwist.createHandlerBoundToUrl('/index.html'), { denylist: navigationDenylist }))
serwist.addEventListeners()
