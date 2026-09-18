import { useFieldContext } from '@design-system/hooks/use-form-context'

import { Field, FieldError, FieldLabel } from '../field/field'
import { Input } from '../input/input'

export interface TextFieldProps {
  disabled?: boolean
  label?: string
  placeholder?: string
}

export const TextField = ({ disabled, label, placeholder }: TextFieldProps) => {
  const field = useFieldContext<string>()

  return (
    <Field dirty={field.state.meta.isDirty} invalid={!field.state.meta.isValid} name={field.name} touched={field.state.meta.isTouched}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <Input disabled={disabled} onChange={(event) => field.handleChange(event.target.value)} placeholder={placeholder} value={field.state.value} />
      <FieldError />
    </Field>
  )
}
