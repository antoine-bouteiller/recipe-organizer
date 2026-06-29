import { ArrowLeftIcon } from '@phosphor-icons/react'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useEffect } from 'react'
import * as v from 'valibot'

import { Card } from '@/components/common/card'
import { Button } from '@/components/ui/button'
import { toastManager } from '@/components/ui/toast'
import { authClient } from '@/lib/auth/auth-client'

const searchSchema = v.object({ error: v.optional(v.string()) })

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
  const searchParams = Route.useSearch()
  const { error } = searchParams as { error?: string }

  useEffect(() => {
    if (error) {
      toastManager.add({ description: getErrorMessage(error), type: 'error' })
    }
  }, [error])

  return (
    <div className="grid flex-1 place-items-center p-4">
      <Card
        className="w-full max-w-sm"
        description="Connectez-vous pour accéder au portail administrateur"
        footer={
          <Button render={<Link to="/" />} size="sm" variant="ghost">
            <ArrowLeftIcon className="h-4 w-4" />
            Retour à l&apos;accueil
          </Button>
        }
        footerClassName="justify-center"
        panelClassName="flex-1"
        title="Connexion"
      >
        <Button className="w-full" onClick={() => signInWithGoogle()} variant="outline">
          <img alt="Google" className="h-4" src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Google_Favicon_2025.svg" /> Connexion avec Google
        </Button>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/auth/login')({
  beforeLoad: ({ context }) => {
    if (context.authUser) {
      throw redirect({ to: '/' })
    }
  },
  component: LoginPage,
  validateSearch: (search) => v.parse(searchSchema, search),
})
