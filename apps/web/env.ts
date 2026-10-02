import { defineEnv, string, url } from 'void/env'

// Scaffolded from .env. Inference is conservative — review each
// Entry and tighten types as needed (e.g. oneOf([...]), url(), .optional(),
// .default(value), or a Standard Schema validator from valibot/zod/arktype).
export default defineEnv({
  CLOUDFLARE_ACCOUNT_ID: string(),
  CLOUDFLARE_D1_TOKEN: string(),
  CLOUDFLARE_DATABASE_ID: string(),
  GOOGLE_CLIENT_ID: string(),
  GOOGLE_CLIENT_SECRET: string(),
  SESSION_SECRET: string(),
  VITE_PUBLIC_URL: url(),
})
