import { notFound } from '@tanstack/react-router'
import { env as cloudflareEnv } from 'cloudflare:workers'
import { z } from 'zod'

import { cache } from '@/lib/cache-manager'

const paramsSchema = z.object({ id: z.string() })

const parseId = (params: unknown): string => {
  const result = paramsSchema.safeParse(params)
  if (!result.success) {
    throw new Error(result.error?.issues[0]?.message ?? 'Invalid params')
  }
  return result.data.id
}

export const createR2GetHandler =
  (defaultContentType: string) =>
  ({ params, request }: { params: unknown; request: Request }) => {
    const id = parseId(params)

    return cache.getWithCache(request.url)(async () => {
      const file = await cloudflareEnv.R2_BUCKET.get(id)

      if (!file) {
        throw notFound()
      }

      return new Response(file.body, {
        headers: {
          'Content-Type': file.httpMetadata?.contentType ?? defaultContentType,
        },
      })
    })
  }

export const createR2HeadHandler =
  (defaultContentType: string) =>
  ({ params, request }: { params: unknown; request: Request }) => {
    const id = parseId(params)

    return cache.getWithCache(request.url)(async () => {
      const file = await cloudflareEnv.R2_BUCKET.head(id)

      if (!file) {
        throw notFound()
      }

      return new Response(null, {
        headers: {
          'Content-Type': file.httpMetadata?.contentType ?? defaultContentType,
          'Content-Length': file.size.toString(),
          'Accept-Ranges': 'bytes',
        },
      })
    })
  }
