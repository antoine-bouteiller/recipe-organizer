import arkenv from 'arkenv'
import { env as cloudflareEnv } from 'cloudflare:workers'

const validatedEnv = arkenv(
  {
    // Server vars
    GOOGLE_CLIENT_ID: /^[0-9]+-[a-zA-Z0-9]+.apps.googleusercontent.com$/,
    GOOGLE_CLIENT_SECRET: /^GOCSPX-[a-zA-Z0-9_-]+$/,
    SESSION_SECRET: 'string>=32',
    VITE_PUBLIC_URL: 'string',
  },
  {
    env: {
      GOOGLE_CLIENT_ID: cloudflareEnv.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: cloudflareEnv.GOOGLE_CLIENT_SECRET,
      SESSION_SECRET: cloudflareEnv.SESSION_SECRET,
      VITE_PUBLIC_URL: import.meta.env.VITE_PUBLIC_URL,
    },
  }
)

export const env = {
  ...validatedEnv,
  DB: cloudflareEnv.DB,
  IMAGES: cloudflareEnv.IMAGES,
  R2_BUCKET: cloudflareEnv.R2_BUCKET,
}
