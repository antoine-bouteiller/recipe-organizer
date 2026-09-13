import { api } from '@recipe-organizer/api/api'
import { type ApiEnvironment } from '@recipe-organizer/api/api-context'
import { getAuth } from '@recipe-organizer/api/lib/auth/auth-server'
import { getDb } from '@recipe-organizer/api/lib/db'
import { createR2GetHandler, createR2HeadHandler, deleteFile, uploadFile, uploadVideo } from '@recipe-organizer/api/lib/r2'

const handleApiRequest = (request: Request) => {
  const db = getDb()
  const services: ApiEnvironment['Bindings'] = {
    auth: getAuth(db),
    db,
    development: import.meta.env.DEV,
    media: { createR2GetHandler, createR2HeadHandler, deleteFile, uploadFile, uploadVideo },
  }
  return api.fetch(request, services)
}

export default { fetch: handleApiRequest } satisfies ExportedHandler<Env>
