import { defaultCache } from '@serwist/vite/worker'
import { Serwist, StaleWhileRevalidate, type PrecacheEntry, type SerwistGlobalConfig } from 'serwist'

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
      handler: new StaleWhileRevalidate({ cacheName: 'server-fn' }),
      matcher: ({ request, sameOrigin, url }) => sameOrigin && request.method === 'GET' && url.pathname.includes('_serverFn'),
    },
    ...defaultCache,
  ],
  skipWaiting: true,
})

serwist.addEventListeners()
