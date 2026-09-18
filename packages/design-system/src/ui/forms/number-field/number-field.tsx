import { useFieldContext } from '@design-system/hooks/use-form-context'

import { Field, FieldError } from '../field/field'
import { NumberInput } from '../number-input/number-input'

export interface NumberFieldProps {
  disabled?: boolean
  label?: string
  max?: number
  min?: number
  placeholder?: string
}

export const NumberField = ({ disabled, label, max, min, placeholder }: NumberFieldProps) => {
  const field = useFieldContext<number | undefined>()

  return (
    <Field dirty={field.state.meta.isDirty} invalid={!field.state.meta.isValid} name={field.name} touched={field.state.meta.isTouched}>
      <NumberInput
        defaultValue={field.state.value}
        disabled={disabled}
        label={label}
        max={max}
        min={min}
        step="any"
        onValueChange={(value) => field.handleChange(value ?? undefined)}
        placeholder={placeholder}
        value={field.state.value}
      />
      <FieldError />
    </Field>
  )
}
