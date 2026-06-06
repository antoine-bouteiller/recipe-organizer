import { type ReactElement } from 'react'

import { Toggle, ToggleGroup as ToggleGroupRoot } from '@/components/ui/toggle-group'

interface ToggleGroupProps {
  items: { label: string; value: string }[]
  value: string[]
  onValueChange: (value: string[]) => void
  disabled?: boolean
  className?: string
}

export const ToggleGroup = ({ items, value, onValueChange, disabled, className = 'flex-wrap' }: ToggleGroupProps): ReactElement => (
  <ToggleGroupRoot className={className} disabled={disabled} multiple onValueChange={onValueChange} value={value}>
    {items.map(({ label, value: itemValue }) => (
      <Toggle key={itemValue} value={itemValue}>
        {label}
      </Toggle>
    ))}
  </ToggleGroupRoot>
)
