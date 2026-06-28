import { CheckIcon } from '@phosphor-icons/react'
import { useState } from 'react'

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
    <button
      type="button"
      onClick={() => setIsChecked((checked) => !checked)}
      className="flex w-full items-center gap-3 border-b py-3 text-left last:border-b-0"
    >
      <span
        className={cn(
          'flex size-5.5 shrink-0 items-center justify-center rounded-full border-2',
          isChecked ? 'border-primary bg-primary text-white' : 'border-muted-foreground/40'
        )}
      >
        {isChecked && <CheckIcon weight="bold" className="size-3" />}
      </span>
      <span className={cn('flex flex-1 items-center justify-between gap-2', isChecked && 'text-muted-foreground line-through')}>
        <span>{ingredient.name}</span>
        <span className="flex flex-col items-end text-sm font-semibold text-muted-foreground">
          <span>{formatQuantityWithUnit(ingredient.primary.quantity, ingredient.primary.unitSlug)}</span>
          {ingredient.fallback.map((line) => (
            <span className="text-xs" key={line.unitSlug ?? 'unitless'}>
              + {formatQuantityWithUnit(line.quantity, line.unitSlug)}
            </span>
          ))}
        </span>
      </span>
    </button>
  )
}
