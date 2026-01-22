import { Combobox, type ComboboxProps, type ValueOptions } from '@/components/ui/combobox'
import { useFieldContext } from '@/hooks/use-form-context'

import { Field, FieldError, FieldLabel } from '../ui/field'

interface ComboboxFieldProps<T extends ValueOptions> extends ComboboxProps<T> {
  label?: string
  fieldClassName?: string
}

const ComboboxField = <T extends ValueOptions>({ label, options, fieldClassName, ...props }: ComboboxFieldProps<T>) => {
  const field = useFieldContext<T | undefined>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field
      dirty={field.state.meta.isDirty}
      invalid={!field.state.meta.isValid}
      name={field.name}
      touched={field.state.meta.isTouched}
      className={fieldClassName}
    >
      {label && <FieldLabel>{label}</FieldLabel>}
      <Combobox
        aria-invalid={isInvalid}
        onChange={(option) => {
          if (option.value === field.store.state.value || option.value === undefined) {
            field.setValue(undefined)
          } else {
            field.setValue(option.value)
          }
        }}
        options={options}
        value={field.store.state.value}
        {...props}
      />
      <FieldError />
    </Field>
  )
}

export { ComboboxField }
