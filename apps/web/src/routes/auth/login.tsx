import { LoginLayout } from '@client/features/auth/components/login-layout'
import { authClient } from '@client/lib/auth/auth-client'
import { loadAuthUser, resetAuthUserCache } from '@client/lib/auth/get-auth-user'
import { toastManager } from '@recipe-organizer/design-system/toast'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useEffect } from 'react'
import * as z from 'zod'

const searchSchema = z.object({ error: z.string().optional() })

const signInWithGoogle = () =>
  authClient.signIn.social({
    callbackURL: '/',
    errorCallbackURL: '/auth/login',
    provider: 'google',
  })

const getErrorMessage = (error: string) => {
  if (error === 'account_pending') {
    return "Votre compte est en attente d'approbation par un administrateur"
  }
  if (error === 'account_blocked') {
    return 'Votre compte a été bloqué. Veuillez contacter un administrateur'
  }
  if (error === 'email_not_verified') {
    return "Votre adresse e-mail Google n'est pas vérifiée"
  }
  return 'Une erreur est survenue'
}

const LoginPage = () => {
  const { error } = Route.useSearch()

  useEffect(() => {
    if (error) {
      toastManager.add({ description: getErrorMessage(error), type: 'error' })
    }
  }, [error])

  return <LoginLayout onSignIn={() => signInWithGoogle()} />
}

export const Route = createFileRoute('/auth/login')({
  // Re-checks uncached: a stale cached session would bounce a logged-out user off the login page forever.
  beforeLoad: async () => {
    resetAuthUserCache()

    if (await loadAuthUser()) {
      throw redirect({ to: '/' })
    }
  },
  component: LoginPage,
  validateSearch: (search) => searchSchema.parse(search),
})
