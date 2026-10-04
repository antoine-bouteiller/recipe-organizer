<script lang="ts">
  import { auth } from 'void/client'

  import Button from '@/components/ui/actions/button/button.svelte'
  import Card from '@/components/ui/data-display/card/card.svelte'
  import { alertError } from '@/lib/client/alert-error'

  const { email }: { readonly email?: string } = $props()
  let pending = $state(false)
  const handleLogout = async () => {
    if (pending) {
      return
    }
    pending = true
    try {
      const result = await auth.signOut()
      if (result.error) {
        throw new Error(result.error.message ?? 'Une erreur est survenue')
      }
      globalThis.location.assign('/auth/login')
    } catch (error) {
      alertError('Erreur lors de la déconnexion', error)
    } finally {
      pending = false
    }
  }
</script>

<div class="account-content-page-content">
  <Card
    ><div class="account-content-card-content">
      <div>
        <h2 class="account-content-heading">Informations du compte</h2>
        <div class="account-content-account-details">
          <div>
            <p class="account-content-label">Email</p>
            <p class="account-content-email">{email}</p>
          </div>
        </div>
      </div>
      <div class="account-content-actions">
        <h2 class="account-content-heading">Actions</h2>
        <Button onclick={handleLogout} disabled={pending} variant="outline">Se déconnecter</Button>
      </div>
    </div></Card
  >
</div>

<style>
  .account-content-page-content {
    padding: 24px;
  }

  .account-content-card-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px;
  }

  .account-content-heading {
    font-size: var(--font-sizes-lg);
    font-weight: var(--font-weights-semibold);
    margin-bottom: 16px;
  }

  .account-content-account-details {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .account-content-label {
    color: var(--colors-muted-foreground);
    font-size: var(--font-sizes-sm);
    font-weight: var(--font-weights-medium);
  }

  .account-content-email {
    font-size: var(--font-sizes-sm);
    margin-top: 4px;
  }

  .account-content-actions {
    border-top-width: 1px;
    padding-top: 24px;
  }
</style>
