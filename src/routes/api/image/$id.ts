import { cache } from '@/lib/cache-manager'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { z } from 'zod'

export const Route = createFileRoute('/api/image/$id')({
  server: {
    handlers: {
      GET: ({ params, request }) => {
        const { id } = z.object({ id: z.string() }).parse(params)

        return cache.getWithCache(request.url)(async () => {
          const file = await env.R2_BUCKET.get(id)

          if (!file) {
            throw notFound()
          }

          return new Response(file.body, {
            headers: {
              'Content-Type': file.httpMetadata?.contentType ?? 'image/webp',
            },
          })
        })
      },
    },
  },
})
