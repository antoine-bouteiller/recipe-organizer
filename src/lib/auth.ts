import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { APIError } from 'better-auth/api'
import { reactStartCookies } from 'better-auth/react-start'
import { getDb } from './db'

import { sendEmail } from '@/lib/email-send'
import { magicLink } from 'better-auth/plugins'

import { getVerifyEmail } from '@/emails/verify-email'

import * as schema from '@/lib/db/schema'

const ALLOWED_USERS = new Set(['anto.bouteiller@gmail.com', 'elisebayraktar@gmail.com'])

export const auth = betterAuth({
  database: drizzleAdapter(getDb(), {
    provider: 'sqlite',
    schema,
  }),
  plugins: [
    reactStartCookies(),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        if (!ALLOWED_USERS.has(email)) {
          throw new APIError('UNAUTHORIZED', {
            message: "Vous n'avez pas accès à cette application.",
          })
        }

        await sendEmail(email, 'Connexion à votre compte', await getVerifyEmail(url))
      },
    }),
  ],
})
