import { CaretDownIcon, CheckIcon } from '@phosphor-icons/react'
import { useMemo, useState, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Combobox, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, ComboboxPopup, ComboboxSeparator } from '@/components/ui/combobox'
import { Drawer, DrawerHeader, DrawerPanel, DrawerPopup, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useFieldContext } from '@/hooks/use-form-context'
import { useIsMobile } from '@/hooks/use-is-mobile'
import { type Option } from '@/hooks/use-options'
import { cn } from '@/utils/cn'

type ValueOptions = number | string | undefined

interface ComboboxFieldProps<TValue extends ValueOptions> {
  addNew?: (inputValue: string) => ReactNode
  disabled?: boolean
  className?: string
  label?: string
  options: Option<TValue>[]
  placeholder?: string
  searchPlaceholder?: string
}

const ComboboxField = <TValue extends ValueOptions>({
  addNew,
  disabled,
  className,
  label,
  options,
  placeholder = 'Sélectionner une option',
  searchPlaceholder = 'Rechercher une option',
}: ComboboxFieldProps<TValue>) => {
  const field = useFieldContext<TValue | undefined>()
  const isMobile = useIsMobile()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  const selectedOption = useMemo(() => options.find((opt) => opt.value === field.store.state.value), [options, field.store.state.value])

  const handleSelect = (option: Option<TValue> | null) => {
    if (option === null || option.value === field.store.state.value || option.value === undefined) {
      field.setValue(undefined)
    } else {
      field.setValue(option.value)
    }
  }

  return (
    <Field
      className={className}
      dirty={field.state.meta.isDirty}
      invalid={!field.state.meta.isValid}
      name={field.name}
      touched={field.state.meta.isTouched}
    >
      {label && <FieldLabel>{label}</FieldLabel>}
      {isMobile ? (
        <MobileCombobox
          addNew={addNew}
          disabled={disabled}
          isInvalid={isInvalid}
          onChange={handleSelect}
          options={options}
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
          selectedOption={selectedOption}
          title={label ?? placeholder}
        />
      ) : (
        <DesktopCombobox
          addNew={addNew}
          disabled={disabled}
          isInvalid={isInvalid}
          onChange={handleSelect}
          options={options}
          placeholder={placeholder}
          selectedOption={selectedOption}
        />
      )}
      <FieldError />
    </Field>
  )
}

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
    <Combobox<Option<TValue>>
      aria-invalid={isInvalid || undefined}
      disabled={disabled}
      items={options}
      onInputValueChange={setInputValue}
      onValueChange={(value) => onChange(value)}
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
    </Combobox>
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

export { ComboboxField }
