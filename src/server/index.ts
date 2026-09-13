import { api } from '@server/api'
import { type ApiEnvironment } from '@server/api-context'
import { getAuth } from '@server/lib/auth/auth-server'
import { getDb } from '@server/lib/db'
import { createR2GetHandler, createR2HeadHandler, deleteFile, uploadFile, uploadVideo } from '@server/lib/r2'

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
