import { createFileRoute, redirect } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useEffect } from 'react'
import * as v from 'valibot'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toastManager } from '@/components/ui/toast'
import { initiateGoogleAuth } from '@/features/auth/api/google-auth'

const searchSchema = v.object({ error: v.optional(v.string()) })

const getErrorMessage = (error: string) => {
  if (error === 'signup_disabled') {
    return "Veuillez contacter l'administrateur pour vous inscrire"
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
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>Connectez-vous pour accéder au portail administrateur</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <Button className="w-full" onClick={() => login()} variant="outline">
            <img alt="Google" className="h-4" src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Google_Favicon_2025.svg" /> Connexion avec
            Google
          </Button>
        </CardContent>
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
