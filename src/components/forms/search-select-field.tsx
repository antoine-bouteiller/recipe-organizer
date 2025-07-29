import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { CheckIcon, ChevronsUpDown } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form'

interface SearchSelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>
  name: TName
  label?: string
  placeholder?: string
  disabled?: boolean
  options: {
    label: string
    value: string
  }[]
}

export function SearchSelectField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ control, name, options }: SearchSelectFieldProps<TFieldValues, TName>) {
  const [open, setOpen] = useState(false)

  const { field } = useController({ control, name })

  const handleSelect = useCallback(
    (currentValue: string) => {
      field.onChange(currentValue)
      setOpen(false)
    },
    [field]
  )

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-controls={`${name}-listbox`}
                aria-expanded={open}
                className={cn(
                  'w-[200px] justify-between',
                  fieldState.error &&
                    'border border-destructive ring-destructive/20 transition-[color,box-shadow] dark:border-destructive dark:ring-destructive/40'
                )}
              >
                {field.value
                  ? options.find((option) => option.value === field.value)?.label
                  : 'Select option...'}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput className="h-9" placeholder="Search framework..." />
                <CommandList>
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem key={option.value} value={option.value} onSelect={handleSelect}>
                        {option.label}
                        <CheckIcon
                          className={cn(
                            'ml-auto',
                            field.value === option.value ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
