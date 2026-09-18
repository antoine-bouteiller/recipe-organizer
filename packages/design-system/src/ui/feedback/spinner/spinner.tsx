import { CircleNotchIcon } from '@recipe-organizer/design-system/icons/circle-notch'
import type React from 'react'

import * as styles from './spinner.css'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
}
export const Spinner = ({ size }: SpinnerProps): React.ReactElement => (
  <span className={styles.spinner({ size })}>
    <CircleNotchIcon aria-label="Loading" />
  </span>
)
