import { getBindings } from '@/lib/bindings'
import { CloudflareCache } from '@/lib/cloudflare-cache'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/api/image/$id')({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const { id } = z.object({ id: z.string() }).parse(params)

        const cache = new CloudflareCache()
        const cachedResponse = await cache.get(request.url)

        if (cachedResponse) {
          return new Response(cachedResponse.body, {
            headers: {
              'Content-Type': cachedResponse.headers.get('Content-Type') ?? 'image/webp',
              'Cache-Control': 'public, max-age=31536000, immutable',
              'CF-Cache-Status': 'HIT',
            },
          })
        }
        const file = await getBindings().R2_BUCKET.get(id)

        if (!file) {
          throw notFound()
        }

        const response = new Response(file.body, {
          headers: {
            'Content-Type': file.httpMetadata?.contentType ?? 'image/webp',
            'Cache-Control': 'public, max-age=31536000, immutable',
            'CF-Cache-Status': 'MISS',
          },
        })

        await cache.put(request.url, response.clone())

        return response
      },
    },
  },
})
