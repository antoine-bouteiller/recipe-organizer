import { FormItem, FormMessage } from '@/components/forms/form'
import { Combobox } from '@/components/ui/combobox'
import { useFieldContext } from '@/hooks/use-form-context'

interface Option {
  label: string
  value: string
}

interface ComboboxFieldProps {
  label?: string
  placeholder?: string
  disabled?: boolean
  options: Option[]
}

const ComboboxField = ({ options }: ComboboxFieldProps) => {
  const field = useFieldContext<string | undefined>()

  return (
    <FormItem className="flex-1 w-full">
      <Combobox
        options={options}
        value={field.store.state.value}
        onChange={(option) => {
          if (option.value === field.store.state.value) {
            field.handleChange(undefined)
          } else {
            field.handleChange(option.value)
          }
        }}
        error={field.errors.length > 0 ? field.errors[0].message : undefined}
      />
      <FormMessage />
    </FormItem>
  )
}

export { ComboboxField, type Option, type ComboboxFieldProps }
