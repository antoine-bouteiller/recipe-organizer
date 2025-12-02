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
  decimalScale?: number
  disabled?: boolean
  label?: string
  max?: number
  min?: number
  placeholder?: string
  step?: number
}

const computeStepper = (decimalScale?: number, currentValue?: number) => {
  if (!currentValue || currentValue < 5) {
    return decimalScale === 0 ? 1 : 0.5
  } else if (currentValue < 10) {
    return 1
  } else if (currentValue < 50) {
    return 5
  }

  return 10
}

export const NumberField = ({ decimalScale, disabled, label, max, min, placeholder, step }: NumberFieldProps) => {
  const field = useFieldContext<number | undefined>()

  const stepper = step ?? computeStepper(decimalScale, field.state.value)

  return (
    <Field dirty={field.state.meta.isDirty} invalid={!field.state.meta.isValid} name={field.name} touched={field.state.meta.isTouched}>
      <NumberInput
        defaultValue={field.state.value}
        disabled={disabled}
        max={max}
        min={min}
        onValueChange={(value) => field.handleChange(value ?? undefined)}
        step={stepper}
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
