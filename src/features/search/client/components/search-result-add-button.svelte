<script lang="ts">
  import Button from '@/components/ui/actions/button/button.svelte'
  import { CheckIcon, PlusIcon } from '@/components/ui/data-display/icons'
  import { useIsInShoppingList } from '@/hooks/use-is-in-shopping-list.svelte'
  import { addToShoppingList } from '@/stores/shopping-list.store.svelte'

  const { recipeId }: { recipeId: number } = $props()
  const isInShoppingList = useIsInShoppingList(() => recipeId)
</script>

{#if isInShoppingList.current}
  <span aria-label="Déjà dans la liste" class="search-results-text"><CheckIcon weight="bold" /></span>
{:else}
  <span class="search-results-add-action">
    <Button aria-label="Ajouter à la liste" onclick={() => addToShoppingList(recipeId)} size="icon"><PlusIcon weight="bold" /></Button>
  </span>
{/if}

<style>
  .search-results-text {
    align-items: center;
    background: var(--colors-accent);
    border-radius: var(--radius-full);
    color: var(--colors-primary);
    display: flex;
    flex-shrink: 0;
    height: 36px;
    justify-content: center;
    width: 36px;
  }

  .search-results-add-action {
    --owner-icon-size: 16px;
    flex-shrink: 0;
  }
</style>
