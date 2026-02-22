import { ingredientCategoryIcons, ingredientCategoryLabels } from '@/features/ingredients/utils/constants'
import { typedEntriesOf } from '@/utils/object'

import { useShoppingList } from '../hooks/use-shopping-list'
import { CartItem } from './cart-item'

export const ShoppingList = () => {
  const { shoppingListIngredients } = useShoppingList()

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
