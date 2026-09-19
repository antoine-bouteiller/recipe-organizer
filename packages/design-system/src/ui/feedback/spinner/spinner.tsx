import { CircleNotchIcon } from '@recipe-organizer/design-system/icons/circle-notch'
import type React from 'react'

import * as styles from './spinner.css'

export const Spinner = (): React.ReactElement => (
  <span className={styles.spinner}>
    <CircleNotchIcon aria-label="Loading" />
  </span>
)
