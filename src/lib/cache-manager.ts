declare global {
  interface CacheStorage {
    readonly default: Cache
  }
}

class CacheManager {
  cache: Cache | undefined = undefined

  constructor() {
    if (typeof caches !== 'undefined') {
      this.cache = caches.default
    }
  }

  getWithCache(key: string, cacheControl = 'public, max-age=31536000, immutable') {
    return async (getItem: () => Promise<Response>) => {
      const cachedResponse = await this.get(key)

      if (cachedResponse) {
        return new Response(cachedResponse?.body, {
          headers: {
            'Cache-Control': cacheControl,
            'CF-Cache-Status': 'HIT',
            'Content-Type': 'image/webp',
            ...Object.fromEntries(cachedResponse.headers.entries()),
          },
        })
      }
      const response = await getItem()

      await this.put(key, response.clone())

      return new Response(response.body, {
        headers: {
          'Cache-Control': cacheControl,
          'CF-Cache-Status': 'MISS',
          'Content-Type': 'image/webp',
          ...Object.fromEntries(response.headers.entries()),
        },
      })
    }
  }

  private get(key: string) {
    if (this.cache) {
      return this.cache.match(key)
    }
  }

  private put(key: string, value: Response) {
    if (this.cache) {
      return this.cache.put(key, value)
    }
  }
}

export const cache = new CacheManager()
