import { ScreenLayout } from '@/components/screen-layout'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { useShoppingListStore, type IngredientWithQuantity } from '@/stores/shopping-list.store'
import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

const CartItem = ({ ingredient }: { ingredient: IngredientWithQuantity }) => {
  const [isChecked, setIsChecked] = useState(false)

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-2 text-nowrap text-ellipsis',
        isChecked && 'line-through'
      )}
    >
      <div className="flex items-center gap-2">
        <Checkbox
          id={`ingredient-${ingredient.id}`}
          checked={isChecked}
          onCheckedChange={(checked) => setIsChecked(checked)}
        />
        <label htmlFor={`ingredient-${ingredient.id}`}>{ingredient.name}</label>
      </div>
      <div className="font-medium">
        {ingredient.quantity} {ingredient.unit && ` ${ingredient.unit}`}
      </div>
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
      {shoppingListIngredients.map((ingredient) => (
        <CartItem key={ingredient.id} ingredient={ingredient} />
      ))}
    </ScreenLayout>
  )
}

export const Route = createFileRoute('/shopping-list')({
  component: CartPage,
})
