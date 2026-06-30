import { Select as SelectPrimitive } from '@base-ui/react/select'
import { CaretDownIcon, CaretUpDownIcon, CaretUpIcon } from '@phosphor-icons/react'
import { type ReactElement } from 'react'

import { type SelectProps } from '@/components/ui/select'
import { getSelectDisplay, selectTriggerIconClassName, selectTriggerVariants } from '@/components/ui/select.shared'
import { cn } from '@/utils/cn'

const SelectRoot = SelectPrimitive.Root

const SelectTrigger = ({
  className,
  size = 'default',
  children,
  ...props
}: SelectPrimitive.Trigger.Props & { size?: 'sm' | 'default' | 'lg' }): React.ReactElement => (
  <SelectPrimitive.Trigger className={cn(selectTriggerVariants({ size }), className)} data-slot="select-trigger" {...props}>
    {children}
    <SelectPrimitive.Icon data-slot="select-icon">
      <CaretUpDownIcon className={selectTriggerIconClassName} />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
)

const SelectPopup = ({
  className,
  children,
  side = 'bottom',
  sideOffset = 4,
  align = 'start',
  alignOffset = 0,
  alignItemWithTrigger = true,
  anchor,
  ...props
}: SelectPrimitive.Popup.Props & {
  side?: SelectPrimitive.Positioner.Props['side']
  sideOffset?: SelectPrimitive.Positioner.Props['sideOffset']
  align?: SelectPrimitive.Positioner.Props['align']
  alignOffset?: SelectPrimitive.Positioner.Props['alignOffset']
  alignItemWithTrigger?: SelectPrimitive.Positioner.Props['alignItemWithTrigger']
  anchor?: SelectPrimitive.Positioner.Props['anchor']
}): React.ReactElement => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Positioner
      align={align}
      alignItemWithTrigger={alignItemWithTrigger}
      alignOffset={alignOffset}
      anchor={anchor}
      className="z-50 select-none"
      data-slot="select-positioner"
      side={side}
      sideOffset={sideOffset}
    >
      <SelectPrimitive.Popup className="origin-(--transform-origin) text-foreground outline-none" data-slot="select-popup" {...props}>
        <SelectPrimitive.ScrollUpArrow
          className="top-0 z-50 flex h-6 w-full cursor-default items-center justify-center before:pointer-events-none before:absolute before:inset-x-px before:top-px before:h-[200%] before:rounded-t-[calc(var(--radius-lg)-1px)] before:bg-linear-to-b before:from-popover before:from-50%"
          data-slot="select-scroll-up-arrow"
        >
          <CaretUpIcon className="relative size-4.5 sm:size-4" />
        </SelectPrimitive.ScrollUpArrow>
        <div className="relative h-full min-w-(--anchor-width) rounded-lg border bg-popover shadow-lg/5 not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]">
          <SelectPrimitive.List className={cn('max-h-(--available-height) overflow-y-auto p-1', className)} data-slot="select-list">
            {children}
          </SelectPrimitive.List>
        </div>
        <SelectPrimitive.ScrollDownArrow
          className="bottom-0 z-50 flex h-6 w-full cursor-default items-center justify-center before:pointer-events-none before:absolute before:inset-x-px before:bottom-px before:h-[200%] before:rounded-b-[calc(var(--radius-lg)-1px)] before:bg-linear-to-t before:from-popover before:from-50%"
          data-slot="select-scroll-down-arrow"
        >
          <CaretDownIcon className="relative size-4.5 sm:size-4" />
        </SelectPrimitive.ScrollDownArrow>
      </SelectPrimitive.Popup>
    </SelectPrimitive.Positioner>
  </SelectPrimitive.Portal>
)

const SelectItem = ({ className, children, ...props }: SelectPrimitive.Item.Props): React.ReactElement => (
  <SelectPrimitive.Item
    className={cn(
      "grid min-h-8 in-data-[side=none]:min-w-[calc(var(--anchor-width)+1.25rem)] cursor-default grid-cols-[1rem_1fr] items-center gap-2 rounded-sm py-1 ps-2 pe-4 text-base outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
      className
    )}
    data-slot="select-item"
    {...props}
  >
    <SelectPrimitive.ItemIndicator className="col-start-1">
      <svg
        aria-hidden="true"
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M5.252 12.7 10.2 18.63 18.748 5.37" />
      </svg>
    </SelectPrimitive.ItemIndicator>
    <SelectPrimitive.ItemText className="col-start-2 min-w-0">{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
)

const SelectBase = <TValue extends string>(props: SelectProps<TValue>): ReactElement => {
  const { items, disabled, className } = props
  const { displayLabel, isEmpty } = getSelectDisplay(props)

  const trigger = (
    <SelectTrigger className={className} disabled={disabled}>
      <span className={cn('flex-1 truncate text-left', isEmpty && 'text-muted-foreground')}>{displayLabel}</span>
    </SelectTrigger>
  )

  const popup = (
    <SelectPopup>
      {items.map((item) => (
        <SelectItem className="justify-start" key={item.value ?? 'none'} value={item.value}>
          {item.label}
        </SelectItem>
      ))}
    </SelectPopup>
  )

  if (props.multiple) {
    return (
      <SelectRoot
        disabled={disabled}
        items={items}
        multiple
        onValueChange={props.onValueChange as (value: (string | null)[]) => void}
        value={props.value}
      >
        {trigger}
        {popup}
      </SelectRoot>
    )
  }

  return (
    <SelectRoot disabled={disabled} items={items} onValueChange={props.onValueChange} value={props.value ?? null}>
      {trigger}
      {popup}
    </SelectRoot>
  )
}

export default SelectBase
