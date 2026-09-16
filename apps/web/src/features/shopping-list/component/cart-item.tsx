import { formatNumber } from '@client/utils/number'
import { css } from '@recipe-organizer/design-system/css'
import { CheckIcon } from '@recipe-organizer/design-system/icons/check'
import { UNITS, type UnitSlug } from '@recipe-organizer/shared/units'
import { useState } from 'react'

import { type IngredientCartItem } from '../types/ingredient-cart-item'

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
    <button
      type="button"
      onClick={() => setIsChecked((checked) => !checked)}
      className={css({
        _last: { borderBottomWidth: '0' },
        alignItems: 'center',
        borderBottomWidth: '1px',
        display: 'flex',
        gap: '3',
        paddingBlock: '3',
        textAlign: 'left',
        width: 'full',
      })}
    >
      <span
        className={css({
          alignItems: 'center',
          background: isChecked ? 'primary' : undefined,
          borderColor: isChecked ? 'primary' : 'muted-foreground/40',
          borderRadius: 'full',
          borderWidth: '2px',
          color: isChecked ? 'white' : undefined,
          display: 'flex',
          flexShrink: '0',
          height: '5.5',
          justifyContent: 'center',
          width: '5.5',
        })}
      >
        {isChecked && <CheckIcon size="xs" weight="bold" />}
      </span>
      <span
        className={css({
          alignItems: 'center',
          color: isChecked ? 'muted-foreground' : undefined,
          display: 'flex',
          flex: '1',
          gap: '2',
          justifyContent: 'space-between',
          textDecoration: isChecked ? 'line-through' : undefined,
        })}
      >
        <span>{ingredient.name}</span>
        <span
          className={css({
            alignItems: 'flex-end',
            color: 'muted-foreground',
            display: 'flex',
            flexDirection: 'column',
            fontSize: 'sm',
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 'semibold',
          })}
        >
          <span>{formatQuantityWithUnit(ingredient.primary.quantity, ingredient.primary.unitSlug)}</span>
          {ingredient.fallback.map((line) => (
            <span className={css({ fontSize: 'xs' })} key={line.unitSlug ?? 'unitless'}>
              + {formatQuantityWithUnit(line.quantity, line.unitSlug)}
            </span>
          ))}
        </span>
      </span>
    </button>
  )
}
