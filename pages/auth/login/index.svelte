<script lang="ts">
  import { auth } from 'void/client'

  import LoginLayout from '@/features/auth/client/components/login-layout.svelte'

  import type { Props } from './index.server'

  const { error }: Props = $props()

  const getErrorMessage = (code: string) => {
    if (code === 'account_pending') {
      return "Votre compte est en attente d'approbation par un administrateur"
    }
    if (code === 'account_blocked') {
      return 'Votre compte a été bloqué. Veuillez contacter un administrateur'
    }
    if (code === 'email_not_verified') {
      return "Votre adresse e-mail Google n'est pas vérifiée"
    }
    return 'Une erreur est survenue'
  }
</script>

<LoginLayout
  error={error ? getErrorMessage(error) : undefined}
  onSignIn={() => auth.signIn.social({ callbackURL: '/', errorCallbackURL: '/auth/login', provider: 'google' })}
/>
