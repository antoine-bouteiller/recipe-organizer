import { createFileRoute } from '@tanstack/solid-router'
import { createFileRoute } from '@tanstack/solid-router'

import { createR2GetHandler } from '@/lib/r2'

export const Route = createFileRoute('/api/image/$id')({
  server: {
    handlers: {
      GET: createR2GetHandler('image/webp'),
    },
  },
})
