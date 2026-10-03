import { useId } from 'react'

import { Field, FieldError, FieldLabel, useFieldInvalid } from '../field/field'
import { Select } from '../select/select'

interface SelectFieldProps {
  name: string
  value: string | null | undefined
  onChange: (value: string | null | undefined) => void
  disabled?: boolean
  items: { label: string; value: string | null }[]
  label?: string
}

const SelectField = ({ name, value, onChange, disabled, items, label }: SelectFieldProps) => {
  const invalid = useFieldInvalid(name)
  const id = useId()

  return (
    <Field name={name}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <Select
        aria-invalid={invalid}
        disabled={disabled}
        id={id}
        items={items}
        onValueChange={(next) => onChange(next ?? undefined)}
        title={label}
        value={value ?? null}
      />
      <FieldError />
    </Field>
  )
}

export { SelectField }
