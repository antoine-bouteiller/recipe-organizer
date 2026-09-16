import { cva } from '@recipe-organizer/design-system/css'
import type React from 'react'

import { CircleNotchIcon } from '../../data-display/icons/circle-notch'

const spinnerRecipe = cva({
  base: { animation: 'spin 1s linear infinite' },
  defaultVariants: { size: 'md' },
  variants: { size: { lg: { '--owner-icon-size': '32px' }, md: { '--owner-icon-size': '18px' }, sm: { '--owner-icon-size': '16px' } } },
})
export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
}
export const Spinner = ({ size }: SpinnerProps): React.ReactElement => (
  <span className={spinnerRecipe({ size })}>
    <CircleNotchIcon aria-label="Loading" />
  </span>
)
