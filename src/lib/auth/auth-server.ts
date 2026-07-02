import { account, session, user, verification } from '@schema'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { APIError } from 'better-auth/api'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { env } from 'cloudflare:workers'

import { getDb } from '@/lib/db'

// Better Auth must be instantiated per request: the Cloudflare `env` binding and
// The D1 database are only available inside a request scope on Workers.
export const getAuth = () => {
  const db = getDb()

  return betterAuth({
    baseURL: import.meta.env.VITE_PUBLIC_URL,
    database: drizzleAdapter(db, {
      provider: 'sqlite',
      schema: { account, session, user, verification },
    }),
    databaseHooks: {
      session: {
        create: {
          // New accounts require admin approval; blocked accounts are denied.
          // Throwing here aborts the OAuth callback, which redirects to
          // `errorCallbackURL?error=<code>` (read by the login page).
          before: async (newSession) => {
            const existing = await db.query.user.findFirst({
              where: { id: newSession.userId },
            })

            if (existing?.status === 'blocked') {
              throw new APIError('FORBIDDEN', { code: 'account_blocked', message: 'Account blocked' })
            }

            if (existing?.status === 'pending') {
              throw new APIError('FORBIDDEN', { code: 'account_pending', message: 'Account pending approval' })
            }
          },
        },
      },
      user: {
        create: {
          // New sign-ups land in `pending` until an admin approves them.
          before: async (newUser) => ({ data: { ...newUser, status: 'pending' as const } }),
        },
      },
    },
    plugins: [tanstackStartCookies()],
    secret: env.SESSION_SECRET,
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
    user: {
      additionalFields: {
        role: { defaultValue: 'user', input: false, required: false, type: 'string' },
        status: { defaultValue: 'active', input: false, required: false, type: 'string' },
      },
    },
  })
}
