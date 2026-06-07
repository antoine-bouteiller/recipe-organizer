import { Skeleton } from '@/components/ui/skeleton'
import { ingredientCategoryIcons, ingredientCategoryLabels } from '@/features/ingredients/utils/constants'
import { incrementalArray } from '@/utils/array'
import { typedEntriesOf } from '@/utils/object'

import { useShoppingList } from '../hooks/use-shopping-list'
import { CartItem } from './cart-item'

export const ShoppingList = () => {
  const { shoppingListIngredients, isLoading } = useShoppingList()

  if (isLoading) {
    return incrementalArray({ length: 4 }).map((index) => (
      <div className="space-y-2" key={index}>
        <Skeleton className="h-6 w-32" />
        <div className="space-y-2">
          {incrementalArray({ length: 3 }).map((innerIndex) => (
            <Skeleton className="h-8 w-full" key={innerIndex} />
          ))}
        </div>
      </div>
    ))
  }

  return typedEntriesOf(shoppingListIngredients).map(([key, ingredients]) => (
    <div className="space-y-2" key={key}>
      <h2 className="flex items-center gap-2 font-medium">
        {ingredientCategoryIcons[key]}
        {ingredientCategoryLabels[key]}
      </h2>
      {ingredients?.map((ingredient) => (
        <CartItem ingredient={ingredient} key={ingredient.id} />
      ))}
    </div>
  ))
}
