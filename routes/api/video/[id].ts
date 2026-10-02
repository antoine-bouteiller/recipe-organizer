import { createR2GetHandler, createR2HeadHandler } from '@recipe-organizer/server/lib/r2'
import { defineHandler } from 'void'

export const GET = defineHandler((context) => {
  // Hono dispatches HEAD through GET handlers while preserving the original method.
  const createHandler = context.req.method === 'HEAD' ? createR2HeadHandler : createR2GetHandler
  return createHandler('video/mp4')({ params: context.req.param(), request: context.req.raw })
})
