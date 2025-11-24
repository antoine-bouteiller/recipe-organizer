import { ScreenLayout } from '@/components/layout/screen-layout'
import { Button } from '@/components/ui/button'
import { CartItem } from '@/features/shopping-list/component/cart-item'
import { useShoppingListStore } from '@/features/shopping-list/hooks/use-shopping-list'
import { resetShoppingList } from '@/stores/shopping-list.store'
import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'

const CartPage = () => {
  const { shoppingListIngredients } = useShoppingListStore()

  return (
    <ScreenLayout
      title="Liste de courses"
      headerEndItem={
        <Button variant="outline" size="icon" onClick={resetShoppingList}>
          <ArrowCounterClockwiseIcon className="sier-4 text-primary" />
        </Button>
      }
    >
      <div className="p-8 space-y-4">
        {Object.entries(shoppingListIngredients).map(([key, ingredients]) => (
          <div className="space-y-2" key={key}>
            <div>{key}</div>
            {ingredients.map((ingredient) => (
              <CartItem key={ingredient.id} ingredient={ingredient} />
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
