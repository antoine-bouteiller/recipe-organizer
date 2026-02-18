import { env as cloudflareEnv } from 'cloudflare:workers'
import * as v from 'valibot'

const envSchema = v.object({
  GOOGLE_CLIENT_ID: v.pipe(v.string(), v.regex(/^\d+-[a-zA-Z0-9]+.apps.googleusercontent.com$/)),
  GOOGLE_CLIENT_SECRET: v.pipe(v.string(), v.regex(/^GOCSPX-[a-zA-Z0-9_-]+$/)),
  SESSION_SECRET: v.pipe(v.string(), v.minLength(32)),
  VITE_PUBLIC_URL: v.string(),
})

const validatedEnv = v.parse(envSchema, {
  GOOGLE_CLIENT_ID: cloudflareEnv.GOOGLE_CLIENT_ID ?? process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: cloudflareEnv.GOOGLE_CLIENT_SECRET ?? process.env.GOOGLE_CLIENT_SECRET,
  SESSION_SECRET: cloudflareEnv.SESSION_SECRET ?? process.env.SESSION_SECRET,
  VITE_PUBLIC_URL: import.meta.env.VITE_PUBLIC_URL,
})

export const env = {
  ...validatedEnv,
  DB: cloudflareEnv.DB,
  IMAGES: cloudflareEnv.IMAGES,
  R2_BUCKET: cloudflareEnv.R2_BUCKET,
}
