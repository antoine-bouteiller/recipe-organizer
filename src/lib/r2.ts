import { getBindings } from '@/lib/bindings'
import { randomUUID } from 'node:crypto'

const uploadFile = async (file: File) => {
  const key = randomUUID()

  const imageStream = file.stream()

  const optimizedImage = await getBindings()
    .IMAGES.input(imageStream)
    .transform({
      width: 1024,
    })
    .output({ format: 'image/webp', quality: 80 })

  // R2 requires known-length bodies for uploads; convert to ArrayBuffer
  const optimizedBuffer = await optimizedImage.response().arrayBuffer()
  await getBindings().R2_BUCKET.put(key, optimizedBuffer, {
    httpMetadata: { contentType: optimizedImage.contentType() },
  })

  return key
}

const deleteFile = async (key: string) => {
  await getBindings().R2_BUCKET.delete(key)
}

const getFileUrl = (key: string) => `/api/image/${key}`

export { uploadFile, deleteFile, getFileUrl }
