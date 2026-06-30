import { type Toggle as TogglePrimitive } from '@base-ui/react/toggle'
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group'
import { type VariantProps } from 'class-variance-authority'
import React, { type ReactElement } from 'react'

import { Toggle as ToggleComponent, type toggleVariants } from '@/components/ui/toggle'
import { cn } from '@/utils/cn'

const ToggleGroupContext: React.Context<VariantProps<typeof toggleVariants>> = React.createContext<VariantProps<typeof toggleVariants>>({
  size: 'default',
  variant: 'default',
})

const ToggleGroupRoot = ({
  className,
  variant = 'default',
  size = 'default',
  orientation = 'horizontal',
  children,
  ...props
}: ToggleGroupPrimitive.Props & VariantProps<typeof toggleVariants>): React.ReactElement => (
  <ToggleGroupPrimitive
    className={cn(
      'flex w-fit *:focus-visible:z-10 dark:*:[[data-slot=separator]:has(+[data-slot=toggle]:hover)]:before:bg-input/64 dark:*:[[data-slot=separator]:has(+[data-slot=toggle][data-pressed])]:before:bg-input dark:*:[[data-slot=toggle]:hover+[data-slot=separator]]:before:bg-input/64 dark:*:[[data-slot=toggle][data-pressed]+[data-slot=separator]]:before:bg-input',
      orientation === 'horizontal' ? '*:pointer-coarse:after:min-w-auto' : '*:pointer-coarse:after:min-h-auto',
      variant === 'default' && 'gap-0.5',
      variant !== 'default' &&
        orientation === 'horizontal' &&
        '*:not-first:rounded-s-none *:not-last:rounded-e-none *:not-first:border-s-0 *:not-last:border-e-0 *:not-first:not-data-[slot=separator]:before:-start-[0.5px] *:not-last:not-data-[slot=separator]:before:-end-[0.5px] *:not-first:before:rounded-s-none *:not-last:before:rounded-e-none',
      variant !== 'default' &&
        orientation !== 'horizontal' &&
        'flex-col *:not-first:rounded-t-none *:not-last:rounded-b-none *:not-first:border-t-0 *:not-last:border-b-0 *:not-first:not-data-[slot=separator]:before:-top-[0.5px] *:not-last:not-data-[slot=separator]:before:-bottom-[0.5px] *:not-first:before:rounded-t-none *:not-last:before:rounded-b-none *:data-[slot=toggle]:not-last:before:hidden dark:*:last:before:hidden dark:*:first:before:block',
      className
    )}
    data-size={size}
    data-slot="toggle-group"
    data-variant={variant}
    orientation={orientation}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ size, variant }}>{children}</ToggleGroupContext.Provider>
  </ToggleGroupPrimitive>
)

const Toggle = ({
  className,
  children,
  variant,
  size,
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>): React.ReactElement => {
  const context = React.useContext(ToggleGroupContext)

  const resolvedVariant = context.variant || variant
  const resolvedSize = context.size || size

  return (
    <ToggleComponent
      className={className}
      data-size={resolvedSize}
      data-variant={resolvedVariant}
      size={resolvedSize}
      variant={resolvedVariant}
      {...props}
    >
      {children}
    </ToggleComponent>
  )
}

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
