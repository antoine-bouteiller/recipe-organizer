import { createSignal, For } from 'solid-js'
import Check from '~icons/ph/check'

import { Drawer, DrawerHeader, DrawerPanel, DrawerPopup, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { type SelectProps } from '@/components/ui/select'
import { getSelectDisplay, SelectButton } from '@/components/ui/select.shared'
import { cn } from '@/utils/cn'

const SelectDrawer = <TValue extends string>(props: SelectProps<TValue>) => {
  const [open, setOpen] = createSignal(false)
  const display = () => getSelectDisplay(props)

  const handleSelect = (value: TValue | null) => {
    if (props.multiple) {
      props.onValueChange(props.value.includes(value as TValue) ? props.value.filter((item) => item !== value) : [...props.value, value as TValue])
    } else {
      props.onValueChange(value)
      setOpen(false)
    }
  }

  return (
    <Drawer onOpenChange={setOpen} open={open()}>
      <DrawerTrigger as={SelectButton} class={props.class} data-slot="drawer-trigger" disabled={props.disabled} size={props.size}>
        <span class={cn(display().isEmpty && 'text-muted-foreground')}>{display().displayLabel}</span>
      </DrawerTrigger>
      <DrawerPopup>
        <DrawerHeader>
          <DrawerTitle>{props.title ?? props.placeholder ?? 'Sélectionner'}</DrawerTitle>
        </DrawerHeader>
        <DrawerPanel>
          <div class="flex flex-col">
            <For each={props.items}>
              {(item) => (
                <button
                  class="flex min-h-11 w-full items-center justify-between gap-2 rounded-sm px-2 text-base outline-none hover:bg-accent hover:text-accent-foreground"
                  onClick={() => handleSelect(item.value)}
                  type="button"
                >
                  <span class="truncate">{item.label}</span>
                  {display().isSelected(item.value) && <Check class="size-4 shrink-0" />}
                </button>
              )}
            </For>
          </div>
        </DrawerPanel>
      </DrawerPopup>
    </Drawer>
  )
}

export default SelectDrawer
