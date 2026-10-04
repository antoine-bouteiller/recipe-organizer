<script module lang="ts">
  export interface QuantityControlsProps {
    readonly recipeId: number
    readonly servings: number
    readonly variant?: 'default' | 'card'
  }
</script>

<script lang="ts">
  import Button from '@/components/ui/actions/button/button.svelte'
  import { MinusIcon, PlusIcon, TrashIcon } from '@/components/ui/data-display/icons/svelte'
  import { useIsInShoppingList } from '@/hooks/use-is-in-shopping-list.svelte'
  import { addToShoppingList, removeFromShoppingList } from '@/stores/shopping-list.store.svelte'

  import { useRecipeQuantities } from '../hooks/use-recipe-quantities.svelte'

  import * as styles from './quantity-controls.css'

  const { recipeId, servings, variant = 'default' }: QuantityControlsProps = $props()
  const membership = useIsInShoppingList(() => recipeId)
  const quantities = useRecipeQuantities(
    () => recipeId,
    () => servings
  )
</script>

{#if variant === 'card'}
  {#if !membership.current}
    <Button onclick={() => addToShoppingList(recipeId)} width="full"><PlusIcon weight="bold" />Ajouter à la liste</Button>
  {:else}
    <div class={styles.container}>
      <Button
        onclick={quantities.decrementQuantity}
        disabled={quantities.quantity === 1}
        aria-label="Retirer un couvert"
        size="icon-xs"
        variant="secondary"><MinusIcon weight="bold" /></Button
      >
      <span class={styles.text}>{quantities.quantity} couverts</span>
      <Button onclick={quantities.incrementQuantity} aria-label="Ajouter un couvert" size="icon-xs" variant="secondary"
        ><PlusIcon weight="bold" /></Button
      >
      <Button onclick={() => removeFromShoppingList(recipeId)} aria-label="Retirer de la liste" size="icon-xs" variant="secondary"
        ><TrashIcon /></Button
      >
    </div>
  {/if}
{:else}
  <div class={styles.controlsContainer}>
    <div class={styles.labelGroup}>
      <span class={styles.controlsLabel}>Couverts</span>
      <div class={styles.adjustmentControls}>
        <Button
          disabled={quantities.quantity === 1}
          onclick={quantities.decrementQuantity}
          aria-label="Retirer un couvert"
          size="icon-sm"
          variant="outline"><MinusIcon /></Button
        >
        <span class={styles.quantityDisplay}>{quantities.quantity}</span>
        <Button onclick={quantities.incrementQuantity} aria-label="Ajouter un couvert" size="icon-sm"><PlusIcon /></Button>
      </div>
    </div>
    {#if membership.current}
      <Button onclick={() => removeFromShoppingList(recipeId)} variant="destructive-outline"><TrashIcon />Retirer</Button>
    {:else}
      <Button onclick={() => addToShoppingList(recipeId)} variant="secondary"><PlusIcon weight="bold" />Ajouter</Button>
    {/if}
  </div>
{/if}
