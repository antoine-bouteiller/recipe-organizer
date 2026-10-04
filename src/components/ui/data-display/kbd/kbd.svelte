<script lang="ts">
  import type { Snippet } from 'svelte'

  interface KbdProps {
    children?: Snippet
  }
  const { children }: KbdProps = $props()
</script>

<kbd class="kbd" data-slot="kbd">{@render children?.()}</kbd>

<style>
  .kbd {
    --owner-icon-size: 12px;
    align-items: center;
    background-color: var(--colors-secondary);
    border-radius: var(--radius-sm);
    color: var(--colors-secondary-foreground);
    display: inline-flex;
    font-family: var(--fonts-sans);
    font-size: var(--font-sizes-xs);
    font-weight: var(--font-weights-medium);
    gap: 4px;
    height: 20px;
    justify-content: center;
    min-width: 20px;
    padding-inline: 4px;
    pointer-events: none;
    -webkit-user-select: none;
    user-select: none;
  }
</style>
