<script lang="ts">
  import type { Snippet } from 'svelte'

  import Button from '@/components/ui/actions/button/button.svelte'

  import * as styles from './app-error.css'

  /** Recovery screen for render errors after client-side navigation between regular pages; key it by pathname to reset. */
  const { children }: { children: Snippet } = $props()
</script>

<svelte:boundary>
  {@render children()}

  {#snippet failed(error: unknown)}
    {@const details = import.meta.env.DEV && error instanceof Error ? error.message : undefined}
    <div class={styles.root} role="alert">
      <h1 class={styles.heading}>Whoops!</h1>
      <div class={styles.body}>
        <h2 class={styles.subheading}>Une erreur est survenue</h2>
        <p>Une erreur est survenue lors du chargement de la page, nous vous suggérons de revenir à la page d'accueil.</p>
      </div>
      {#if details}
        <div class={styles.details}>
          <code>{details}</code>
        </div>
      {/if}
      <Button asLink href="/" size="lg">Retour à la page d'accueil</Button>
    </div>
  {/snippet}
</svelte:boundary>
