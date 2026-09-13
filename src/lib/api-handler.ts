import { api } from '@/lib/api'
import { type ApiEnvironment } from '@/lib/api-context'
import { getAuth } from '@/lib/auth/auth-server'
import { getDb } from '@/lib/db'
import { createR2GetHandler, createR2HeadHandler, deleteFile, uploadFile, uploadVideo } from '@/lib/r2'

export const handleApiRequest = (request: Request) => {
  const db = getDb()
  const services: ApiEnvironment['Bindings'] = {
    auth: getAuth(db),
    db,
    development: import.meta.env.DEV,
    media: { createR2GetHandler, createR2HeadHandler, deleteFile, uploadFile, uploadVideo },
  }
  return api.fetch(request, services)
}
