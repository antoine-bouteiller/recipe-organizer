import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { reactStartCookies } from 'better-auth/react-start'
import { getDb } from './db'

import * as schema from '@/lib/db/schema'
import { env } from 'cloudflare:workers'

export const auth = betterAuth({
  database: drizzleAdapter(getDb(), {
    provider: 'sqlite',
    schema,
  }),
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      disableSignUp: true,
    },
  },
  plugins: [reactStartCookies()],
})
