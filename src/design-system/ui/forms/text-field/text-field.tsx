import { useId } from 'react'

import { useFieldContext } from '@/design-system/hooks/use-form-context'

import { Field, FieldError, FieldLabel } from '../field/field'
import { Input } from '../input/input'

export interface TextFieldProps {
  disabled?: boolean
  label?: string
  placeholder?: string
}

export const TextField = ({ disabled, label, placeholder }: TextFieldProps) => {
  const field = useFieldContext<string>()
  const id = useId()

  return (
    <Field invalid={!field.state.meta.isValid} name={field.name}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <Input
        aria-invalid={!field.state.meta.isValid || undefined}
        disabled={disabled}
        id={id}
        onChange={(event) => field.handleChange(event.target.value)}
        placeholder={placeholder}
        value={field.state.value}
      />
      <FieldError />
    </Field>
  )
}
