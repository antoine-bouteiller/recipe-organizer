import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox'
import { CaretDownIcon, CaretUpDownIcon, CheckIcon, XIcon } from '@phosphor-icons/react'
import React, { useMemo, useState, type ReactElement, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Drawer, DrawerHeader, DrawerPanel, DrawerPopup, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useIsMobile } from '@/hooks/use-is-mobile'
import { type Option } from '@/hooks/use-options'
import { cn } from '@/utils/cn'

const ComboboxContext: React.Context<{
  chipsRef: React.RefObject<Element | null> | null
  multiple: boolean
}> = React.createContext<{
  chipsRef: React.RefObject<Element | null> | null
  multiple: boolean
}>({
  chipsRef: null,
  multiple: false,
})

const ComboboxRoot = <Value, Multiple extends boolean | undefined = false>(
  props: ComboboxPrimitive.Root.Props<Value, Multiple>
): React.ReactElement => {
  const chipsRef = React.useRef<Element | null>(null)
  return (
    <ComboboxContext.Provider value={{ chipsRef, multiple: Boolean(props.multiple) }}>
      <ComboboxPrimitive.Root {...props} />
    </ComboboxContext.Provider>
  )
}

const ComboboxTrigger = ({ className, children, ...props }: ComboboxPrimitive.Trigger.Props): React.ReactElement => (
  <ComboboxPrimitive.Trigger className={className} data-slot="combobox-trigger" {...props}>
    {children}
  </ComboboxPrimitive.Trigger>
)

const ComboboxClear = ({ className, ...props }: ComboboxPrimitive.Clear.Props): React.ReactElement => (
  <ComboboxPrimitive.Clear className={className} data-slot="combobox-clear" {...props} />
)

const ComboboxInput = ({
  className,
  showTrigger = true,
  showClear = false,
  startAddon,
  size,
  triggerProps,
  clearProps,
  ...props
}: Omit<ComboboxPrimitive.Input.Props, 'size'> & {
  showTrigger?: boolean
  showClear?: boolean
  startAddon?: React.ReactNode
  size?: 'sm' | 'default' | 'lg' | number
  ref?: React.Ref<HTMLInputElement>
  triggerProps?: ComboboxPrimitive.Trigger.Props
  clearProps?: ComboboxPrimitive.Clear.Props
}): React.ReactElement => {
  const sizeValue = size ?? 'default'

  return (
    <ComboboxPrimitive.InputGroup
      className="relative w-full text-foreground not-has-[>*.w-full]:w-fit has-disabled:opacity-64"
      data-slot="combobox-input-group"
    >
      {startAddon && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 start-px z-10 flex items-center ps-[calc(--spacing(3)-1px)] opacity-80 has-[+[data-size=sm]]:ps-[calc(--spacing(2.5)-1px)] [&_svg]:-mx-0.5 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4"
          data-slot="combobox-start-addon"
        >
          {startAddon}
        </div>
      )}
      <ComboboxPrimitive.Input
        className={cn(
          startAddon &&
            'data-[size=sm]:*:data-[slot=combobox-input]:ps-[calc(--spacing(7.5)-1px)] *:data-[slot=combobox-input]:ps-[calc(--spacing(8.5)-1px)] sm:data-[size=sm]:*:data-[slot=combobox-input]:ps-[calc(--spacing(7)-1px)] sm:*:data-[slot=combobox-input]:ps-[calc(--spacing(8)-1px)]',
          sizeValue === 'sm'
            ? 'has-[+[data-slot=combobox-trigger],+[data-slot=combobox-clear]]:*:data-[slot=combobox-input]:pe-6.5'
            : 'has-[+[data-slot=combobox-trigger],+[data-slot=combobox-clear]]:*:data-[slot=combobox-input]:pe-7',
          className
        )}
        data-slot="combobox-input"
        render={<Input className="has-disabled:opacity-100" nativeInput size={sizeValue} />}
        {...props}
      />
      {showTrigger && (
        <ComboboxTrigger
          className={cn(
            "absolute top-1/2 inline-flex size-8 shrink-0 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md border border-transparent opacity-80 outline-none transition-opacity pointer-coarse:after:absolute pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 hover:opacity-100 has-[+[data-slot=combobox-clear]]:hidden sm:size-7 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
            sizeValue === 'sm' ? 'end-0' : 'end-0.5'
          )}
          {...triggerProps}
        >
          <ComboboxPrimitive.Icon data-slot="combobox-icon">
            <CaretUpDownIcon />
          </ComboboxPrimitive.Icon>
        </ComboboxTrigger>
      )}
      {showClear && (
        <ComboboxClear
          className={cn(
            "absolute top-1/2 inline-flex size-8 shrink-0 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md border border-transparent opacity-80 outline-none transition-opacity pointer-coarse:after:absolute pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 hover:opacity-100 has-[+[data-slot=combobox-clear]]:hidden sm:size-7 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
            sizeValue === 'sm' ? 'end-0' : 'end-0.5'
          )}
          {...clearProps}
        >
          <XIcon />
        </ComboboxClear>
      )}
    </ComboboxPrimitive.InputGroup>
  )
}

const ComboboxPopup = ({
  className,
  children,
  side = 'bottom',
  sideOffset = 4,
  alignOffset,
  align = 'start',
  anchor: anchorProp,
  ...props
}: ComboboxPrimitive.Popup.Props & {
  align?: ComboboxPrimitive.Positioner.Props['align']
  sideOffset?: ComboboxPrimitive.Positioner.Props['sideOffset']
  alignOffset?: ComboboxPrimitive.Positioner.Props['alignOffset']
  side?: ComboboxPrimitive.Positioner.Props['side']
  anchor?: ComboboxPrimitive.Positioner.Props['anchor']
}): React.ReactElement => {
  const { chipsRef } = React.useContext(ComboboxContext)
  const anchor = anchorProp ?? chipsRef

  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="z-50 select-none"
        data-slot="combobox-positioner"
        side={side}
        sideOffset={sideOffset}
      >
        <span
          className={cn(
            'relative flex max-h-full min-w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) rounded-lg border bg-popover not-dark:bg-clip-padding shadow-lg/5 transition-[scale,opacity] before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]',
            className
          )}
        >
          <ComboboxPrimitive.Popup
            className="flex max-h-[min(var(--available-height),23rem)] flex-1 flex-col text-foreground"
            data-slot="combobox-popup"
            {...props}
          >
            {children}
          </ComboboxPrimitive.Popup>
        </span>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  )
}

const ComboboxItem = ({ className, children, ...props }: ComboboxPrimitive.Item.Props): React.ReactElement => (
  <ComboboxPrimitive.Item
    className={cn(
      "grid min-h-8 in-data-[side=none]:min-w-[calc(var(--anchor-width)+1.25rem)] cursor-default grid-cols-[1rem_1fr] items-center gap-2 rounded-sm py-1 ps-2 pe-4 text-base outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
      className
    )}
    data-slot="combobox-item"
    {...props}
  >
    <ComboboxPrimitive.ItemIndicator className="col-start-1">
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
    </ComboboxPrimitive.ItemIndicator>
    <div className="col-start-2">{children}</div>
  </ComboboxPrimitive.Item>
)

const ComboboxSeparator = ({ className, ...props }: ComboboxPrimitive.Separator.Props): React.ReactElement => (
  <ComboboxPrimitive.Separator className={cn('mx-2 my-1 h-px bg-border last:hidden', className)} data-slot="combobox-separator" {...props} />
)

const ComboboxEmpty = ({ className, ...props }: ComboboxPrimitive.Empty.Props): React.ReactElement => (
  <ComboboxPrimitive.Empty
    className={cn('not-empty:p-2 text-center text-base text-muted-foreground sm:text-sm', className)}
    data-slot="combobox-empty"
    {...props}
  />
)

const ComboboxList = ({ className, ...props }: ComboboxPrimitive.List.Props): React.ReactElement => (
  <ScrollArea scrollbarGutter scrollFade>
    <ComboboxPrimitive.List
      className={cn('not-empty:scroll-py-1 not-empty:px-1 not-empty:py-1 in-data-has-overflow-y:pe-3', className)}
      data-slot="combobox-list"
      {...props}
    />
  </ScrollArea>
)

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
