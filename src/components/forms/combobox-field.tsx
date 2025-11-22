import { Combobox, type ComboboxProps } from '@/components/ui/combobox'
import { useFieldContext } from '@/hooks/use-form-context'
import { Field, FieldError, FieldLabel } from '../ui/field'

interface ComboboxFieldProps extends ComboboxProps {
  label?: string
}

const ComboboxField = ({ options, label, ...props }: ComboboxFieldProps) => {
  const field = useFieldContext<string | undefined>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field
      className="flex-1 w-full"
      name={field.name}
      invalid={!field.state.meta.isValid}
      dirty={field.state.meta.isDirty}
      touched={field.state.meta.isTouched}
    >
      {label && <FieldLabel>{label}</FieldLabel>}
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
        error={isInvalid}
        {...props}
      />
      <FieldError />
    </Field>
  )
}

export { ComboboxField }
