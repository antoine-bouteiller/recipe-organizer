import { Field } from '@/components/ui/field'
import { NumberInput } from '@/components/ui/number-input'
import { useFieldContext } from '@/hooks/use-form-context'

interface NumberFieldProps {
  allowDecimals?: boolean
  disabled?: boolean
  label?: string
  max?: number
  min?: number
  placeholder?: string
  className?: string
}

export const NumberField = ({ allowDecimals = false, disabled, label, max, min, placeholder, className }: NumberFieldProps) => {
  const field = useFieldContext<number | undefined>()

  return (
    <Field
      dirty={field.state.meta.isDirty}
      invalid={!field.state.meta.isValid}
      name={field.name}
      touched={field.state.meta.isTouched}
      className={className}
    >
      <NumberInput
        defaultValue={field.state.value}
        disabled={disabled}
        label={label}
        max={max}
        min={min}
        onValueChange={(value) => field.handleChange(value ?? undefined)}
        placeholder={placeholder}
        step={allowDecimals ? 0.25 : 1}
        value={field.state.value}
      />
      <Field.Error />
    </Field>
  )
}
