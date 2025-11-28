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
  label?: string
  placeholder?: string
  disabled?: boolean
  min?: number
  max?: number
  decimalScale?: number
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

export const NumberField = ({
  label,
  placeholder,
  disabled,
  min,
  max,
  decimalScale,
  step,
}: NumberFieldProps) => {
  const field = useFieldContext<number | undefined>()

  const stepper = step ?? computeStepper(decimalScale, field.state.value)

  return (
    <Field
      name={field.name}
      invalid={!field.state.meta.isValid}
      dirty={field.state.meta.isDirty}
      touched={field.state.meta.isTouched}
    >
      <NumberInput
        defaultValue={field.state.value}
        max={max}
        min={min}
        step={stepper}
        onValueChange={(value) => field.handleChange(value ?? undefined)}
        disabled={disabled}
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
