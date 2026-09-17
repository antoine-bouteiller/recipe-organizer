import { type RecipeVariants } from '@vanilla-extract/recipes'
import type React from 'react'

import * as styles from './badge.css'

export type BadgeProps = Pick<React.ComponentProps<'span'>, 'children'> & RecipeVariants<typeof styles.badge>

export const Badge = ({ children, size, variant }: BadgeProps): React.ReactElement => (
  <span className={styles.badge({ size, variant })} data-slot="badge">
    {children}
  </span>
)
