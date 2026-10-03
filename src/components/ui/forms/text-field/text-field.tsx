import { useId } from 'react'

import { Field, FieldError, FieldLabel, useFieldInvalid } from '../field/field'
import { Input } from '../input/input'

export interface TextFieldProps {
  name: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  label?: string
  placeholder?: string
}

export const TextField = ({ name, value, onChange, disabled, label, placeholder }: TextFieldProps) => {
  const invalid = useFieldInvalid(name)
  const id = useId()

  return (
    <Field name={name}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <Input
        aria-invalid={invalid || undefined}
        disabled={disabled}
        id={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
      <FieldError />
    </Field>
  )
}
