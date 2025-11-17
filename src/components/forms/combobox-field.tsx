import { FieldLabel, FieldMessage, FormItem } from '@/components/forms/form'
import { Combobox, type ComboboxProps } from '@/components/ui/combobox'
import { useFieldContext } from '@/hooks/use-form-context'

interface ComboboxFieldProps extends ComboboxProps {
  label?: string
}

const ComboboxField = ({ options, label, ...props }: ComboboxFieldProps) => {
  const field = useFieldContext<string | undefined>()

  return (
    <FormItem className="flex-1 w-full">
      {label && <FieldLabel className="text-base font-semibold">{label}</FieldLabel>}
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
        {...props}
      />
      <FieldMessage />
    </FormItem>
  )
}

export { ComboboxField }
