import { createEnv } from '@t3-oss/env-core'
import { env as cloudflareEnv } from 'cloudflare:workers'
import { z } from 'zod'

export const env = createEnv({
  server: {
    R2_BUCKET: z.custom<R2Bucket>((value) => value),
    DB: z.custom<D1Database>((value) => value),
    IMAGES: z.custom<ImagesBinding>((value) => value),
    GOOGLE_CLIENT_ID: z.string().regex(/^[0-9]+-[a-zA-Z0-9]+\.apps\.googleusercontent\.com$/),
    GOOGLE_CLIENT_SECRET: z.string().regex(/^GOCSPX-[a-zA-Z0-9_-]+$/),
    SESSION_SECRET: z.string().min(32),
  },

  clientPrefix: 'VITE_PUBLIC_',

  client: {
    VITE_PUBLIC_URL: z.url(),
  },

  runtimeEnv: {
    VITE_PUBLIC_URL: import.meta.env.VITE_PUBLIC_URL,
    ...(cloudflareEnv as Record<string, string>),
  },

  emptyStringAsUndefined: true,
})
