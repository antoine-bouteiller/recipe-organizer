import { createFileRoute, Link, redirect } from '@tanstack/solid-router'
import { createEffect } from 'solid-js'
import * as v from 'valibot'
import ArrowLeft from '~icons/ph/arrow-left'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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

  createEffect(() => {
    const { error } = searchParams() as { error?: string }
    if (error) {
      toastManager.add({ title: getErrorMessage(error), type: 'error' })
    }
  })

  return (
    <div class="grid flex-1 place-items-center p-4">
      <Card class="w-full max-w-sm" description="Connectez-vous pour accéder au portail administrateur" title="Connexion">
        <div class="px-6 pb-6">
          <Button class="w-full" onClick={() => signInWithGoogle()} variant="outline">
            <img alt="Google" class="h-4" src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Google_Favicon_2025.svg" /> Connexion avec Google
          </Button>
        </div>
        <div class="flex items-center justify-center px-6 pb-6">
          <Button as={Link} size="sm" to="/" variant="ghost">
            <ArrowLeft class="h-4 w-4" />
            Retour à l&apos;accueil
          </Button>
        </div>
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
