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

  if (isLoading) {
    return incrementalArray({ length: 4 }).map((index) => (
      <div className={styles.container} key={index}>
        <Skeleton preset="shopping-list-title" />
        <div className={styles.container2}>
          {incrementalArray({ length: 3 }).map((innerIndex) => (
            <Skeleton preset="shopping-list-row" key={innerIndex} />
          ))}
        </div>
      </div>
    ))
  }

  const groups = Object.entries(shoppingListIngredients).flatMap(([key, ingredients]) => {
    const category = ingredientCategory.find((item) => item === key)
    return category && ingredients?.length ? [{ category, ingredients }] : []
  })

  if (groups.length === 0) {
    return (
      <div className={styles.container3}>
        <div className={styles.container4}>
          <BasketIcon size="xl" />
        </div>
        <p className={styles.text}>Votre liste de courses est vide</p>
        <p className={styles.text2}>Ajoutez des recettes depuis la recherche</p>
      </div>
    )
  }

  return groups.map(({ category: key, ingredients }) => (
    <div key={key}>
      <h2 className={styles.heading}>
        {ingredientCategoryIcons[key]}
        {ingredientCategoryLabels[key]}
      </h2>
      <div className={styles.container5}>
        {ingredients?.map((ingredient) => (
          <CartItem ingredient={ingredient} key={ingredient.id} />
        ))}
      </div>
    </div>
  ))
}
