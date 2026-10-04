<script lang="ts">
  import { ingredientCategoryIcons, ingredientCategoryLabels } from '@/components/ingredient-categories'
  import Button from '@/components/ui/actions/button/button.svelte'
  import { BasketIcon } from '@/components/ui/data-display/icons'
  import Skeleton from '@/components/ui/feedback/skeleton/skeleton.svelte'
  import { ingredientCategory } from '@/features/ingredients/categories'
  import { incrementalArray } from '@/utils/array'

  import { useShoppingList } from '../hooks/use-shopping-list.svelte'
  import CartItem from './cart-item.svelte'

  const shoppingList = useShoppingList()
  const groups = $derived(
    Object.entries(shoppingList.current).flatMap(([key, ingredients]) => {
      const category = ingredientCategory.find((item) => item === key)
      return category && ingredients?.length ? [{ category, ingredients }] : []
    })
  )
</script>

<div class="shopping-list-list">
  {#if shoppingList.status === 'pending'}
    {#each incrementalArray({ length: 4 }) as index (index)}
      <div class="shopping-list-container">
        <Skeleton preset="shopping-list-title" />
        <div class="shopping-list-loading-rows">
          {#each incrementalArray({ length: 3 }) as innerIndex (innerIndex)}
            <Skeleton preset="shopping-list-row" />
          {/each}
        </div>
      </div>
    {/each}
  {:else if shoppingList.status === 'error'}
    <div class="shopping-list-empty-state">
      <p role="alert" class="shopping-list-text">Impossible de charger votre liste de courses. Veuillez réessayer.</p>
      <Button onclick={shoppingList.retry} variant="outline">Réessayer</Button>
    </div>
  {:else if groups.length === 0}
    <div class="shopping-list-empty-state">
      <div class="shopping-list-empty-state-icon"><BasketIcon size="xl" /></div>
      <p class="shopping-list-text">Votre liste de courses est vide</p>
      <p class="shopping-list-empty-state-description">Ajoutez des recettes depuis la recherche</p>
    </div>
  {:else}
    {#each groups as { category, ingredients } (category)}
      {@const Icon = ingredientCategoryIcons[category]}
      <div>
        <h2 class="shopping-list-heading"><Icon />{ingredientCategoryLabels[category]}</h2>
        <div class="shopping-list-category-card">
          {#each ingredients as ingredient (ingredient.id)}
            <CartItem {ingredient} />
          {/each}
        </div>
      </div>
    {/each}
  {/if}
</div>

<style>
  .shopping-list-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .shopping-list-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .shopping-list-loading-rows {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .shopping-list-empty-state {
    align-items: center;
    display: flex;
    flex: 1 1 0%;
    flex-direction: column;
    gap: 12px;
    justify-content: center;
    padding: 32px;
    text-align: center;
  }

  .shopping-list-text {
    font-weight: var(--font-weights-medium);
    text-wrap: balance;
  }

  .shopping-list-empty-state-icon {
    align-items: center;
    background: var(--colors-accent);
    border-radius: var(--radius-full);
    color: var(--colors-primary);
    display: flex;
    height: 64px;
    justify-content: center;
    width: 64px;
  }

  .shopping-list-empty-state-description {
    color: var(--colors-muted-foreground);
    font-size: var(--font-sizes-sm);
    text-wrap: balance;
  }

  .shopping-list-heading {
    align-items: center;
    color: var(--colors-primary);
    display: flex;
    font-size: var(--font-sizes-xs);
    font-weight: var(--font-weights-semibold);
    gap: 6px;
    letter-spacing: var(--letter-spacings-wider);
    margin-bottom: 8px;
    padding-inline: 4px;
    text-transform: uppercase;
  }

  .shopping-list-category-card {
    background: var(--colors-card);
    border-radius: var(--radius-2xl);
    border-width: 1px;
    overflow: hidden;
    padding-inline: 14px;
  }
</style>
