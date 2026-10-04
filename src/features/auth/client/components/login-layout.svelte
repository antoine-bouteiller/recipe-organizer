<script lang="ts">
  import Button from '@/components/ui/actions/button/button.svelte'
  import Card from '@/components/ui/data-display/card/card.svelte'
  import { ArrowLeftIcon } from '@/components/ui/data-display/icons/svelte'
  import { alertError } from '@/lib/client/alert-error'

  import * as styles from './login-layout.css'

  const { error, onSignIn }: { error?: string; onSignIn: () => void | Promise<unknown> } = $props()
  let pending = $state(false)
  const handleSignIn = async () => {
    if (pending) {
      return
    }
    pending = true
    try {
      await onSignIn()
    } catch (signInError) {
      alertError('Erreur lors de la connexion avec Google', signInError)
    } finally {
      pending = false
    }
  }
</script>

<div class={styles.container}>
  <div class={styles.formContainer}>
    <Card>
      {#snippet title()}Connexion{/snippet}
      {#snippet description()}Connectez-vous pour accéder à vos recettes{/snippet}
      <div class={styles.signInButtonContainer}>
        {#if error}<p class={styles.error}>{error}</p>{/if}
        <Button onclick={handleSignIn} disabled={pending} variant="outline" width="full"
          ><img alt="Google" class={styles.image} src="/google.svg" /> Connexion avec Google</Button
        >
      </div>
      <div class={styles.backLinkContainer}>
        <Button asLink href="/" size="sm" variant="ghost"><ArrowLeftIcon size="sm" />Retour à l'accueil</Button>
      </div>
    </Card>
  </div>
</div>
