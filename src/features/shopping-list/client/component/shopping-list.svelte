<script lang="ts">
  import { ingredientCategoryIcons, ingredientCategoryLabels } from '@/components/ingredient-categories'
  import Button from '@/components/ui/actions/button/button.svelte'
  import { BasketIcon } from '@/components/ui/data-display/icons'
  import Skeleton from '@/components/ui/feedback/skeleton/skeleton.svelte'
  import { ingredientCategory } from '@/features/ingredients/categories'
  import { incrementalArray } from '@/utils/array'

  import { useShoppingList } from '../hooks/use-shopping-list.svelte'
  import CartItem from './cart-item.svelte'

  import * as styles from './shopping-list.css'

  const shoppingList = useShoppingList()
  const groups = $derived(
    Object.entries(shoppingList.current).flatMap(([key, ingredients]) => {
      const category = ingredientCategory.find((item) => item === key)
      return category && ingredients?.length ? [{ category, ingredients }] : []
    })
  )
</script>

<div class={styles.list}>
  {#if shoppingList.status === 'pending'}
    {#each incrementalArray({ length: 4 }) as index (index)}
      <div class={styles.container}>
        <Skeleton preset="shopping-list-title" />
        <div class={styles.loadingRows}>
          {#each incrementalArray({ length: 3 }) as innerIndex (innerIndex)}
            <Skeleton preset="shopping-list-row" />
          {/each}
        </div>
      </div>
    {/each}
  {:else if shoppingList.status === 'error'}
    <div class={styles.emptyState}>
      <p role="alert" class={styles.text}>Impossible de charger votre liste de courses. Veuillez réessayer.</p>
      <Button onclick={shoppingList.retry} variant="outline">Réessayer</Button>
    </div>
  {:else if groups.length === 0}
    <div class={styles.emptyState}>
      <div class={styles.emptyStateIcon}><BasketIcon size="xl" /></div>
      <p class={styles.text}>Votre liste de courses est vide</p>
      <p class={styles.emptyStateDescription}>Ajoutez des recettes depuis la recherche</p>
    </div>
  {:else}
    {#each groups as { category, ingredients } (category)}
      {@const Icon = ingredientCategoryIcons[category]}
      <div>
        <h2 class={styles.heading}><Icon />{ingredientCategoryLabels[category]}</h2>
        <div class={styles.categoryCard}>
          {#each ingredients as ingredient (ingredient.id)}
            <CartItem {ingredient} />
          {/each}
        </div>
      </div>
    {/each}
  {/if}
</div>
