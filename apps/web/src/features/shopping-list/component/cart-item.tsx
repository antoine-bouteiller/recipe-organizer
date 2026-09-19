import { formatNumber } from '@client/utils/number'
import { Toggle } from '@recipe-organizer/design-system/toggle'
import { UNITS, type UnitSlug } from '@recipe-organizer/shared/units'
import { useState } from 'react'

import { type IngredientCartItem } from '../types/ingredient-cart-item'

import * as styles from './cart-item.css'

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
    <Toggle onPressedChange={setIsChecked} presentation="check-row" pressed={isChecked}>
      <span className={styles.details}>
        <span>{ingredient.name}</span>
        <span className={styles.quantities}>
          <span>{formatQuantityWithUnit(ingredient.primary.quantity, ingredient.primary.unitSlug)}</span>
          {ingredient.fallback.map((line) => (
            <span className={styles.fallbackQuantity} key={line.unitSlug ?? 'unitless'}>
              + {formatQuantityWithUnit(line.quantity, line.unitSlug)}
            </span>
          ))}
        </span>
      </span>
    </Toggle>
  )
}
