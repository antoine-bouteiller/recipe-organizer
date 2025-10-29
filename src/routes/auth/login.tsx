import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useEffect } from 'react'
import { toast } from 'sonner'
import z from 'zod'

const getErrorMessage = (error: string) => {
  switch (error) {
    case 'signup_disabled': {
      return "Veuillez contacter l'administrateur pour vous inscrire"
    }
    default: {
      return 'Une erreur est survenue'
    }
  }
}

const LoginPage = () => {
  const { signInWithGoogle } = useAuth()

  const { error } = Route.useSearch()

  useEffect(() => {
    if (error) {
      toast.error(getErrorMessage(error))
    }
  }, [error])

  return (
    <div className="flex-1 grid place-items-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>Connectez-vous pour accéder au portail administrateur</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <Button variant="outline" className="w-full" onClick={signInWithGoogle}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Google_Favicon_2025.svg"
              alt="Google"
              className="h-4"
            />
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
