import { createMemo, createSignal, For, Show } from 'solid-js'
import CaretDown from '~icons/ph/caret-down'
import Check from '~icons/ph/check'

import { Button } from '@/components/ui/button'
import { type ComboboxImplProps, type ValueOptions } from '@/components/ui/combobox'
import { Drawer, DrawerHeader, DrawerPanel, DrawerPopup, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/utils/cn'

const ComboboxDrawer = <TValue extends ValueOptions>(props: ComboboxImplProps<TValue>) => {
  const [open, setOpen] = createSignal(false)
  const [search, setSearch] = createSignal('')

  const filteredOptions = createMemo(() => {
    const lower = search().toLowerCase()
    return lower ? props.options.filter((option) => option.label.toLowerCase().includes(lower)) : props.options
  })

  return (
    <Drawer onOpenChange={setOpen} open={open()}>
      <DrawerTrigger
        as={Button}
        aria-invalid={props.isInvalid || undefined}
        class={cn(
          'w-full justify-between border-input font-normal text-ellipsis',
          'not-disabled:not-focus-visible:not-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] aria-invalid:border-destructive/36 focus-visible:aria-invalid:border-destructive/64 focus-visible:aria-invalid:ring-destructive/16'
        )}
        data-slot="drawer-trigger"
        disabled={props.disabled}
        variant="outline"
      >
        <span class="truncate">{props.selectedOption?.label ?? props.placeholder}</span>
        <CaretDown />
      </DrawerTrigger>
      <DrawerPopup>
        <DrawerHeader>
          <DrawerTitle>{props.title}</DrawerTitle>
        </DrawerHeader>
        <DrawerPanel>
          <div class="flex flex-col gap-2">
            <Input onInput={(event) => setSearch(event.currentTarget.value)} placeholder={props.searchPlaceholder} value={search()} />
            <div class="flex max-h-64 flex-col overflow-y-auto">
              <Show when={filteredOptions().length === 0}>
                <p class="py-4 text-center text-sm text-muted-foreground">Aucun résultat</p>
              </Show>
              <For each={filteredOptions()}>
                {(option) => (
                  <button
                    class="flex min-h-10 w-full cursor-default items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-base outline-none active:bg-accent active:text-accent-foreground"
                    onClick={() => {
                      props.onChange(option)
                      setOpen(false)
                      setSearch('')
                    }}
                    type="button"
                  >
                    <span class="truncate">{option.label}</span>
                    {props.selectedOption?.value === option.value && <Check class="size-4 shrink-0" />}
                  </button>
                )}
              </For>
            </div>
            <Show when={props.addNew}>
              {(addNew) => (
                <>
                  <Separator />
                  {addNew()(search())}
                </>
              )}
            </Show>
          </div>
        </DrawerPanel>
      </DrawerPopup>
    </Drawer>
  )
}

export default ComboboxDrawer
