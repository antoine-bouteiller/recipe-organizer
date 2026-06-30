import { CaretDownIcon, CheckIcon } from '@phosphor-icons/react'
import { useMemo, useState, type ReactElement } from 'react'

import { Button } from '@/components/ui/button'
import { type ComboboxImplProps, type ValueOptions } from '@/components/ui/combobox'
import { Drawer, DrawerHeader, DrawerPanel, DrawerPopup, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/utils/cn'

const ComboboxDrawer = <TValue extends ValueOptions>({
  addNew,
  disabled,
  isInvalid,
  onChange,
  options,
  placeholder,
  searchPlaceholder,
  selectedOption,
  title,
}: ComboboxImplProps<TValue>): ReactElement => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filteredOptions = useMemo(() => {
    if (!search) {
      return options
    }
    const lower = search.toLowerCase()
    return options.filter((opt) => opt.label.toLowerCase().includes(lower))
  }, [options, search])

  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerTrigger
        disabled={disabled}
        render={
          <Button
            aria-invalid={isInvalid || undefined}
            className={cn(
              'w-full justify-between border-input font-normal text-ellipsis',
              'not-disabled:not-focus-visible:not-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] aria-invalid:border-destructive/36 focus-visible:aria-invalid:border-destructive/64 focus-visible:aria-invalid:ring-destructive/16'
            )}
            variant="outline"
          />
        }
      >
        <span className="truncate">{selectedOption?.label ?? placeholder}</span>
        <CaretDownIcon />
      </DrawerTrigger>
      <DrawerPopup>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <DrawerPanel>
          <div className="flex flex-col gap-2">
            <Input onChange={(event) => setSearch(event.target.value)} placeholder={searchPlaceholder} value={search} />
            <div className="flex max-h-64 flex-col overflow-y-auto">
              {filteredOptions.length === 0 && <p className="py-4 text-center text-sm text-muted-foreground">Aucun résultat</p>}
              {filteredOptions.map((option) => (
                <button
                  className="flex min-h-10 w-full cursor-default items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-base outline-none active:bg-accent active:text-accent-foreground"
                  key={String(option.value)}
                  onClick={() => {
                    onChange(option)
                    setOpen(false)
                    setSearch('')
                  }}
                  type="button"
                >
                  <span className="truncate">{option.label}</span>
                  {selectedOption?.value === option.value && <CheckIcon className="size-4 shrink-0" />}
                </button>
              ))}
            </div>
            {addNew && (
              <>
                <Separator />
                {addNew(search)}
              </>
            )}
          </div>
        </DrawerPanel>
      </DrawerPopup>
    </Drawer>
  )
}

export default ComboboxDrawer
