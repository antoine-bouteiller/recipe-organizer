import { Suspense } from 'react'

import { ingredientCategoryIcons, ingredientCategoryLabels } from '@/components/ingredient-category'
import { BasketIcon } from '@/design-system/ui/data-display/icons'
import { Skeleton } from '@/design-system/ui/feedback/skeleton/skeleton'
import { ingredientCategory } from '@/features/ingredients/categories'
import { useIsHydrated } from '@/hooks/use-is-hydrated'
import { incrementalArray } from '@/utils/array'

import { useShoppingList } from '../hooks/use-shopping-list'
import { CartItem } from './cart-item'

import * as styles from './shopping-list.css'

const ShoppingListSkeleton = () =>
  incrementalArray({ length: 4 }).map((index) => (
    <div className={styles.container} key={index}>
      <Skeleton preset="shopping-list-title" />
      <div className={styles.loadingRows}>
        {incrementalArray({ length: 3 }).map((innerIndex) => (
          <Skeleton preset="shopping-list-row" key={innerIndex} />
        ))}
      </div>
    </div>
  ))

const ShoppingListGroups = () => {
  const shoppingListIngredients = useShoppingList()

  const groups = Object.entries(shoppingListIngredients).flatMap(([key, ingredients]) => {
    const category = ingredientCategory.find((item) => item === key)
    return category && ingredients?.length ? [{ category, ingredients }] : []
  })

  if (groups.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateIcon}>
          <BasketIcon size="xl" />
        </div>
        <p className={styles.text}>Votre liste de courses est vide</p>
        <p className={styles.emptyStateDescription}>Ajoutez des recettes depuis la recherche</p>
      </div>
    )
  }

  return groups.map(({ category: key, ingredients }) => (
    <div key={key}>
      <h2 className={styles.heading}>
        {ingredientCategoryIcons[key]}
        {ingredientCategoryLabels[key]}
      </h2>
      <div className={styles.categoryCard}>
        {ingredients.map((ingredient) => (
          <CartItem ingredient={ingredient} key={ingredient.id} />
        ))}
      </div>
    </div>
  ))
}

export const ShoppingList = () => {
  // The selection lives in localStorage, which server HTML cannot know.
  const isHydrated = useIsHydrated()

  return (
    <div className={styles.list}>
      {isHydrated ? (
        <Suspense fallback={<ShoppingListSkeleton />}>
          <ShoppingListGroups />
        </Suspense>
      ) : (
        <ShoppingListSkeleton />
      )}
    </div>
  )
}
