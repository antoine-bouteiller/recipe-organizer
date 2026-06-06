import { ArrowLeftIcon } from '@phosphor-icons/react'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useEffect } from 'react'
import { z } from 'zod'

import { Button } from '@/components/common/button'
import { Card } from '@/components/common/card'
import { toastManager } from '@/components/common/toast'
import { initiateGoogleAuth } from '@/features/auth/api/google-auth'

const searchSchema = z.object({ error: z.string().optional() })

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

  const login = useServerFn(initiateGoogleAuth)

  return (
    <div className="grid flex-1 place-items-center p-4">
      <Card className="w-full max-w-sm">
        <Card.Header>
          <Card.Title>Connexion</Card.Title>
          <Card.Description>Connectez-vous pour accéder au portail administrateur</Card.Description>
        </Card.Header>
        <Card.Panel className="flex-1">
          <Button className="w-full" onClick={() => login()} variant="outline">
            <img alt="Google" className="h-4" src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Google_Favicon_2025.svg" /> Connexion avec
            Google
          </Button>
        </Card.Panel>
        <Card.Footer className="justify-center">
          <Button render={<Link to="/" />} size="sm" variant="ghost">
            <ArrowLeftIcon className="h-4 w-4" />
            Retour à l&apos;accueil
          </Button>
        </Card.Footer>
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
  validateSearch: (search) => searchSchema.parse(search),
})
