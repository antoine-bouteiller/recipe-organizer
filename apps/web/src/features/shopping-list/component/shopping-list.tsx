import { ingredientCategoryIcons, ingredientCategoryLabels } from '@client/components/ingredient-category'
import { css } from '@recipe-organizer/design-system/css'
import { BasketIcon } from '@recipe-organizer/design-system/icons/basket'
import { Skeleton } from '@recipe-organizer/design-system/skeleton'
import { ingredientCategory } from '@recipe-organizer/shared/ingredients/categories'
import { incrementalArray } from '@recipe-organizer/shared/utils/array'

import { useShoppingList } from '../hooks/use-shopping-list'
import { CartItem } from './cart-item'

export const ShoppingList = () => {
  const { shoppingListIngredients, isLoading } = useShoppingList()

  if (isLoading) {
    return incrementalArray({ length: 4 }).map((index) => (
      <div className={css({ display: 'flex', flexDirection: 'column', gap: '2' })} key={index}>
        <Skeleton preset="shopping-list-title" />
        <div className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
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
      <div
        className={css({
          alignItems: 'center',
          display: 'flex',
          flex: '1',
          flexDirection: 'column',
          gap: '3',
          justifyContent: 'center',
          padding: '8',
          textAlign: 'center',
        })}
      >
        <div
          className={css({
            alignItems: 'center',
            background: 'accent',
            borderRadius: 'full',
            color: 'primary',
            display: 'flex',
            height: '16',
            justifyContent: 'center',
            width: '16',
          })}
        >
          <BasketIcon size="xl" />
        </div>
        <p className={css({ fontWeight: 'medium', textWrap: 'balance' })}>Votre liste de courses est vide</p>
        <p className={css({ color: 'muted-foreground', fontSize: 'sm', textWrap: 'balance' })}>Ajoutez des recettes depuis la recherche</p>
      </div>
    )
  }

  return groups.map(({ category: key, ingredients }) => (
    <div key={key}>
      <h2
        className={css({
          alignItems: 'center',
          color: 'primary',
          display: 'flex',
          fontSize: '11px',
          fontWeight: 'semibold',
          gap: '1.5',
          letterSpacing: 'wider',
          marginBottom: '2',
          paddingInline: '1',
          textTransform: 'uppercase',
        })}
      >
        {ingredientCategoryIcons[key]}
        {ingredientCategoryLabels[key]}
      </h2>
      <div className={css({ background: 'card', borderRadius: '2xl', borderWidth: '1px', overflow: 'hidden', paddingInline: '3.5' })}>
        {ingredients?.map((ingredient) => (
          <CartItem ingredient={ingredient} key={ingredient.id} />
        ))}
      </div>
    </div>
  ))
}
