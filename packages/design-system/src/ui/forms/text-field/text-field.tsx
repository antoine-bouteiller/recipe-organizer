import { useFieldContext } from '../../../hooks/use-form-context'
import { Field, FieldError, FieldLabel } from '../field/field'
import { Input } from '../input/input'

interface TextFieldProps {
  className?: string
  disabled?: boolean
  label?: string
  placeholder?: string
}

export const TextField = ({ className, disabled, label, placeholder }: TextFieldProps) => {
  const field = useFieldContext<string>()

  return (
    <Field
      className={className}
      dirty={field.state.meta.isDirty}
      invalid={!field.state.meta.isValid}
      name={field.name}
      touched={field.state.meta.isTouched}
    >
      {label && <FieldLabel>{label}</FieldLabel>}
      <Input disabled={disabled} onChange={(event) => field.handleChange(event.target.value)} placeholder={placeholder} value={field.state.value} />
      <FieldError />
    </Field>
  )
}
