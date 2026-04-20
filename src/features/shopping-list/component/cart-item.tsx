import { useState } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { UNITS, type UnitSlug } from '@/lib/db/schema/unit'
import { cn } from '@/utils/cn'
import { formatNumber } from '@/utils/number'

import { type IngredientCartItem } from '../types/ingredient-cart-item'

const formatUnitLabel = (slug: UnitSlug | null) => (slug ? (UNITS[slug]?.name ?? '') : '')

const formatQuantityWithUnit = (quantity: number, unitSlug: UnitSlug | null) => {
  const label = formatUnitLabel(unitSlug)
  return label ? `${formatNumber(quantity)} ${label}` : formatNumber(quantity)
}

export const CartItem = ({ ingredient }: { ingredient: IngredientCartItem }) => {
  const [isChecked, setIsChecked] = useState(false)

  return (
    <div className={cn('flex items-center gap-2 text-nowrap text-ellipsis', isChecked && 'line-through')}>
      <Checkbox checked={isChecked} id={`ingredient-${ingredient.id}`} onCheckedChange={(checked) => setIsChecked(checked)} />
      <label className="flex flex-1 justify-between gap-2" htmlFor={`ingredient-${ingredient.id}`}>
        <span>{ingredient.name}</span>
        <span className="flex flex-col items-end">
          <span>{formatQuantityWithUnit(ingredient.primary.quantity, ingredient.primary.unitSlug)}</span>
          {ingredient.fallback.map((line) => (
            <span className="text-xs text-muted-foreground" key={line.unitSlug ?? 'unitless'}>
              + {formatQuantityWithUnit(line.quantity, line.unitSlug)}
            </span>
          ))}
        </span>
      </label>
    </div>
  )
}
