<script lang="ts">
  import type { Snippet } from 'svelte'

  import Button from '@/components/ui/actions/button/button.svelte'

  /** Recovery screen for render errors after client-side navigation between regular pages; key it by pathname to reset. */
  const { children }: { children: Snippet } = $props()
</script>

<svelte:boundary>
  {@render children()}

  {#snippet failed(error: unknown)}
    {@const details = import.meta.env.DEV && error instanceof Error ? error.message : undefined}
    <div class="root" role="alert">
      <h1 class="heading">Whoops!</h1>
      <div class="body">
        <h2 class="subheading">Une erreur est survenue</h2>
        <p>Une erreur est survenue lors du chargement de la page, nous vous suggérons de revenir à la page d'accueil.</p>
      </div>
      {#if details}
        <div class="details">
          <code>{details}</code>
        </div>
      {/if}
      <Button asLink href="/" size="lg">Retour à la page d'accueil</Button>
    </div>
  {/snippet}
</svelte:boundary>

<style>
  .root {
    align-items: center;
    display: flex;
    flex: 1 1 0%;
    flex-direction: column;
    gap: 24px;
    justify-content: center;
    min-width: 0;
    padding: 16px;
  }

  .heading {
    font-size: var(--font-sizes-5xl);
    font-weight: var(--font-weights-semibold);
  }

  .body {
    display: flex;
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }

  .subheading {
    font-size: var(--font-sizes-3xl);
    font-weight: var(--font-weights-semibold);
  }

  .details {
    border-color: var(--colors-destructive);
    border-radius: var(--radius-sm);
    border-width: 1px;
    color: var(--colors-destructive);
    font-size: var(--font-sizes-sm);
    padding: 4px;
  }
</style>
