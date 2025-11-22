import { ScreenLayout } from '@/components/layout/screen-layout'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useShoppingListStore, type IngredientWithQuantity } from '@/stores/shopping-list.store'
import { cn } from '@/utils/cn'
import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

const CartItem = ({ ingredient }: { ingredient: IngredientWithQuantity }) => {
  const [isChecked, setIsChecked] = useState(false)

  return (
    <div
      className={cn(
        'flex items-center text-nowrap text-ellipsis gap-2',
        isChecked && 'line-through'
      )}
    >
      <Checkbox
        id={`ingredient-${ingredient.id}`}
        checked={isChecked}
        onCheckedChange={(checked) => setIsChecked(checked)}
      />
      <label htmlFor={`ingredient-${ingredient.id}`} className="flex-1 flex justify-between">
        <span>{ingredient.name}</span>
        <span>
          {ingredient.quantity} {ingredient.unit && ` ${ingredient.unit}`}
        </span>
      </label>
    </div>
  )
}

const CartPage = () => {
  const { shoppingListIngredients, reset } = useShoppingListStore()

  return (
    <ScreenLayout
      title="Liste de courses"
      headerEndItem={
        <Button variant="outline" size="icon" onClick={reset}>
          <ArrowCounterClockwiseIcon className="sier-4 text-primary" />
        </Button>
      }
    >
      <div className="p-8 space-y-2">
        {shoppingListIngredients.map((ingredient) => (
          <CartItem key={ingredient.id} ingredient={ingredient} />
        ))}
      </div>
    </ScreenLayout>
  )
}

export const Route = createFileRoute('/shopping-list')({
  component: CartPage,
})
