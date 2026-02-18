import { createFileRoute, notFound } from '@tanstack/react-router'
import { env as cloudflareEnv } from 'cloudflare:workers'
import * as v from 'valibot'

import { cache } from '@/lib/cache-manager'

const paramsSchema = v.object({ id: v.string() })

export const Route = createFileRoute('/api/image/$id')({
  server: {
    handlers: {
      GET: ({ params, request }) => {
        const result = v.safeParse(paramsSchema, params)
        if (!result.success) {
          throw new Error(result.issues[0]?.message ?? 'Invalid params')
        }
        const { id } = result.output

        return cache.getWithCache(request.url)(async () => {
          const file = await cloudflareEnv.R2_BUCKET.get(id)

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
