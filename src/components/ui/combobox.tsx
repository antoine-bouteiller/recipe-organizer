import { CaretDownIcon, CheckIcon } from '@phosphor-icons/react'
import { type ReactNode, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'
import { ResponsivePopover, ResponsivePopoverContent, ResponsivePopoverTrigger } from '@/components/ui/responsive-popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/utils/cn'

export type ValueOptions = number | string | undefined

interface Option<T> {
  label: string
  value: T
}

interface ComboboxProps<T extends ValueOptions> extends Omit<React.ComponentProps<'button'>, 'onChange'> {
  addNew?: (inputValue: string) => ReactNode
  disabled?: boolean
  nested?: boolean
  noResultsLabel?: string
  onChange?: (option: Option<T>) => void
  options: Option<T>[]
  placeholder?: string
  searchPlaceholder?: string
  value?: T
}

const Combobox = <T extends ValueOptions>({
  addNew,
  className,
  nested = false,
  noResultsLabel = 'Aucun résultat trouvé',
  onChange,
  options,
  placeholder = 'Sélectionner une option',
  searchPlaceholder = 'Rechercher une option',
  value,
  ...props
}: ComboboxProps<T>) => {
  const [open, setOpen] = useState(false)

  return (
    <ResponsivePopover nested={nested} onOpenChange={setOpen} open={open}>
      <ResponsivePopoverTrigger
        render={
          <Button
            className={cn(
              'w-full justify-between border-input text-ellipsis',
              `
                not-disabled:not-focus-visible:not-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)]
                aria-invalid:border-destructive/36
                focus-visible:aria-invalid:border-destructive/64
                focus-visible:aria-invalid:ring-destructive/16
              `,
              className
            )}
            variant="outline"
            {...props}
          />
        }
      >
        <span className={cn('truncate')}>{value ? options.find((option) => option.value === value)?.label : placeholder}</span>
        <CaretDownIcon />
      </ResponsivePopoverTrigger>
      <ResponsivePopoverContent className="w-(--anchor-width) p-0">
        <ComboboxContent
          addNew={addNew}
          noResultsLabel={noResultsLabel}
          onChange={onChange}
          options={options}
          searchPlaceholder={searchPlaceholder}
          setOpen={setOpen}
          value={value}
        />
      </ResponsivePopoverContent>
    </ResponsivePopover>
  )
}

interface ComboboxContentProps<T> {
  addNew?: (inputValue: string) => ReactNode
  disabled?: boolean
  noResultsLabel: string
  onChange?: (option: Option<T>) => void
  options: Option<T>[]
  searchPlaceholder: string
  setOpen: (open: boolean) => void
  value?: T
}

const ComboboxContent = <T extends ValueOptions>({
  addNew,
  disabled,
  noResultsLabel,
  onChange,
  options,
  searchPlaceholder,
  setOpen,
  value,
}: ComboboxContentProps<T>) => {
  const [inputValue, setInputValue] = useState('')
  return (
    <Command>
      <CommandInput disabled={disabled} onValueChange={setInputValue} placeholder={searchPlaceholder} value={inputValue} />
      <CommandList>
        <ScrollArea>
          <CommandEmpty>{addNew ? addNew(inputValue) : noResultsLabel}</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={String(option.value)}
                onSelect={() => {
                  onChange?.(option)
                  setOpen(false)
                }}
                value={option.label}
              >
                <span className="truncate">{option.label}</span>
                {value === option.value && <CheckIcon />}
              </CommandItem>
            ))}
            {addNew?.(inputValue)}
          </CommandGroup>
        </ScrollArea>
      </CommandList>
      <CommandSeparator />
    </Command>
  )
}

export { Combobox }
export type { ComboboxProps, Option }
