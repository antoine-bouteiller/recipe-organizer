<script lang="ts">
  import type { Snippet } from 'svelte'

  const { children }: { children: Snippet } = $props()
</script>

<main class="main-content">{@render children()}</main>

<style>
  .main-content {
    display: flex;
    flex: 1 1 0%;
    flex-direction: column;
    min-height: 0;
  }
  @media screen and (min-width: 768px) {
    .main-content {
      padding-bottom: 0;
    }
  }
</style>
