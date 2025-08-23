import { getBindings } from '@/lib/bindings'
import { notFound } from '@tanstack/react-router'
import { createServerFileRoute } from '@tanstack/react-start/server'
import { z } from 'zod'

export const ServerRoute = createServerFileRoute('/api/image/$id').methods({
  GET: async ({ params }) => {
    const { id } = z.object({ id: z.string() }).parse(params)

    const file = await getBindings().R2_BUCKET.get(id)

    if (!file) {
      throw notFound()
    }

    return new Response(file.body, {
      headers: {
        'Content-Type': file.httpMetadata?.contentType ?? 'image/webp',
      },
    })
  },
})
