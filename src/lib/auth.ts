import { betterAuth } from 'better-auth'
import { APIError } from 'better-auth/api'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { reactStartCookies } from 'better-auth/react-start'
import { getDb } from './db'

import { magicLink } from 'better-auth/plugins'
import { formatEmail, sendEmail } from '@/lib/email-send'

import verifyEmail from '@/emails/verify-email.html?raw'

const ALLOWED_USERS = new Set(['anto.bouteiller@gmail.com', 'elisebayraktar@gmail.com'])

export const auth = betterAuth({
  database: prismaAdapter(getDb(), {
    provider: 'sqlite',
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

        const html = formatEmail(verifyEmail, { loginUrl: url })
        await sendEmail(email, 'Connexion à votre compte', html)
      },
    }),
  ],
})
