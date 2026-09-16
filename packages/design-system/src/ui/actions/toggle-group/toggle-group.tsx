import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group'
import { css } from '@recipe-organizer/design-system/css'
import { type ReactElement } from 'react'

import { Toggle } from '../toggle/toggle'

const wrapperClassName = css({ maxWidth: 'full', overflowX: 'auto', overflowY: 'hidden' })
const groupClassName = css({ '--toggle-hit-min-width': 'auto', display: 'flex', gap: '0.5', width: 'fit-content' })
const itemClassName = css({ flexShrink: '0' })

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
