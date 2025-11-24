import { Combobox, type ComboboxProps, type ValueOptions } from '@/components/ui/combobox'
import { useFieldContext } from '@/hooks/use-form-context'
import { Field, FieldError, FieldLabel } from '../ui/field'

interface ComboboxFieldProps<T extends ValueOptions> extends ComboboxProps<T> {
  label?: string
}

const ComboboxField = <T extends ValueOptions>({
  options,
  label,
  ...props
}: ComboboxFieldProps<T>) => {
  const field = useFieldContext<T | undefined>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field
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
          if (option.value === field.store.state.value || option.value === undefined) {
            field.setValue(undefined)
          } else {
            field.setValue(option.value)
          }
        }}
        aria-invalid={isInvalid}
        {...props}
      />
      <FieldError />
    </Field>
  )
}

export { ComboboxField }
