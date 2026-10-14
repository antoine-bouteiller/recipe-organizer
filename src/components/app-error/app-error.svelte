<script lang="ts">
  import type { Snippet } from 'svelte'

  import Button from '@/components/ui/actions/button/button.svelte'

  /** Recovery screen for a failed route load (`error`) or a render error; key it by pathname to reset. */
  const { children, error }: { children: Snippet; error?: unknown } = $props()
</script>

{#snippet failure(failed: unknown)}
  {@const details = import.meta.env.DEV && failed instanceof Error ? failed.message : undefined}
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

{#if error === undefined}
  <svelte:boundary>
    {@render children()}

    {#snippet failed(caught: unknown)}{@render failure(caught)}{/snippet}
  </svelte:boundary>
{:else}
  {@render failure(error)}
{/if}

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
