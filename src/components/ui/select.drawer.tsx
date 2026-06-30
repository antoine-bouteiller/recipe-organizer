import { CheckIcon } from '@phosphor-icons/react'
import { useState, type ReactElement } from 'react'

import { Drawer, DrawerHeader, DrawerPanel, DrawerPopup, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { type SelectProps } from '@/components/ui/select'
import { getSelectDisplay, SelectButton } from '@/components/ui/select.shared'
import { cn } from '@/utils/cn'

const SelectDrawer = <TValue extends string>(props: SelectProps<TValue>): ReactElement => {
  const { items, placeholder = 'Sélectionner', title, disabled, className } = props
  const [open, setOpen] = useState(false)
  const { displayLabel, isEmpty, isSelected } = getSelectDisplay(props)

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
      <DrawerPopup>
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

export default SelectDrawer
