import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { Loader2Icon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.email('Email invalide'),
})

const LoginPage = () => {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string>()
  const { signInWithMagicLink } = useAuth()

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '' },
  })

  if (form.formState.isSubmitted) {
    return (
      <div className="min-h-screen grid place-items-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>
              Un lien de connexion a été envoyé à votre email. Veuillez cliquer sur le lien pour
              vous connecter.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>Connectez-vous pour accéder à vos recettes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async ({ email }) => {
                setErrorMessage(undefined)
                const response = await signInWithMagicLink(email)
                if (response.error) {
                  setErrorMessage('Identifiants invalides. Veuillez réessayer.')
                } else {
                  navigate({ to: '/' })
                }
              })}
            >
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          autoComplete="email"
                          disabled={form.formState.isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {errorMessage && (
                  <p role="alert" className="text-sm text-destructive">
                    {errorMessage}
                  </p>
                )}
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Se connecter
                </Button>
              </div>
            </form>
          </Form>
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
})
