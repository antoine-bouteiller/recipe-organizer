import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppForm } from '@/hooks/use-app-form'
import { useAuth } from '@/hooks/use-auth'
import { revalidateLogic } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.email('Email invalide'),
})

export const Login = () => {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string>()
  const { signInWithMagicLink } = useAuth()

  const { state, handleSubmit, AppField, FormSubmit, AppForm } = useAppForm({
    validators: {
      onDynamic: loginSchema,
    },
    validationLogic: revalidateLogic(),
    defaultValues: { email: '' },
    onSubmit: async (data) => {
      setErrorMessage(undefined)
      const response = await signInWithMagicLink(data.value.email)
      if (response.error) {
        setErrorMessage('Identifiants invalides. Veuillez réessayer.')
      } else {
        await navigate({ to: '/' })
      }
    },
  })

  if (state.isSubmitted && !errorMessage) {
    return (
      <div className="h-full grid place-items-center p-4">
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
    <div className="h-full grid place-items-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>Connectez-vous pour accéder à vos recettes.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void handleSubmit()
            }}
            className="grid gap-4"
          >
            <AppField name="email">{({ TextField }) => <TextField label="Email" />}</AppField>
            {errorMessage && (
              <p role="alert" className="text-sm text-destructive">
                {errorMessage}
              </p>
            )}
            <AppForm>
              <FormSubmit label="Se connecter" />
            </AppForm>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
