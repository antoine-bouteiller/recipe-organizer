import { CheckIcon } from '@phosphor-icons/react'
import { useState, type ReactElement } from 'react'

import { Drawer, DrawerHeader, DrawerPanel, DrawerPopup, DrawerTitle, DrawerTrigger } from '@/components/ui/primitive/drawer'
import { SelectButton, SelectItem, SelectPopup, Select as SelectRoot, SelectTrigger, type SelectButtonProps } from '@/components/ui/primitive/select'
import { useIsMobile } from '@/hooks/use-is-mobile'
import { cn } from '@/utils/cn'

interface SelectOption {
  label: string
  value: string | null
}

interface SelectBaseProps {
  items: SelectOption[]
  placeholder?: string
  title?: string
  disabled?: boolean
  className?: string
  size?: SelectButtonProps['size']
}

type SelectProps = SelectBaseProps &
  (
    | { multiple?: false; value: string | null | undefined; onValueChange: (value: string | null) => void }
    | { multiple: true; value: string[]; onValueChange: (value: string[]) => void }
  )

export const Select = (props: SelectProps): ReactElement => {
  const { items, placeholder = 'Sélectionner', title, disabled, className } = props
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)

  const isSelected = (value: string | null): boolean => (props.multiple ? props.value.includes(value as string) : (props.value ?? null) === value)

  const selectedLabels = items.filter((item) => isSelected(item.value)).map((item) => item.label)
  const isEmpty = selectedLabels.length === 0
  const displayLabel = isEmpty ? placeholder : selectedLabels.join(', ')

  if (isMobile) {
    const handleSelect = (value: string | null) => {
      if (props.multiple) {
        props.onValueChange(props.value.includes(value as string) ? props.value.filter((item) => item !== value) : [...props.value, value as string])
      } else {
        props.onValueChange(value)
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
