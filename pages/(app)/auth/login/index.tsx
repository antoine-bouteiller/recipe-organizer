import { LoginLayout } from '@client/features/auth/components/login-layout'
import { authClient } from '@client/lib/auth/auth-client'

import type { Props } from './index.server'

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

export default function LoginPage({ error }: Props) {
  return (
    <LoginLayout
      error={error && getErrorMessage(error)}
      onSignIn={() => authClient.signIn.social({ callbackURL: '/', errorCallbackURL: '/auth/login', provider: 'google' })}
    />
  )
}
