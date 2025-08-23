import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { CheckIcon, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'

interface Option {
  label: string
  value: string
}

interface SearchSelectProps {
  label?: string
  placeholder?: string
  disabled?: boolean
  onChange?: (option: Option) => void
  value?: string
  options: Option[]
  error?: string
}

const SearchSelect = ({ options, value, onChange, error }: SearchSelectProps) => {
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
          {value
            ? options.find((option) => option.value === value)?.label
            : 'Sélectionner une option'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput className="h-9" placeholder="Rechercher..." />
          <CommandList>
            <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
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
                  {option.label}
                  <CheckIcon
                    className={cn('ml-auto', value === option.value ? 'opacity-100' : 'opacity-0')}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export type { Option }
export { SearchSelect }
