import { randomUUID } from 'node:crypto'

import { env } from 'cloudflare:workers'
import { HTTPException } from 'hono/http-exception'
import { storage } from 'void/storage'
import * as z from 'zod'

import { cache } from './cache-manager'

const uploadFile = async (file: File) => {
  const key = randomUUID()

  const imageStream = file.stream()

  const optimizedImage = await env.IMAGES.input(imageStream)
    .transform({
      width: 640,
    })
    .output({ format: 'image/webp', quality: 80 })

  // R2 requires known-length bodies for uploads; convert to ArrayBuffer
  const optimizedBuffer = await optimizedImage.response().arrayBuffer()
  await storage.put(key, optimizedBuffer, {
    httpMetadata: { contentType: optimizedImage.contentType() },
  })

  return key
}

const uploadVideo = async (file: File) => {
  const key = randomUUID()

  const videoBuffer = await file.arrayBuffer()
  await storage.put(key, videoBuffer, {
    httpMetadata: { contentType: file.type },
  })

  return key
}

const deleteFile = async (key: string) => {
  await storage.delete(key)
}

const paramsSchema = z.object({ id: z.string() })

export const createR2GetHandler =
  (defaultContentType: string) =>
  ({ params, request }: { params: unknown; request: Request }) => {
    const { id } = paramsSchema.parse(params)

    return cache.getWithCache(request.url)(async () => {
      const file = await storage.get(id)

      if (!file) {
        throw new HTTPException(404, { message: 'not_found' })
      }

      return new Response(file.body, {
        headers: {
          'Cache-Control':
            defaultContentType === 'image/webp' ? 'public, max-age=31536000, immutable' : 'public, max-age=86400, stale-while-revalidate=604800',
          'Content-Type': file.httpMetadata?.contentType ?? defaultContentType,
        },
      })
    })
  }

export const createR2HeadHandler =
  (defaultContentType: string) =>
  ({ params, request }: { params: unknown; request: Request }) => {
    const { id } = paramsSchema.parse(params)

    return cache.getWithCache(request.url)(async () => {
      const file = await storage.head(id)

      if (!file) {
        throw new HTTPException(404, { message: 'not_found' })
      }

      return new Response(null, {
        headers: {
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
          'Content-Length': file.size.toString(),
          'Content-Type': file.httpMetadata?.contentType ?? defaultContentType,
        },
      })
    })
  }

export { deleteFile, uploadFile, uploadVideo }
