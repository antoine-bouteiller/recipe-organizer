<script module lang="ts">
  interface QuantityControlsProps {
    readonly recipeId: number
    readonly servings: number
    readonly variant?: 'default' | 'card'
  }
</script>

<script lang="ts">
  import Button from '@/components/ui/actions/button/button.svelte'
  import { MinusIcon, PlusIcon, TrashIcon } from '@/components/ui/data-display/icons'
  import { useIsInShoppingList } from '@/hooks/use-is-in-shopping-list.svelte'
  import { addToShoppingList, removeFromShoppingList } from '@/stores/shopping-list.store.svelte'

  import { useRecipeQuantities } from '../hooks/use-recipe-quantities.svelte'

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
    <div class="quantity-controls-container">
      <Button
        onclick={quantities.decrementQuantity}
        disabled={quantities.quantity === 1}
        aria-label="Retirer un couvert"
        size="icon-xs"
        variant="secondary"><MinusIcon weight="bold" /></Button
      >
      <span class="quantity-controls-text">{quantities.quantity} couverts</span>
      <Button onclick={quantities.incrementQuantity} aria-label="Ajouter un couvert" size="icon-xs" variant="secondary"
        ><PlusIcon weight="bold" /></Button
      >
      <Button onclick={() => removeFromShoppingList(recipeId)} aria-label="Retirer de la liste" size="icon-xs" variant="secondary"
        ><TrashIcon /></Button
      >
    </div>
  {/if}
{:else}
  <div class="quantity-controls-controls-container">
    <div class="quantity-controls-label-group">
      <span class="quantity-controls-controls-label">Couverts</span>
      <div class="quantity-controls-adjustment-controls">
        <Button
          disabled={quantities.quantity === 1}
          onclick={quantities.decrementQuantity}
          aria-label="Retirer un couvert"
          size="icon-sm"
          variant="outline"><MinusIcon /></Button
        >
        <span class="quantity-controls-quantity-display">{quantities.quantity}</span>
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

<style>
  .quantity-controls-container {
    align-items: center;
    background: var(--colors-primary);
    border-radius: var(--radius-xl);
    display: flex;
    gap: 10px;
    justify-content: center;
    padding: 4px;
    outline: 1;
    outline-color: var(--colors-primary);
    width: 100%;
  }

  .quantity-controls-text {
    color: var(--colors-inverse-foreground);
    font-size: var(--font-sizes-sm);
    font-variant-numeric: tabular-nums;
    font-weight: var(--font-weights-bold);
    min-width: 72px;
    text-align: center;
  }

  .quantity-controls-controls-container {
    align-items: center;
    background: var(--colors-card);
    border-radius: var(--radius-2xl);
    border-width: 1px;
    display: flex;
    gap: 12px;
    justify-content: space-between;
    padding: 8px;
    padding-left: 16px;
  }

  .quantity-controls-label-group {
    align-items: center;
    display: flex;
    gap: 12px;
  }

  .quantity-controls-controls-label {
    font-size: var(--font-sizes-sm);
    font-weight: var(--font-weights-bold);
  }

  .quantity-controls-adjustment-controls {
    align-items: center;
    display: flex;
    gap: 8px;
  }

  .quantity-controls-quantity-display {
    font-variant-numeric: tabular-nums;
    font-weight: var(--font-weights-bold);
    min-width: 20px;
    text-align: center;
  }
</style>
