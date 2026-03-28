import { createFileRoute } from '@tanstack/react-router'

import { createR2GetHandler } from '@/lib/r2'

export const Route = createFileRoute('/api/image/$id')({
  server: {
    handlers: {
      GET: createR2GetHandler('image/webp'),
    },
  },
})
