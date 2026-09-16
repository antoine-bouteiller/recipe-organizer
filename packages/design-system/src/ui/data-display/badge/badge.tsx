import { type RecipeVariants } from '@vanilla-extract/recipes'
import type React from 'react'

import { badgeRecipe } from './badge.css'

export type BadgeProps = Pick<React.ComponentProps<'span'>, 'children'> & RecipeVariants<typeof badgeRecipe>

export const Badge = ({ children, size, variant }: BadgeProps): React.ReactElement => (
  <span className={badgeRecipe({ size, variant })} data-slot="badge">
    {children}
  </span>
)
