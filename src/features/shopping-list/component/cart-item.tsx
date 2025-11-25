import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/utils/cn'
import { useState } from 'react'
import type { IngredientCartItem } from '../types/ingredient-cart-item'

export const CartItem = ({ ingredient }: { ingredient: IngredientCartItem }) => {
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
