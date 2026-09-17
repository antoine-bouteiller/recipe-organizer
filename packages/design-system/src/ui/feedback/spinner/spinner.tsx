import type React from 'react'

import { CircleNotchIcon } from '../../data-display/icons/circle-notch'

import * as styles from './spinner.css'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
}
export const Spinner = ({ size }: SpinnerProps): React.ReactElement => (
  <span className={styles.spinner({ size })}>
    <CircleNotchIcon aria-label="Loading" />
  </span>
)
