import { Field, FieldError } from '@/components/ui/field'
import {
  NumberInput,
  NumberInputDecrement,
  NumberInputField,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInputScrubArea,
} from '@/components/ui/number-input'
import { useFieldContext } from '@/hooks/use-form-context'

interface NumberFieldProps {
  allowDecimals?: number
  disabled?: boolean
  label?: string
  max?: number
  min?: number
  placeholder?: string
}

export const NumberField = ({ allowDecimals, disabled, label, max, min, placeholder }: NumberFieldProps) => {
  const field = useFieldContext<number | undefined>()

  return (
    <Field dirty={field.state.meta.isDirty} invalid={!field.state.meta.isValid} name={field.name} touched={field.state.meta.isTouched}>
      <NumberInput
        defaultValue={field.state.value}
        disabled={disabled}
        max={max}
        min={min}
        onValueChange={(value) => field.handleChange(value ?? undefined)}
        step={allowDecimals ? 0.25 : 1}
        value={field.state.value}
      >
        {label && <NumberInputScrubArea label={label} />}
        <NumberInputGroup>
          <NumberInputDecrement />
          <NumberInputField placeholder={placeholder} />
          <NumberInputIncrement />
        </NumberInputGroup>
      </NumberInput>
      <FieldError />
    </Field>
  )
}
