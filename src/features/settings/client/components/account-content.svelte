<script lang="ts">
  import { auth } from 'void/client'

  import Button from '@/components/ui/actions/button/button.svelte'
  import Card from '@/components/ui/data-display/card/card.svelte'
  import { alertError } from '@/lib/client/alert-error'

  import * as styles from './account-content.css'

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

<div class={styles.pageContent}>
  <Card
    ><div class={styles.cardContent}>
      <div>
        <h2 class={styles.heading}>Informations du compte</h2>
        <div class={styles.accountDetails}>
          <div>
            <p class={styles.label}>Email</p>
            <p class={styles.email}>{email}</p>
          </div>
        </div>
      </div>
      <div class={styles.actions}>
        <h2 class={styles.heading}>Actions</h2>
        <Button onclick={handleLogout} disabled={pending} variant="outline">Se déconnecter</Button>
      </div>
    </div></Card
  >
</div>
