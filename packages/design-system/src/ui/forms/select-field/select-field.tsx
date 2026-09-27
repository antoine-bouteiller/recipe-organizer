import { useFieldContext } from '@design-system/hooks/use-form-context'
import { useId } from 'react'

import { Field, FieldError, FieldLabel } from '../field/field'
import { Select } from '../select/select'

interface SelectFieldProps {
  disabled?: boolean
  items: { label: string; value: string | null }[]
  label?: string
}

const SelectField = ({ disabled, items, label }: SelectFieldProps) => {
  const field = useFieldContext<string | null | undefined>()
  const id = useId()

  return (
    <Field dirty={field.state.meta.isDirty} invalid={!field.state.meta.isValid} name={field.name} touched={field.state.meta.isTouched}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <Select
        aria-invalid={!field.state.meta.isValid}
        disabled={disabled}
        id={id}
        items={items}
        onValueChange={(value) => field.setValue(value ?? undefined)}
        title={label}
        value={field.state.value ?? null}
      />
      <FieldError />
    </Field>
  )
}

export { SelectField }
