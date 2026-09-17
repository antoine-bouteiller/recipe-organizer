import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group'
import { type ReactElement } from 'react'

import { Toggle } from '../toggle/toggle'

import * as styles from './toggle-group.css'

export interface ToggleGroupProps {
  disabled?: boolean
  items: readonly { label: string; value: string }[]
  onValueChange: (value: string[]) => void
  value: readonly string[]
}

export const ToggleGroup = ({ items, value, onValueChange, disabled }: ToggleGroupProps): ReactElement => (
  <div className={styles.wrapper}>
    <ToggleGroupPrimitive className={styles.group} data-slot="toggle-group" disabled={disabled} multiple onValueChange={onValueChange} value={value}>
      {items.map(({ label, value: itemValue }) => (
        <span className={styles.item} key={itemValue}>
          <Toggle value={itemValue}>{label}</Toggle>
        </span>
      ))}
    </ToggleGroupPrimitive>
  </div>
)
