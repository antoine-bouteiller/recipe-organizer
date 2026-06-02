import { defineEnv, string, url } from 'void/env'

export default defineEnv({
  CLOUDFLARE_ACCOUNT_ID: string(),
  CLOUDFLARE_D1_TOKEN: string(),
  CLOUDFLARE_DATABASE_ID: string(),
  GOOGLE_CLIENT_ID: string(),
  GOOGLE_CLIENT_SECRET: string(),
  SESSION_SECRET: string(),
  VITE_PUBLIC_URL: url(),
})
