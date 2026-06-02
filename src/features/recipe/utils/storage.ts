import { randomUUID } from 'node:crypto'

import { env } from 'cloudflare:workers'
import { storage } from 'void/storage'

export const uploadImage = async (file: File): Promise<string> => {
  const key = randomUUID()
  const optimized = await env.IMAGES.input(file.stream()).transform({ width: 1024 }).output({ format: 'image/webp', quality: 80 })
  await storage.put(key, await optimized.response().arrayBuffer(), {
    httpMetadata: { contentType: optimized.contentType() },
  })
  return key
}

export const uploadVideo = async (file: File): Promise<string> => {
  const key = randomUUID()
  await storage.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  })
  return key
}

export const deleteFile = (key: string): Promise<void> => storage.delete(key)
