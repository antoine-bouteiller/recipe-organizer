import { getBindings } from '@/lib/bindings'
import { randomUUID } from 'node:crypto'

export async function uploadFile(file: File) {
  const key = randomUUID()

  const arrayBuffer = await file.arrayBuffer()

  await getBindings().R2_BUCKET.put(key, arrayBuffer)

  return key
}

export async function deleteFile(key: string) {
  await getBindings().R2_BUCKET.delete(key)
}
