import { createFileRoute, notFound } from '@tanstack/react-router'
import * as v from 'valibot'
import { storage } from 'void/storage'

import { cache } from '@/lib/cache-manager'

const paramsSchema = v.object({ id: v.string() })

export const Route = createFileRoute('/api/image/$id')({
  server: {
    handlers: {
      GET: ({ params, request }) => {
        const { id } = v.parse(paramsSchema, params)
        return cache.getWithCache(request.url)(async () => {
          const file = await storage.get(id)
          if (!file) {
            throw notFound()
          }
          return new Response(file.body, {
            headers: {
              'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
              'Content-Type': file.httpMetadata?.contentType ?? 'image/webp',
            },
          })
        })
      },
    },
  },
})
