import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { initiateGoogleAuth } from '@/features/auth/api/google-auth'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useEffect } from 'react'
import { toast } from 'sonner'
import z from 'zod'

const getErrorMessage = (error: string) => {
  if (error === 'signup_disabled') {
    return "Veuillez contacter l'administrateur pour vous inscrire"
  }
  return 'Une erreur est survenue'
}

const LoginPage = () => {
  const { error } = Route.useSearch()

  useEffect(() => {
    if (error) {
      toast.error(getErrorMessage(error))
    }
  }, [error])

  const login = useServerFn(initiateGoogleAuth)

  return (
    <div className="flex-1 grid place-items-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>Connectez-vous pour accéder au portail administrateur</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <Button variant="outline" className="w-full" onClick={() => login()}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Google_Favicon_2025.svg"
              alt="Google"
              className="h-4"
            />{' '}
            Connexion avec Google
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
  validateSearch: z.object({ error: z.string().optional() }),
  component: LoginPage,
})
