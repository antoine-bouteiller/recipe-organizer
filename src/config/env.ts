import arkenv from 'arkenv'
import { type } from 'arktype'
import { env as cloudflareEnv } from 'cloudflare:workers'

export const env = arkenv(
  {
    // Server vars
    DB: type('object').as<D1Database>(),
    GOOGLE_CLIENT_ID: /^[0-9]+-[a-zA-Z0-9]+.apps.googleusercontent.com$/,
    GOOGLE_CLIENT_SECRET: /^GOCSPX-[a-zA-Z0-9_-]+$/,
    IMAGES: type('object').as<ImagesBinding>(),
    R2_BUCKET: type('object').as<R2Bucket>(),
    SESSION_SECRET: 'string>=32',
    VITE_PUBLIC_URL: 'string',
  },
  {
    VITE_PUBLIC_URL: import.meta.env.VITE_PUBLIC_URL,
    ...(cloudflareEnv as Record<string, string>),
  }
)
