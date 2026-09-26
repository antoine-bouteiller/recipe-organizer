import type { getAuth } from '@recipe-organizer/api/lib/auth/auth-server'
import type { getDb } from '@recipe-organizer/api/lib/db'
import type { createR2GetHandler, createR2HeadHandler, deleteFile, uploadFile, uploadVideo } from '@recipe-organizer/api/lib/r2'

interface ApiUser {
  id: string
  role: string | null | undefined
  status: string | null | undefined
  email?: string
}

export interface ApiEnvironment {
  Bindings: {
    auth: ReturnType<typeof getAuth>
    db: ReturnType<typeof getDb>
    development: boolean
    media: {
      createR2GetHandler: typeof createR2GetHandler
      createR2HeadHandler: typeof createR2HeadHandler
      deleteFile: typeof deleteFile
      uploadFile: typeof uploadFile
      uploadVideo: typeof uploadVideo
    }
  }
  Variables: {
    user: ApiUser
  }
}
