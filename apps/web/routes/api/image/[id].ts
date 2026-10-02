import { defineHandler } from 'void'

import { createR2GetHandler } from '#server/lib/r2'

export const GET = defineHandler((context) => createR2GetHandler('image/webp')({ params: context.req.param(), request: context.req.raw }))
