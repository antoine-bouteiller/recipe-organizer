<script lang="ts">
  import type { Snippet } from 'svelte'

  interface CardProps {
    children?: Snippet
    description?: Snippet
    title?: Snippet
  }
  const { children, description, title }: CardProps = $props()
</script>

<div class="card" data-slot="card">
  {#if title !== undefined || description !== undefined}
    <div class="header" data-slot="card-header">
      {#if title !== undefined}<div class="title" data-slot="card-title">{@render title()}</div>{/if}
      {#if description !== undefined}<div class="description" data-slot="card-description">{@render description()}</div>{/if}
    </div>
  {/if}
  {@render children?.()}
</div>

<style>
  .card {
    background-clip: padding-box;
    -webkit-background-clip: padding-box;
    background-color: var(--colors-card);
    border-radius: var(--radius-2xl);
    border-width: 1px;
    color: var(--colors-card-foreground);
    display: flex;
    flex-direction: column;
    position: relative;
    box-shadow: var(--shadows-xs);
  }
  :global(.dark) .card {
    background-clip: border-box;
    -webkit-background-clip: border-box;
  }

  .header {
    align-items: start;
    display: grid;
    gap: 6px;
    grid-auto-rows: min-content;
    grid-template-rows: auto auto;
    padding: 24px;
  }

  .title {
    font-size: var(--font-sizes-lg);
    font-weight: var(--font-weights-semibold);
    line-height: var(--line-heights-none);
  }

  .description {
    color: var(--colors-muted-foreground);
    font-size: var(--font-sizes-sm);
  }
</style>
