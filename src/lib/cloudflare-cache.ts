declare global {
  interface CacheStorage {
    default: Cache
  }
}

export class CloudflareCache {
  cache: Cache | undefined = undefined

  constructor() {
    if (typeof caches !== 'undefined') {
      this.cache = caches.default
    }
  }

  get(key: string) {
    if (this.cache) {
      return this.cache.match(key)
    }
  }

  put(key: string, value: Response) {
    if (this.cache) {
      return this.cache.put(key, value)
    }
  }
}
