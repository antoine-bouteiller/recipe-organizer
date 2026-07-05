import { defaultCache } from '@serwist/vite/worker'
import { NetworkFirst, Serwist, type PrecacheEntry, type SerwistGlobalConfig } from 'serwist'

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope

const serwist = new Serwist({
  clientsClaim: true,
  navigationPreload: true,
  precacheEntries: self.__SW_MANIFEST,
  runtimeCaching: [
    {
      // NetworkFirst, not SWR: post-invalidation refetches must see fresh data; cache is offline fallback only.
      handler: new NetworkFirst({ cacheName: 'server-fn' }),
      matcher: ({ request, sameOrigin, url }) => sameOrigin && request.method === 'GET' && url.pathname.includes('_serverFn'),
    },
    ...defaultCache,
  ],
  skipWaiting: true,
})

serwist.addEventListeners()
