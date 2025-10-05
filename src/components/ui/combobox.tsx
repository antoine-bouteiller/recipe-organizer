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
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useMediaQuery } from '@/hooks/use-media-query'
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
  addNewOptionOnClick?: () => void
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
}: ComboboxProps) => {
  const [open, setOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
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
        </DrawerTrigger>
        <DrawerContent>
          <ComboboxContent
            setOpen={setOpen}
            options={options}
            value={value}
            onChange={onChange}
            addNewOptionOnClick={addNewOptionOnClick}
            searchPlaceholder={searchPlaceholder}
            addNewOptionLabel={addNewOptionLabel}
          />
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
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
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popper-anchor-width) p-0">
        <ComboboxContent
          setOpen={setOpen}
          options={options}
          value={value}
          onChange={onChange}
          addNewOptionOnClick={addNewOptionOnClick}
          searchPlaceholder={searchPlaceholder}
          addNewOptionLabel={addNewOptionLabel}
        />
      </PopoverContent>
    </Popover>
  )
}

interface ComboboxContentProps {
  options: Option[]
  value?: string
  onChange?: (option: Option) => void
  addNewOptionOnClick?: () => void
  searchPlaceholder: string
  setOpen: (open: boolean) => void
  addNewOptionLabel: string
}

const ComboboxContent = ({
  options,
  value,
  onChange,
  addNewOptionOnClick,
  searchPlaceholder,
  setOpen,
  addNewOptionLabel,
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
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start font-normal px-1.5"
              onClick={addNewOptionOnClick}
            >
              <PlusIcon className="size-4" aria-hidden="true" />
              {addNewOptionLabel} {inputValue}
            </Button>
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
export type { Option }
