import { randomUUID } from 'node:crypto'

import { env } from 'cloudflare:workers'

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

export { deleteFile, uploadFile, uploadVideo }
