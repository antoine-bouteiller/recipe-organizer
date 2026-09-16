import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group'
import { type ReactElement } from 'react'

import { Toggle } from '../toggle/toggle'

import { wrapperClassName, groupClassName, itemClassName } from './toggle-group.css'

export interface ToggleGroupProps {
  disabled?: boolean
  items: readonly { label: string; value: string }[]
  onValueChange: (value: string[]) => void
  value: readonly string[]
}

export const ToggleGroup = ({ items, value, onValueChange, disabled }: ToggleGroupProps): ReactElement => (
  <div className={wrapperClassName}>
    <ToggleGroupPrimitive
      className={groupClassName}
      data-slot="toggle-group"
      disabled={disabled}
      multiple
      onValueChange={onValueChange}
      value={value}
    >
      {items.map(({ label, value: itemValue }) => (
        <span className={itemClassName} key={itemValue}>
          <Toggle value={itemValue}>{label}</Toggle>
        </span>
      ))}
    </ToggleGroupPrimitive>
  </div>
)
