import { env } from '@/config/env'
import { getDb } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { useAppSession, useOAuthSession } from '@/lib/session'
import { redirect } from '@tanstack/react-router'
import { createServerFn, createServerOnlyFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { type AuthError } from './constants'

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo'

const generateState = (): string => {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export const redirectWithError = (errorMessage: AuthError) => {
  throw redirect({
    to: '/auth/login',
    search: {
      error: errorMessage,
    },
  })
}

export const initiateGoogleAuth = createServerFn({ method: 'POST' }).handler(async () => {
  const state = generateState()
  const redirectUri = `${env.VITE_PUBLIC_URL}/api/auth/google/callback`

  const searchParams = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'online',
    prompt: 'select_account',
  })

  const session = await useOAuthSession()

  await session.update({ oauthState: state })

  throw redirect({
    href: `https://accounts.google.com/o/oauth2/v2/auth?${searchParams.toString()}`,
  })
})

export const handleGoogleCallback = createServerOnlyFn(async (code: string, state: string) => {
  if (!code || !state) {
    throw redirectWithError('invalid_state')
  }

  const oAuthSession = await useOAuthSession()

  if (!oAuthSession.data.oauthState || oAuthSession.data.oauthState !== state) {
    throw redirectWithError('invalid_state')
  }

  const redirectUri = `${env.VITE_PUBLIC_URL}/api/auth/google/callback`

  // Exchange code for tokens
  const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  if (!tokenResponse.ok) {
    throw redirectWithError('error_communicating_with_google')
  }

  const tokens = await tokenResponse.json()
  const accessToken = (tokens as { access_token?: string }).access_token

  if (!accessToken) {
    throw redirectWithError('error_communicating_with_google')
  }

  // Fetch user info
  const userInfoResponse = await fetch(GOOGLE_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!userInfoResponse.ok) {
    throw redirectWithError('error_communicating_with_google')
  }

  const userInfoData = await userInfoResponse.json()
  const userInfo = userInfoData as {
    id?: string
    email?: string
    name?: string
    picture?: string
  }

  if (!userInfo.id || !userInfo.email || !userInfo.name) {
    throw redirectWithError('error_communicating_with_google')
  }

  // Find or create user
  const existingUser = await getDb().query.user.findFirst({
    where: eq(user.email, userInfo.email),
  })

  if (!existingUser) {
    throw redirectWithError('signup_disabled')
  }

  // Create session
  const session = await useAppSession()

  await session.update({ userId: existingUser.id })

  return existingUser
})
