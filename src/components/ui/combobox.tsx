import { Button } from '@/components/ui/button'
import {
  Command,
  CommandCheck,
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
import { cn } from '@/lib/utils'
import { CaretDownIcon, PlusIcon } from '@phosphor-icons/react'
import { useState } from 'react'

interface Option {
  label: string
  value: string
}

interface ComboboxProps {
  label?: string
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  onChange?: (option: Option) => void
  value?: string
  options: Option[]
  error?: string
  addNewOptionLabel?: string
  addNewOptionOnClick?: (label: string) => void
  noResultsLabel?: string
}

const Combobox = ({
  options,
  value,
  onChange,
  error,
  addNewOptionOnClick,
  addNewOptionLabel = 'Créer une nouvelle option :',
  placeholder = 'Sélectionner une option',
  searchPlaceholder = 'Rechercher une option',
  noResultsLabel = 'Aucun résultat trouvé',
}: ComboboxProps) => {
  const [open, setOpen] = useState(false)

  return (
    <ResponsivePopover open={open} onOpenChange={setOpen}>
      <ResponsivePopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between text-ellipsis bg-transparent border-input',
            error &&
              'border-destructive ring-destructive/20 transition-[color,box-shadow] dark:border-destructive dark:ring-destructive/40'
          )}
        >
          <span className={cn('truncate')}>
            {value ? options.find((option) => option.value === value)?.label : placeholder}
          </span>
          <CaretDownIcon />
        </Button>
      </ResponsivePopoverTrigger>
      <ResponsivePopoverContent className="w-(--radix-popper-anchor-width) p-0">
        <ComboboxContent
          setOpen={setOpen}
          options={options}
          value={value}
          onChange={onChange}
          addNewOptionOnClick={addNewOptionOnClick}
          searchPlaceholder={searchPlaceholder}
          addNewOptionLabel={addNewOptionLabel}
          noResultsLabel={noResultsLabel}
        />
      </ResponsivePopoverContent>
    </ResponsivePopover>
  )
}

interface ComboboxContentProps {
  options: Option[]
  value?: string
  onChange?: (option: Option) => void
  addNewOptionOnClick?: (value: string) => void
  searchPlaceholder: string
  setOpen: (open: boolean) => void
  addNewOptionLabel: string
  noResultsLabel: string
}

const ComboboxContent = ({
  options,
  value,
  onChange,
  addNewOptionOnClick,
  searchPlaceholder,
  setOpen,
  addNewOptionLabel,
  noResultsLabel,
}: ComboboxContentProps) => {
  const [inputValue, setInputValue] = useState('')
  return (
    <Command>
      <CommandInput
        placeholder={searchPlaceholder}
        value={inputValue}
        onValueChange={setInputValue}
      />
      <CommandList>
        <ScrollArea viewportClassName="max-h-[300px] [&>div]:block!">
          <CommandEmpty>
            {addNewOptionOnClick ? (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start font-normal px-1.5"
                onClick={() => addNewOptionOnClick(inputValue)}
              >
                <PlusIcon className="size-4" aria-hidden="true" />
                {addNewOptionLabel} {inputValue}
              </Button>
            ) : (
              noResultsLabel
            )}
          </CommandEmpty>
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
                {value === option.value && <CommandCheck />}
              </CommandItem>
            ))}
          </CommandGroup>
        </ScrollArea>
      </CommandList>
      <CommandSeparator />
    </Command>
  )
}

export { Combobox }
export type { Option, ComboboxProps }
