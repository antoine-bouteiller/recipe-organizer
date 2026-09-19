import { ingredientCategoryIcons, ingredientCategoryLabels } from '@client/components/ingredient-category'
import { BasketIcon } from '@recipe-organizer/design-system/icons/basket'
import { Skeleton } from '@recipe-organizer/design-system/skeleton'
import { ingredientCategory } from '@recipe-organizer/shared/ingredients/categories'
import { incrementalArray } from '@recipe-organizer/shared/utils/array'

import { useShoppingList } from '../hooks/use-shopping-list'
import { CartItem } from './cart-item'

import * as styles from './shopping-list.css'

export const ShoppingList = () => {
  const { shoppingListIngredients, isLoading } = useShoppingList()

  const groups = Object.entries(shoppingListIngredients ?? {}).flatMap(([key, ingredients]) => {
    const category = ingredientCategory.find((item) => item === key)
    return category && ingredients?.length ? [{ category, ingredients }] : []
  })

  return (
    <div className={styles.list}>
      {isLoading &&
        incrementalArray({ length: 4 }).map((index) => (
          <div className={styles.container} key={index}>
            <Skeleton preset="shopping-list-title" />
            <div className={styles.loadingRows}>
              {incrementalArray({ length: 3 }).map((innerIndex) => (
                <Skeleton preset="shopping-list-row" key={innerIndex} />
              ))}
            </div>
          </div>
        ))}
      {!isLoading && groups.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>
            <BasketIcon size="xl" />
          </div>
          <p className={styles.text}>Votre liste de courses est vide</p>
          <p className={styles.emptyStateDescription}>Ajoutez des recettes depuis la recherche</p>
        </div>
      )}
      {!isLoading &&
        groups.map(({ category: key, ingredients }) => (
          <div key={key}>
            <h2 className={styles.heading}>
              {ingredientCategoryIcons[key]}
              {ingredientCategoryLabels[key]}
            </h2>
            <div className={styles.categoryCard}>
              {ingredients?.map((ingredient) => (
                <CartItem ingredient={ingredient} key={ingredient.id} />
              ))}
            </div>
          </div>
        ))}
    </div>
  )
}
