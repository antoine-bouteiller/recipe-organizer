import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'

import { ScreenLayout } from '@/components/layout/screen-layout'
import { Button } from '@/components/ui/button'
import { ingredientCategoryIcons, ingredientCategoryLabels } from '@/features/ingredients/utils/ingredient-category'
import { CartItem } from '@/features/shopping-list/component/cart-item'
import { useShoppingListStore } from '@/features/shopping-list/hooks/use-shopping-list'
import { resetShoppingList } from '@/stores/shopping-list.store'
import { typedEntriesOf } from '@/utils/object'

const CartPage = () => {
  const { shoppingListIngredients } = useShoppingListStore()

  return (
    <ScreenLayout
      headerEndItem={
        <Button onClick={resetShoppingList} size="icon" variant="outline">
          <ArrowCounterClockwiseIcon className="size-4 text-primary" />
        </Button>
      }
      title="Liste de courses"
    >
      <div className="space-y-4 p-8">
        {typedEntriesOf(shoppingListIngredients).map(([key, ingredients]) => (
          <div className="space-y-2" key={key}>
            <h2 className="flex items-center gap-2 font-medium">
              {ingredientCategoryIcons[key]}
              {ingredientCategoryLabels[key]}
            </h2>
            {ingredients?.map((ingredient) => (
              <CartItem ingredient={ingredient} key={ingredient.id} />
            ))}
          </div>
        ))}
      </div>
    </ScreenLayout>
  )
}

export const Route = createFileRoute('/shopping-list')({
  component: CartPage,
})
