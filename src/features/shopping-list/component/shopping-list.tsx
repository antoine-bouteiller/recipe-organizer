import { ingredientCategoryIcons, ingredientCategoryLabels } from '@/components/ingredient-category'
import { Skeleton } from '@/components/ui/skeleton'
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
    <div key={key}>
      <h2 className="mb-2 flex items-center gap-1.5 px-1 text-[11px] font-semibold tracking-wider text-primary uppercase">
        {ingredientCategoryIcons[key]}
        {ingredientCategoryLabels[key]}
      </h2>
      <div className="overflow-hidden rounded-2xl border bg-card px-3.5">
        {ingredients?.map((ingredient) => (
          <CartItem ingredient={ingredient} key={ingredient.id} />
        ))}
      </div>
    </div>
  ))
}
