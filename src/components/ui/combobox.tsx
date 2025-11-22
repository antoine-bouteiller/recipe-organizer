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

interface Option {
  label: string
  value: string
}

interface ComboboxProps extends Omit<React.ComponentProps<'button'>, 'onChange'> {
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  onChange?: (option: Option) => void
  value?: string
  options: Option[]
  noResultsLabel?: string
  addNew?: (inputValue: string) => ReactNode
}

const Combobox = ({
  options,
  value,
  onChange,
  placeholder = 'Sélectionner une option',
  searchPlaceholder = 'Rechercher une option',
  noResultsLabel = 'Aucun résultat trouvé',
  addNew,
  ...props
}: ComboboxProps) => {
  const [open, setOpen] = useState(false)

  return (
    <ResponsivePopover open={open} onOpenChange={setOpen}>
      <ResponsivePopoverTrigger
        render={
          <Button
            variant="outline"
            role="button"
            aria-expanded={open}
            {...props}
            className={cn(
              'w-full justify-between text-ellipsis border-input',
              'not-disabled:not-focus-visible:not-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] focus-visible:aria-invalid:border-destructive/64 focus-visible:aria-invalid:ring-destructive/16 aria-invalid:border-destructive/36'
            )}
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

interface ComboboxContentProps {
  options: Option[]
  value?: string
  onChange?: (option: Option) => void
  searchPlaceholder: string
  setOpen: (open: boolean) => void
  noResultsLabel: string
  addNew?: (inputValue: string) => ReactNode
  disabled?: boolean
}

const ComboboxContent = ({
  options,
  value,
  onChange,
  searchPlaceholder,
  setOpen,
  noResultsLabel,
  addNew,
  disabled,
}: ComboboxContentProps) => {
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
                key={option.value}
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
