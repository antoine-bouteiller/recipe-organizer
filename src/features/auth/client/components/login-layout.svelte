<script lang="ts">
  import Button from '@/components/ui/actions/button/button.svelte'
  import Card from '@/components/ui/data-display/card/card.svelte'
  import { ArrowLeftIcon } from '@/components/ui/data-display/icons'
  import { alertError } from '@/lib/client/alert-error'

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

<div class="login-layout-container">
  <div class="login-layout-form-container">
    <Card>
      {#snippet title()}Connexion{/snippet}
      {#snippet description()}Connectez-vous pour accéder à vos recettes{/snippet}
      <div class="login-layout-sign-in-button-container">
        {#if error}<p class="login-layout-error">{error}</p>{/if}
        <Button onclick={handleSignIn} disabled={pending} variant="outline" width="full"
          ><img alt="Google" class="login-layout-image" src="/google.svg" /> Connexion avec Google</Button
        >
      </div>
      <div class="login-layout-back-link-container">
        <Button asLink href="/" size="sm" variant="ghost"><ArrowLeftIcon size="sm" />Retour à l'accueil</Button>
      </div>
    </Card>
  </div>
</div>

<style>
  .login-layout-container {
    display: grid;
    flex: 1 1 0%;
    padding: 16px;
    place-items: center;
  }

  .login-layout-form-container {
    max-width: 384px;
    width: 100%;
  }

  .login-layout-sign-in-button-container {
    padding-bottom: 24px;
    padding-inline: 24px;
  }

  .login-layout-error {
    color: var(--colors-destructive-foreground);
    font-size: var(--font-sizes-sm);
    padding-bottom: 16px;
  }

  .login-layout-image {
    height: 16px;
  }

  .login-layout-back-link-container {
    align-items: center;
    display: flex;
    justify-content: center;
    padding-bottom: 24px;
    padding-inline: 24px;
  }
</style>
