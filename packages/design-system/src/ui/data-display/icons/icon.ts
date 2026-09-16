import { css } from '@recipe-organizer/design-system/css'
import { createElement, type ReactElement, type ReactNode } from 'react'

import { type IconProps, type IconSize } from './types'

const iconRecipes = {
  inherit: css({
    color: 'currentColor',
    flexShrink: 0,
    height: 'var(--owner-icon-size, 1em)',
    marginInline: 'var(--owner-icon-margin-inline, 0)',
    opacity: 'var(--owner-icon-opacity, 1)',
    width: 'var(--owner-icon-size, 1em)',
  }),
  lg: css({
    color: 'currentColor',
    flexShrink: 0,
    height: 'var(--owner-icon-size, 1.25rem)',
    marginInline: 'var(--owner-icon-margin-inline, 0)',
    opacity: 'var(--owner-icon-opacity, 1)',
    width: 'var(--owner-icon-size, 1.25rem)',
  }),
  md: css({
    color: 'currentColor',
    flexShrink: 0,
    height: 'var(--owner-icon-size, 1.125rem)',
    marginInline: 'var(--owner-icon-margin-inline, 0)',
    opacity: 'var(--owner-icon-opacity, 1)',
    width: 'var(--owner-icon-size, 1.125rem)',
  }),
  sm: css({
    color: 'currentColor',
    flexShrink: 0,
    height: 'var(--owner-icon-size, 1rem)',
    marginInline: 'var(--owner-icon-margin-inline, 0)',
    opacity: 'var(--owner-icon-opacity, 1)',
    width: 'var(--owner-icon-size, 1rem)',
  }),
  xl: css({
    color: 'currentColor',
    flexShrink: 0,
    height: 'var(--owner-icon-size, 1.75rem)',
    marginInline: 'var(--owner-icon-margin-inline, 0)',
    opacity: 'var(--owner-icon-opacity, 1)',
    width: 'var(--owner-icon-size, 1.75rem)',
  }),
  xs: css({
    color: 'currentColor',
    flexShrink: 0,
    height: 'var(--owner-icon-size, 0.75rem)',
    marginInline: 'var(--owner-icon-margin-inline, 0)',
    opacity: 'var(--owner-icon-opacity, 1)',
    width: 'var(--owner-icon-size, 0.75rem)',
  }),
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
