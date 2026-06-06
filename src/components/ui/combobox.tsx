import { CaretDownIcon, CheckIcon } from '@phosphor-icons/react'
import { useMemo, useState, type ReactElement, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Combobox as ComboboxRoot,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxSeparator,
} from '@/components/ui/primitive/combobox'
import { Drawer, DrawerHeader, DrawerPanel, DrawerPopup, DrawerTitle, DrawerTrigger } from '@/components/ui/primitive/drawer'
import { Separator } from '@/components/ui/separator'
import { useIsMobile } from '@/hooks/use-is-mobile'
import { type Option } from '@/hooks/use-options'
import { cn } from '@/utils/cn'

type ValueOptions = number | string | undefined

interface ComboboxProps<TValue extends ValueOptions> {
  addNew?: (inputValue: string) => ReactNode
  disabled?: boolean
  isInvalid?: boolean
  onChange: (option: Option<TValue> | null) => void
  options: Option<TValue>[]
  placeholder?: string
  searchPlaceholder?: string
  title?: string
  value: TValue | undefined
}

const Combobox = <TValue extends ValueOptions>({
  addNew,
  disabled,
  isInvalid = false,
  onChange,
  options,
  placeholder = 'Sélectionner une option',
  searchPlaceholder = 'Rechercher une option',
  title,
  value,
}: ComboboxProps<TValue>): ReactElement => {
  const isMobile = useIsMobile()
  const selectedOption = useMemo(() => options.find((opt) => opt.value === value), [options, value])

  if (isMobile) {
    return (
      <MobileCombobox
        addNew={addNew}
        disabled={disabled}
        isInvalid={isInvalid}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        selectedOption={selectedOption}
        title={title ?? placeholder}
      />
    )
  }

  return (
    <DesktopCombobox
      addNew={addNew}
      disabled={disabled}
      isInvalid={isInvalid}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      selectedOption={selectedOption}
    />
  )
}

export { Combobox }

interface DesktopComboboxProps<TValue extends ValueOptions> {
  addNew?: (inputValue: string) => ReactNode
  disabled?: boolean
  isInvalid: boolean
  onChange: (option: Option<TValue> | null) => void
  options: Option<TValue>[]
  placeholder: string
  selectedOption: Option<TValue> | undefined
}

const DesktopCombobox = <TValue extends ValueOptions>({
  addNew,
  disabled,
  isInvalid,
  onChange,
  options,
  placeholder,
  selectedOption,
}: DesktopComboboxProps<TValue>) => {
  const [inputValue, setInputValue] = useState('')

  return (
    <ComboboxRoot<Option<TValue>>
      aria-invalid={isInvalid || undefined}
      disabled={disabled}
      items={options}
      onInputValueChange={setInputValue}
      onValueChange={(option) => onChange(option)}
      value={selectedOption ?? null}
    >
      <ComboboxInput placeholder={placeholder} showClear={Boolean(selectedOption)} />
      <ComboboxPopup>
        <ComboboxEmpty>Aucun résultat</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={String(item.value)} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
        {addNew && (
          <>
            <ComboboxSeparator />
            <div className="p-1">{addNew(inputValue)}</div>
          </>
        )}
      </ComboboxPopup>
    </ComboboxRoot>
  )
}

interface MobileComboboxProps<TValue extends ValueOptions> {
  addNew?: (inputValue: string) => ReactNode
  disabled?: boolean
  isInvalid: boolean
  onChange: (option: Option<TValue> | null) => void
  options: Option<TValue>[]
  placeholder: string
  searchPlaceholder: string
  selectedOption: Option<TValue> | undefined
  title: string
}

const MobileCombobox = <TValue extends ValueOptions>({
  addNew,
  disabled,
  isInvalid,
  onChange,
  options,
  placeholder,
  searchPlaceholder,
  selectedOption,
  title,
}: MobileComboboxProps<TValue>) => {
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
      <DrawerPopup showBar>
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
