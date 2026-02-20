import { useSession } from '@tanstack/react-start/server'
import { env } from 'cloudflare:workers'

interface AppSessionData {
  userId?: string
}

interface OAuthSessionData {
  oauthState?: string
}

export const useAppSession = () =>
  useSession<AppSessionData>({
    cookie: {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 7 days
      sameSite: 'lax',
      secure: import.meta.env.PROD,
    },
    name: 'app-session',
    password: env.SESSION_SECRET,
  })

export const useOAuthSession = () =>
  useSession<OAuthSessionData>({
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: import.meta.env.PROD,
    },
    name: 'oauth-session',
    password: env.SESSION_SECRET,
  })
