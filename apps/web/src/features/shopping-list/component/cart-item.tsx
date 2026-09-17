import { formatNumber } from '@client/utils/number'
import { CheckIcon } from '@recipe-organizer/design-system/icons/check'
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
    <button type="button" onClick={() => setIsChecked((checked) => !checked)} className={styles.item}>
      <span className={styles.check[isChecked ? 'checked' : 'unchecked']}>{isChecked && <CheckIcon size="xs" weight="bold" />}</span>
      <span className={styles.details[isChecked ? 'checked' : 'unchecked']}>
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
    </button>
  )
}
