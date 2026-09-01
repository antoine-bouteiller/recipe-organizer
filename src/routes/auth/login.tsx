import { ArrowLeftIcon } from '@phosphor-icons/react'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useEffect } from 'react'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toastManager } from '@/components/ui/toast'
import { authClient } from '@/lib/auth/auth-client'
import { loadAuthUser, resetAuthUserCache } from '@/lib/auth/get-auth-user'

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

  return (
    <div className="grid flex-1 place-items-center p-4">
      <Card className="w-full max-w-sm" description="Connectez-vous pour accéder à vos recettes" title="Connexion">
        <div className="px-6 pb-6">
          <Button className="w-full" onClick={() => signInWithGoogle()} variant="outline">
            <img alt="Google" className="h-4" src="/google.svg" /> Connexion avec Google
          </Button>
        </div>
        <div className="flex items-center justify-center px-6 pb-6">
          <Button render={<Link to="/" />} size="sm" variant="ghost">
            <ArrowLeftIcon className="h-4 w-4" />
            Retour à l&apos;accueil
          </Button>
        </div>
      </Card>
    </div>
  )
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
