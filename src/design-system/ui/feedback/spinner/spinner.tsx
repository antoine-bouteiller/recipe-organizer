import type React from 'react'

import { CircleNotchIcon } from '@/design-system/ui/data-display/icons'

import * as styles from './spinner.css'

export const Spinner = (): React.ReactElement => (
  <span className={styles.spinner}>
    <CircleNotchIcon aria-label="Loading" />
  </span>
)
