import type React from 'react'

export type IconSize = 'inherit' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

type IconAccessibilityProps = { 'aria-hidden'?: true | 'true'; 'aria-label'?: never } | { 'aria-hidden'?: never; 'aria-label': string }

/** Icons are decorative by default; an aria-label makes one informative. */
export type IconProps = Pick<React.ComponentProps<'svg'>, 'aria-hidden' | 'aria-label' | 'ref'> &
  IconAccessibilityProps & {
    role?: never
    size?: IconSize
  }
