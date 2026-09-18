import { useFieldContext } from '@design-system/hooks/use-form-context'
import { ToggleGroup } from '@design-system/ui/actions/toggle-group/toggle-group'

import { Field, FieldError, FieldLabel } from '../field/field'

export interface ToggleGroupFieldProps {
  disabled?: boolean
  items: { label: string; value: string }[]
  label?: string
}

export const ToggleGroupField = ({ disabled, items, label }: ToggleGroupFieldProps) => {
  const field = useFieldContext<string[]>()

  return (
    <Field dirty={field.state.meta.isDirty} invalid={!field.state.meta.isValid} name={field.name} touched={field.state.meta.isTouched}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <ToggleGroup disabled={disabled} items={items} onValueChange={(value) => field.handleChange(value)} value={field.state.value ?? []} />
      <FieldError />
    </Field>
  )
}
