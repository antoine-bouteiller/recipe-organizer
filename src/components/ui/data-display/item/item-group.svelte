<script lang="ts">
  import type { Snippet } from 'svelte'

  interface ItemGroupProps {
    children?: Snippet
  }
  const { children }: ItemGroupProps = $props()
</script>

<div class="group" data-slot="item-group" role="list">{@render children?.()}</div>

<style>
  .group {
    display: flex;
    flex-direction: column;
  }
</style>
