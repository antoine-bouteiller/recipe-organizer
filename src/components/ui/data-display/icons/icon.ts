import { createElement } from 'react'
import type { ReactElement, ReactNode } from 'react'

import type { IconProps, IconSize } from './types'

import * as styles from './icon.css'

const iconRecipes = {
  inherit: styles.element,
  lg: styles.large,
  md: styles.medium,
  sm: styles.small,
  xl: styles.extraLarge,
  xs: styles.extraSmall,
} satisfies Record<IconSize, string>

/** Private SVG root. It deliberately forwards only the closed public icon contract. */
export const Icon = ({
  'aria-hidden': ariaHidden,
  'aria-label': ariaLabel,
  children,
  ref,
  size = 'inherit',
}: IconProps & { children: ReactNode }): ReactElement =>
  createElement(
    'svg',
    {
      'aria-hidden': ariaLabel === undefined ? (ariaHidden ?? true) : undefined,
      'aria-label': ariaLabel,
      className: iconRecipes[size],
      fill: 'none',
      height: '1em',
      ref,
      role: ariaLabel === undefined ? undefined : 'img',
      viewBox: '0 0 24 24',
      width: '1em',
      xmlns: 'http://www.w3.org/2000/svg',
    },
    children
  )
