import { Toggle as TogglePrimitive } from '@base-ui/react/toggle'
import { CheckIcon } from '@recipe-organizer/design-system/icons/check'
import type React from 'react'

import * as styles from './toggle.css'

export type ToggleProps = Pick<
  TogglePrimitive.Props,
  'aria-label' | 'children' | 'defaultPressed' | 'disabled' | 'onClick' | 'onPressedChange' | 'pressed' | 'value'
> & {
  presentation?: 'check-row' | 'default' | 'filter'
  variant?: 'default' | 'outline'
}

export const Toggle = ({ children, presentation, variant, ...props }: ToggleProps): React.ReactElement => (
  <TogglePrimitive {...props} className={styles.toggle({ presentation, variant })} data-slot="toggle">
    {presentation === 'check-row' && (
      <span aria-hidden="true" className={styles.check} data-slot="toggle-check">
        <CheckIcon size="xs" weight="bold" />
      </span>
    )}
    {presentation === 'check-row' ? <span className={styles.checkRowContent}>{children}</span> : children}
  </TogglePrimitive>
)
