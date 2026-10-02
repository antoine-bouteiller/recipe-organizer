import { useState } from 'react'
import type React from 'react'

import { CheckIcon } from '@/design-system/ui/data-display/icons'

import * as styles from './toggle.css'

export type ToggleProps = Pick<React.ComponentProps<'button'>, 'aria-label' | 'children' | 'disabled'> & {
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
  presentation?: 'check-row' | 'default' | 'filter'
  pressed?: boolean
  variant?: 'default' | 'outline'
}

export const Toggle = ({
  children,
  defaultPressed = false,
  onPressedChange,
  presentation,
  pressed: controlledPressed,
  variant,
  ...props
}: ToggleProps): React.ReactElement => {
  const [localPressed, setLocalPressed] = useState(defaultPressed)
  const pressed = controlledPressed ?? localPressed
  return (
    <button
      {...props}
      aria-pressed={pressed}
      className={styles.toggle({ presentation, variant })}
      data-slot="toggle"
      onClick={() => {
        setLocalPressed(!pressed)
        onPressedChange?.(!pressed)
      }}
      type="button"
    >
      {presentation === 'check-row' && (
        <span aria-hidden="true" className={styles.check} data-slot="toggle-check">
          <CheckIcon size="xs" weight="bold" />
        </span>
      )}
      {presentation === 'check-row' ? <span className={styles.checkRowContent}>{children}</span> : children}
    </button>
  )
}
