<script lang="ts">
  import type { Snippet } from 'svelte'

  import * as styles from './card.css'

  interface CardProps {
    children?: Snippet
    description?: Snippet
    title?: Snippet
  }
  const { children, description, title }: CardProps = $props()
</script>

<div class={styles.card} data-slot="card">
  {#if title !== undefined || description !== undefined}
    <div class={styles.header} data-slot="card-header">
      {#if title !== undefined}<div class={styles.title} data-slot="card-title">{@render title()}</div>{/if}
      {#if description !== undefined}<div class={styles.description} data-slot="card-description">{@render description()}</div>{/if}
    </div>
  {/if}
  {@render children?.()}
</div>
