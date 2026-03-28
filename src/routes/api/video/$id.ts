import { createFileRoute } from '@tanstack/react-router'

import { createR2GetHandler, createR2HeadHandler } from '@/lib/r2'

export const Route = createFileRoute('/api/video/$id')({
  server: {
    handlers: {
      GET: createR2GetHandler('video/mp4'),
      HEAD: createR2HeadHandler('video/mp4'),
    },
  },
})
