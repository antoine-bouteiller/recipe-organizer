import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  ResponsivePopover,
  ResponsivePopoverContent,
  ResponsivePopoverTrigger,
} from '@/components/ui/responsive-popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/utils/cn'
import { CaretDownIcon, CheckIcon } from '@phosphor-icons/react'
import { type ReactNode, useState } from 'react'

export type ValueOptions = string | number | undefined

interface Option<T> {
  label: string
  value: T
}

interface ComboboxProps<T extends ValueOptions>
  extends Omit<React.ComponentProps<'button'>, 'onChange'> {
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  onChange?: (option: Option<T>) => void
  value?: T
  options: Option<T>[]
  noResultsLabel?: string
  addNew?: (inputValue: string) => ReactNode
  nested?: boolean
}

const Combobox = <T extends ValueOptions>({
  options,
  value,
  onChange,
  placeholder = 'Sélectionner une option',
  searchPlaceholder = 'Rechercher une option',
  noResultsLabel = 'Aucun résultat trouvé',
  addNew,
  nested = false,
  className,
  ...props
}: ComboboxProps<T>) => {
  const [open, setOpen] = useState(false)

  return (
    <ResponsivePopover open={open} onOpenChange={setOpen} nested={nested}>
      <ResponsivePopoverTrigger
        render={
          <Button
            variant="outline"
            className={cn(
              'w-full justify-between text-ellipsis border-input',
              'not-disabled:not-focus-visible:not-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] focus-visible:aria-invalid:border-destructive/64 focus-visible:aria-invalid:ring-destructive/16 aria-invalid:border-destructive/36',
              className
            )}
            {...props}
          />
        }
      >
        <span className={cn('truncate')}>
          {value ? options.find((option) => option.value === value)?.label : placeholder}
        </span>
        <CaretDownIcon />
      </ResponsivePopoverTrigger>
      <ResponsivePopoverContent className="w-(--anchor-width) p-0">
        <ComboboxContent
          setOpen={setOpen}
          options={options}
          value={value}
          onChange={onChange}
          searchPlaceholder={searchPlaceholder}
          noResultsLabel={noResultsLabel}
          addNew={addNew}
        />
      </ResponsivePopoverContent>
    </ResponsivePopover>
  )
}

interface ComboboxContentProps<T> {
  options: Option<T>[]
  value?: T
  onChange?: (option: Option<T>) => void
  searchPlaceholder: string
  setOpen: (open: boolean) => void
  noResultsLabel: string
  addNew?: (inputValue: string) => ReactNode
  disabled?: boolean
}

const ComboboxContent = <T extends ValueOptions>({
  options,
  value,
  onChange,
  searchPlaceholder,
  setOpen,
  noResultsLabel,
  addNew,
  disabled,
}: ComboboxContentProps<T>) => {
  const [inputValue, setInputValue] = useState('')
  return (
    <Command>
      <CommandInput
        placeholder={searchPlaceholder}
        value={inputValue}
        onValueChange={setInputValue}
        disabled={disabled}
      />
      <CommandList>
        <ScrollArea>
          <CommandEmpty>{addNew ? addNew(inputValue) : noResultsLabel}</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={String(option.value)}
                value={option.label}
                onSelect={() => {
                  onChange?.(option)
                  setOpen(false)
                }}
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
