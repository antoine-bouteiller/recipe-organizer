import { createFileRoute, notFound } from '@tanstack/react-router'
import { env as cloudflareEnv } from 'cloudflare:workers'
import { z } from 'zod'

import { cache } from '@/lib/cache-manager'

const paramsSchema = z.object({ id: z.string() })

export const Route = createFileRoute('/api/video/$id')({
  server: {
    handlers: {
      GET: ({ params, request }) => {
        const result = paramsSchema.safeParse(params)
        if (!result.success) {
          throw new Error(result.error?.issues[0]?.message ?? 'Invalid params')
        }
        const { id } = result.data

        return cache.getWithCache(request.url)(async () => {
          const file = await cloudflareEnv.R2_BUCKET.get(id)

          if (!file) {
            throw notFound()
          }

          return new Response(file.body, {
            headers: {
              'Content-Type': file.httpMetadata?.contentType ?? 'video/mp4',
            },
          })
        })
      },
      HEAD: ({ params, request }) => {
        const result = paramsSchema.safeParse(params)
        if (!result.success) {
          throw new Error(result.error?.issues[0]?.message ?? 'Invalid params')
        }
        const { id } = result.data

        return cache.getWithCache(request.url)(async () => {
          const file = await cloudflareEnv.R2_BUCKET.head(id)

          if (!file) {
            throw notFound()
          }

          return new Response(null, {
            headers: {
              'Content-Type': file.httpMetadata?.contentType ?? 'video/mp4',
              'Content-Length': file.size.toString(),
              'Accept-Ranges': 'bytes',
            },
          })
        })
      },
    },
  },
})
