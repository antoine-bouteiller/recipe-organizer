import { useState } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/utils/cn'
import { formatNumber } from '@/utils/number'

import type { IngredientCartItem } from '../types/ingredient-cart-item'

export const CartItem = ({ ingredient }: { ingredient: IngredientCartItem }) => {
  const [isChecked, setIsChecked] = useState(false)

  return (
    <div className={cn('flex items-center gap-2 text-nowrap text-ellipsis', isChecked && 'line-through')}>
      <Checkbox checked={isChecked} id={`ingredient-${ingredient.id}`} onCheckedChange={(checked) => setIsChecked(checked)} />
      <label className="flex flex-1 justify-between" htmlFor={`ingredient-${ingredient.id}`}>
        <span>{ingredient.name}</span>
        <span>
          {formatNumber(ingredient.quantity)} {ingredient.unit && ` ${ingredient.unit}`}
        </span>
      </label>
    </div>
  )
}
