import { randomUUID } from 'node:crypto'

import { notFound } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { z } from 'zod'

import { cache } from './cache-manager'

const uploadFile = async (file: File) => {
  const key = randomUUID()

  const imageStream = file.stream()

  const optimizedImage = await env.IMAGES.input(imageStream)
    .transform({
      width: 1024,
    })
    .output({ format: 'image/webp', quality: 80 })

  // R2 requires known-length bodies for uploads; convert to ArrayBuffer
  const optimizedBuffer = await optimizedImage.response().arrayBuffer()
  await env.R2_BUCKET.put(key, optimizedBuffer, {
    httpMetadata: { contentType: optimizedImage.contentType() },
  })

  return key
}

const uploadVideo = async (file: File) => {
  const key = randomUUID()

  const videoBuffer = await file.arrayBuffer()
  await env.R2_BUCKET.put(key, videoBuffer, {
    httpMetadata: { contentType: file.type },
  })

  return key
}

const deleteFile = async (key: string) => {
  await env.R2_BUCKET.delete(key)
}

const paramsSchema = z.object({ id: z.string() })

export const createR2GetHandler =
  (defaultContentType: string) =>
  ({ params, request }: { params: unknown; request: Request }) => {
    const { id } = paramsSchema.parse(params)

    return cache.getWithCache(request.url)(async () => {
      const file = await env.R2_BUCKET.get(id)

      if (!file) {
        throw notFound()
      }

      return new Response(file.body, {
        headers: {
          'Content-Type': file.httpMetadata?.contentType ?? defaultContentType,
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        },
      })
    })
  }

export const createR2HeadHandler =
  (defaultContentType: string) =>
  ({ params, request }: { params: unknown; request: Request }) => {
    const { id } = paramsSchema.parse(params)

    return cache.getWithCache(request.url)(async () => {
      const file = await env.R2_BUCKET.head(id)

      if (!file) {
        throw notFound()
      }

      return new Response(null, {
        headers: {
          'Content-Type': file.httpMetadata?.contentType ?? defaultContentType,
          'Content-Length': file.size.toString(),
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        },
      })
    })
  }

export { deleteFile, uploadFile, uploadVideo }
