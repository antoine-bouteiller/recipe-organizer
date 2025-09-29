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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { ChevronDownIcon, Plus } from 'lucide-react'
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
  noOptionsLabel?: string
  addNewOptionLabel?: string
  addNewOptionOnClick?: () => void
}

const Combobox = ({
  options,
  value,
  onChange,
  error,
  noOptionsLabel = 'Aucune valeur trouvée.',
  addNewOptionLabel = 'Ajouter une nouvelle option',
  addNewOptionOnClick,
  placeholder = 'Sélectionner une option',
  searchPlaceholder = 'Rechercher une option',
}: ComboboxProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between text-ellipsis',
            error &&
              'border border-destructive ring-destructive/20 transition-[color,box-shadow] dark:border-destructive dark:ring-destructive/40'
          )}
        >
          <span className={cn('truncate')}>
            {value ? options.find((option) => option.value === value)?.label : placeholder}
          </span>
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popper-anchor-width) p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <ScrollArea viewportClassName="max-h-[300px] [&>div]:block!">
              <CommandEmpty>{noOptionsLabel}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
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
          {addNewOptionLabel && (
            <CommandGroup>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start font-normal px-1.5"
                onClick={addNewOptionOnClick}
              >
                <Plus className="size-4" aria-hidden="true" />
                {addNewOptionLabel}
              </Button>
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { Combobox }
export type { Option }
