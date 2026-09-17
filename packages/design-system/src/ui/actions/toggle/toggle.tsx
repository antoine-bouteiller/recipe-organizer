import { Toggle as TogglePrimitive } from '@base-ui/react/toggle'
import type React from 'react'

import * as styles from './toggle.css'

export type ToggleProps = Pick<
  TogglePrimitive.Props,
  'aria-label' | 'children' | 'defaultPressed' | 'disabled' | 'onClick' | 'onPressedChange' | 'pressed' | 'value'
> & {
  presentation?: 'default' | 'filter'
  variant?: 'default' | 'outline'
}

export const Toggle = ({ presentation, variant, ...props }: ToggleProps): React.ReactElement => (
  <TogglePrimitive {...props} className={styles.toggle({ presentation, variant })} data-slot="toggle" />
)
