import { FormItem, FormMessage } from '@/components/forms/form'
import { Combobox, type ComboboxProps } from '@/components/ui/combobox'
import { useFieldContext } from '@/hooks/use-form-context'

const ComboboxField = ({ options, ...props }: ComboboxProps) => {
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
        {...props}
      />
      <FormMessage />
    </FormItem>
  )
}

export { ComboboxField }
