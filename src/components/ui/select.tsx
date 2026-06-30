import { mergeProps } from '@base-ui/react/merge-props'
import { Select as SelectPrimitive } from '@base-ui/react/select'
import { useRender } from '@base-ui/react/use-render'
import { CaretDownIcon, CaretUpDownIcon, CaretUpIcon, CheckIcon } from '@phosphor-icons/react'
import { cva, type VariantProps } from 'class-variance-authority'
import { useState, type ReactElement } from 'react'

import { Drawer, DrawerHeader, DrawerPanel, DrawerPopup, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { useIsMobile } from '@/hooks/use-is-mobile'
import { cn } from '@/utils/cn'

const SelectRoot = SelectPrimitive.Root

const selectTriggerVariants = cva(
  "relative inline-flex min-h-9 w-full min-w-36 select-none items-center justify-between gap-2 rounded-lg border border-input bg-background not-dark:bg-clip-padding px-[calc(--spacing(3)-1px)] text-left text-base text-foreground shadow-xs/5 outline-none ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-data-disabled:not-focus-visible:not-aria-invalid:not-data-pressed:before:shadow-[0_1px_--theme(--color-black/4%)] pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 focus-visible:border-ring focus-visible:ring-[3px] aria-invalid:border-destructive/36 focus-visible:aria-invalid:border-destructive/64 focus-visible:aria-invalid:ring-destructive/16 data-disabled:pointer-events-none data-disabled:opacity-64 sm:min-h-8 sm:text-sm dark:bg-input/32 dark:aria-invalid:ring-destructive/24 dark:not-data-disabled:not-focus-visible:not-aria-invalid:not-data-pressed:before:shadow-[0_-1px_--theme(--color-white/6%)] [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 [[data-disabled],:focus-visible,[aria-invalid],[data-pressed]]:shadow-none",
  {
    defaultVariants: {
      size: 'default',
    },
    variants: {
      size: {
        default: '',
        lg: 'min-h-10 sm:min-h-9',
        sm: 'min-h-8 gap-1.5 px-[calc(--spacing(2.5)-1px)] sm:min-h-7',
      },
    },
  }
)

const selectTriggerIconClassName = '-me-1 size-4.5 opacity-80 sm:size-4'

interface SelectButtonProps extends useRender.ComponentProps<'button'> {
  size?: VariantProps<typeof selectTriggerVariants>['size']
}

const SelectButton = ({ className, size, render, children, ...props }: SelectButtonProps): React.ReactElement => {
  const typeValue: React.ButtonHTMLAttributes<HTMLButtonElement>['type'] = render ? undefined : 'button'

  const defaultProps = {
    children: (
      <>
        <span className="flex-1 truncate in-data-placeholder:text-muted-foreground/72">{children}</span>
        <CaretUpDownIcon className={selectTriggerIconClassName} />
      </>
    ),
    className: cn(selectTriggerVariants({ size }), 'min-w-0', className),
    'data-slot': 'select-button',
    type: typeValue,
  }

  return useRender({
    defaultTagName: 'button',
    props: mergeProps<'button'>(defaultProps, props),
    render,
  })
}

const SelectTrigger = ({
  className,
  size = 'default',
  children,
  ...props
}: SelectPrimitive.Trigger.Props & VariantProps<typeof selectTriggerVariants>): React.ReactElement => (
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

interface SelectOption<TValue extends string> {
  label: string
  value: TValue | null
}

interface SelectBaseProps<TValue extends string> {
  items: SelectOption<TValue>[]
  placeholder?: string
  title?: string
  disabled?: boolean
  className?: string
  size?: SelectButtonProps['size']
}

type SelectProps<TValue extends string> = SelectBaseProps<TValue> &
  (
    | { multiple?: false; value: TValue | null | undefined; onValueChange: (value: TValue | null) => void }
    | { multiple: true; value: TValue[]; onValueChange: (value: TValue[]) => void }
  )

export const Select = <TValue extends string>(props: SelectProps<TValue>): ReactElement => {
  const { items, placeholder = 'Sélectionner', title, disabled, className } = props
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)

  const isSelected = (value: string | null): boolean => (props.multiple ? props.value.includes(value as TValue) : (props.value ?? null) === value)

  const selectedLabels = items.filter((item) => isSelected(item.value)).map((item) => item.label)
  const isEmpty = selectedLabels.length === 0
  const displayLabel = isEmpty ? placeholder : selectedLabels[0] + (selectedLabels.length > 1 ? ` (+${selectedLabels.length - 1})` : '')

  if (isMobile) {
    const handleSelect = (value: TValue | null) => {
      if (props.multiple) {
        props.onValueChange(props.value.includes(value as TValue) ? props.value.filter((item) => item !== value) : [...props.value, value as TValue])
      } else {
        props.onValueChange(value as TValue)
        setOpen(false)
      }
    }

    return (
      <Drawer onOpenChange={setOpen} open={open}>
        <DrawerTrigger
          disabled={disabled}
          render={
            <SelectButton className={className} size={props.size}>
              <span className={cn(isEmpty && 'text-muted-foreground')}>{displayLabel}</span>
            </SelectButton>
          }
        />
        <DrawerPopup showBar>
          <DrawerHeader>
            <DrawerTitle>{title ?? placeholder}</DrawerTitle>
          </DrawerHeader>
          <DrawerPanel>
            <div className="flex flex-col">
              {items.map((item) => (
                <button
                  className="flex min-h-11 w-full items-center justify-between gap-2 rounded-sm px-2 text-base outline-none hover:bg-accent hover:text-accent-foreground"
                  key={item.value ?? 'none'}
                  onClick={() => handleSelect(item.value)}
                  type="button"
                >
                  <span className="truncate">{item.label}</span>
                  {isSelected(item.value) && <CheckIcon className="size-4 shrink-0" />}
                </button>
              ))}
            </div>
          </DrawerPanel>
        </DrawerPopup>
      </Drawer>
    )
  }

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
