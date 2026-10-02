import type { ComponentProps, ReactElement } from 'react'

import type { TriggerProps } from '@/design-system/hooks/use-drawer'
import { CaretUpDownIcon } from '@/design-system/ui/data-display/icons'

import * as styles from './select.shared.css'

type SelectButtonProps = TriggerProps & Pick<ComponentProps<'button'>, 'aria-invalid' | 'children' | 'disabled'>

export const SelectButton = ({ children, ...props }: SelectButtonProps): ReactElement => (
  <button {...props} className={styles.selectTrigger} data-slot="select-button" type="button">
    <span className={`${styles.selectText} ${styles.selectTextState.selected}`}>{children}</span>
    <span className={styles.selectTriggerIcon}>
      <CaretUpDownIcon />
    </span>
  </button>
)
