import { createFileRoute, notFound } from '@tanstack/react-router'
import { type } from 'arktype'

import { env } from '@/config/env'
import { cache } from '@/lib/cache-manager'

const paramsSchema = type({ id: 'string' })

export const Route = createFileRoute('/api/image/$id')({
  server: {
    handlers: {
      GET: ({ params, request }) => {
        const validated = paramsSchema(params)
        if (validated instanceof type.errors) {
          throw new Error(validated.summary)
        }
        const { id } = validated

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
