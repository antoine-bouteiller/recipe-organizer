import { createR2GetHandler } from '@recipe-organizer/server/lib/r2'
import { defineHandler } from 'void'

export const GET = defineHandler((context) => createR2GetHandler('image/webp')({ params: context.req.param(), request: context.req.raw }))
