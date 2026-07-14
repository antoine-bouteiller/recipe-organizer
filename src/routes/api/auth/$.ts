import { createFileRoute } from '@tanstack/solid-router'
import { createFileRoute } from '@tanstack/solid-router'

import { getAuth } from '@/lib/auth/auth-server'

// Catch-all handler that mounts Better Auth on `/api/auth/*`
// (sign-in, OAuth callback, session, sign-out, ...).
const handler = ({ request }: { request: Request }) => getAuth().handler(request)

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: handler,
      POST: handler,
    },
  },
})
