import { css } from '@recipe-organizer/design-system/css'
import { type IngredientCategory } from '@recipe-organizer/shared/ingredients/categories'
import type React from 'react'

const categoryStyles = {
  fish: { backgroundColor: 'blue.200', color: 'blue.600' },
  meat: { backgroundColor: 'red.200', color: 'red.600' },
  other: { backgroundColor: 'zinc.200', color: 'zinc.700' },
  spices: { backgroundColor: 'yellow.200', color: 'yellow.600' },
  vegetables: { backgroundColor: 'emerald.100', color: 'emerald.600' },
} satisfies Record<IngredientCategory, Record<string, string>>

export interface IngredientBadgeProps {
  readonly category: IngredientCategory
  readonly children: React.ReactNode
}

/** Domain-owned ingredient category treatment; category colors never bypass the shared Badge contract. */
export const IngredientBadge = ({ category, children }: IngredientBadgeProps): React.ReactElement => (
  <span
    className={css({
      alignItems: 'center',
      borderRadius: 'sm',
      display: 'inline-flex',
      fontSize: { base: 'sm', sm: 'xs' },
      fontWeight: 'medium',
      height: { base: '5.5', sm: '4.5' },
      justifyContent: 'center',
      minWidth: { base: '5.5', sm: '4.5' },
      paddingInline: 'calc(token(spacing.1) - 1px)',
      ...categoryStyles[category],
    })}
    data-slot="ingredient-badge"
  >
    {children}
  </span>
)
