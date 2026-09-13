import { createFileRoute } from '@tanstack/react-router'

import { handleApiRequest } from '@/lib/api-handler'

const handler = ({ request }: { request: Request }) => handleApiRequest(request)

export const Route = createFileRoute('/api/$')({
  server: {
    handlers: {
      DELETE: handler,
      GET: handler,
      HEAD: handler,
      OPTIONS: handler,
      PATCH: handler,
      POST: handler,
      PUT: handler,
    },
  },
})
