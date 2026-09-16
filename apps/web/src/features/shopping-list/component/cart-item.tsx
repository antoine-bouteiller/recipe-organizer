import { formatNumber } from '@client/utils/number'
import { CheckIcon } from '@recipe-organizer/design-system/icons/check'
import { UNITS, type UnitSlug } from '@recipe-organizer/shared/units'
import { useState } from 'react'

import { type IngredientCartItem } from '../types/ingredient-cart-item'

import { check, checkState, details, detailsState, fallbackQuantity, item, quantities } from './cart-item.css'

const formatUnitLabel = (slug: UnitSlug | null) => (slug ? (UNITS[slug]?.name ?? '') : '')

const formatQuantityWithUnit = (quantity: number, unitSlug: UnitSlug | null) => {
  const label = formatUnitLabel(unitSlug)
  return label ? `${formatNumber(quantity)} ${label}` : formatNumber(quantity)
}

export interface CartItemProps {
  readonly ingredient: IngredientCartItem
}

export const CartItem = ({ ingredient }: CartItemProps) => {
  const [isChecked, setIsChecked] = useState(false)

  return (
    <button type="button" onClick={() => setIsChecked((checked) => !checked)} className={item}>
      <span className={`${check} ${checkState[isChecked ? 'checked' : 'unchecked']}`}>{isChecked && <CheckIcon size="xs" weight="bold" />}</span>
      <span className={`${details} ${detailsState[isChecked ? 'checked' : 'unchecked']}`}>
        <span>{ingredient.name}</span>
        <span className={quantities}>
          <span>{formatQuantityWithUnit(ingredient.primary.quantity, ingredient.primary.unitSlug)}</span>
          {ingredient.fallback.map((line) => (
            <span className={fallbackQuantity} key={line.unitSlug ?? 'unitless'}>
              + {formatQuantityWithUnit(line.quantity, line.unitSlug)}
            </span>
          ))}
        </span>
      </span>
    </button>
  )
}
