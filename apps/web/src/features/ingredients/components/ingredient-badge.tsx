import { type IngredientCategory } from '@recipe-organizer/shared/ingredients/categories'
import type React from 'react'

import * as styles from './ingredient-badge.css'

export interface IngredientBadgeProps {
  readonly category: IngredientCategory
  readonly children: React.ReactNode
}

/** Domain-owned ingredient category treatment; category colors never bypass the shared Badge contract. */
export const IngredientBadge = ({ category, children }: IngredientBadgeProps): React.ReactElement => (
  <span className={styles.badge[category]} data-slot="ingredient-badge">
    {children}
  </span>
)
