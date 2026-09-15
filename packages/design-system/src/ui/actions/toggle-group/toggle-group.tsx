import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group'
import { cn } from 'cn'
import { type ReactElement } from 'react'

import { Toggle } from '../toggle/toggle'

interface ToggleGroupProps {
  items: { label: string; value: string }[]
  value: string[]
  onValueChange: (value: string[]) => void
  disabled?: boolean
  className?: string
}

export const ToggleGroup = ({ items, value, onValueChange, disabled, className }: ToggleGroupProps): ReactElement => (
  <div className={cn('max-w-full overflow-x-auto overflow-y-hidden', className)}>
    <ToggleGroupPrimitive
      className="flex w-fit gap-0.5 *:focus-visible:z-10 *:pointer-coarse:after:min-w-auto"
      data-slot="toggle-group"
      disabled={disabled}
      multiple
      onValueChange={onValueChange}
      value={value}
    >
      {items.map(({ label, value: itemValue }) => (
        <Toggle className="shrink-0" key={itemValue} value={itemValue}>
          {label}
        </Toggle>
      ))}
    </ToggleGroupPrimitive>
  </div>
)
