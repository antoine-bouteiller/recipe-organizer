import { type ReactElement } from 'react'

import { Toggle, ToggleGroup as ToggleGroupRoot } from '@/components/ui/toggle-group'
import { cn } from '@/utils/cn'

interface ToggleGroupProps {
  items: { label: string; value: string }[]
  value: string[]
  onValueChange: (value: string[]) => void
  disabled?: boolean
  className?: string
}

export const ToggleGroup = ({ items, value, onValueChange, disabled, className }: ToggleGroupProps): ReactElement => (
  <div className={cn('max-w-full overflow-x-auto overflow-y-hidden', className)}>
    <ToggleGroupRoot disabled={disabled} multiple onValueChange={onValueChange} value={value}>
      {items.map(({ label, value: itemValue }) => (
        <Toggle className="shrink-0" key={itemValue} value={itemValue}>
          {label}
        </Toggle>
      ))}
    </ToggleGroupRoot>
  </div>
)
