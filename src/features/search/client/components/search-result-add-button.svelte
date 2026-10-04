<script lang="ts">
  import Button from '@/components/ui/actions/button/button.svelte'
  import { CheckIcon, PlusIcon } from '@/components/ui/data-display/icons'
  import { useIsInShoppingList } from '@/hooks/use-is-in-shopping-list.svelte'
  import { addToShoppingList } from '@/stores/shopping-list.store.svelte'

  import * as styles from './search-results.css'

  const { recipeId }: { recipeId: number } = $props()
  const isInShoppingList = useIsInShoppingList(() => recipeId)
</script>

{#if isInShoppingList.current}
  <span aria-label="Déjà dans la liste" class={styles.text}><CheckIcon weight="bold" /></span>
{:else}
  <span class={styles.addAction}>
    <Button aria-label="Ajouter à la liste" onclick={() => addToShoppingList(recipeId)} size="icon"><PlusIcon weight="bold" /></Button>
  </span>
{/if}
