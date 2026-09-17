import { authClient } from '@client/lib/auth/auth-client'
import { loadAuthUser, resetAuthUserCache } from '@client/lib/auth/get-auth-user'
import { Button } from '@recipe-organizer/design-system/button'
import { Card } from '@recipe-organizer/design-system/card'
import { ArrowLeftIcon } from '@recipe-organizer/design-system/icons/arrow-left'
import { toastManager } from '@recipe-organizer/design-system/toast'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useEffect } from 'react'
import * as z from 'zod'

import * as styles from './login.css'

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
    <div className={styles.container}>
      <div className={styles.container2}>
        <Card description="Connectez-vous pour accéder à vos recettes" title="Connexion">
          <div className={styles.container3}>
            <Button onClick={() => signInWithGoogle()} variant="outline" width="full">
              <img alt="Google" className={styles.image} src="/google.svg" /> Connexion avec Google
            </Button>
          </div>
          <div className={styles.container4}>
            <Button render={<Link to="/" />} size="sm" variant="ghost">
              <ArrowLeftIcon size="sm" />
              Retour à l&apos;accueil
            </Button>
          </div>
        </Card>
      </div>
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
