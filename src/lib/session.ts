import { env } from '@/config/env'
import { useSession } from '@tanstack/react-start/server'

interface AppSessionData {
  userId?: string
}

interface OAuthSessionData {
  oauthState?: string
}

export const useAppSession = () =>
  useSession<AppSessionData>({
    name: 'app-session',
    password: env.SESSION_SECRET,
    cookie: {
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 7 days
    },
  })

export const useOAuthSession = () =>
  useSession<OAuthSessionData>({
    name: 'oauth-session',
    password: env.SESSION_SECRET,
    cookie: {
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      httpOnly: true,
    },
  })
