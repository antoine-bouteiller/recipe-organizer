<script lang="ts">
  import type { Snippet } from 'svelte'

  const { children }: { readonly children: Snippet } = $props()
</script>

<div class="recipe-form-actions-actions">{@render children()}</div>

<style>
  .recipe-form-actions-actions {
    display: flex;
    flex-direction: column;
    gap: 16px;
    justify-content: flex-end;
    padding-top: 24px;
  }

  @media screen and (min-width: 768px) {
    .recipe-form-actions-actions {
      flex-direction: row;
    }
  }
</style>
