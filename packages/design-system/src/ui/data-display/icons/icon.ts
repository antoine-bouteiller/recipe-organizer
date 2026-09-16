import { createElement, type ReactElement, type ReactNode } from 'react'

import { type IconProps, type IconSize } from './types'

import { element, element2, element3, element4, element5, element6 } from './icon.css'

const iconRecipes = {
  inherit: element,
  lg: element2,
  md: element3,
  sm: element4,
  xl: element5,
  xs: element6,
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
