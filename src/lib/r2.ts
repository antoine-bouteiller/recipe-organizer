import { getBindings } from '@/lib/bindings'
import { randomUUID } from 'node:crypto'

const uploadFile = async (file: File) => {
  const key = randomUUID()

  const arrayBuffer = await file.arrayBuffer()

  await getBindings().R2_BUCKET.put(key, arrayBuffer)

  return key
}

const deleteFile = async (key: string) => {
  await getBindings().R2_BUCKET.delete(key)
}

const getFileUrl = (key: string) => `${import.meta.env.VITE_PUBLIC_R2_URL}/${key}`

export { uploadFile, deleteFile, getFileUrl }
