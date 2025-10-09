import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
          onCheckedChange={(checked) => setIsChecked(checked === 'indeterminate' ? false : checked)}
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
    <div className="md:min-h-full max-w-5xl mx-auto relative md:p-8 flex flex-col px-8">
      <Card className="pt-0 relative gap-2 md:gap-6 border-none shadow-none rounded-none md:border md:shadow-sm md:rounded-xl flex-1 flex flex-col">
        <div className=" py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Liste de courses</h1>
          <Button variant="outline" size="icon" onClick={reset}>
            <ArrowCounterClockwiseIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {shoppingListIngredients.map((ingredient) => (
            <CartItem key={ingredient.id} ingredient={ingredient} />
          ))}
        </div>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/shopping-list')({
  component: CartPage,
})
