<script lang="ts">
  import type { Snippet } from 'svelte'

  interface KbdGroupProps {
    children?: Snippet
  }
  const { children }: KbdGroupProps = $props()
</script>

<kbd class="group" data-slot="kbd-group">{@render children?.()}</kbd>

<style>
  .group {
    align-items: center;
    display: inline-flex;
    gap: 4px;
  }
</style>
